import React from 'react';
import { JourneyItem } from '../../types/journey';
import { SlidersHorizontal, X, ArrowRight, ShieldAlert, Clock, Compass, Box, CheckCircle2 } from 'lucide-react';

interface JourneyComparePanelProps {
  comparedJourneys: JourneyItem[];
  onRemoveJourney: (id: string) => void;
  onClearCompare: () => void;
}

export const JourneyComparePanel: React.FC<JourneyComparePanelProps> = ({
  comparedJourneys,
  onRemoveJourney,
  onClearCompare,
}) => {
  if (comparedJourneys.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl bg-[#111726] border border-blue-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
              Side-by-Side Journey Comparison Matrix
            </h2>
            <p className="text-[10px] text-slate-400">Comparing {comparedJourneys.length} active shipment routes</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearCompare}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-[#0E1320] border border-slate-800 hover:border-slate-700 transition-colors"
        >
          Exit Compare Mode
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparedJourneys.map((j) => (
          <div
            key={j.id}
            className="p-4 rounded-xl bg-[#0E1320] border border-slate-800 space-y-3 relative group"
          >
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemoveJourney(j.id)}
              className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title & Status */}
            <div className="pr-8 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm font-mono-code text-blue-400">{j.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-semibold ${
                  j.status === 'delayed' ? 'bg-amber-500/20 text-amber-400' :
                  j.status === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {j.status}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-white">{j.title}</h3>
            </div>

            {/* Comparison Metrics List */}
            <div className="space-y-2 text-xs divide-y divide-slate-800/60 pt-1">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Carrier / Vehicle:</span>
                <span className="font-semibold text-slate-200">{j.carrier}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Route Origin & Dest:</span>
                <span className="font-semibold text-slate-200 text-right">{j.origin} → {j.destination}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Progress:</span>
                <span className="font-mono-code font-bold text-blue-400">{j.progressPercent}%</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Distance Remaining:</span>
                <span className="font-mono-code text-slate-300">{j.distanceRemaining}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Estimated Arrival (ETA):</span>
                <span className="font-mono-code text-slate-200">{j.eta}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Schedule Variance:</span>
                <span className={`font-mono-code font-semibold ${
                  j.etaVariance?.includes('delay') ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {j.etaVariance || 'On time'}
                </span>
              </div>
            </div>

            {/* AI Insight Summary */}
            <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="text-[10px] text-blue-400 font-mono-code font-bold uppercase">AI Diagnostic Note</span>
              <p className="line-clamp-2 leading-tight">{j.aiInsight.delayReason || j.aiInsight.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
