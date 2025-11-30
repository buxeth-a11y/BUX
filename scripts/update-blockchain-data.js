const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration (from GitHub Secrets)
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const LOTTO_ADDRESS = '0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF';
const DEPLOYMENT_BLOCK = 7439089;
const BATCH_SIZE = 10; // Alchemy free tier limit

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
    try {
      const batch = await contract.queryFilter(eventName, currentFrom, currentTo);
      events.push(...batch);
    } catch (err) {
      console.log(`Batch ${currentFrom}-${currentTo} failed, skipping...`);
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
    `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
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

  // Find the highest block we've already indexed
  const lastBlock = existingWinners.reduce(
    (max, w) => Math.max(max, w.blockNumber || 0),
    DEPLOYMENT_BLOCK
  );
  const fromBlock = lastBlock > DEPLOYMENT_BLOCK ? lastBlock + 1 : DEPLOYMENT_BLOCK;

  // Only query recent blocks to avoid too many API calls
  // On first run, start from recent blocks only (last 1000 blocks)
  const effectiveFromBlock = existingWinners.length === 0
    ? Math.max(currentBlock - 1000, DEPLOYMENT_BLOCK)
    : fromBlock;

  console.log(`Querying events from block ${effectiveFromBlock} to ${currentBlock}...`);

  const [hourlyEvents, dailyEvents] = await Promise.all([
    queryEventsInBatches(contract, 'HourlyWinnerPaid', effectiveFromBlock, currentBlock),
    queryEventsInBatches(contract, 'DailyWinnerPaid', effectiveFromBlock, currentBlock),
  ]);

  console.log(`Found ${hourlyEvents.length} hourly and ${dailyEvents.length} daily events`);

  // Process new events
  const newWinners = [];
  for (const event of [...hourlyEvents, ...dailyEvents]) {
    const block = await provider.getBlock(event.blockNumber);
    const isHourly = event.fragment.name === 'HourlyWinnerPaid';
    newWinners.push({
      type: isHourly ? 'hourly' : 'daily',
      roundId: Number(event.args.roundId),
      winner: event.args.winner,
      prizeEth: parseFloat(ethers.formatEther(event.args.prizeWei)),
      note: event.args.note,
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: block.timestamp,
    });
  }

  // Merge and sort by timestamp (newest first)
  const allWinners = [...existingWinners, ...newWinners]
    .sort((a, b) => b.timestamp - a.timestamp);

  fs.writeFileSync(winnersPath, JSON.stringify(allWinners, null, 2));
  console.log(`Wrote winners.json: ${allWinners.length} total winners (${newWinners.length} new)`);

  console.log('Data update complete!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
