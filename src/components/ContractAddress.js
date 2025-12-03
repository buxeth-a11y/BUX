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

  // Compact version for Navbar - no border, just yellow text
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
        "
        style={{
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        }}
        title="Click to copy contract address"
      >
        {copied ? (
          <span className="text-buxYellow">Copied!</span>
        ) : (
          <>
            <span className="hidden sm:inline">CA: {CONTRACT_ADDRESS}</span>
            <span className="sm:hidden">CA: {truncatedAddress}</span>
          </>
        )}
      </button>
    );
  }

  // Banner version for mobile - full width, thin, full address
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
          <span>CA: {CONTRACT_ADDRESS}</span>
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
        <span>CA: {CONTRACT_ADDRESS}</span>
      )}
    </button>
  );
}
