import React, { useState, useEffect, useRef } from 'react';

export default function DVDModal({ isOpen, onClose }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: 1.5, y: 1.5 });
  const [color, setColor] = useState('#85BB65');
  const [dailyCountdown, setDailyCountdown] = useState('');
  const [hourlyCountdown, setHourlyCountdown] = useState('');
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const logoWidth = 400;
  const logoHeight = 200;

  const colors = ['#85BB65', '#faf4dd']; 


  
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      
      // midnight utc
      const nextMidnight = new Date(utcNow);
      nextMidnight.setUTCHours(24, 0, 0, 0);
      const dailyDiff = nextMidnight - utcNow;
      
      const dailyHours = Math.floor(dailyDiff / (1000 * 60 * 60));
      const dailyMinutes = Math.floor((dailyDiff % (1000 * 60 * 60)) / (1000 * 60));
      const dailySeconds = Math.floor((dailyDiff % (1000 * 60)) / 1000);
      
      // time until next hr
      const nextHour = new Date(utcNow);
      nextHour.setUTCMinutes(60, 0, 0);
      const hourlyDiff = nextHour - utcNow;
      
      const hourlyMinutes = Math.floor((hourlyDiff % (1000 * 60 * 60)) / (1000 * 60));
      const hourlySeconds = Math.floor((hourlyDiff % (1000 * 60)) / 1000);
      
      setDailyCountdown(
        `${String(dailyHours).padStart(2, '0')}:${String(dailyMinutes).padStart(2, '0')}:${String(dailySeconds).padStart(2, '0')}`
      );
      setHourlyCountdown(
        `${String(hourlyMinutes).padStart(2, '0')}:${String(hourlySeconds).padStart(2, '0')}`
      );

    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  // bounce animation synced to refresh rate
  useEffect(() => {
    if (!isOpen) return;

    const animate = () => {
      setPosition((prev) => {
        if (!containerRef.current) return prev;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        let colorChanged = false;

        // x boundary
        if (newX <= 0 || newX + logoWidth >= containerWidth) {
          newVelX = -velocity.x;
          newX = newX <= 0 ? 0 : containerWidth - logoWidth;
          colorChanged = true;
        }

        // y boundary
        if (newY <= 0 || newY + logoHeight >= containerHeight) {
          newVelY = -velocity.y;
          newY = newY <= 0 ? 0 : containerHeight - logoHeight;
          colorChanged = true;
        }

        if (colorChanged) {
          setColor(colors[Math.floor(Math.random() * colors.length)]);
          setVelocity({ x: newVelX, y: newVelY });
        }

        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, velocity, colors]);

  if (!isOpen) return null;

   return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div>
         <div
          className="w-full h-full flex flex-col items-center justify-center font-pixel p-4 relative"
          /*style={{
            backgroundColor: color,
            imageRendering: 'pixelated',
            // pixel border, do not touch this!
            boxShadow: `
              4px 0 0 0 #000,
              -4px 0 0 0 #000,
              0 4px 0 0 #000,
              0 -4px 0 0 #000,
              8px 0 0 0 ${color},
              -8px 0 0 0 ${color},
              0 8px 0 0 ${color},
              0 -8px 0 0 ${color},
              4px 4px 0 0 #000,
              -4px 4px 0 0 #000,
              4px -4px 0 0 #000,
              -4px -4px 0 0 #000,
              8px 4px 0 0 #000,
              -8px 4px 0 0 #000,
              8px -4px 0 0 #000,
              -8px -4px 0 0 #000,
              4px 8px 0 0 #000,
              -4px 8px 0 0 #000,
              4px -8px 0 0 #000,
              -4px -8px 0 0 #000
            `,
          }}*/
        >

        <div>
          <span className="daily text-xl font-bold">{dailyCountdown}</span>
        </div>
        <div>
          <span className="hourly text-xl font-bold">{hourlyCountdown}</span>
        </div>       

        </div>
      </div>
    </div>
  );
}