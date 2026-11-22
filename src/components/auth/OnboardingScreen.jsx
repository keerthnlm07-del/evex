import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const OnboardingScreen = ({ onNext }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Plan · Manage · Work',
      subtitle: 'All your events in one place',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Verified Agencies',
      subtitle: 'Compare budgets & custom packages',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'On-Demand Gig Crew',
      subtitle: 'Recruit skilled event workers in minutes',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const current = slides[slide];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFF8F3] text-[#260C13]">
      {/* Top Wedding/Event Photography Card matching reference */}
      <div className="w-full pt-4">
        <div className="w-full h-84 rounded-[32px] overflow-hidden shadow-lg border border-[#EDE0D7] relative">
          <img
            src={current.image}
            alt="Event Stage Celebration"
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* Center Copy matching reference image */}
      <div className="text-center my-auto py-4 space-y-2">
        <h2 className="text-2xl font-black text-[#260C13] tracking-tight">
          {current.title}
        </h2>
        <p className="text-sm font-medium text-[#8B7377]">
          {current.subtitle}
        </p>

        {/* 3 Dot pagination indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-4">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === slide ? 'w-6 bg-[#4B0718]' : 'w-2 bg-[#EADBD1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button matching reference */}
      <div className="w-full pb-2">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-base shadow-md transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
