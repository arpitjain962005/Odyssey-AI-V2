import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Compass,
  Globe2,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { GrowthSignalItem } from '../../types/rising';

interface GrowthSignalsSectionProps {
  signals: GrowthSignalItem[];
  filterCategory: string;
  onNavigateToView?: (viewId: string) => void;
}

export const GrowthSignalsSection: React.FC<GrowthSignalsSectionProps> = ({
  signals,
  filterCategory,
  onNavigateToView,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredSignals = signals.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) {
      return false;
    }
    if (activeTab !== 'all' && s.category !== activeTab) {
      return false;
    }
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'cargo':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'tradelane':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'region':
        return <Globe2 className="w-4 h-4 text-emerald-400" />;
      case 'customer':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'market':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Growth Signals & Momentum Drivers
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key positive momentum indicators across cargo categories, trade lanes, regions, top accounts, and expanding markets.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'cargo', label: 'Cargo' },
            { id: 'tradelane', label: 'Trade Lanes' },
            { id: 'region', label: 'Regions' },
            { id: 'customer', label: 'Accounts' },
            { id: 'market', label: 'Markets' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Growth Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            className="p-4 rounded-xl bg-[#0E1320] border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  {getCategoryIcon(signal.category)}
                  <span className="capitalize text-emerald-400 font-mono-code text-[11px]">
                    {signal.subtitle}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Score {signal.opportunityScore}/100
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {signal.title}
                </h3>
              </div>

              {/* Metrics pill */}
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono-code flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {signal.growthMetric}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold font-mono-code">
                  {signal.margin}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {signal.description}
              </p>
            </div>

            {/* Connected Insight to Falling */}
            {signal.relatedFallingContext && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono-code">Contrasting Lagging Area:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('falling');
                  }}
                  className="text-rose-400 hover:text-rose-300 font-mono-code flex items-center gap-1 hover:underline"
                >
                  <span>{signal.relatedFallingContext}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
