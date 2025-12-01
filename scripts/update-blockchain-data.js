const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration (from GitHub Secrets)
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const LOTTO_ADDRESS = '0x6B003aB42C53e4340223f286D8263E20F3565A67';
const DEPLOYMENT_BLOCK = 21920808;
const BATCH_SIZE = 10; // Alchemy free tier limit
const BLOCKS_TO_QUERY = 30; // ~6 minutes of blocks at 12 sec/block

const LOTTO_ABI = [
  'function hourlyPotWei() view returns (uint256)',
  'function dailyPotWei() view returns (uint256)',
  'function secondsToNextHourly() view returns (uint64)',
  'function secondsToNextDaily() view returns (uint64)',
  'event HourlyWinnerPaid(uint64 indexed roundId, address indexed winner, uint256 prizeWei, string note)',
  'event DailyWinnerPaid(uint64 indexed roundId, address indexed winner, uint256 prizeWei, string note)',
];

// Query events in batches to work with Alchemy free tier
async function queryEventsInBatches(contract, eventName, fromBlock, toBlock) {
  const events = [];
  let currentFrom = fromBlock;

  while (currentFrom <= toBlock) {
    const currentTo = Math.min(currentFrom + BATCH_SIZE - 1, toBlock);
    let retries = 3;

    while (retries > 0) {
      try {
        const batch = await contract.queryFilter(eventName, currentFrom, currentTo);
        events.push(...batch);
        break; // Success, exit retry loop
      } catch (err) {
        retries--;
        if (retries > 0) {
          console.log(`Batch ${currentFrom}-${currentTo} failed, retrying... (${retries} left)`);
          await new Promise(r => setTimeout(r, 1000)); // Wait 1 second before retry
        } else {
          console.log(`Batch ${currentFrom}-${currentTo} failed after all retries, skipping`);
        }
      }
    }
    currentFrom = currentTo + 1;
  }

  return events;
}

async function main() {
  if (!ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY environment variable is required');
  }

  const provider = new ethers.JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  );
  const contract = new ethers.Contract(LOTTO_ADDRESS, LOTTO_ABI, provider);

  // Ensure data directory exists (files are at repo root)
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Fetch pot amounts and countdown
  console.log('Fetching pot amounts...');
  const [hourlyWei, dailyWei, hourlySeconds, dailySeconds] = await Promise.all([
    contract.hourlyPotWei(),
    contract.dailyPotWei(),
    contract.secondsToNextHourly(),
    contract.secondsToNextDaily(),
  ]);

  const potsData = {
    hourlyPotEth: parseFloat(ethers.formatEther(hourlyWei)),
    dailyPotEth: parseFloat(ethers.formatEther(dailyWei)),
    nextHourlyTimestamp: Math.floor(Date.now() / 1000) + Number(hourlySeconds),
    nextDailyTimestamp: Math.floor(Date.now() / 1000) + Number(dailySeconds),
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(dataDir, 'pots.json'),
    JSON.stringify(potsData, null, 2)
  );
  console.log('Wrote pots.json:', potsData);

  // 2. Fetch winner events (incremental - check existing winners.json)
  console.log('Fetching winner events...');
  let existingWinners = [];
  const winnersPath = path.join(dataDir, 'winners.json');
  if (fs.existsSync(winnersPath)) {
    try {
      existingWinners = JSON.parse(fs.readFileSync(winnersPath, 'utf8'));
    } catch (e) {
      console.log('Could not parse existing winners.json, starting fresh');
      existingWinners = [];
    }
  }

  // Get current block
  const currentBlock = await provider.getBlockNumber();

  // Always query the last BLOCKS_TO_QUERY blocks (simple, reliable)
  const fromBlock = Math.max(currentBlock - BLOCKS_TO_QUERY, DEPLOYMENT_BLOCK);

  console.log(`Querying events from block ${fromBlock} to ${currentBlock}...`);

  const [hourlyEvents, dailyEvents] = await Promise.all([
    queryEventsInBatches(contract, 'HourlyWinnerPaid', fromBlock, currentBlock),
    queryEventsInBatches(contract, 'DailyWinnerPaid', fromBlock, currentBlock),
  ]);

  console.log(`Found ${hourlyEvents.length} hourly and ${dailyEvents.length} daily events`);

  // Process new events
  const newWinners = [];
  for (const event of [...hourlyEvents, ...dailyEvents]) {
    const block = await provider.getBlock(event.blockNumber);
    const isHourly = event.fragment.name === 'HourlyWinnerPaid';
    newWinners.push({
      id: Number(event.args.roundId),
      type: isHourly ? 'hourly' : 'daily',
      wallet: event.args.winner,
      ethAmount: parseFloat(ethers.formatEther(event.args.prizeWei)),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: block.timestamp * 1000, // Convert to milliseconds for JavaScript Date
    });
  }

  // Merge, deduplicate by txHash, and sort by timestamp (newest first)
  const existingTxHashes = new Set(existingWinners.map(w => w.txHash));
  const uniqueNewWinners = newWinners.filter(w => !existingTxHashes.has(w.txHash));

  const allWinners = [...existingWinners, ...uniqueNewWinners]
    .sort((a, b) => b.timestamp - a.timestamp);

  fs.writeFileSync(winnersPath, JSON.stringify(allWinners, null, 2));
  console.log(`Wrote winners.json: ${allWinners.length} total winners (${uniqueNewWinners.length} new)`);

  console.log('Data update complete!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
