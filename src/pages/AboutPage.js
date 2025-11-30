import React, { useState } from "react";
import PotDisplay from "../components/PotDisplay";
import SocialsModal from "../components/SocialsModal";
import BuxModal from "../components/BuxModal";
import DVDModal from "../components/DVDModal";

function AboutPage() {
  const [isSocialsModalOpen, setIsSocialsModalOpen] = useState(false);
  const [isBuxModalOpen, setIsBuxModalOpen] = useState(false);
  const [isDVDModalOpen, setIsDVDModalOpen] = useState(false);

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

        <div className="mb-6">
          <PotDisplay />
        </div>

        {/* Modals */}
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
