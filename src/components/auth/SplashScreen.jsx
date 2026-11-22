import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const SplashScreen = ({ onProceed }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceed?.();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onProceed]);

  return (
    <div
      onClick={onProceed}
      className="flex-1 flex flex-col items-center justify-between p-8 relative overflow-hidden bg-gradient-to-b from-[#350713] via-[#4B0718] to-[#2A050E] text-white cursor-pointer select-none"
    >
      {/* Top fireworks / celebratory gold sparkle glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 left-6 flex items-center gap-1 text-amber-300/40">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>
      <div className="absolute top-16 right-8 flex items-center gap-1 text-amber-200/50">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      {/* Decorative Fireworks Artwork */}
      <div className="w-full flex justify-center pt-8 opacity-80 pointer-events-none">
        <svg viewBox="0 0 200 120" className="w-48 h-28 text-amber-300/70">
          <circle cx="100" cy="60" r="3" fill="currentColor" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="60"
              x2={100 + 45 * Math.cos((deg * Math.PI) / 180)}
              y2={60 + 45 * Math.sin((deg * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="2,3"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* Center Branding matching reference */}
      <div className="text-center my-auto z-10 space-y-3">
        <h1 className="text-5xl font-serif-brand font-black tracking-wider text-white">
          EVEX
        </h1>
        <p className="text-sm font-medium tracking-wide text-amber-100/90 font-['Playfair_Display',serif] italic">
          Events meet Opportunities
        </p>
      </div>

      {/* Bottom celebratory sparks & tap hint */}
      <div className="w-full flex flex-col items-center pb-6 z-10">
        <div className="flex justify-center gap-6 mb-4 text-amber-300/50">
          <Sparkles className="w-4 h-4 animate-bounce" />
          <Sparkles className="w-5 h-5 animate-pulse" />
          <Sparkles className="w-4 h-4 animate-bounce" />
        </div>
        <p className="text-[11px] text-amber-200/60 font-medium tracking-widest uppercase">
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
};
