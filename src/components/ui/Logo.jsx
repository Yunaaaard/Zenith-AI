import React from 'react';

export default function Logo({ size = 'md', className = '', glow = false }) {
  const sizeMap = {
    xs: { height: 22 },
    sm: { height: 28 },
    md: { height: 36 },
    lg: { height: 52 },
    xl: { height: 76 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${glow ? 'animate-pulse-glow' : ''}`}>
        {/* Ambient Glow */}
        {glow && (
          <div className="absolute inset-0 rounded-full bg-indigo-500/25 blur-md transform scale-125 pointer-events-none" />
        )}
        <img
          src="/Zenith AI Logo.png"
          alt="Zenith AI"
          style={{ height: currentSize.height, width: 'auto' }}
          className="object-contain filter drop-shadow-md transition-transform duration-200 hover:scale-105"
        />
      </div>
    </div>
  );
}
