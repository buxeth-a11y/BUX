import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard-ts';

export default function ScrollingBanner({ dailyPot, hourlyPot, contractAddress }) {
  const [copied, setCopied] = useState(false);
  const [dailyCountdown, setDailyCountdown] = useState('');
  const [hourlyCountdown, setHourlyCountdown] = useState('');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextDailyReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    return tomorrow;
  };

  const getNextHourlyReset = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return nextHour;
  };

  const formatCountdown = (ms, isDaily = false) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (isDaily) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  };

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const dailyMs = getNextDailyReset() - now;
      const hourlyMs = getNextHourlyReset() - now;
      setDailyCountdown(formatCountdown(dailyMs, true));
      setHourlyCountdown(formatCountdown(hourlyMs, false));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const bannerText = `Daily Pot: $${dailyPot} (${dailyCountdown}) | Hourly Pot: $${hourlyPot} (${hourlyCountdown}) | CA: ${contractAddress}`;

   return (
    <>
      <style>{`
        .marquee-container {
          width: 100%;
          /* overflow: hidden;
          position: relative; */
        }

        .marquee-wrapper {
          /* display: flex; */
          align-items: center;
          gap: 3rem;
          /* animation: scroll-banner 25s linear infinite; */
          will-change: transform;
        }

        .marquee-section {
          display: inline-block;
          /*align-items: center;
          gap: 2rem;
          white-space: wrap;
          flex-shrink: 0;*/
        }

        .deer-icon {
          height: 36px;
          width: auto;
        }

        /* @keyframes scroll-banner {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        .marquee-container:hover .marquee-wrapper {
          animation-play-state: paused;
        }*/

        @media (max-width: 768px) {
          /*.marquee-wrapper {
            animation: scroll-banner-mobile 25s linear infinite;
          }

          @keyframes scroll-banner-mobile {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-100%, 0, 0);
            }
          }
        }
      `}</style>

      <CopyToClipboard text={contractAddress} onCopy={handleCopy}>
        <div
          /*className="
            relative
            bg-buxGreen
            border-t-4 border-b-4 border-buxYellow
            before:content-['']
            before:absolute
            before:top-0
            before:left-0
            before:right-0
            before:bottom-0
            before:border-t-2 before:border-b-2 before:border-buxGreen
            before:pointer-events-none
            h-14
            flex items-center
            cursor-pointer
            hover:bg-opacity-90
            transition-all
            overflow-hidden
            shadow-[inset_0_-4px_0px_0px_rgba(0,0,0,0.3)]
          "*/
          title="Click to copy CA"
        >
          {copied ? (
            <div
              /*className="
                w-full 
                text-center 
                text-buxYellow 
                font-pixel 
                text-sm
                animate-pulse
                drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]
              "*/
            >
              ✓ COPIED!
            </div>
          ) : (
            <div className="marquee-container">
              <div className="marquee-wrapper text-buxYellow font-pixel text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {/* duplicate to avoid weird clipping bug */}
               {[...Array(1)].map((_, i) => (
                  <div className="marquee-section" key={i}>
                    <span className="bannerText">{bannerText}</span>
                    <img src="/bux.png" alt="bux" className="deer-icon" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CopyToClipboard>
    </>
  );
}
