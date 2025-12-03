import React, { useState } from 'react';

const CONTRACT_ADDRESS = '0xb6cbFfeab1434a0D73F1706c1389378325feBB96';

export default function ContractAddress({ variant = 'default' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Truncated version
  const truncatedAddress = `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-3)}`;

  // Compact version for Navbar mobile - no border, just yellow text, truncated
  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className="
          text-buxYellow
          font-pixel
          text-xs
          px-2 py-1
          hover:opacity-80
          transition-all
          cursor-pointer
          sm:hidden
        "
        style={{
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}
        title="Click to copy contract address"
      >
        {copied ? (
          <span className="text-buxYellow">Copied!</span>
        ) : (
          <span>CA:{truncatedAddress}</span>
        )}
      </button>
    );
  }

  // Banner version - full width, thin, truncated on mobile
  if (variant === 'banner') {
    return (
      <button
        onClick={handleCopy}
        className="
          w-full
          text-buxYellow
          font-pixel
          text-xs
          py-2
          hover:opacity-80
          transition-all
          cursor-pointer
          text-center
        "
        style={{
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}
        title="Click to copy contract address"
      >
        {copied ? (
          <span className="text-buxYellow">Copied!</span>
        ) : (
          <span>CA:{truncatedAddress}</span>
        )}
      </button>
    );
  }

  // Desktop banner version - full address
  if (variant === 'desktop-banner') {
    return (
      <button
        onClick={handleCopy}
        className="
          w-full
          bg-buxGreen
          text-buxYellow
          font-pixel
          text-xs
          py-2
          hover:opacity-90
          transition-all
          cursor-pointer
          text-center
          border-b-2
          border-black
        "
        style={{
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}
        title="Click to copy contract address"
      >
        {copied ? (
          <span className="text-buxYellow">Copied!</span>
        ) : (
          <span>CA:{CONTRACT_ADDRESS}</span>
        )}
      </button>
    );
  }

  // Dollar bill themed banner - vintage/tan colors
  if (variant === 'dollar-bill') {
    return (
      <button
        onClick={handleCopy}
        className="
          w-full
          font-pixel
          text-xs
          py-2
          hover:opacity-80
          transition-all
          cursor-pointer
          text-center
          border-b-2
        "
        style={{
          backgroundColor: '#d4c9a8',
          color: '#2d4a3e',
          borderColor: '#2d4a3e',
          textShadow: '1px 1px 0 rgba(255,255,255,0.3)'
        }}
        title="Click to copy contract address"
      >
        {copied ? (
          <span style={{ color: '#1a5c3a' }}>Copied!</span>
        ) : (
          <span>CA:{CONTRACT_ADDRESS}</span>
        )}
      </button>
    );
  }

  // Default version
  return (
    <button
      onClick={handleCopy}
      className="
        text-buxYellow
        font-pixel
        text-sm
        px-4 py-2
        hover:opacity-80
        transition-all
        cursor-pointer
      "
      style={{
        textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
      }}
      title="Click to copy contract address"
    >
      {copied ? (
        <span className="text-buxYellow">Copied!</span>
      ) : (
        <span>CA:{CONTRACT_ADDRESS}</span>
      )}
    </button>
  );
}
