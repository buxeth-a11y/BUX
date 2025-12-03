import React from 'react';

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center flex-grow p-4 gap-8">
      {/* logo */}
      <img 
        src="/gifs/buxMobile.gif" 
        alt="BuxLotto" 
        className="w-64 h-auto pixelated"
      />
      
          {/* buy button */}
          <a
      href="https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0xb6cbffeab1434a0d73f1706c1389378325febb96"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="
        relative
        bg-buxYellow 
        text-buxBlack 
        font-pixel 
        px-8 py-4
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
        text-sm
      ">
        BUY NOW
      </button>
    </a>
     
    </section>
  );
}