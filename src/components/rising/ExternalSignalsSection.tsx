import React from 'react';
import {
  Sun,
  Anchor,
  Globe,
  Fuel,
  FileCheck,
  Newspaper,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ExternalSignalItem } from '../../types/rising';

interface ExternalSignalsSectionProps {
  signals: ExternalSignalItem[];
}

export const ExternalSignalsSection: React.FC<ExternalSignalsSectionProps> = ({
  signals,
}) => {
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'port':
        return <Anchor className="w-4 h-4 text-emerald-400" />;
      case 'geopolitical':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-emerald-400" />;
      case 'trade':
        return <FileCheck className="w-4 h-4 text-teal-400" />;
      case 'logistics':
        return <Newspaper className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Sun className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              External Macro Signals & Favorable Conditions
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time external factors including ocean weather windows, port gate speed, fuel indexes, and trade policy updates.
          </p>
        </div>

        <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          6 External Feeds Monitored
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((sig) => (
          <div
            key={sig.id}
            className="p-4 rounded-xl bg-[#0E1320] border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#111726] border border-slate-800">
                  {getSignalIcon(sig.type)}
                </div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider">
                  {sig.location}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {sig.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {sig.title}
              </h3>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono-code flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Financial Impact: {sig.impact}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {sig.aiSummary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
