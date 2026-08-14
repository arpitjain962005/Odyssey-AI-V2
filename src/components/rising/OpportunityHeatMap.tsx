import React, { useState } from 'react';
import {
  Globe2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Percent,
  ArrowRight,
  Layers,
  MapPin,
} from 'lucide-react';
import { OpportunityRegionItem } from '../../types/rising';

interface OpportunityHeatMapProps {
  regions: OpportunityRegionItem[];
  selectedRegionId: string | null;
  onSelectRegion: (region: OpportunityRegionItem) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const OpportunityHeatMap: React.FC<OpportunityHeatMapProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  onNavigateToView,
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<OpportunityRegionItem | null>(
    null
  );

  const activeDetailRegion =
    hoveredRegion ||
    regions.find((r) => r.id === selectedRegionId) ||
    regions[0];

  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Globe2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Opportunity Heat Map (Regional Momentum)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic distribution of accelerating supply demand, yield density, and regional growth scores.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
            Green Gradient = High Opportunity Yield
          </span>
        </div>
      </div>

      {/* Main Container: Map Canvas + Active Region Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 relative min-h-[360px] rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          {/* Subtle Map Grid lines background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #10B981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Map Lines & Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/20 fill-none stroke-1">
            {/* Curved trade lane connecting lines */}
            <path d="M 78% 48% Q 60% 30% 44% 34%" strokeDasharray="3 3" />
            <path d="M 78% 48% Q 50% 20% 20% 38%" strokeDasharray="3 3" />
            <path d="M 20% 38% Q 25% 55% 32% 68%" strokeDasharray="3 3" />
          </svg>

          {/* Map Region Nodes */}
          <div className="relative w-full h-[320px]">
            {regions.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              const isHovered = hoveredRegion?.id === reg.id;

              return (
                <div
                  key={reg.id}
                  style={{ top: `${reg.lat}%`, left: `${reg.lng}%` }}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onSelectRegion(reg)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  {/* Outer Pulsing Green Aura */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-10 h-10 rounded-full bg-emerald-500/20 animate-ping" />
                    <span
                      className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected || isHovered
                          ? 'bg-emerald-500 border-white shadow-lg shadow-emerald-500/50 scale-125'
                          : 'bg-[#111726] border-emerald-400 text-emerald-400 hover:border-white'
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 ${
                          isSelected || isHovered ? 'text-slate-950' : 'text-emerald-400'
                        }`}
                      />
                    </span>
                  </div>

                  {/* Floating Tag */}
                  <div className="mt-1 px-2 py-0.5 rounded bg-[#111726]/90 border border-emerald-500/30 text-[10px] font-mono-code font-bold text-emerald-400 shadow-md whitespace-nowrap backdrop-blur-sm group-hover:scale-105 transition-transform">
                    {reg.code} ({reg.revenueGrowth})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footnote */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="flex items-center gap-1.5 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Interactive Nodes: Hover or Click for AI Regional Analysis
            </span>
            <span className="text-slate-500 font-mono-code">Global Coverage 100%</span>
          </div>
        </div>

        {/* Active Region Detail Panel (4 cols) */}
        {activeDetailRegion && (
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0E1320] border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider font-semibold">
                  Regional Intelligence
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeDetailRegion.region}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Score {activeDetailRegion.opportunityScore}/100
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code">Revenue Growth</span>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {activeDetailRegion.revenueGrowth}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code">Demand Surge</span>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  {activeDetailRegion.demandGrowth}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code">On-Time SLA</span>
                <div className="text-sm font-bold text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  {activeDetailRegion.reliabilityScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code">Status</span>
                <div className="text-xs font-bold text-emerald-400 uppercase font-mono-code pt-0.5">
                  {activeDetailRegion.status.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Regional Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeDetailRegion.aiSummary}
              </p>
            </div>

            {/* Connected Insight to Falling */}
            {activeDetailRegion.relatedFallingRegion && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono-code">Laggard Corridor Ref:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('falling');
                  }}
                  className="text-rose-400 hover:text-rose-300 font-mono-code flex items-center gap-1 hover:underline"
                >
                  <span>{activeDetailRegion.relatedFallingRegion}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
