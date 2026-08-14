import React from 'react';
import { Navigation, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { JourneyStatus } from '../../types/journey';

interface JourneysKpiCardsProps {
  activeCount: number;
  delayedCount: number;
  deliveredCount: number;
  criticalCount: number;
  selectedStatus: JourneyStatus;
  onSelectStatusFilter: (status: JourneyStatus) => void;
}

export const JourneysKpiCards: React.FC<JourneysKpiCardsProps> = ({
  activeCount,
  delayedCount,
  deliveredCount,
  criticalCount,
  selectedStatus,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      id: 'active' as JourneyStatus,
      title: 'Active Journeys',
      value: activeCount.toString(),
      trend: '+8.2% in flight/transit',
      badge: 'Live Operations',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      icon: Navigation,
      iconColor: 'text-blue-400',
    },
    {
      id: 'delayed' as JourneyStatus,
      title: 'Delayed',
      value: delayedCount.toString(),
      trend: '8.4% fleet impact',
      badge: 'Action Required',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    {
      id: 'delivered' as JourneyStatus,
      title: 'Delivered Today',
      value: deliveredCount.toString(),
      trend: '100% SLA compliance',
      badge: 'Completed',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'critical' as JourneyStatus,
      title: 'High Risk',
      value: criticalCount.toString(),
      trend: 'Weather & Engine Alerts',
      badge: 'High Priority',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectStatusFilter(isSelected ? 'all' : card.id)}
            className={`p-4 rounded-xl transition-all cursor-pointer space-y-3 shadow-xs border ${
              isSelected
                ? 'bg-[#151E32] border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-950/40'
                : 'bg-[#111726] border-slate-800/80 hover:border-slate-700/80 hover:bg-[#141C2E]'
            }`}
          >
            {/* Top row: Title + Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{card.title}</span>
              <div className={`p-1.5 rounded-lg bg-[#0E1320] border border-slate-800 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Value + Badge */}
            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="text-2xl font-bold text-white font-mono-code tracking-tight">
                {card.value}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold uppercase border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            {/* Supporting trend */}
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              {card.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
};
