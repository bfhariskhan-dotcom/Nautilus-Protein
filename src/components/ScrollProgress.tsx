import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgress: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollPercent(Math.min(100, Math.max(0, current)));
      }
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG Circle parameters for progress ring
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      {/* 1. Top Glowing Purple Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-neutral-900/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(168,85,247,0.85)]"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* 2. Floating "Back to Top" Button with Circular Progress Ring */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-22 right-6 z-30 p-2 rounded-full bg-[#0d0c14]/90 hover:bg-[#151322] border border-purple-800/70 text-purple-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl shadow-purple-950/80 backdrop-blur-md flex items-center justify-center focus:outline-none group"
          aria-label="Scroll back to top"
          title="Back to top"
        >
          {/* Circular SVG Progress Ring */}
          <svg className="w-10 h-10 -rotate-90">
            <circle
              cx="20"
              cy="20"
              r={16}
              className="text-neutral-800"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="20"
              cy="20"
              r={16}
              className="text-purple-500 transition-all duration-100 ease-out"
              strokeWidth="2.5"
              strokeDasharray={2 * Math.PI * 16}
              strokeDashoffset={2 * Math.PI * 16 - (scrollPercent / 100) * (2 * Math.PI * 16)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <ArrowUp className="w-4 h-4 absolute group-hover:-translate-y-0.5 transition-transform text-purple-400 group-hover:text-white" />
        </button>
      )}
    </>
  );
};
