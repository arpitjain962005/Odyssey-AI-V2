import React from 'react';
import { JourneyActivityFeedItem } from '../../types/journey';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2, Info, ArrowRight, MapPin } from 'lucide-react';

interface RecentActivityFeedProps {
  feedItems: JourneyActivityFeedItem[];
  onSelectJourneyById: (journeyId: string) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  feedItems,
  onSelectJourneyById,
}) => {
  const getSeverityBadgeClass = (severity: JourneyActivityFeedItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity: JourneyActivityFeedItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md space-y-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
              Recent Operational Activity Feed
            </h2>
            <p className="text-[10px] text-slate-500">Live telemetry and event log across all global transit corridors</p>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono-code bg-[#0E1320] px-2.5 py-1 rounded-md border border-slate-800">
          Real-time Event Stream
        </span>
      </div>

      {/* Cards Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {feedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectJourneyById(item.journeyId)}
            className="p-3.5 rounded-xl bg-[#0E1320]/80 hover:bg-[#141C2E] border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              {/* Header row: Severity + Timestamp */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {getSeverityIcon(item.severity)}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase font-semibold border ${getSeverityBadgeClass(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-slate-500">{item.timestamp}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Footer row: Journey ID shortcut + Location */}
            <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-slate-500 font-mono-code text-[10px]">
                {item.location && (
                  <>
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </>
                )}
              </div>

              <span className="text-blue-400 group-hover:text-blue-300 font-mono-code text-[10px] font-bold inline-flex items-center gap-1">
                <span>{item.journeyId}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
