import React from 'react';
import { useBux } from '../contexts/BuxContext';

// Format seconds into readable countdown
const formatCountdown = (totalSeconds, includeHours = false) => {
  if (totalSeconds <= 0) return includeHours ? '0h 0m 0s' : '0m 0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (includeHours) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

// Format USD amount
const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PotDisplay() {
  const {
    dailyPot: dailyPotEth,
    hourlyPot: hourlyPotEth,
    hourlySeconds,
    dailySeconds,
    ethPrice
  } = useBux();

  const dailyPotUSD = Math.round(dailyPotEth * ethPrice);
  const hourlyPotUSD = Math.round(hourlyPotEth * ethPrice);

  const labelStyle = {
    textShadow: `
      -1px -1px 0 #000,
       1px -1px 0 #000,
      -1px  1px 0 #000,
       1px  1px 0 #000
    `,
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 sm:gap-8 w-full max-w-2xl mx-auto">
      {/* Daily Pot */}
      <div className="flex-1 bg-buxGreen rounded-lg p-4 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-buxYellow text-xl font-pixel mb-2" style={labelStyle}>
          DAILY POT
        </h3>
        <div className="text-white text-3xl sm:text-4xl font-pixel mb-2" style={labelStyle}>
          {formatUSD(dailyPotUSD)}
        </div>
        <div className="text-buxYellow text-sm font-pixel">
          Next draw: {formatCountdown(dailySeconds, true)}
        </div>
      </div>

      {/* Hourly Pot */}
      <div className="flex-1 bg-buxGreen rounded-lg p-4 text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-buxYellow text-xl font-pixel mb-2" style={labelStyle}>
          HOURLY POT
        </h3>
        <div className="text-white text-3xl sm:text-4xl font-pixel mb-2" style={labelStyle}>
          {formatUSD(hourlyPotUSD)}
        </div>
        <div className="text-buxYellow text-sm font-pixel">
          Next draw: {formatCountdown(hourlySeconds, false)}
        </div>
      </div>
    </div>
  );
}
