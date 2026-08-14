import React, { useState } from 'react';
import {
  Globe2,
  TrendingUp,
  PackageCheck,
  CheckCircle,
  Sparkles,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { MOCK_REGIONAL_PERFORMANCE } from '../../data/mockRevenueData';
import { RegionalPerformanceItem } from '../../types/revenue';

interface RegionalPerformanceMapProps {
  onSelectRegion?: (region: RegionalPerformanceItem) => void;
}

export const RegionalPerformanceMap: React.FC<RegionalPerformanceMapProps> = ({
  onSelectRegion,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('reg-apac');

  const selectedRegion =
    MOCK_REGIONAL_PERFORMANCE.find((r) => r.id === selectedRegionId) ||
    MOCK_REGIONAL_PERFORMANCE[0];

  const activeRegion =
    MOCK_REGIONAL_PERFORMANCE.find((r) => r.id === hoveredRegionId) || selectedRegion;

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Regional Financial Performance</h3>
            <p className="text-xs text-slate-400">
              Interactive geographic yield mapping across major trade corridors.
            </p>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-slate-800">
          {MOCK_REGIONAL_PERFORMANCE.map((reg) => {
            const isSel = reg.id === selectedRegionId;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegionId(reg.id);
                  onSelectRegion?.(reg);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code font-medium transition-all ${
                  isSel
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {reg.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Visual Map Canvas + Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SVG World Map Canvas */}
        <div className="lg:col-span-8 bg-[#090D16] border border-slate-800/80 rounded-xl p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden group">
          {/* Subtle World Map SVG background grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 1000 500" className="w-full h-full stroke-slate-700 fill-none" strokeWidth="0.8">
              {/* Simplified latitude longitude grid */}
              <line x1="0" y1="125" x2="1000" y2="125" strokeDasharray="3 3" />
              <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="3 3" />
              <line x1="0" y1="375" x2="1000" y2="375" strokeDasharray="3 3" />
              <line x1="250" y1="0" x2="250" y2="500" strokeDasharray="3 3" />
              <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="3 3" />
              <line x1="750" y1="0" x2="750" y2="500" strokeDasharray="3 3" />
              
              {/* World outline stylized dots */}
              {/* NA */}
              <path d="M 150,150 Q 220,120 300,180 T 250,280 Z" strokeWidth="1" opacity="0.3" />
              {/* EMEA */}
              <path d="M 450,120 Q 550,110 580,220 T 500,320 Z" strokeWidth="1" opacity="0.3" />
              {/* APAC */}
              <path d="M 680,140 Q 820,130 880,260 T 720,340 Z" strokeWidth="1" opacity="0.3" />
              {/* LATAM */}
              <path d="M 280,300 Q 320,320 340,420 T 290,440 Z" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Global Financial Heatmap
            </span>
            <span className="text-[10px] text-slate-500 font-mono-code">
              Click node to inspect region
            </span>
          </div>

          {/* Map Overlay Pins for each region */}
          <div className="relative z-10 w-full h-[220px] my-auto">
            {MOCK_REGIONAL_PERFORMANCE.map((reg) => {
              const isSelected = reg.id === selectedRegionId;
              const isHovered = reg.id === hoveredRegionId;

              return (
                <div
                  key={reg.id}
                  style={{
                    left: `${reg.lng}%`,
                    top: `${reg.lat}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                  onMouseEnter={() => setHoveredRegionId(reg.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => {
                    setSelectedRegionId(reg.id);
                    onSelectRegion?.(reg);
                  }}
                >
                  {/* Glowing Radar Pulse Ring */}
                  <div className={`absolute -inset-3 rounded-full animate-ping opacity-30 ${
                    isSelected ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />

                  {/* Marker Circle */}
                  <div className={`relative px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all shadow-lg ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/30 scale-110'
                      : isHovered
                      ? 'bg-blue-600 text-white border-blue-400 scale-105'
                      : 'bg-[#111726]/90 text-slate-200 border-slate-700 hover:border-slate-500'
                  }`}>
                    <span className="font-mono-code font-bold text-xs">{reg.code}</span>
                    <span className="text-[10px] font-mono-code opacity-90">{reg.revenue}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer status */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Hover node to preview metrics</span>
            <span className="text-emerald-400 font-mono-code">APAC leading at 28.5% margin</span>
          </div>
        </div>

        {/* Selected Region Detailed Card */}
        <div className="lg:col-span-4 bg-[#090D16] border border-slate-800/80 rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase">Region Analysis</span>
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  {activeRegion.region}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeRegion.growth} YoY
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code uppercase">Revenue</span>
                <div className="text-lg font-bold text-white font-mono-code">{activeRegion.revenue}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code uppercase">Net Profit</span>
                <div className="text-lg font-bold text-emerald-400 font-mono-code">{activeRegion.profit}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code uppercase">Profit Margin</span>
                <div className="text-lg font-bold text-cyan-400 font-mono-code">{activeRegion.margin}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code uppercase">Shipment Count</span>
                <div className="text-lg font-bold text-slate-200 font-mono-code">{activeRegion.shipments.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#111726] border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Strategic Takeaway
            </div>
            <p className="text-[11px] text-slate-400">
              {activeRegion.code === 'APAC' && 'High-yield tech exports surging. Transpacific air freight margins up 4.2% month over month.'}
              {activeRegion.code === 'EMEA' && 'Automotive manufacturing trade steady. Rotterdam port tariff rebate unlocked.'}
              {activeRegion.code === 'NA' && 'Drayage corridor expansion in US Midwest offering +14% growth trajectory.'}
              {activeRegion.code === 'LATAM' && 'Fastest growing corridor (+28.5%). High-margin lithium supply chain opportunity.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
