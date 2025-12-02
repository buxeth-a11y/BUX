import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PotDisplay from "../components/PotDisplay";

const Home = () => {
  const [showHour, setShowHour] = React.useState(true);

  // Alternate between Hour and Day every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHour(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);  

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
      <section className={`${sectionClass} bg-buxDollarGreen pb-48`}>
        {/* Logo - Smaller */}
        <img 
          src="/gifs/buxMobile.gif" 
          alt="BuxLotto" 
          className="w-48 h-auto pixelated mb-4"
        />

        <h1 className="text-4xl text-buxYellow font-pixel mb-3 text-center" style={labelStyle}>
          BUX
        </h1>
        
        <p className="text-black font-pixel text-center mb-6 max-w-md text-sm flex items-center justify-center">
          Win every{' '}
          <span className="relative inline-flex items-center justify-center ml-4" style={{ width: '3.5em', height: '1.2em' }}>
            <span
              className="text-buxYellow absolute transition-all duration-500"
              style={{
                ...labelStyle,
                opacity: showHour ? 1 : 0,
                transform: showHour ? 'translateY(0)' : 'translateY(-10px)',
              }}
            >
              HOUR
            </span>
            <span
              className="text-buxYellow absolute transition-all duration-500"
              style={{
                ...labelStyle,
                opacity: showHour ? 0 : 1,
                transform: showHour ? 'translateY(10px)' : 'translateY(0)',
              }}
            >
              DAY
            </span>
          </span>
        </p>
        
        
        
        <div className="mb-4 w-full max-w-md">
          <PotDisplay />
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

      {/* buy now */}
      <section className={`${sectionClass} bg-buxBlack`}>
        <i className="hn hn-cart-shopping-solid text-8xl text-buxYellow mb-6"></i>
        <h2 className="text-4xl text-buxYellow font-pixel mb-4" style={labelStyle}>
          BUY NOW
        </h2>
        <p className="text-white font-pixel text-center mb-8 max-w-md">
          Get BUX on Uniswap!
        </p>
        <a
          href="https://app.uniswap.org/swap"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Buy BUX
        </a>
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
          href="https://bux.life/BUX%20Smart%20Contract%20Audit%20-%20Final%20Report.pdf"
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
            href="https://x.com/BUXonETH"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-x mr-2"></i> Twitter
          </a>
          <a
            href="https://t.me/buxeth"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <i className="hn hn-envelope-solid mr-2"></i> Telegram
          </a>
          <a
            href="https://dexscreener.com/ethereum/0x26b73e77f7b2cfc05d28a8978b917eced1cdf7915862292cfbb507731d5120fd"
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