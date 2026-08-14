import React from 'react';
import {
  Clock,
  FileCheck2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_FINANCIAL_FEED } from '../../data/mockRevenueData';
import { FinancialActivityItem } from '../../types/revenue';

export const FinancialActivityFeed: React.FC = () => {
  const getItemIcon = (type: FinancialActivityItem['type']) => {
    switch (type) {
      case 'contract':
        return FileCheck2;
      case 'rebate':
        return Percent;
      case 'billing':
        return Receipt;
      case 'cost_saving':
        return ShieldCheck;
      case 'tariff':
      default:
        return DollarSign;
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Financial Activity Stream</h3>
            <p className="text-xs text-slate-400">
              Live ledger updates, contract lock-ins, rebate releases, and settlements.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Live Ledger
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {MOCK_FINANCIAL_FEED.map((item) => {
          const Icon = getItemIcon(item.type);

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#090D16] border border-slate-700 flex items-center justify-center text-emerald-400 shadow-sm group-hover:border-emerald-500 transition-colors">
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-slate-700 hover:bg-[#141C2E] transition-all space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.amount && (
                      <span className="text-xs font-mono-code font-bold text-emerald-400">
                        {item.amount}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
