import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DATA_CONFIG } from '../config/constants';

const BuxContext = createContext();

export function BuxProvider({ children }) {
  const [hourlyPot, setHourlyPot] = useState(0);
  const [dailyPot, setDailyPot] = useState(0);
  const [hourlySeconds, setHourlySeconds] = useState(0);
  const [dailySeconds, setDailySeconds] = useState(0);
  const [winners, setWinners] = useState([]);
  const [winnersLoading, setWinnersLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(DATA_CONFIG.DEFAULT_ETH_PRICE);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Fetch static JSON data files
  const fetchData = useCallback(async () => {
    try {
      // Fetch pots.json (static file, auto-updated by GitHub Actions)
      const potsRes = await fetch(DATA_CONFIG.POTS_URL + '?t=' + Date.now());
      if (potsRes.ok) {
        const pots = await potsRes.json();
        setHourlyPot(pots.hourlyPotEth);
        setDailyPot(pots.dailyPotEth);
        setLastUpdate(pots.updatedAt);

        // Calculate remaining seconds from timestamps
        const now = Math.floor(Date.now() / 1000);
        setHourlySeconds(Math.max(0, pots.nextHourlyTimestamp - now));
        setDailySeconds(Math.max(0, pots.nextDailyTimestamp - now));
      }

      // Fetch ETH price from CoinGecko (public API, no key needed)
      try {
        const priceRes = await fetch(DATA_CONFIG.COINGECKO_URL);
        if (priceRes.ok) {
          const priceData = await priceRes.json();
          setEthPrice(priceData.ethereum.usd);
        }
      } catch (priceErr) {
        // Keep default price if CoinGecko fails
        console.warn('Could not fetch ETH price, using default');
      }

      setError(null);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Failed to load data');
    }
  }, []);

  // Fetch winners from static JSON file
  const fetchWinners = useCallback(async () => {
    try {
      setWinnersLoading(true);
      const res = await fetch(DATA_CONFIG.WINNERS_URL + '?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setWinners(data);
      }
    } catch (err) {
      console.error('Winners fetch error:', err);
    } finally {
      setWinnersLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
    fetchWinners();
  }, [fetchData, fetchWinners]);

  // Refresh data periodically (check for GitHub Actions updates)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      fetchWinners();
    }, DATA_CONFIG.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData, fetchWinners]);

  // Tick countdown every second (client-side)
  useEffect(() => {
    const interval = setInterval(() => {
      setHourlySeconds((prev) => Math.max(0, prev - 1));
      setDailySeconds((prev) => Math.max(0, prev - 1));
    }, DATA_CONFIG.COUNTDOWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <BuxContext.Provider
      value={{
        hourlyPot,
        dailyPot,
        hourlySeconds,
        dailySeconds,
        winners,
        winnersLoading,
        ethPrice,
        lastUpdate,
        error,
        refreshData: fetchData,
        refreshWinners: fetchWinners,
      }}
    >
      {children}
    </BuxContext.Provider>
  );
}

export function useBux() {
  const context = useContext(BuxContext);
  if (!context) {
    throw new Error('useBux must be used within a BuxProvider');
  }
  return context;
}
