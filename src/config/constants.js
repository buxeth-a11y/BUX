// BUX Configuration

export const APP_CONFIG = {
  // Contract address (Mainnet)
  CONTRACT_ADDRESS: '0x6B003aB42C53e4340223f286D8263E20F3565A67',

  // Responsive breakpoint (how wide screen has to be to go down to mobile version)
  DESKTOP_BREAKPOINT: 1024,
};

export const DATA_CONFIG = {
  // Cloudflare Worker API endpoints (updates every 30 seconds)
  POTS_URL: 'https://bux-data-worker.buxeth.workers.dev/api/pots',
  WINNERS_URL: 'https://bux-data-worker.buxeth.workers.dev/api/winners',

  // CoinGecko API for ETH price (public, no key needed)
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',

  // How often to check for new data (ms)
  REFRESH_INTERVAL: 30000,  // 30 seconds (matches Worker update frequency)

  // Countdown tick interval (ms)
  COUNTDOWN_INTERVAL: 1000, // 1 second

  // Default ETH price fallback
  DEFAULT_ETH_PRICE: 3500,
};

export const ROUTES = {
  HOME: '/',
  WINNERS: '/winners',
  ABOUT: '/about',
};