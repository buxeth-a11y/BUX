import React from 'react';
import { useLocation } from 'react-router-dom';
import DollarBill from '../DollarBill';
import ScrollingBanner from '../ScrollingBanner';
import { APP_CONFIG } from '../../config/constants';
import Footer from '../Footer';

function DesktopLayout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showBanner = location.pathname === '/about' || location.pathname === '/winners';

 
  if (isHomePage) {
    return <DollarBill />;
  }


  return (
    <main className="flex flex-col min-h-screen">
      {showBanner && (
        <ScrollingBanner
          dailyPot={APP_CONFIG.DAILY_POT}
          hourlyPot={APP_CONFIG.HOURLY_POT}
          contractAddress={APP_CONFIG.CONTRACT_ADDRESS}
        />
      )}
      <div className="flex-1">{children}</div>
      <Footer/>
    </main>
  );
}

export default DesktopLayout;