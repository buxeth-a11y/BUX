const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Configuration (from GitHub Secrets)
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const LOTTO_ADDRESS = '0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF';
const DEPLOYMENT_BLOCK = 7439089;

const LOTTO_ABI = [
  'function hourlyPotWei() view returns (uint256)',
  'function dailyPotWei() view returns (uint256)',
  'function secondsToNextHourly() view returns (uint64)',
  'function secondsToNextDaily() view returns (uint64)',
  'event HourlyWinnerPaid(uint64 indexed roundId, address indexed winner, uint256 prizeWei, string note)',
  'event DailyWinnerPaid(uint64 indexed roundId, address indexed winner, uint256 prizeWei, string note)',
];

async function main() {
  if (!ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY environment variable is required');
  }

  const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  );
  const contract = new ethers.Contract(LOTTO_ADDRESS, LOTTO_ABI, provider);

  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../buxlotto-app/buxlotto-app/public/data');
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

  // Find the highest block we've already indexed
  const lastBlock = existingWinners.reduce(
    (max, w) => Math.max(max, w.blockNumber || 0),
    DEPLOYMENT_BLOCK
  );
  const fromBlock = lastBlock > DEPLOYMENT_BLOCK ? lastBlock + 1 : DEPLOYMENT_BLOCK;

  console.log(`Querying events from block ${fromBlock}...`);
  const [hourlyEvents, dailyEvents] = await Promise.all([
    contract.queryFilter('HourlyWinnerPaid', fromBlock),
    contract.queryFilter('DailyWinnerPaid', fromBlock),
  ]);

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
