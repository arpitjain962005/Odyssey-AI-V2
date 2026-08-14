import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  X,
} from 'lucide-react';
import { AiRecommendationItem } from '../../types/rising';

interface AiOpportunityRecommendationsProps {
  recommendations: AiRecommendationItem[];
  onExecuteRecommendation?: (rec: AiRecommendationItem) => void;
}

export const AiOpportunityRecommendations: React.FC<
  AiOpportunityRecommendationsProps
> = ({ recommendations, onExecuteRecommendation }) => {
  const [executedIds, setExecutedIds] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const handleExecute = (rec: AiRecommendationItem) => {
    if (!executedIds.includes(rec.id)) {
      setExecutedIds([...executedIds, rec.id]);
    }
    setActiveToast(`AI Executed: ${rec.title}`);
    if (onExecuteRecommendation) {
      onExecuteRecommendation(rec);
    }

    setTimeout(() => {
      setActiveToast(null);
    }, 4000);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5 relative">
      {/* Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{activeToast}</span>
          <button
            onClick={() => setActiveToast(null)}
            className="text-emerald-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Executive Opportunity Recommendations
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              One-Click Optimization
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prescriptive decision support engine generating high-confidence operational adjustments for maximum capital return.
          </p>
        </div>

        <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          +$2.1M Estimated Net Margin Lift
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isExecuted = executedIds.includes(rec.id);

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isExecuted
                  ? 'bg-[#0E1722] border-emerald-500/40 opacity-80'
                  : 'bg-[#0E1320] hover:bg-[#12192A] border-slate-800 hover:border-emerald-500/50 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    {rec.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 font-mono-code">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {rec.confidence}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {rec.action}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090D16] border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono-code">Financial Upside:</span>
                  <span className="font-bold text-emerald-400 font-mono-code flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {rec.expectedImpact}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleExecute(rec)}
                disabled={isExecuted}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isExecuted
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/30'
                }`}
              >
                {isExecuted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Optimization Applied & Dispatched</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-white" />
                    <span>{rec.primaryButtonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
