import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  Star,
  DollarSign,
  ArrowUpRight,
  Filter,
  Sparkles,
  X
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const AnalyticsView = ({ onBack }) => {
  const { bookings, proposals } = useDatabase();
  const [timeRange, setTimeRange] = useState('This Month');

  // Revenue points for the smooth line chart matching reference mockup bottom-right
  const revenuePoints = [
    { month: 'Jul', val: 2.1 },
    { month: 'Aug', val: 2.8 },
    { month: 'Sep', val: 2.4 },
    { month: 'Oct', val: 3.5 },
    { month: 'Nov', val: 3.9 },
    { month: 'Dec', val: 4.2 }
  ];

  // SVG coordinates for responsive curved line
  // Width: 500, Height: 160. Margin: 30
  // Values range from 1.5 to 4.5
  const getCoordinates = () => {
    return revenuePoints.map((pt, i) => {
      const x = 40 + i * 85;
      const y = 140 - ((pt.val - 1.5) / 3.0) * 110;
      return { x, y, ...pt };
    });
  };

  const coords = getCoordinates();
  // Build smooth bezier path
  const pathD = coords.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header with Title and Time Filter matching reference mockup bottom-right */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#242424]">Analytics & Performance</h1>
          <p className="text-xs text-[#736B66] mt-0.5">
            Real-time revenue metrics, client acquisitions, and event trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-[#EAE5DE] rounded-xl py-1.5 px-3 text-xs font-bold text-[#242424] focus:outline-none focus:border-[#4B0718] shadow-xs cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Year 2026">Year 2026</option>
          </select>

          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-[#736B66] hover:bg-[#F8F7F5] border border-[#EAE5DE]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Stat Metric Cards matching reference mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Events */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">24</span>
          <span className="text-xs font-semibold text-[#736B66] mt-1 block">Total Events</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1.5">
            <ArrowUpRight className="w-3 h-3" />
            +18% from last month
          </span>
        </div>

        {/* Card 2: Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold text-[#4B0718] block">₹4.2L</span>
          <span className="text-xs font-semibold text-[#736B66] mt-1 block">Revenue</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1.5">
            <ArrowUpRight className="w-3 h-3" />
            +24% YoY growth
          </span>
        </div>

        {/* Card 3: New Clients */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">18</span>
          <span className="text-xs font-semibold text-[#736B66] mt-1 block">New Clients</span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1.5">
            <ArrowUpRight className="w-3 h-3" />
            +6 new inquiries
          </span>
        </div>

        {/* Card 4: Avg. Rating */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#242424]">4.8</span>
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-xs font-semibold text-[#736B66] mt-1 block">Avg. Rating</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1.5 block">Across 142 reviews</span>
        </div>
      </div>

      {/* Revenue Trend Line Chart matching reference mockup bottom-right */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
          <div>
            <h3 className="text-base font-bold text-[#242424]">Revenue Trajectory</h3>
            <p className="text-xs text-[#736B66]">Monthly earnings growth across event contracts</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4B0718]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4B0718]" />
            <span>Actual Revenue</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto no-scrollbar pt-2">
          <svg viewBox="0 0 520 180" className="w-full h-48 select-none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4B0718" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4B0718" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background grid lines */}
            <line x1="30" y1="30" x2="490" y2="30" stroke="#EAE5DE" strokeDasharray="3 3" />
            <line x1="30" y1="80" x2="490" y2="80" stroke="#EAE5DE" strokeDasharray="3 3" />
            <line x1="30" y1="130" x2="490" y2="130" stroke="#EAE5DE" strokeDasharray="3 3" />

            {/* Filled area */}
            <path
              d={`${pathD} L ${coords[coords.length - 1].x} 150 L ${coords[0].x} 150 Z`}
              fill="url(#chartGrad)"
            />

            {/* Burgundy curved stroke line */}
            <path
              d={pathD}
              fill="none"
              stroke="#4B0718"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data circles & labels */}
            {coords.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#4B0718"
                  strokeWidth="3"
                />
                <text
                  x={pt.x}
                  y="170"
                  textAnchor="middle"
                  fill="#736B66"
                  fontSize="11"
                  fontWeight="600"
                >
                  {pt.month}
                </text>
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#4B0718"
                  fontSize="10"
                  fontWeight="bold"
                >
                  ₹{pt.val}L
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
