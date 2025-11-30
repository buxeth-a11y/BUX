import { useBux } from '../contexts/BuxContext';

// Format seconds into readable countdown string
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

export default function Countdown() {
  // Get countdown seconds from blockchain data (via static JSON)
  const { hourlySeconds, dailySeconds } = useBux();

  return (
    <>
      <div>
        <span className="daily text-xl font-bold">
          {formatCountdown(dailySeconds, true)}
        </span>
      </div>
      <div>
        <span className="hourly text-xl font-bold">
          {formatCountdown(hourlySeconds, false)}
        </span>
      </div>
    </>
  );
}
