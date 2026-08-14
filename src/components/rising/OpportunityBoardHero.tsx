import React from 'react';
import {
  TrendingUp,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Percent,
  Activity,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { OpportunityCorridorItem } from '../../types/rising';

interface OpportunityBoardHeroProps {
  corridors: OpportunityCorridorItem[];
  selectedCorridorId: string | null;
  onSelectCorridor: (corridor: OpportunityCorridorItem) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const OpportunityBoardHero: React.FC<OpportunityBoardHeroProps> = ({
  corridors,
  selectedCorridorId,
  onSelectCorridor,
  onNavigateToView,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800/90 shadow-xl space-y-5">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Accelerating Supply Corridors (Opportunity Board)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              High-Yield Target Lanes
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Top global trade corridors experiencing compound throughput growth, expanding margins, and high AI allocation scores.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            4 Active Corridors Monitored
          </span>
        </div>
      </div>

      {/* Corridor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {corridors.map((corridor) => {
          const isSelected = selectedCorridorId === corridor.id;
          return (
            <div
              key={corridor.id}
              onClick={() => onSelectCorridor(corridor)}
              className={`group relative p-4 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 border ${
                isSelected
                  ? 'bg-gradient-to-b from-[#162235] to-[#0E1524] border-emerald-500/80 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#0E1320] hover:bg-[#131A2B] border-slate-800/90 hover:border-emerald-500/40'
              }`}
            >
              {/* Top Row: Route & Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-emerald-400 font-bold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {corridor.routeCode}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {corridor.confidenceScore}% AI Confidence
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                    {corridor.origin.split(' ')[0]} → {corridor.destination.split(' ')[0]}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono-code">
                    {corridor.origin} to {corridor.destination}
                  </p>
                </div>
              </div>

              {/* Middle Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#090D16]/80 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono-code">Growth</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {corridor.growth.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-mono-code">Margin</span>
                  <span className="text-xs font-bold text-white flex items-center gap-0.5">
                    <Percent className="w-3 h-3 text-emerald-400" />
                    {corridor.profitability.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-mono-code">Efficiency</span>
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-0.5">
                    <Activity className="w-3 h-3 text-blue-400" />
                    {corridor.efficiency.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* AI Summary */}
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1" />
                {corridor.aiSummary}
              </p>

              {/* Connected Insight to Falling */}
              {corridor.relatedFallingRouteName && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono-code">Decelerating ref:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigateToView) onNavigateToView('falling');
                    }}
                    className="text-rose-400 hover:text-rose-300 font-mono-code flex items-center gap-1 hover:underline"
                  >
                    <span>{corridor.relatedFallingRouteName}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
