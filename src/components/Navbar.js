import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/', icon: 'home-solid' },
  { name: 'Winners', path: '/winners', icon: 'trophy-solid' },
  { name: 'About', path: '/about', icon: 'question-solid' },
  { name: 'Twitter', path: 'https://x.com/BUXonETH', icon: 'x', external: true },
  { name: 'Telegram', path: 'https://t.me/buxeth', icon: 'envelope-solid', external: true },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="
      relative
      bg-buxGreen
      border-4 border-black
      before:content-['']
      before:absolute
      before:top-1
      before:left-1
      before:right-1
      before:bottom-1
      before:border-2
      before:border-buxYellow
      before:pointer-events-none
    ">
      <div className="flex items-center justify-between p-4">
        {/* logo in container */}
        <div className="flex items-center gap-2">
          <div className="
            bg-buxYellow 
            p-2 
            border-2 border-black
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          ">
            <img 
              src="/bux.png" 
              alt="BuxLotto" 
              className="h-8 w-8 pixelated"
            />
          </div>
          <span className="text-buxYellow font-pixel text-xs drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            BUX
          </span>
        </div>

        {/* burgir */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="
            bg-buxYellow
            text-buxBlack
            p-3
            border-4 border-black
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[3px]
            hover:translate-y-[3px]
            transition-all
          "
          aria-label="Toggle menu"
        >
          <i className="hn hn-bars-solid text-xl"></i>
        </button>
      </div>

      {/* dropdown */}
      {isMenuOpen && (
        <div className="
          absolute 
          top-full 
          left-0 
          right-0 
          bg-buxGreen 
          border-4 border-black 
          border-t-0
          shadow-[0_4px_0px_0px_rgba(0,0,0,1)]
          z-50
        ">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={index} className="border-b-2 border-black last:border-b-0">
                {item.external ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex items-center gap-3 
                      p-4 
                      text-buxYellow 
                      hover:bg-buxYellow 
                      hover:text-buxBlack 
                      transition-colors
                    "
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`hn hn-${item.icon} text-xl`}></i>
                    <span className="font-pixel text-xs">{item.name}</span>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className="
                      flex items-center gap-3 
                      p-4 
                      text-buxYellow 
                      hover:bg-buxYellow 
                      hover:text-buxBlack 
                      transition-colors
                    "
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`hn hn-${item.icon} text-xl`}></i>
                    <span className="font-pixel text-xs">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}