import React, { useState } from "react";
import Countdown from './Countdown';

export default function Pots() {
  const [hoveredGifs, setHoveredGifs] = useState({
    daily: false,
    hourly: false,
  });

  const gifSpeeds = {
    daily: 1,
    hourly: 1,
  };

  return (
    <>
      {/* DAILY */}
      <div className="dailyBox">
      <a 
        href="/winners" 
        className="dailyPot"
        onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, daily: true }))}
        onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, daily: false }))}
      >
        <div 
          className="nextDraw text-2xl font-bold mb-2"
          style={{
            textShadow:
              '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
            color: '#fff',
          }}
        >
          <img width="280"
            src="/bill-parts/parts/nextdraw.png"
            alt="Next Daily Draw"
            className="h-full"
          />
        </div>

        <img width="240"
          src={
            hoveredGifs.daily 
              ? "/gifs/daily-fast.gif" 
              : `/gifs/daily.gif`
          }
          alt="Daily"
          className="h-full"
        />
      </a>


      </div>

      {/* HOURLY */}
      <div className="hourlyBox">      
      <a 
        href="/winners" 
        className="hourlyPot"
        onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, hourly: true }))}
        onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, hourly: false }))}
      >
        <div 
          className="nextDraw text-2xl font-bold mb-2"
          style={{
            textShadow:
              '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
            color: '#fff',
          }}
        >
          <img width="280"
            src="/bill-parts/parts/nextdraw.png"
            alt="Next Hourly Draw"
            className="h-full"
          />
        </div>

        <img width="280"
          src={
            hoveredGifs.hourly
              ? "/gifs/hourly-fast.gif"
              : `/gifs/hourly.gif`
          }
          alt="Hourly"
          className="h-full"
        />
      </a></div>
    </>
  );
}
