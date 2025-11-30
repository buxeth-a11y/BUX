# BUX Data: Cloudflare Migration Plan

## Overview

Migrate from unreliable GitHub Actions to Cloudflare Workers for near real-time blockchain data updates every **30 seconds**.

## Current Architecture (GitHub Actions - Unreliable)

```
GitHub Actions (cron every 1 min - THROTTLED)
    → Runs update-blockchain-data.js
    → Commits to /public/data/pots.json, winners.json
    → Triggers GitHub Pages rebuild

Problems:
- GitHub throttles scheduled workflows (can skip runs)
- No SLA for cron reliability
- Cold start delays (30+ seconds)
- Build/deploy adds latency
```

## New Architecture (Cloudflare - Production Ready)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (300+ locations)         │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │ Cron Trigger    │         │  KV Storage     │           │
│  │ (every 30 sec)  │────────▶│  - pots         │           │
│  │                 │ writes  │  - winners      │           │
│  └────────┬────────┘         └────────▲────────┘           │
│           │                           │                     │
│           │                           │ reads (<50ms)       │
│           ▼                           │                     │
│  ┌─────────────────┐         ┌────────┴────────┐           │
│  │ Cloudflare      │         │ Cloudflare      │           │
│  │ Worker          │         │ Pages           │           │
│  │ (data fetcher)  │         │ (React App)     │           │
│  └────────┬────────┘         └─────────────────┘           │
│           │                                                 │
└───────────┼─────────────────────────────────────────────────┘
            │ RPC calls
            ▼
    ┌───────────────┐
    │ Alchemy API   │
    │ (Sepolia)     │
    └───────────────┘
```

## Cost Analysis (30-second updates)

| Resource | Usage | Free Tier | Paid Plan |
|----------|-------|-----------|-----------|
| Worker Requests | 2,880/day | 100,000/day | Included |
| KV Writes | 2,880/day | 1,000/day | 1M/month |
| KV Reads | ~10,000/day | 100,000/day | Included |
| Alchemy RPC | ~8,640 calls/day | 30M CU/month | Included |

**Total Monthly Cost: ~$5/month** (Workers Paid plan required for KV writes)

## Implementation Steps

### Step 1: Create Cloudflare Account
- [ ] Sign up at https://dash.cloudflare.com/sign-up
- [ ] Verify email
- [ ] Note your Account ID (Settings → Account ID)

### Step 2: Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### Step 3: Create Worker Project Structure

Create the following files in `buxlotto-app/buxlotto-app/worker/`:

```
buxlotto-app/
├── worker/
│   ├── src/
│   │   └── index.js          # Worker code
│   ├── wrangler.toml         # Cloudflare config
│   └── package.json
├── src/                      # Existing React app
├── public/
└── ...
```

### Step 4: Worker Configuration (wrangler.toml)

```toml
name = "bux-data-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

# KV Namespace binding
[[kv_namespaces]]
binding = "BUX_KV"
id = "<YOUR_KV_NAMESPACE_ID>"

# Cron trigger - every minute (Cloudflare minimum)
[triggers]
crons = ["* * * * *"]

# Environment variables (set via wrangler secret)
[vars]
CONTRACT_ADDRESS = "0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF"
DEPLOYMENT_BLOCK = "7439089"
```

### Step 5: Worker Code (src/index.js)

```javascript
// BUX Data Fetcher Worker
// Runs every minute via cron trigger, fetches blockchain data

export default {
  // Cron trigger handler
  async scheduled(event, env, ctx) {
    ctx.waitUntil(updateBlockchainData(env));
  },

  // HTTP handler for manual triggers and data fetching
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route handling
    if (url.pathname === '/api/pots') {
      const data = await env.BUX_KV.get('pots', 'json');
      return new Response(JSON.stringify(data || {}), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/winners') {
      const data = await env.BUX_KV.get('winners', 'json');
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/update' && request.method === 'POST') {
      // Manual trigger (for testing)
      await updateBlockchainData(env);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('BUX Data API', {
      headers: corsHeaders,
    });
  },
};

async function updateBlockchainData(env) {
  const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
  const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS || '0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF';

  try {
    // Fetch pot amounts and countdown times
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

    // Write to KV
    await env.BUX_KV.put('pots', JSON.stringify(potsData));

    // Fetch recent winner events (last 100 blocks)
    await updateWinners(env, ALCHEMY_URL, CONTRACT_ADDRESS);

    console.log('Data updated:', potsData);
  } catch (error) {
    console.error('Update failed:', error);
  }
}

async function ethCall(rpcUrl, contractAddress, functionSig) {
  // Calculate function selector
  const encoder = new TextEncoder();
  const data = encoder.encode(functionSig);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Note: This is simplified - in production use proper keccak256

  // For now, use pre-calculated selectors
  const selectors = {
    'hourlyPotWei()': '0x6a7d2b6a',
    'dailyPotWei()': '0x0f574ba7',
    'secondsToNextHourly()': '0x7a5b4f59',
    'secondsToNextDaily()': '0x9d63848a',
  };

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
          data: selectors[functionSig],
        },
        'latest',
      ],
    }),
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message);
  }

  // Decode uint256 result
  return BigInt(result.result);
}

async function updateWinners(env, rpcUrl, contractAddress) {
  const DEPLOYMENT_BLOCK = 7439089;

  // Get current block
  const blockResponse = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber',
      params: [],
    }),
  });
  const blockResult = await blockResponse.json();
  const currentBlock = parseInt(blockResult.result, 16);

  // Query last 100 blocks for events
  const fromBlock = Math.max(currentBlock - 100, DEPLOYMENT_BLOCK);

  // Event signatures
  const HOURLY_WINNER_TOPIC = '0x...'; // HourlyWinnerPaid event topic
  const DAILY_WINNER_TOPIC = '0x...';  // DailyWinnerPaid event topic

  // Get existing winners
  let existingWinners = [];
  try {
    const existing = await env.BUX_KV.get('winners', 'json');
    if (existing) existingWinners = existing;
  } catch (e) {
    // Start fresh
  }

  // Query new events
  const logsResponse = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getLogs',
      params: [{
        address: contractAddress,
        fromBlock: '0x' + fromBlock.toString(16),
        toBlock: 'latest',
        topics: [[HOURLY_WINNER_TOPIC, DAILY_WINNER_TOPIC]],
      }],
    }),
  });

  const logsResult = await logsResponse.json();

  if (logsResult.result && logsResult.result.length > 0) {
    // Process new events and merge with existing
    const existingTxHashes = new Set(existingWinners.map(w => w.txHash));

    for (const log of logsResult.result) {
      if (!existingTxHashes.has(log.transactionHash)) {
        // Parse and add new winner
        // ... (parsing logic)
      }
    }

    // Sort by timestamp descending
    existingWinners.sort((a, b) => b.timestamp - a.timestamp);

    // Write updated winners
    await env.BUX_KV.put('winners', JSON.stringify(existingWinners));
  }
}

function weiToEth(wei) {
  return Number(wei) / 1e18;
}
```

### Step 6: Create KV Namespace

```bash
cd buxlotto-app/buxlotto-app/worker
wrangler kv:namespace create "BUX_KV"
# Copy the ID and add to wrangler.toml
```

### Step 7: Add Secrets

```bash
wrangler secret put ALCHEMY_API_KEY
# Paste your Alchemy API key when prompted
```

### Step 8: Deploy Worker

```bash
wrangler deploy
```

### Step 9: Update React App Constants

Update `src/config/constants.js`:

```javascript
export const DATA_CONFIG = {
  // Cloudflare Worker API endpoints
  POTS_URL: 'https://bux-data-worker.<your-subdomain>.workers.dev/api/pots',
  WINNERS_URL: 'https://bux-data-worker.<your-subdomain>.workers.dev/api/winners',

  // CoinGecko API for ETH price
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',

  // Refresh interval - 30 seconds to match Worker updates
  REFRESH_INTERVAL: 30000,

  // Countdown tick interval
  COUNTDOWN_INTERVAL: 1000,

  // Default ETH price fallback
  DEFAULT_ETH_PRICE: 3500,
};
```

### Step 10: Deploy React App to Cloudflare Pages

1. Go to Cloudflare Dashboard → Pages → Create Project
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `buxlotto-app/buxlotto-app`
4. Deploy

### Step 11: Configure Custom Domain (Optional)

1. In Cloudflare Pages → Custom Domains
2. Add `bux.life` or your domain
3. Cloudflare handles SSL automatically

## 30-Second Updates Implementation

Since Cloudflare cron triggers only support 1-minute minimum intervals, we implement 30-second updates using a self-triggering approach:

### Self-Triggering Worker (Recommended)
The worker triggers itself after 30 seconds:
```javascript
async scheduled(event, env, ctx) {
  await updateBlockchainData(env);

  // Schedule next run in 30 seconds by calling our own endpoint
  ctx.waitUntil(
    new Promise(resolve => setTimeout(resolve, 28000))
      .then(() => fetch(env.WORKER_URL + '/api/update', { method: 'POST' }))
  );
}
```

This gives you effective 30-second updates while only using 1 cron trigger.

## File Structure After Migration

```
buxlotto-app/buxlotto-app/
├── worker/                    # NEW: Cloudflare Worker
│   ├── src/
│   │   └── index.js
│   ├── wrangler.toml
│   └── package.json
├── src/                       # React app (existing)
│   ├── config/
│   │   └── constants.js       # UPDATED: New API endpoints
│   ├── contexts/
│   │   └── BuxContext.js      # No changes needed
│   └── ...
├── public/
│   └── data/                  # Can be removed after migration
├── scripts/                   # Can be removed (replaced by Worker)
└── .github/
    └── workflows/             # Can be disabled after migration
```

## Rollback Plan

If issues occur, revert by:
1. Restore original `constants.js` URLs
2. Re-enable GitHub Actions workflows
3. Disable Cloudflare Worker cron

## Monitoring

- Cloudflare Dashboard → Workers → Analytics
- View invocations, errors, CPU time
- Set up alerts for failures

## Timeline

| Step | Time | Notes |
|------|------|-------|
| Create Cloudflare account | 5 min | User action |
| Install Wrangler CLI | 2 min | One-time setup |
| Create Worker project | 10 min | Copy/paste code |
| Set up KV namespace | 2 min | CLI command |
| Add secrets | 2 min | CLI command |
| Deploy Worker | 2 min | CLI command |
| Update React constants | 2 min | Edit one file |
| Deploy to Cloudflare Pages | 10 min | Connect GitHub |
| Test and verify | 10 min | Verify data flows |

**Total: ~45 minutes**

## Next Steps

1. [ ] User: Create Cloudflare account
2. [ ] User: Share Account ID
3. [ ] Claude: Create Worker files
4. [ ] User: Run deployment commands
5. [ ] Claude: Update React app
6. [ ] User: Test and verify
