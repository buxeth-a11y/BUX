import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import ScrollingBanner from '../ScrollingBanner';
import Footer from '../Footer';
import { APP_CONFIG } from '../../config/constants';

function MobileLayout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';


  if (isHomePage) {
    return (
      <div className="flex flex-col min-h-screen">
        <ScrollingBanner
          dailyPot={APP_CONFIG.DAILY_POT}
          hourlyPot={APP_CONFIG.HOURLY_POT}
          contractAddress={APP_CONFIG.CONTRACT_ADDRESS}
        />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollingBanner
        dailyPot={APP_CONFIG.DAILY_POT}
        hourlyPot={APP_CONFIG.HOURLY_POT}
        contractAddress={APP_CONFIG.CONTRACT_ADDRESS}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default MobileLayout;