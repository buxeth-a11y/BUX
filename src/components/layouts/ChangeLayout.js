import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import MobileLayout from './Mobile';
import Desktop from './Desktop';

function ChangeLayout({ children, desktopFallback }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }


  if (desktopFallback) {
    return desktopFallback;
  }

 
  return <Desktop>{children}</Desktop>;
}

export default ChangeLayout;