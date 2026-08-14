import React from 'react';
import {
  Compass,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowUpRight,
  Route,
  UserCheck,
  Percent,
  MapPin,
} from 'lucide-react';
import { MOCK_OPPORTUNITIES } from '../../data/mockRevenueData';
import { FinancialOpportunityItem } from '../../types/revenue';

interface RevenueOpportunitiesProps {
  onSelectOpportunity?: (opp: FinancialOpportunityItem) => void;
}

export const RevenueOpportunities: React.FC<RevenueOpportunitiesProps> = ({
  onSelectOpportunity,
}) => {
  const getCategoryIcon = (cat: FinancialOpportunityItem['category']) => {
    switch (cat) {
      case 'High-Margin Route':
        return Route;
      case 'Fast-Growing Account':
        return UserCheck;
      case 'Cost Reduction':
        return Percent;
      case 'Market Expansion':
      default:
        return MapPin;
    }
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Targeted Business Opportunities</h3>
            <p className="text-xs text-slate-400">
              High-yield commercial routes, customer expansions, and operational savings.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono-code text-slate-400">
          4 High Potential Projects
        </span>
      </div>

      {/* Grid of Opportunity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_OPPORTUNITIES.map((opp) => {
          const Icon = getCategoryIcon(opp.category);

          return (
            <div
              key={opp.id}
              onClick={() => onSelectOpportunity?.(opp)}
              className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-indigo-500/60 hover:bg-[#141C2E] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {opp.category}
                  </span>
                  <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                    {opp.marginBoost}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {opp.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono-code uppercase">Potential Value</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono-code">{opp.potentialValue}</span>
                </div>

                {/* Readiness Score Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono-code">
                    <span>Readiness Score</span>
                    <span className="text-white font-bold">{opp.readinessScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${opp.readinessScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
