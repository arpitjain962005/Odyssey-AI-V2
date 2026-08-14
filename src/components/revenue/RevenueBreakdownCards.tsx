import React, { useState } from 'react';
import {
  Ship,
  Plane,
  Truck,
  TrainTrack,
  Globe2,
  Building,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { MOCK_REVENUE_BREAKDOWN } from '../../data/mockRevenueData';
import { DistributionItem } from '../../types/revenue';

interface RevenueBreakdownCardsProps {
  onFilterByDistribution?: (item: DistributionItem) => void;
}

export const RevenueBreakdownCards: React.FC<RevenueBreakdownCardsProps> = ({
  onFilterByDistribution,
}) => {
  const [activeTab, setActiveTab] = useState<'mode' | 'region' | 'unit'>('mode');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getItems = () => {
    switch (activeTab) {
      case 'mode':
        return MOCK_REVENUE_BREAKDOWN.byMode;
      case 'region':
        return MOCK_REVENUE_BREAKDOWN.byRegion;
      case 'unit':
        return MOCK_REVENUE_BREAKDOWN.byBusinessUnit;
    }
  };

  const items = getItems();

  // Helper SVG Donut Chart
  const renderDonutChart = () => {
    const size = 160;
    const strokeWidth = 22;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercentage = 0;

    return (
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
          {items.map((item) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
            accumulatedPercentage += item.percentage;

            const isHovered = hoveredId === item.id;

            return (
              <circle
                key={item.id}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onFilterByDistribution?.(item)}
              />
            );
          })}
        </svg>

        {/* Center Text Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] text-slate-400 font-mono-code uppercase">Total Share</span>
          <span className="text-lg font-bold text-white font-mono-code">100%</span>
          <span className="text-[9px] text-emerald-400 font-mono-code">$48.2M</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Card Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Revenue Distribution</h3>
            <p className="text-xs text-slate-400">
              Breakdown by logistics transport mode, global region, and business unit.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('mode')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'mode'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Transport Mode
          </button>
          <button
            onClick={() => setActiveTab('region')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'region'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Region
          </button>
          <button
            onClick={() => setActiveTab('unit')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'unit'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Business Unit
          </button>
        </div>
      </div>

      {/* Main Content: Donut + Item List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Donut */}
        <div className="md:col-span-5 flex justify-center py-2">
          {renderDonutChart()}
        </div>

        {/* Right Distribution Item Cards */}
        <div className="md:col-span-7 space-y-2.5">
          {items.map((item) => {
            const isHovered = hoveredId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onFilterByDistribution?.(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isHovered
                    ? 'bg-[#151E32] border-blue-500/80 shadow-md'
                    : 'bg-[#090D16] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-white">${item.value}M</span>
                    <span className="text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.growth}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono-code">
                  <span>Share of Total Revenue</span>
                  <span className="text-slate-200 font-bold">{item.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
