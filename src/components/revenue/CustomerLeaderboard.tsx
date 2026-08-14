import React from 'react';
import {
  Award,
  TrendingUp,
  Star,
  ChevronRight,
  Building2,
  Sparkles,
} from 'lucide-react';
import { MOCK_CUSTOMER_LEADERBOARD } from '../../data/mockRevenueData';
import { CustomerPerformanceItem } from '../../types/revenue';

interface CustomerLeaderboardProps {
  onSelectCustomer?: (customer: CustomerPerformanceItem) => void;
}

export const CustomerLeaderboard: React.FC<CustomerLeaderboardProps> = ({
  onSelectCustomer,
}) => {
  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Top Enterprise Customer Yield</h3>
            <p className="text-xs text-slate-400">
              Account leaderboard ranked by revenue contribution, margin score, and growth momentum.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono-code text-slate-400">
          Showing 5 Strategic Accounts
        </span>
      </div>

      {/* Customer Leaderboard Cards List (Avoiding Spreadsheet look!) */}
      <div className="space-y-3">
        {MOCK_CUSTOMER_LEADERBOARD.map((cust, index) => {
          return (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer?.(cust)}
              className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-emerald-500/60 hover:bg-[#141C2E] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Customer Identifier & Rank */}
              <div className="flex items-center gap-3 min-w-[240px]">
                {/* Rank Badge */}
                <div className="w-7 h-7 rounded-lg bg-[#111726] border border-slate-800 flex items-center justify-center font-mono-code font-bold text-xs text-slate-300 shrink-0">
                  #{index + 1}
                </div>

                {/* Avatar Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/30 flex items-center justify-center font-bold text-base text-blue-400 shrink-0 shadow-inner">
                  {cust.logoInitial}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {cust.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold border ${cust.badgeColor}`}>
                      {cust.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{cust.industry}</p>
                </div>
              </div>

              {/* Middle Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 items-center flex-1">
                {/* Revenue */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono-code uppercase">Revenue</span>
                  <div className="text-base font-bold text-white font-mono-code">{cust.revenue}</div>
                </div>

                {/* Margin */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono-code uppercase">Profit Margin</span>
                  <div className="text-base font-bold text-emerald-400 font-mono-code">{cust.profitMargin}</div>
                </div>

                {/* Growth */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono-code uppercase">Growth</span>
                  <div className="text-base font-bold text-blue-400 font-mono-code flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {cust.growth}
                  </div>
                </div>
              </div>

              {/* Right Score & Action */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-right space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    Yield Score
                  </div>
                  <div className="text-sm font-bold text-amber-400 font-mono-code">
                    {cust.score} <span className="text-[10px] text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#111726] border border-slate-800 text-slate-400 group-hover:text-white group-hover:bg-emerald-600 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
