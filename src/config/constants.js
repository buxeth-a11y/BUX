// BUX Configuration

export const APP_CONFIG = {
  // Contract address (Sepolia)
  CONTRACT_ADDRESS: '0x804E5bFe72Eeb3037D0A6dFa08F58d7786A6FdbF',

  // Responsive breakpoint (how wide screen has to be to go down to mobile version)
  DESKTOP_BREAKPOINT: 1024,
};

export const DATA_CONFIG = {
  // Static JSON files (auto-updated by GitHub Actions)
  POTS_URL: '/data/pots.json',
  WINNERS_URL: '/data/winners.json',

  // CoinGecko API for ETH price (public, no key needed)
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',

  // How often to check for new data (ms)
  REFRESH_INTERVAL: 60000,  // 60 seconds

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