import React, { useState, useEffect } from 'react';
import '../App.css';
import SocialsModal from './SocialsModal';
import BuxModal from './BuxModal';
import DVDModal from './DVDModal'; // Add this import

const getDigit = (number, position) => Math.floor((number / 10 ** position) % 10);

// dollar amount display
export const NumberDisplay = ({ number, position, className }) => (

  <img
    src={`/bill-parts/numbersBold/${getDigit(number, position)}.png`}
    alt={getDigit(number, position)}
    className={className}
  />
);

export default function DollarBill() {
  const [isSocialsModalOpen, setIsSocialsModalOpen] = useState(false);
  const [isBuxModalOpen, setIsBuxModalOpen] = useState(false);
  const [isDVDModalOpen, setIsDVDModalOpen] = useState(true); 
  const [dailyPot, setDailyPot] = useState(0);
  const [hourlyPot, setHourlyPot] = useState(0);
  
  // hover state for gifs
  const [hoveredGifs, setHoveredGifs] = useState({
    daily: false,
    hourly: false,
    eav: false,
    deer: false,
    buynow: false,
    socials: false,    
  });

  // random assign slow and fast to each gif
  const [gifSpeeds] = useState({
    daily: Math.random() > 0.5 ? '' : '-slow',
    hourly: Math.random() > 0.5 ? '' : '-slow',
    eav: Math.random() > 0.5 ? '' : '-slow',
    deer: Math.random() > 0.5 ? '' : '-slow',
    buynow: Math.random() > 0.5 ? '' : '-slow',
    socials: Math.random() > 0.5 ? '' : '-slow',
  });

  // scaling (DO NOT TOUCH THIS!!!)
  useEffect(() => {
    const resize = () => {
      const designWidth = 1920;
      const designHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scaleX = windowWidth / designWidth;
      const scaleY = windowHeight / designHeight;

      document.documentElement.style.setProperty("--scale-x", scaleX);
      document.documentElement.style.setProperty("--scale-y", scaleY);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // counter update 
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyPot((prev) => (prev >= 10000000 ? 0 : prev + 500));
      setHourlyPot((prev) => (prev >= 10000000 ? 0 : prev + 250));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showKLeft = dailyPot > 1000;
  const showKRight = hourlyPot > 1000;

  return (
    <div className="bux-container">
      <div className="design-wrapper">
        {/* background */}
        <img src="/bill1.png" alt="" className="bg " />

        {/* daily */}
        <a 
          href="/winners" 
          className="dailyPot hover-zoom"
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
            <img src="/bill-parts/parts/nextdraw.png"
            alt="Next Daily Draw" 
            className="w-full h-full " 
            />
          </div>

          <img 
            src={hoveredGifs.daily ? "/gifs/daily-fast.gif" : `/gifs/daily${gifSpeeds.daily}.gif`} 
            alt="Daily" 
            className="w-full h-full " 
          />
        </a> 

        {/* hourly */}
        <a 
          href="/winners" 
          className="hourlyPot hover-zoom"
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
            <img src="/bill-parts/parts/nextdraw.png"
            alt="Next Hourly Draw" 
            className="w-full h-full "             
            />
          </div> 

          <img 
            src={hoveredGifs.hourly ? "/gifs/hourly-fast.gif" : `/gifs/hourly${gifSpeeds.hourly}.gif`} 
            alt="Hourly" 
            className="w-full h-full " 
          />
         
        </a>

   

        {/* audit */}
        <a 
          href="/BUX Smart Contract Audit - Final Report.pdf"
          target="_blank" 
          className="externalAudit hover-zoom"
          onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, eav: true }))}
          onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, eav: false }))}
        >
          <img 
            src={hoveredGifs.eav ? "/gifs/ashlock.png" : `/gifs/ashlock${gifSpeeds.eav}.png`} 
            alt="External Audit Verified" 
            className="w-full h-full " 
          />
        </a>

        <img 
          src={`/bill-parts/parts/wineveryhour.png`} 
          alt="Win" 
          className="win " 
        />
        
        {/* deer */}
        <button 
          onClick={() => setIsBuxModalOpen(true)} 
          className="bux hover-zoom"
          onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, deer: true }))}
          onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, deer: false }))}
        >
          <img 
            src={hoveredGifs.deer ? "/gifs/bux-fast.gif" : `/gifs/bux${gifSpeeds.deer}.gif`} 
            alt="Bux Logo" 
            className="w-full h-full " 
          />
        </button>

        {/* buy now */}
        <a 
          href="https://app.uniswap.org/swap" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="buynow hover-zoom"
          onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, buynow: true }))}
          onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, buynow: false }))}
        >
          <img 
            src={hoveredGifs.buynow ? "/gifs/buynow-fast.gif" : `/gifs/buynow${gifSpeeds.buynow}.gif`} 
            alt="Buy Now" 
            className="w-full h-full " 
          />
        </a>

        {/* about */}
        <a href="/about"><img 
          src={`/bill-parts/parts/about-bux.gif`} 
          alt="About Bux" 
          className="onehundredbux aboutbux" 
        /></a>

        {/* socilas */}
        <button 
          onClick={() => setIsSocialsModalOpen(true)} 
          className="socials hover-zoom"
          onMouseEnter={() => setHoveredGifs(prev => ({ ...prev, socials: true }))}
          onMouseLeave={() => setHoveredGifs(prev => ({ ...prev, socials: false }))}
        >
          <img 
            src={hoveredGifs.socials ? "/gifs/socials-fast.gif" : `/gifs/socials${gifSpeeds.socials}.gif`} 
            alt="Socials" 
            className="w-full h-full " 
          />
        </button>

        {/* amounts left (daily) */}
        <img src="/bill-parts/numbersBold/dollar_sign.png" alt="$" className="dollarLeft " />
        <NumberDisplay number={dailyPot} position={5} className="d0Left " />        
        <NumberDisplay number={dailyPot} position={4} className="d1Left " />
        <NumberDisplay number={dailyPot} position={3} className="d2Left " />
        <NumberDisplay number={dailyPot} position={2} className="d3Left " />
        <NumberDisplay number={dailyPot} position={1} className="d4Left " />
        <NumberDisplay number={dailyPot} position={0} className="d5Left " />
        {showKLeft && <img src="/bill-parts/numbersBold/k.png" alt="k" className="d6Left " />}

        {/* amounts right (hourly) */}
        <img src="/bill-parts/numbersBold/dollar_sign.png" alt="$" className="dollarRight " />
        <NumberDisplay number={hourlyPot} position={5} className="d0Right " />
        <NumberDisplay number={hourlyPot} position={4} className="d1Right " />
        <NumberDisplay number={hourlyPot} position={3} className="d2Right " />
        <NumberDisplay number={hourlyPot} position={2} className="d3Right " />
        <NumberDisplay number={hourlyPot} position={1} className="d4Right " />
        <NumberDisplay number={hourlyPot} position={0} className="d5Right " />
        {showKRight && <img src="/bill-parts/numbersBold/k.png" alt="k" className="d6Right " />}

        {/* modals */}
        <SocialsModal isOpen={isSocialsModalOpen} onClose={() => setIsSocialsModalOpen(false)} />
        <BuxModal isOpen={isBuxModalOpen} onClose={() => setIsBuxModalOpen(false)} />
        <DVDModal isOpen={isDVDModalOpen} onClose={() => setIsDVDModalOpen(true)} /> 
      </div>
    </div>
  );
}