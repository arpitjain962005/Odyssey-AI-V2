import React from 'react';
import {
  Navigation,
  Network,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowRight
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'journeys',
      label: 'View Journeys',
      icon: <Navigation className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'network',
      label: 'Open Network',
      icon: <Network className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'rising',
      label: 'Review Rising',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'falling',
      label: 'Review Falling',
      icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'reports',
      label: 'Generate Report',
      icon: <FileText className="w-4 h-4 text-slate-300" />,
    },
  ];

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono-code">
          Quick Actions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelectAction(action.id)}
            className="p-3.5 rounded-xl bg-[#111726] border border-slate-800/80 hover:border-slate-700 hover:bg-[#151D2F] transition-all flex items-center justify-between group shadow-xs text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-slate-800/60">
                {action.icon}
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
