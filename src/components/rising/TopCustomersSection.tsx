import React from 'react';
import {
  Users,
  TrendingUp,
  Percent,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { TopCustomerItem } from '../../types/rising';

interface TopCustomersSectionProps {
  customers: TopCustomerItem[];
  onActionClick?: (cust: TopCustomerItem) => void;
}

export const TopCustomersSection: React.FC<TopCustomersSectionProps> = ({
  customers,
  onActionClick,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Top-Performing Accounts & Expansion Targets
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key enterprise accounts generating high-yield margin and expanding contract volumes.
          </p>
        </div>

        <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          +$23.5M Total Account Yield
        </span>
      </div>

      {/* Grid of Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customers.map((cust) => (
          <div
            key={cust.id}
            className="p-4 rounded-xl bg-[#0E1320] border border-slate-800/90 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Logo & Account Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  {cust.logoInitial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cust.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono-code">
                    {cust.industry}
                  </p>
                </div>
              </div>

              {/* Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-[#090D16] border border-slate-800/80 text-center">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono-code block">ARR Value</span>
                  <span className="text-xs font-bold text-white font-mono-code">
                    {cust.revenueValue}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-mono-code block">Growth</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono-code flex items-center justify-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    {cust.growthRate.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 font-mono-code block">Margin</span>
                  <span className="text-xs font-bold text-slate-200 font-mono-code">
                    {cust.margin.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-2.5 rounded-lg bg-[#111726] border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono-code font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Growth Action
                </span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {cust.aiRecommendation}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => onActionClick && onActionClick(cust)}
              className="w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Expand Account SLA</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
