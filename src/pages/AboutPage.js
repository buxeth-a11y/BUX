import React, { useState } from "react";
import Pots from "../components/Pots";
import Countdown from "../components/Countdown";
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

function AboutPage() {
  // Get live pot data from blockchain (via static JSON files)
  const { dailyPot: dailyPotEth, hourlyPot: hourlyPotEth, ethPrice } = useBux();

  // Convert ETH to USD for display
  const dailyPot = Math.round(dailyPotEth * ethPrice);
  const hourlyPot = Math.round(hourlyPotEth * ethPrice);

  const [isSocialsModalOpen, setIsSocialsModalOpen] = useState(false);
  const [isBuxModalOpen, setIsBuxModalOpen] = useState(false);
  const [isDVDModalOpen, setIsDVDModalOpen] = useState(false);

  const showKLeft = dailyPot > 1000;
  const showKRight = hourlyPot > 1000;

  return (
    <div className="min-h-screen bg-buxDollarGreen flex items-center justify-center p-8 font-pixel">
      <div className="max-w-4xl w-full">
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
          About BUX
        </h1>

        <div className="bg-buxGreen dh text-white p-6 mb-2 rounded shadow-pixel space-y-6">
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

              {/* modals */}
              <SocialsModal
                isOpen={isSocialsModalOpen}
                onClose={() => setIsSocialsModalOpen(false)}
              />
              <BuxModal
                isOpen={isBuxModalOpen}
                onClose={() => setIsBuxModalOpen(false)}
              />
              <DVDModal
                isOpen={isDVDModalOpen}
                onClose={() => setIsDVDModalOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION BELOW --- */}
        <div className="bg-buxBlack text-white p-6 rounded shadow-pixel space-y-6">
          <p className="font-bold">Win every hour, win every day.</p>
            <ul className="list-none list-inside space-y-2 text-sm">
              <li>Hold more BUX → Higher odds.</li>
              <li>1 BUX → 1 eligibility point.</li>
              <li>Hold forever → Win forever.</li>
            </ul>          
          <p>
            BUX is a coin with built-in automated ETH rewards. Each buy or sell
            funds two pools – Hourly and Daily – that pay out ETH to randomly
            selected holders.
          </p>

          <div>
            <h2
              className="text-2xl text-buxYellow mb-4"
              style={{
                textShadow:
                  " -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 ",
              }}
            >
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Buy or sell BUX → ETH fees go to reward pools.</li>
              <li>
                Chainlink VRF randomly selects eligible holders hourly and daily.
              </li>
              <li>ETH is sent automatically to recipients on-chain.</li>
            </ol>
          </div>

          <p className="font-bold">Fully transparent. Immutable. <a className="hlink" target="_blank" href="/BUX Smart Contract Audit - Final Report.pdf">Audited.</a></p>

          <div>
            <h2
              className="text-2xl text-buxYellow mb-4"
              style={{
                textShadow:
                  " -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 ",
              }}
            >
              Fee Breakdown
            </h2>
            <p className="mb-2">Every transaction includes a 12.25% ETH fee:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>7.90% → Hourly Rewards</li>
              <li>3.50% → Daily Rewards</li>
              <li>0.85% → Team (ops, audits)</li>
            </ul>
          </div>

          <p>All fees are paid in ETH — never from your BUX balance.</p>
          <p>This means the contract does not sell BUX to convert into ETH, eliminating automated sell pressure and supporting a more stable chart over time.</p>

          <div>
            <h2
              className="text-2xl text-buxYellow mb-4"
              style={{
                textShadow:
                  " -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 ",
              }}
            >
              Fair & Transparent
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>No burning, no multipliers.</li>
              <li>All data and results verifiable on-chain.</li>
              <li>Hashlock <a className="hlink" target="_blank" href="/BUX Smart Contract Audit - Final Report.pdf">Audited.</a></li>
            </ul>
          </div>

          <div>
            <h2
              className="text-2xl text-buxYellow mb-4"
              style={{
                textShadow:
                  " -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 ",
              }}
            >
              Launch Plan
            </h2>
              <p className="mb-4">25% of the 1B BUX supply will be released at launch. This initial supply will be paired with ~$50,000 USD in liquidity funded by the BUX development team.</p>
              <p className="mb-4">Remaining 70% of the total supply will enter circulation over a 4 month period with releases of about 47M tokens per week. This pacing is designed to support stable price action and prevent dilution for early holders.</p>
              <p className="mb-4">The BUX team will retain 5% of the supply. Each of the 4 team members will receive 1% and the remaining 1% will be reserved for marketing.</p>
          </div>          

          <div className="flex justify-center space-x-4 mt-6">
            <a
              href="/#"
              className="relative bg-buxGreen text-buxYellow font-pixel px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
            >
              Home
            </a>
            <a
              href="/buy"
              className="relative bg-buxYellow text-buxBlack font-pixel px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
            >
              Buy BUX
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
