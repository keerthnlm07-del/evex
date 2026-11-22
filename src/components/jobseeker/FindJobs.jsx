import React, { useState } from 'react';
import { ArrowLeft, Search, Briefcase, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const FindJobs = ({ onBack, onSelectJob }) => {
  const { jobListings } = useDatabase();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Catering', 'Decoration', 'Photos'];

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      job.eventName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && job.jobTitle.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Find Jobs` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">Find Jobs</h2>
      </div>

      {/* Search Input matching reference */}
      <div className="p-4 bg-white border-b border-[#EDE0D7] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8B7377]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#260C13] placeholder-[#8B7377] focus:outline-none focus:border-[#4B0718]"
          />
        </div>

        {/* Filter Pills matching reference: All | Catering | Decoration | Photos */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4B0718] text-white shadow-xs'
                    : 'bg-[#FFF8F3] text-[#8B7377] hover:text-[#260C13]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Cards List matching reference image */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Briefcase className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Jobs Match Search</h4>
            <p className="text-xs text-[#8B7377] mt-1">Try another category or keyword.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob?.(job)}
              className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <h3 className="font-extrabold text-sm text-[#260C13]">{job.jobTitle}</h3>
                <p className="text-xs font-medium text-[#8B7377] mt-0.5">{job.eventName}</p>
                <p className="text-[11px] text-[#8B7377] mt-1">
                  {job.date} · {job.location}
                </p>
                <p className="text-xs font-black text-[#4B0718] mt-2">
                  ₹{job.salaryPerDay} / day
                </p>
              </div>

              {/* Burgundy Apply Button matching reference */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectJob?.(job);
                }}
                className="py-2 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
