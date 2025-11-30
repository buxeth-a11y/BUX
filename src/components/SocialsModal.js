import React from 'react';

const navItems = [
  { name: 'Twitter', icon: 'x', link: 'https://x.com/BUXonETH' },
  { name: 'Telegram', icon: 'envelope-solid', link: 'https://t.me/buxeth' },
  { name: 'Dexscreener', icon: 'analytics-solid', link: 'https://dexscreener.com/' },
];

export default function SocialsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="max-w-md w-full"
        style={{
          clipPath:
            'polygon(0px 20px, 4px 20px, 4px 12px, 8px 12px, 8px 8px, 12px 8px, 12px 4px, 16px 4px, 20px 4px, 20px 0px, calc(100% - 20px) 0px, calc(100% - 20px) 4px, calc(100% - 12px) 4px, calc(100% - 12px) 8px, calc(100% - 8px) 8px, calc(100% - 8px) 12px, calc(100% - 4px) 12px, calc(100% - 4px) 16px, calc(100% - 4px) 20px, 100% 20px, 100% calc(100% - 20px), calc(100% - 4px) calc(100% - 20px), calc(100% - 4px) calc(100% - 12px), calc(100% - 8px) calc(100% - 12px), calc(100% - 8px) calc(100% - 8px), calc(100% - 12px) calc(100% - 8px), calc(100% - 12px) calc(100% - 4px), calc(100% - 16px) calc(100% - 4px), calc(100% - 20px) calc(100% - 4px), calc(100% - 20px) 100%, 20px 100%, 20px calc(100% - 4px), 12px calc(100% - 4px), 12px calc(100% - 8px), 8px calc(100% - 8px), 8px calc(100% - 12px), 4px calc(100% - 12px), 4px calc(100% - 16px), 4px calc(100% - 20px), 0px calc(100% - 20px))',
          backgroundColor: '#FAF4DD',
        }}
      >
        <div className="p-6 rounded shadow-pixel">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-buxYellow text-xl font-pixel"
              style={{
                textShadow:
                  '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
              }}
            >
              Socials
            </h2>
            <button onClick={onClose} className="text-white hover:text-buxYellow">
              <i
                className="hn hn-times-solid text-2xl"
                style={{
                  textShadow:
                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
                }}
              ></i>
            </button>
          </div>
          <ul className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-buxYellow flex items-center space-x-2"
                  onClick={onClose}
                  style={{
                    textShadow:
                      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
                  }}
                >
                  <i className={`hn hn-${item.icon} text-2xl`}></i>
                  <span className="font-pixel text-sm">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}