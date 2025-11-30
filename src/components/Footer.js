import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
    <footer className="bg-buxBlack border-t-4 border-buxYellow py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Column 1: About */}
          <div>
            <h3 className="text-buxYellow font-pixel text-xl mb-4" style={labelStyle}>
              About BUX Token
            </h3>
            <p className="text-white font-pixel text-sm leading-relaxed">
              The best decentralized rewards token on ETH. Win daily and hourly prizes with BUX tokens!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-buxYellow font-pixel text-xl mb-4" style={labelStyle}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-white font-pixel text-sm hover:text-buxYellow transition-colors"
                >
                  → Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white font-pixel text-sm hover:text-buxYellow transition-colors"
                >
                  → About
                </Link>
              </li>
              <li>
                <Link 
                  to="/winners" 
                  className="text-white font-pixel text-sm hover:text-buxYellow transition-colors"
                >
                  → Winners
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social & Contract */}
          <div>
            <h3 className="text-buxYellow font-pixel text-xl mb-4" style={labelStyle}>
              Connect
            </h3>
            <div className="space-y-2">
              <a
                href="https://x.com/BUXonETH"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-pixel text-sm hover:text-buxYellow transition-colors block"
              >
                → Twitter
              </a>
              <a
                href="https://t.me/buxeth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-pixel text-sm hover:text-buxYellow transition-colors block"
              >
                → Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-buxGreen pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white font-pixel text-sm">
              © 2025 BUX Token. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://etherscan.io/address/0x..." 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-buxYellow font-pixel text-sm hover:underline"
              >
                Audit
              </a>
              <span className="text-white">|</span>
              <a 
                href="#" 
                className="text-white font-pixel text-sm hover:text-buxYellow transition-colors"
              >
                Terms
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;