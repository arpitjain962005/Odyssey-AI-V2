import React, { useState } from 'react';
import { JourneyItem } from '../../types/journey';
import { Sparkles, AlertTriangle, Lightbulb, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface JourneyAiInsightsPanelProps {
  journey: JourneyItem;
}

export const JourneyAiInsightsPanel: React.FC<JourneyAiInsightsPanelProps> = ({ journey }) => {
  const [actionToast, setActionToast] = useState<string | null>(null);

  const handleExecuteAction = (actionLabel: string) => {
    setActionToast(`Executed: "${actionLabel}"`);
    setTimeout(() => setActionToast(null), 3500);
  };

  const insight = journey.aiInsight;

  return (
    <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md flex flex-col h-full space-y-4 relative">
      {/* Toast Notification */}
      {actionToast && (
        <div className="absolute top-3 right-3 z-30 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
            AI Journey Diagnostics & Copilot
          </h2>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono-code bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Real-Time Agent
        </span>
      </div>

      {/* Weather Alert / Delay Explanation */}
      {insight.delayReason && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Diagnostic Impact</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {insight.delayReason}
          </p>
        </div>
      )}

      {/* Route Recommendation */}
      {insight.recommendation && (
        <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI Reroute Recommendation</span>
          </div>
          <p className="text-xs text-blue-100/90 leading-relaxed">
            {insight.recommendation}
          </p>
        </div>
      )}

      {/* Risk Summary */}
      {insight.riskSummary && (
        <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Downstream SLA Risk Profile</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {insight.riskSummary}
          </p>
        </div>
      )}

      {/* Suggested Actions Interactive Buttons */}
      {insight.suggestedActions && insight.suggestedActions.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] font-mono-code uppercase text-slate-400 tracking-wider">
            Suggested Mitigations ({insight.suggestedActions.length})
          </span>

          <div className="flex flex-col gap-2">
            {insight.suggestedActions.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => handleExecuteAction(act.label)}
                className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 shadow-xs ${
                  act.primary
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 font-semibold'
                    : 'bg-[#0E1320] hover:bg-[#141C2E] text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{act.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
