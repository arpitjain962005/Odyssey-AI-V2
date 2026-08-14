import React from 'react';
import {
  Flame,
  Warehouse,
  Anchor,
  Users,
  FileCheck2,
  ShieldCheck,
  TrendingDown,
  AlertCircle,
  PiggyBank,
} from 'lucide-react';
import { MOCK_COST_BREAKDOWN } from '../../data/mockRevenueData';
import { CostCategoryItem } from '../../types/revenue';

interface CostBreakdownCardsProps {
  onSelectCategory?: (category: CostCategoryItem) => void;
}

export const CostBreakdownCards: React.FC<CostBreakdownCardsProps> = ({
  onSelectCategory,
}) => {
  const getIconForCategory = (cat: string) => {
    switch (cat) {
      case 'Fuel & Bunkering':
        return Flame;
      case 'Warehousing & Storage':
        return Warehouse;
      case 'Port & Terminal Fees':
        return Anchor;
      case 'Labor & Fleet Ops':
        return Users;
      case 'Customs Clearance':
        return FileCheck2;
      case 'Cargo Insurance':
      default:
        return ShieldCheck;
    }
  };

  const totalExpense = MOCK_COST_BREAKDOWN.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Logistics Cost Structure</h3>
            <p className="text-xs text-slate-400">
              Expense breakdown by operating vector & active AI cost reduction targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Operational Outflow:</span>
          <span className="text-sm font-bold text-rose-400 font-mono-code">${totalExpense.toFixed(1)}M</span>
        </div>
      </div>

      {/* Grid of Cost Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOCK_COST_BREAKDOWN.map((item) => {
          const Icon = getIconForCategory(item.category);

          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory?.(item)}
              className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-slate-700 hover:bg-[#141C2E] transition-all cursor-pointer space-y-2.5 group"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#111726] border border-slate-800 text-slate-300 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.category}
                  </span>
                </div>

                {item.isSavingTarget && (
                  <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Target Area
                  </span>
                )}
              </div>

              {/* Amount and Percentage */}
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-lg font-bold text-white font-mono-code">
                  ${item.amount.toFixed(1)}M
                </div>
                <div className="text-xs font-mono-code font-semibold text-slate-300">
                  {item.percentage}% <span className="text-slate-500 text-[10px]">of total</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              {/* Trend label */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className="truncate">{item.trend}</span>
                <span className="text-slate-500 font-mono-code">Q3 Audited</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
