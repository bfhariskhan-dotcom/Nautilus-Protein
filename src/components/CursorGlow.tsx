import React, { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if user device supports fine pointer / hover (desktop)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(!!isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth trailing ring lerp physics loop
    const followLoop = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.22,
        y: prev.y + (mousePos.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(followLoop);
    };
    animationFrameId = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* 1. Large Atmospheric Radial Flashlight Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(147, 51, 234, 0.08), transparent 75%)`,
        }}
      />

      {/* 2. Magnetic Outer Ring (Expands & glows on interactive elements) */}
      <div
        className="pointer-events-none fixed z-50 rounded-full transition-transform duration-150 ease-out border will-change-transform"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovered ? '46px' : '22px',
          height: isHovered ? '46px' : '22px',
          transform: 'translate(-50%, -50%)',
          borderColor: isHovered ? 'rgba(168, 85, 247, 0.85)' : 'rgba(147, 51, 234, 0.45)',
          backgroundColor: isHovered ? 'rgba(168, 85, 247, 0.16)' : 'transparent',
          boxShadow: isHovered
            ? '0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(168, 85, 247, 0.3)'
            : '0 0 8px rgba(147, 51, 234, 0.3)',
        }}
      />

      {/* 3. High-Precision Laser Center Dot */}
      <div
        className="pointer-events-none fixed z-50 rounded-full bg-purple-400 will-change-transform"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: '5px',
          height: '5px',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 8px #c084fc, 0 0 14px #a855f7',
        }}
      />
    </>
  );
};
