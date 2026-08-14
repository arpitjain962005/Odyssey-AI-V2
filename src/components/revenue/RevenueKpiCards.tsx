import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Truck,
  Building2,
  Zap,
} from 'lucide-react';
import { MOCK_FINANCIAL_KPI_SUMMARY } from '../../data/mockRevenueData';
import { RevenueMetricType } from '../../types/revenue';

interface RevenueKpiCardsProps {
  selectedMetric: RevenueMetricType;
  onSelectMetric: (m: RevenueMetricType) => void;
}

export const RevenueKpiCards: React.FC<RevenueKpiCardsProps> = ({
  selectedMetric,
  onSelectMetric,
}) => {
  const cards = [
    {
      id: 'revenue' as RevenueMetricType,
      title: 'Total Revenue',
      value: MOCK_FINANCIAL_KPI_SUMMARY.totalRevenue,
      subText: MOCK_FINANCIAL_KPI_SUMMARY.totalRevenueGrowth,
      badge: '+14.8% YoY',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'profit' as RevenueMetricType,
      title: 'Net Profit',
      value: MOCK_FINANCIAL_KPI_SUMMARY.netProfit,
      subText: MOCK_FINANCIAL_KPI_SUMMARY.netProfitGrowth,
      badge: 'High Yield',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      icon: TrendingUp,
      iconColor: 'text-blue-400',
    },
    {
      id: 'margin' as RevenueMetricType,
      title: 'Profit Margin',
      value: MOCK_FINANCIAL_KPI_SUMMARY.profitMargin,
      subText: MOCK_FINANCIAL_KPI_SUMMARY.profitMarginTarget,
      badge: 'Target Met',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      icon: Percent,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'cost' as RevenueMetricType,
      title: 'Logistics Cost',
      value: MOCK_FINANCIAL_KPI_SUMMARY.logisticsCost,
      subText: MOCK_FINANCIAL_KPI_SUMMARY.logisticsCostSavings,
      badge: 'Optimized',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Truck,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'cost' as RevenueMetricType,
      title: 'Operating Cost',
      value: MOCK_FINANCIAL_KPI_SUMMARY.operatingCost,
      subText: MOCK_FINANCIAL_KPI_SUMMARY.operatingCostEfficiency,
      badge: '91.8% OER',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Building2,
      iconColor: 'text-amber-400',
    },
    {
      id: 'revenue' as RevenueMetricType,
      title: 'Revenue Growth Rate',
      value: MOCK_FINANCIAL_KPI_SUMMARY.revenueGrowthRate,
      subText: 'Quarterly momentum',
      badge: 'Strong',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Zap,
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isSelected = selectedMetric === card.id;

        return (
          <div
            key={idx}
            onClick={() => onSelectMetric(card.id)}
            className={`p-3.5 rounded-xl transition-all cursor-pointer space-y-2 border shadow-xs ${
              isSelected
                ? 'bg-[#151E32] border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40'
                : 'bg-[#111726] border-slate-800/80 hover:border-slate-700 hover:bg-[#141C2E]'
            }`}
          >
            {/* Header: Title + Icon */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-slate-300 truncate">{card.title}</span>
              <div className={`p-1 rounded bg-[#0E1320] border border-slate-800 ${card.iconColor} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Main Value */}
            <div className="text-xl font-bold text-white font-mono-code tracking-tight pt-0.5">
              {card.value}
            </div>

            {/* Subtext + Badge */}
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
              <span className="text-slate-400 truncate">{card.subText}</span>
              <span className={`px-1.5 py-0.2 rounded font-mono-code font-semibold uppercase border shrink-0 ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
