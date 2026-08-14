import React from 'react';
import {
  Trophy,
  TrendingUp,
  Percent,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import { TopRouteItem } from '../../types/rising';

interface TopPerformingRoutesLeaderboardProps {
  routes: TopRouteItem[];
  onSelectRouteForComparison?: (route: TopRouteItem) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const TopPerformingRoutesLeaderboard: React.FC<
  TopPerformingRoutesLeaderboardProps
> = ({ routes, onSelectRouteForComparison, onNavigateToView }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Trophy className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Top Performing Trade Routes
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Ranked by Yield & Reliability
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Highest profitability and fastest growth corridors operating within enterprise SLA parameters.
          </p>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {routes.map((route, index) => (
          <div
            key={route.id}
            className="p-4 rounded-xl bg-[#0E1320] border border-slate-800/90 hover:border-emerald-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Rank & Route Name */}
            <div className="flex items-start gap-3.5 min-w-[280px]">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono-code text-xs shrink-0 mt-0.5">
                #{index + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {route.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-code mt-0.5">
                  <span>
                    {route.originCode} → {route.destCode}
                  </span>
                  <span>•</span>
                  <span>{route.volumeTEU}</span>
                  <span>•</span>
                  <span>{route.transitDays}</span>
                </div>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-xl">
              <div className="p-2 rounded-lg bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code block">
                  Gross Margin
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono-code">
                  {route.profitability}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code block">
                  YoY Growth
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono-code flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {route.growth}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code block">
                  On-Time SLA
                </span>
                <span className="text-xs font-bold text-blue-400 font-mono-code">
                  {route.reliability}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#090D16] border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono-code block">
                  AI Score
                </span>
                <span className="text-xs font-bold text-white font-mono-code">
                  {route.opportunityScore}/100
                </span>
              </div>
            </div>

            {/* AI Insight & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800/80 shrink-0">
              <p className="text-[11px] text-slate-300 max-w-xs text-left lg:text-right">
                <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1" />
                {route.aiInsight}
              </p>

              <div className="flex items-center gap-2 pt-1">
                {route.relatedFallingRoute && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToView) onNavigateToView('falling');
                    }}
                    className="text-[10px] font-mono-code text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
                  >
                    <span>Ref: {route.relatedFallingRoute}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}

                {onSelectRouteForComparison && (
                  <button
                    type="button"
                    onClick={() => onSelectRouteForComparison(route)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-all flex items-center gap-1"
                  >
                    <BarChart2 className="w-3 h-3" />
                    <span>Compare</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
