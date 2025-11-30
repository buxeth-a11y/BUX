import React from 'react';
import { Link } from 'react-router-dom';
import Pots from "../components/Pots";
import Countdown from "../components/Countdown";
import DollarBill from "../components/DollarBill";
import SocialsModal from "../components/SocialsModal";
import BuxModal from "../components/BuxModal";
import DVDModal from "../components/DVDModal";
import { useBux } from '../contexts/BuxContext';


const getDigit = (number, position) =>
  Math.floor((number / 10 ** position) % 10);

// dollar amount display
export const NumberDisplay = ({ number, position, className }) => (
  <img
    src={`/bill-parts/numbersBold/${getDigit(number, position)}.png`}
    alt={getDigit(number, position)}
    className={className}
  />
);

const Home = () => {
  const [showHour, setShowHour] = React.useState(true);

  // Get live pot data from blockchain (via static JSON files)
  const { dailyPot: dailyPotEth, hourlyPot: hourlyPotEth, ethPrice } = useBux();

  // Convert ETH to USD for display
  const dailyPot = Math.round(dailyPotEth * ethPrice);
  const hourlyPot = Math.round(hourlyPotEth * ethPrice);

  const showKLeft = dailyPot > 1000;
  const showKRight = hourlyPot > 1000;  

  const sectionClass = "min-h-screen flex flex-col items-center justify-center p-8 snap-start";
  
  const buttonClass = `
    relative
    bg-buxYellow 
    text-buxBlack 
    font-pixel 
    text-2xl
    px-12 py-6
    border-4 border-black
    before:content-['']
    before:absolute
    before:top-1
    before:left-1
    before:right-1
    before:bottom-1
    before:border-2
    before:border-white
    before:pointer-events-none
    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
    hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    hover:translate-x-[4px]
    hover:translate-y-[4px]
    active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
    active:translate-x-[6px]
    active:translate-y-[6px]
    transition-all
    w-full
    max-w-xs
  `;

  const linkClass = `
    relative
    bg-buxGreen 
    text-buxYellow 
    font-pixel 
    text-xl
    px-10 py-5
    border-4 border-black
    before:content-['']
    before:absolute
    before:top-1
    before:left-1
    before:right-1
    before:bottom-1
    before:border-2
    before:border-white
    before:pointer-events-none
    shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
    hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
    hover:translate-x-[3px]
    hover:translate-y-[3px]
    active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
    active:translate-x-[5px]
    active:translate-y-[5px]
    transition-all
    w-full
    max-w-xs
    text-center
  `;

  const labelStyle = {
    textShadow: `
      -2px -2px 0 #000000,  
       2px -2px 0 #000000,
      -2px  2px 0 #000000,
       2px  2px 0 #000000,
      -4px  0px 0 #000000,
       4px  0px 0 #000000,
       0px -4px 0 #000000,
       0px  4px 0 #000000
    `,
  };

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* 1. Hero / Buy Now Section */}
      <section className={`${sectionClass} bg-buxDollarGreen`}>
        {/* Logo - Smaller */}
        <img 
          src="/gifs/buxMobile.gif" 
          alt="BuxLotto" 
          className="w-48 h-auto pixelated mb-4"
        />

        <h1 className="text-4xl text-buxYellow font-pixel mb-3 text-center" style={labelStyle}>
          BUX LOTTO
        </h1>
        
        <p className="text-black font-pixel text-center mb-6 max-w-md text-sm relative h-6">
          Win every{' '}
          <span 
            className="text-buxYellow inline-block transition-all duration-500"
            style={{
              ...labelStyle,
              opacity: showHour ? 1 : 0,
              transform: showHour ? 'translateY(0)' : 'translateY(-10px)',
              position: showHour ? 'relative' : 'absolute',
            }}
          >
            HOUR
          </span>
          <span 
            className="text-buxYellow inline-block transition-all duration-500"
            style={{
              ...labelStyle,
              opacity: showHour ? 0 : 1,
              transform: showHour ? 'translateY(10px)' : 'translateY(0)',
              position: showHour ? 'absolute' : 'relative',
            }}
          >
            DAY
          </span>
        </p>
        
        
        
        <div className="bg-buxGreen dh text-white home p-6 mb-4 rounded shadow-pixel space-y-6">
          {/* POTS DISPLAY */}
          <Pots />

          {/* COUNTDOWN UNDER POTS */}
          <div className="items-center gap-2 mb-10">
            <Countdown />
          </div>

          {/* BILL DISPLAY SECTION */}
          <div>
            <div className="aboutTotalLeft">
              {/* amounts left (daily) */}
              <img
                src="/bill-parts/numbersBold/dollar_sign.png"
                alt="$"
                className="dollarLeft"
              />
              <NumberDisplay number={dailyPot} position={5} className="d0Left" />              
              <NumberDisplay number={dailyPot} position={4} className="d1Left" />
              <NumberDisplay number={dailyPot} position={3} className="d2Left" />
              <NumberDisplay number={dailyPot} position={2} className="d3Left" />
              <NumberDisplay number={dailyPot} position={1} className="d4Left" />
              <NumberDisplay number={dailyPot} position={0} className="d5Left" />

              {showKLeft && (
                <img
                  src="/bill-parts/numbersBold/k.png"
                  alt="k"
                  className="d6Left"
                />
              )}
              </div>

            <div className="aboutTotalRight">              
              {/* amounts right (hourly) */}
              <img
                src="/bill-parts/numbersBold/dollar_sign.png"
                alt="$"
                className="dollarRight"
              />
              <NumberDisplay number={hourlyPot} position={5} className="d0Right" />              
              <NumberDisplay number={hourlyPot} position={4} className="d1Right" />
              <NumberDisplay number={hourlyPot} position={3} className="d2Right" />
              <NumberDisplay number={hourlyPot} position={2} className="d3Right" />
              <NumberDisplay number={hourlyPot} position={1} className="d4Right" />
              <NumberDisplay number={hourlyPot} position={0} className="d5Right" />

              {showKRight && (
                <img
                  src="/bill-parts/numbersBold/k.png"
                  alt="k"
                  className="d6Right"
                />
              )}

            </div>
          </div>
        </div>
        
        
        {/* Buy Button */}
        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs"
        >
          <button className={`${buttonClass} text-xl px-10 py-5`}>
            ABOUT US
          </button>
        </a>
        
        <p className="text-black font-pixel text-xs mt-6 animate-bounce">
          ↓ Scroll Down ↓
        </p>
      </section>

      {/* winners */}
      <section className={`${sectionClass} bg-buxGreen`}>
        <i className="hn hn-trophy-solid text-8xl text-buxYellow mb-6"></i>
        <h2 className="text-4xl text-buxYellow font-pixel mb-4" style={labelStyle}>
          WINNERS
        </h2>
        <p className="text-white font-pixel text-center mb-8 max-w-md">
          Check out all our lucky winners!
        </p>
        <Link to="/winners" className={linkClass}>
          View Winners
        </Link>
      </section>

      {/* about */}
      <section className={`${sectionClass} bg-buxBlack`}>
        <i className="hn hn-question-solid text-8xl text-buxYellow mb-6"></i>
        <h2 className="text-4xl text-buxYellow font-pixel mb-4" style={labelStyle}>
          ABOUT
        </h2>
        <p className="text-white font-pixel text-center mb-8 max-w-md">
          Learn how BUX LOTTO works!
        </p>
        <Link to="/about" className={linkClass}>
          Learn More
        </Link>
      </section>

      {/* audit */}
      <section className={`${sectionClass} bg-buxDollarGreen`}>
        <i className="hn hn-shield-solid text-8xl text-buxYellow mb-6"></i>
        <h2 className="text-4xl text-buxYellow font-pixel mb-4" style={labelStyle}>
          AUDIT
        </h2>
        <p className="text-black font-pixel text-center mb-8 max-w-md">
          Verified & secure smart contracts
        </p>
        <a 
          href="https://audit-link.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={linkClass}
        >
          View Audit
        </a>
      </section>

      {/* socials n shit */}
      <section className={`${sectionClass} bg-buxGreen`}>
        <h2 className="text-4xl text-buxYellow font-pixel mb-8" style={labelStyle}>
          JOIN US
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a 
            href="https://twitter.com/buxlotto" 
            target="_blank" 
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-x mr-2"></i> Twitter
          </a>
          <a 
            href="https://discord.gg/buxlotto" 
            target="_blank" 
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-discord mr-2"></i> Discord
          </a>
          <a 
            href="https://t.me/buxlotto" 
            target="_blank" 
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-envelope-solid mr-2"></i> Telegram
          </a>
          <a 
            href="https://dexscreener.com/buxlotto" 
            target="_blank" 
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-chart-line-solid mr-2"></i> Dexscreener
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;