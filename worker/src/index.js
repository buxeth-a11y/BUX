/**
 * BUX Data Fetcher Worker
 * Runs every minute via cron trigger, self-triggers at 30s for effective 30-second updates
 * Fetches blockchain data from Alchemy and stores in Cloudflare KV
 */

// Pre-calculated function selectors (keccak256 hash first 4 bytes)
const SELECTORS = {
  'hourlyPotWei()': '0x08cd2e3e',
  'dailyPotWei()': '0x2f3db86a',
  'secondsToNextHourly()': '0x40b3f73a',
  'secondsToNextDaily()': '0xd79475a3',
};

// Event topic hashes (keccak256 of event signatures)
const EVENT_TOPICS = {
  HourlyWinnerPaid: '0x87fbf63a8bd04c6091139f239bb12a43269eb9a3c50512c1a894e819a7f08408',
  DailyWinnerPaid: '0x65a6ca63c2eece850f2acfc9ac1233c46ed4a1dce9d06fc7dbbc24c256a736b2',
};

export default {
  // Cron trigger handler (runs every minute)
  async scheduled(event, env, ctx) {
    console.log('Cron triggered at:', new Date().toISOString());

    // First update
    await updateBlockchainData(env);

    // Schedule second update in 30 seconds for effective 30-second intervals
    ctx.waitUntil(
      new Promise(resolve => setTimeout(resolve, 30000))
        .then(() => updateBlockchainData(env))
        .then(() => console.log('30-second update completed'))
    );
  },

  // HTTP handler for API endpoints and manual triggers
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET /api/pots - Return pot amounts and countdown times
      if (url.pathname === '/api/pots') {
        const data = await env.BUX_KV.get('pots', 'json');
        return new Response(JSON.stringify(data || {}), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // GET /api/winners - Return winner history
      if (url.pathname === '/api/winners') {
        const data = await env.BUX_KV.get('winners', 'json');
        return new Response(JSON.stringify(data || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /api/update - Manual trigger for testing
      if (url.pathname === '/api/update' && request.method === 'POST') {
        await updateBlockchainData(env);
        return new Response(JSON.stringify({ success: true, timestamp: new Date().toISOString() }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // GET /api/status - Health check
      if (url.pathname === '/api/status') {
        const pots = await env.BUX_KV.get('pots', 'json');
        return new Response(JSON.stringify({
          status: 'ok',
          lastUpdate: pots?.updatedAt || 'never',
          contractAddress: env.CONTRACT_ADDRESS,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default response
      return new Response(JSON.stringify({
        name: 'BUX Data API',
        endpoints: ['/api/pots', '/api/winners', '/api/status'],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('API error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

/**
 * Main update function - fetches blockchain data and stores in KV
 */
async function updateBlockchainData(env) {
  const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
  const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS || '0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF';
  const DEPLOYMENT_BLOCK = parseInt(env.DEPLOYMENT_BLOCK || '7439089');
  const BATCH_SIZE = parseInt(env.BATCH_SIZE || '10');
  const BLOCKS_TO_QUERY = parseInt(env.BLOCKS_TO_QUERY || '30');

  try {
    console.log('Starting blockchain data update...');

    // Fetch pot amounts and countdown times in parallel
    const [hourlyPotWei, dailyPotWei, hourlySeconds, dailySeconds] = await Promise.all([
      ethCall(ALCHEMY_URL, CONTRACT_ADDRESS, 'hourlyPotWei()'),
      ethCall(ALCHEMY_URL, CONTRACT_ADDRESS, 'dailyPotWei()'),
      ethCall(ALCHEMY_URL, CONTRACT_ADDRESS, 'secondsToNextHourly()'),
      ethCall(ALCHEMY_URL, CONTRACT_ADDRESS, 'secondsToNextDaily()'),
    ]);

    const now = Math.floor(Date.now() / 1000);

    const potsData = {
      hourlyPotEth: weiToEth(hourlyPotWei),
      dailyPotEth: weiToEth(dailyPotWei),
      nextHourlyTimestamp: now + Number(hourlySeconds),
      nextDailyTimestamp: now + Number(dailySeconds),
      updatedAt: new Date().toISOString(),
    };

    // Write pots data to KV
    await env.BUX_KV.put('pots', JSON.stringify(potsData));
    console.log('Pots updated:', potsData);

    // Fetch and update winners (with batching for Alchemy free tier)
    await updateWinners(env, ALCHEMY_URL, CONTRACT_ADDRESS, DEPLOYMENT_BLOCK, BATCH_SIZE, BLOCKS_TO_QUERY);

    console.log('Blockchain data update complete');
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
}

/**
 * Make an eth_call to read contract state
 */
async function ethCall(rpcUrl, contractAddress, functionSig) {
  const selector = SELECTORS[functionSig];
  if (!selector) {
    throw new Error(`Unknown function signature: ${functionSig}`);
  }

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: contractAddress,
          data: selector,
        },
        'latest',
      ],
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(`RPC error: ${result.error.message}`);
  }

  // Decode uint256 result
  return BigInt(result.result);
}

/**
 * Get current block number
 */
async function getBlockNumber(rpcUrl) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber',
      params: [],
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(`RPC error: ${result.error.message}`);
  }

  return parseInt(result.result, 16);
}

/**
 * Get block timestamp
 */
async function getBlockTimestamp(rpcUrl, blockNumber) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['0x' + blockNumber.toString(16), false],
    }),
  });

  const result = await response.json();
  if (result.error || !result.result) {
    return Math.floor(Date.now() / 1000); // Fallback to current time
  }

  return parseInt(result.result.timestamp, 16);
}

/**
 * Query events in batches (Alchemy free tier: 10 blocks max)
 */
async function queryEventsInBatches(rpcUrl, contractAddress, topics, fromBlock, toBlock, batchSize) {
  const allLogs = [];
  let currentFrom = fromBlock;

  while (currentFrom <= toBlock) {
    const currentTo = Math.min(currentFrom + batchSize - 1, toBlock);
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getLogs',
            params: [{
              address: contractAddress,
              fromBlock: '0x' + currentFrom.toString(16),
              toBlock: '0x' + currentTo.toString(16),
              topics: topics,
            }],
          }),
        });

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error.message);
        }

        if (result.result && result.result.length > 0) {
          allLogs.push(...result.result);
        }
        break; // Success, exit retry loop

      } catch (err) {
        retries--;
        if (retries > 0) {
          console.log(`Batch ${currentFrom}-${currentTo} failed, retrying... (${retries} left)`);
          await new Promise(r => setTimeout(r, 1000));
        } else {
          console.log(`Batch ${currentFrom}-${currentTo} failed after all retries, skipping`);
        }
      }
    }

    currentFrom = currentTo + 1;
  }

  return allLogs;
}

/**
 * Update winners list with batched event queries
 */
async function updateWinners(env, rpcUrl, contractAddress, deploymentBlock, batchSize, blocksToQuery) {
  // Get current block
  const currentBlock = await getBlockNumber(rpcUrl);
  const fromBlock = Math.max(currentBlock - blocksToQuery, deploymentBlock);

  console.log(`Querying events from block ${fromBlock} to ${currentBlock} in batches of ${batchSize}...`);

  // Get existing winners from KV
  let existingWinners = [];
  try {
    const existing = await env.BUX_KV.get('winners', 'json');
    if (existing) existingWinners = existing;
  } catch (e) {
    console.log('Starting with empty winners list');
  }

  // Use pre-computed event topic hashes
  const HOURLY_TOPIC = EVENT_TOPICS.HourlyWinnerPaid;
  const DAILY_TOPIC = EVENT_TOPICS.DailyWinnerPaid;

  // Query both event types with batching
  const [hourlyLogs, dailyLogs] = await Promise.all([
    queryEventsInBatches(rpcUrl, contractAddress, [[HOURLY_TOPIC]], fromBlock, currentBlock, batchSize),
    queryEventsInBatches(rpcUrl, contractAddress, [[DAILY_TOPIC]], fromBlock, currentBlock, batchSize),
  ]);

  console.log(`Found ${hourlyLogs.length} hourly and ${dailyLogs.length} daily events`);

  // Process new events
  const existingTxHashes = new Set(existingWinners.map(w => w.txHash));
  const newWinners = [];

  for (const log of hourlyLogs) {
    if (!existingTxHashes.has(log.transactionHash)) {
      const winner = await parseWinnerLog(rpcUrl, log, 'hourly');
      if (winner) newWinners.push(winner);
    }
  }

  for (const log of dailyLogs) {
    if (!existingTxHashes.has(log.transactionHash)) {
      const winner = await parseWinnerLog(rpcUrl, log, 'daily');
      if (winner) newWinners.push(winner);
    }
  }

  if (newWinners.length > 0) {
    console.log(`Found ${newWinners.length} new winners`);

    // Merge, deduplicate, and sort by timestamp (newest first)
    const allWinners = [...existingWinners, ...newWinners]
      .sort((a, b) => b.timestamp - a.timestamp);

    await env.BUX_KV.put('winners', JSON.stringify(allWinners));
    console.log(`Updated winners: ${allWinners.length} total`);
  } else {
    console.log('No new winners found');
  }
}

/**
 * Parse a winner event log
 */
async function parseWinnerLog(rpcUrl, log, type) {
  try {
    // Topics: [eventSig, roundId (indexed), winner (indexed)]
    const roundId = parseInt(log.topics[1], 16);
    const winner = '0x' + log.topics[2].slice(26); // Address is last 20 bytes

    // Data: prizeWei (uint256) + note offset + note length + note data
    const prizeWei = BigInt('0x' + log.data.slice(2, 66));

    // Get block timestamp
    const blockNumber = parseInt(log.blockNumber, 16);
    const timestamp = await getBlockTimestamp(rpcUrl, blockNumber);

    return {
      id: roundId,
      type: type,
      wallet: winner,
      ethAmount: weiToEth(prizeWei),
      txHash: log.transactionHash,
      blockNumber: blockNumber,
      timestamp: timestamp * 1000, // Convert to milliseconds
    };
  } catch (err) {
    console.error('Error parsing log:', err);
    return null;
  }
}

/**
 * Convert wei to ETH (as number)
 */
function weiToEth(wei) {
  return Number(wei) / 1e18;
}

