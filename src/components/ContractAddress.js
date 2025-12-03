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

  // Truncated version for mobile
  const truncatedAddress = `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-3)}`;

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className="
          flex items-center gap-1
          bg-buxBlack
          text-buxYellow
          font-pixel
          text-xs
          px-2 py-1
          border-2 border-black
          shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-[1px]
          hover:translate-y-[1px]
          active:shadow-none
          active:translate-x-[2px]
          active:translate-y-[2px]
          transition-all
          cursor-pointer
        "
        title="Click to copy contract address"
      >
        <span className="hidden sm:inline">CA: {CONTRACT_ADDRESS}</span>
        <span className="sm:hidden">CA: {truncatedAddress}</span>
        {copied ? (
          <i className="hn hn-check-solid text-buxGreen"></i>
        ) : (
          <i className="hn hn-copy-solid"></i>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="
        flex items-center gap-2
        bg-buxBlack
        text-buxYellow
        font-pixel
        text-sm
        px-4 py-2
        border-4 border-black
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px]
        hover:translate-y-[2px]
        active:shadow-none
        active:translate-x-[4px]
        active:translate-y-[4px]
        transition-all
        cursor-pointer
      "
      title="Click to copy contract address"
    >
      <span className="hidden sm:inline">CA: {CONTRACT_ADDRESS}</span>
      <span className="sm:hidden">CA: {truncatedAddress}</span>
      {copied ? (
        <span className="text-buxGreen flex items-center gap-1">
          <i className="hn hn-check-solid"></i>
          Copied!
        </span>
      ) : (
        <i className="hn hn-copy-solid"></i>
      )}
    </button>
  );
}
