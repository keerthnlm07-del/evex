import React, { useState } from 'react';
import { Search, ArrowRight, Star, ShieldCheck, Heart, Sparkles, Filter } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const ExploreServicesPage = ({ onSelectCategory, onPlanEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Weddings', label: 'Weddings' },
    { id: 'Birthdays', label: 'Birthdays' },
    { id: 'Corporate', label: 'Corporate' },
    { id: 'College Events', label: 'College Events' },
    { id: 'Social', label: 'Social' },
    { id: 'Others', label: 'Others' }
  ];

  const serviceCards = [
    {
      id: 'srv_1',
      title: 'Weddings',
      category: 'Weddings',
      subtitle: 'Full wedding coordination, stage decors, floral setups & catering.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      priceFrom: '₹1,50,000',
      agencies: 18
    },
    {
      id: 'srv_2',
      title: 'Birthdays',
      category: 'Birthdays',
      subtitle: 'Theme setups, balloon installations, custom cakes & entertainment.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      priceFrom: '₹35,000',
      agencies: 12
    },
    {
      id: 'srv_3',
      title: 'Corporate Events',
      category: 'Corporate',
      subtitle: 'Conferences, product launches, gala banquets & executive sound.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      priceFrom: '₹1,20,000',
      agencies: 24
    },
    {
      id: 'srv_4',
      title: 'College Fests',
      category: 'College Events',
      subtitle: 'Concert stages, pro-lights, sound engineering & artist hospitality.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      priceFrom: '₹2,00,000',
      agencies: 9
    },
    {
      id: 'srv_5',
      title: 'Exhibitions',
      category: 'Others',
      subtitle: 'Modular stalls, entrance gateways, electrical trusses & carpets.',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      priceFrom: '₹95,000',
      agencies: 14
    },
    {
      id: 'srv_6',
      title: 'Social Gatherings',
      category: 'Social',
      subtitle: 'Anniversaries, housewarmings, cocktail parties & family reunions.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
      priceFrom: '₹45,000',
      agencies: 16
    }
  ];

  const filteredCards = serviceCards.filter((card) => {
    const matchesCat = selectedCategory === 'All' || card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Title Header matching reference mockup top-middle */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#242424]">Explore Event Services</h1>
        <p className="text-xs sm:text-sm text-[#736B66] mt-1">
          Browse specialized event management services, curated packages, and certified agencies.
        </p>
      </div>

      {/* Category Pills matching reference */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'bg-white border border-[#EAE5DE] text-[#736B66] hover:text-[#242424] hover:bg-[#F8F7F5]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Cards matching reference mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onPlanEvent ? onPlanEvent(card.title) : null}
            className="rounded-2xl bg-white border border-[#EAE5DE] overflow-hidden shadow-xs hover:shadow-md hover:border-[#4B0718]/40 transition duration-200 group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-48 sm:h-52 relative overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  {card.agencies} Verified Agencies
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-bold text-[#242424] group-hover:text-[#4B0718] transition">
                    {card.title}
                  </h3>
                  <span className="text-xs font-bold text-[#736B66]">
                    Starts at {card.priceFrom}
                  </span>
                </div>
                <p className="text-xs text-[#736B66] leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-1 border-t border-[#EAE5DE]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#4B0718]">Request Quote</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#EAE5DE] flex items-center justify-center text-[#4B0718] group-hover:bg-[#4B0718] group-hover:text-white transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
