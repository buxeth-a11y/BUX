import React, { useState, useEffect } from 'react';
import Pots from "../components/Pots";
import Countdown from "../components/Countdown";
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

function WinnersPage() {
  // Get live data from blockchain (via static JSON files)
  const {
    dailyPot: dailyPotEth,
    hourlyPot: hourlyPotEth,
    ethPrice,
    winners,
    winnersLoading
  } = useBux();

  // Convert ETH to USD for display
  const dailyPot = Math.round(dailyPotEth * ethPrice);
  const hourlyPot = Math.round(hourlyPotEth * ethPrice);

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUSD, setShowUSD] = useState(false);
  const perPage = 10;

  const showKLeft = dailyPot > 1000;
  const showKRight = hourlyPot > 1000;  

  const filteredWinners = React.useMemo(() => {
    return winners
      .filter((winner) => {
        if (filterType !== 'all' && winner.type !== filterType) return false;
        
        const tsDate = new Date(winner.timestamp);
        if (fromDate && tsDate < new Date(fromDate)) return false;
        if (toDate && tsDate > new Date(toDate + 'T23:59:59.999Z')) return false;
        
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.timestamp - a.timestamp;
          case 'oldest':
            return a.timestamp - b.timestamp;
          case 'highest':
            return b.ethAmount - a.ethAmount;
          case 'lowest':
            return a.ethAmount - b.ethAmount;
          default:
            return b.timestamp - a.timestamp;
        }
      });
  }, [winners, filterType, sortBy, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredWinners.length / perPage));
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedWinners = React.useMemo(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return filteredWinners.slice(start, end);
  }, [filteredWinners, currentPage, perPage]);

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const utc = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const local = date.toLocaleString();
    return `${utc} / ${local}`;
  };

  const shortenWallet = (wallet) => {
    if (!wallet || wallet.length < 10) return wallet;
    return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
  };

  const shortenTx = (tx) => {
    if (!tx || tx.length < 18) return tx;
    return `${tx.substring(0, 10)}...${tx.substring(tx.length - 8)}`;
  };

  const txLink = (tx) => {
    return `https://sepolia.etherscan.io/tx/${tx}`;
  };

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
    <div className="min-h-screen bg-buxDollarGreen p-4 py-8 font-pixel">
      <div className="max-w-6xl w-full mx-auto">
        <h1
          className="text-4xl text-buxYellow mb-8 text-center"
          style={{
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
          }}
        >
          Winners
        </h1>        

        <div className="bg-buxGreen dh winner text-white p-6 mb-2 rounded shadow-pixel space-y-6">
          {/* POTS DISPLAY */}
          <Pots />

          {/* COUNTDOWN UNDER POTS */}
          <div className="flex flex-col items-center gap-2 mb-10">
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
              <NumberDisplay number={dailyPot} position={4} className="d0Left" />              
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
              <NumberDisplay number={hourlyPot} position={4} className="d0Right" />              
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

        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-buxBlack text-white px-4 py-2 rounded shadow-pixel font-pixel text-sm w-full sm:w-auto"
            >
              <option value="all">All Pots</option>
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-buxBlack text-white px-4 py-2 rounded shadow-pixel font-pixel text-sm w-full sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Prize</option>
              <option value="lowest">Lowest Prize</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="flex items-center space-x-2">
              <label className="text-buxYellow font-pixel text-sm whitespace-nowrap" style={labelStyle}>
                From:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-buxBlack text-white px-2 py-1 rounded shadow-pixel text-sm w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-buxYellow font-pixel text-sm whitespace-nowrap" style={labelStyle}>
                To:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-buxBlack text-white px-2 py-1 rounded shadow-pixel text-sm w-full"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto shadow-pixel rounded" style={{ backgroundColor: '#3c3b34' }}>
          <table className="w-full text-white">
            <thead>
              <tr className="bg-buxGreen">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Timestamp (UTC / Local)</th>
                <th className="px-4 py-2 text-left">Wallet</th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer hover:text-buxYellow transition-colors select-none"
                  onClick={() => setShowUSD(!showUSD)}
                  title="Click to toggle ETH/USD"
                >
                  Prize ({showUSD ? 'USD' : 'ETH'})
                </th>
                <th className="px-4 py-2 text-left">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWinners.length > 0 ? (
                paginatedWinners.map((winner, idx) => (
                  <tr key={winner.id} className={idx !== paginatedWinners.length - 1 ? "border-b border-buxYellow" : ""}>
                    <td className="px-4 py-2">{winner.id}</td>
                    <td className="px-4 py-2 capitalize">{winner.type}</td>
                    <td className="px-4 py-2 text-sm">{formatTimestamp(winner.timestamp)}</td>
                    <td className="px-4 py-2">{shortenWallet(winner.wallet)}</td>
                    <td className="px-4 py-2">
                      {showUSD
                        ? `$${(winner.ethAmount * ethPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `${winner.ethAmount.toFixed(4)} ETH`
                      }
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={txLink(winner.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-buxYellow hover:underline"
                      >
                        {shortenTx(winner.txHash)}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    {winnersLoading
                      ? 'Loading winners...'
                      : winners.length === 0
                        ? 'No winners yet - be the first!'
                        : 'No winners match the filters!'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 mb-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="relative
              bg-buxYellow 
              text-4x1
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
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              disabled:hover:translate-x-0
              disabled:hover:translate-y-0
              transition-all
              text-sm"
          >
            Prev
          </button>
          
          <span className="text-buxYellow font-pixel text-sm" style={labelStyle}>
            <span className="hidden sm:inline">Page </span>{currentPage} of {totalPages}
          </span>
          
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="relative
              bg-buxGreen 
              text-buxYellow 
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
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              disabled:hover:translate-x-0
              disabled:hover:translate-y-0
              transition-all
              text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnersPage;