import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  Percent,
  AlertTriangle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { RouteComparisonData, TopRouteItem } from '../../types/rising';

interface RouteComparisonToolProps {
  comparisonData: RouteComparisonData;
  availableRoutes: TopRouteItem[];
  onNavigateToView?: (viewId: string) => void;
}

export const RouteComparisonTool: React.FC<RouteComparisonToolProps> = ({
  comparisonData,
  availableRoutes,
  onNavigateToView,
}) => {
  const [selectedRouteAId, setSelectedRouteAId] = useState<string>('route-a');
  const [selectedRouteBId, setSelectedRouteBId] = useState<string>('route-b');

  const routeA = comparisonData.routeA;
  const routeB = comparisonData.routeB;

  const metrics = [
    {
      label: 'Gross Profit Margin',
      valA: routeA.profitability,
      valB: routeB.profitability,
      unit: '%',
      higherIsBetter: true,
    },
    {
      label: 'On-Time Delivery SLA',
      valA: routeA.reliability,
      valB: routeB.reliability,
      unit: '%',
      higherIsBetter: true,
    },
    {
      label: 'Demand Surge Velocity',
      valA: routeA.demandSurge,
      valB: routeB.demandSurge,
      unit: '%',
      higherIsBetter: true,
    },
    {
      label: 'Weather Safety Index',
      valA: routeA.weatherScore,
      valB: routeB.weatherScore,
      unit: '/100',
      higherIsBetter: true,
    },
    {
      label: 'Geopolitical Stability',
      valA: routeA.geoStability,
      valB: routeB.geoStability,
      unit: '/100',
      higherIsBetter: true,
    },
    {
      label: 'Port Congestion Risk',
      valA: routeA.congestionScore,
      valB: routeB.congestionScore,
      unit: '/100',
      higherIsBetter: false, // lower congestion is better
    },
    {
      label: 'AI Opportunity Yield Score',
      valA: routeA.opportunityScore,
      valB: routeB.opportunityScore,
      unit: '/100',
      higherIsBetter: true,
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <GitCompare className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Route Comparison Tool (Opportunity vs Lagging Reference)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Multi-Metric Side-by-Side
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare operational efficiency, gross margin, weather windows, and congestion scores between target lanes.
          </p>
        </div>

        {onNavigateToView && (
          <button
            type="button"
            onClick={() => onNavigateToView('falling')}
            className="text-xs font-mono-code text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Analyze Lagging Routes in Falling</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Comparison Column Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Route A Header (Rising Target) */}
        <div className="p-4 rounded-xl bg-[#0E1524] border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
              Target Route A (Rising)
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono-code">
              Score {routeA.opportunityScore}/100
            </span>
          </div>
          <h3 className="text-base font-bold text-white">{routeA.name}</h3>
          <p className="text-xs text-emerald-400 font-mono-code">{routeA.code}</p>
        </div>

        {/* Route B Header (Lagging Reference) */}
        <div className="p-4 rounded-xl bg-[#0E121B] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
              Reference Route B (Lagging)
            </span>
            <span className="text-xs font-bold text-rose-400 font-mono-code">
              Score {routeB.opportunityScore}/100
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-300">{routeB.name}</h3>
          <p className="text-xs text-rose-400/80 font-mono-code">{routeB.code}</p>
        </div>
      </div>

      {/* Side-by-Side Comparative Metrics */}
      <div className="space-y-3 pt-2">
        {metrics.map((m) => {
          const isAWinner = m.higherIsBetter ? m.valA > m.valB : m.valA < m.valB;

          return (
            <div
              key={m.label}
              className="p-3.5 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 font-mono-code">
                  {m.valA}
                  {m.unit} {isAWinner && <Check className="w-3 h-3 inline text-emerald-400 ml-0.5" />}
                </span>
                <span className="text-slate-300 font-semibold">{m.label}</span>
                <span className="font-bold text-slate-400 font-mono-code">
                  {m.valB}
                  {m.unit}
                </span>
              </div>

              {/* Dual Visual Bar */}
              <div className="grid grid-cols-2 gap-3 h-2">
                {/* Route A Bar */}
                <div className="w-full bg-slate-900 rounded-full overflow-hidden flex justify-end">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, m.valA)}%` }}
                  />
                </div>
                {/* Route B Bar */}
                <div className="w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      !m.higherIsBetter && m.valB > 50 ? 'bg-rose-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(100, m.valB)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Comparative Synthesis */}
      <div className="p-4 rounded-xl bg-[#0E1524] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Comparative Synthesis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Route A delivers +15.7% higher profit margin, 26.7% better on-time SLA, and 72% lower congestion than Route B. Capital re-allocation to Route A is strongly recommended.
          </p>
        </div>

        {onNavigateToView && (
          <button
            type="button"
            onClick={() => onNavigateToView('falling')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Explore Decelerating Corridors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
