import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  Bot,
} from 'lucide-react';
import { MOCK_FINANCIAL_AI_INSIGHTS } from '../../data/mockRevenueData';
import { FinancialAiInsight } from '../../types/revenue';

interface RevenueAiInsightsProps {
  onExecuteAction: (insight: FinancialAiInsight) => void;
}

export const RevenueAiInsights: React.FC<RevenueAiInsightsProps> = ({
  onExecuteAction,
}) => {
  const [executedIds, setExecutedIds] = useState<string[]>([]);

  const handleApply = (insight: FinancialAiInsight) => {
    if (!executedIds.includes(insight.id)) {
      setExecutedIds([...executedIds, insight.id]);
      onExecuteAction(insight);
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Autonomous Financial AI Insights
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Optimization Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Machine-generated financial recommendations to maximize net yield & reduce leakage.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono-code text-slate-400">
          3 Actionable Directives
        </span>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_FINANCIAL_AI_INSIGHTS.map((insight) => {
          const isExecuted = executedIds.includes(insight.id);

          return (
            <div
              key={insight.id}
              className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {insight.confidence}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono-code">
                    {insight.impactValue}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {insight.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] text-slate-300 font-mono-code">
                  <span className="text-slate-500">Action: </span>
                  {insight.suggestedAction}
                </div>

                <button
                  type="button"
                  onClick={() => handleApply(insight)}
                  disabled={isExecuted}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isExecuted
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                  }`}
                >
                  {isExecuted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Directive Executed</span>
                    </>
                  ) : (
                    <>
                      <span>{insight.primaryActionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
