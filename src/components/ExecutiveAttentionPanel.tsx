import React from 'react';
import { ExecutiveAttentionItem, EventSeverity } from '../types';
import { ArrowRight, Activity, ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface ExecutiveAttentionPanelProps {
  items: ExecutiveAttentionItem[];
  activeEventId?: string | null;
  onSelectEvent: (item: ExecutiveAttentionItem) => void;
}

export const ExecutiveAttentionPanel: React.FC<ExecutiveAttentionPanelProps> = ({
  items,
  activeEventId,
  onSelectEvent,
}) => {
  const renderSeverityDot = (severity: EventSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        );
      case 'warning':
        return (
          <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        );
      case 'resolved':
        return (
          <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        );
      case 'info':
      default:
        return (
          <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
        );
    }
  };

  const getSeverityBadgeClass = (severity: EventSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'resolved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md flex flex-col h-full min-h-[520px] lg:min-h-[580px] overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#0E1320] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
              Executive Attention
            </h2>
            <span className="text-[10px] text-slate-500">
              Live Operational Heartbeat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono-code bg-[#090D16] px-2 py-1 rounded-md border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Stream</span>
        </div>
      </div>

      {/* Stream Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-3 space-y-2">
        {items.map((item) => {
          const isActive = activeEventId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectEvent(item)}
              className={`p-3.5 rounded-xl transition-all cursor-pointer group flex flex-col justify-between gap-2 border ${
                isActive
                  ? 'bg-[#161F33] border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-[#0E1320]/60 hover:bg-[#141C2E] border-slate-800/60 hover:border-slate-700/80'
              }`}
            >
              {/* Top Row: Severity Indicator + Title */}
              <div className="flex items-start gap-2.5">
                {renderSeverityDot(item.severity)}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-semibold leading-snug transition-colors ${
                      isActive ? 'text-blue-300' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {item.title}
                    </h3>

                    <span className="text-[10px] text-slate-500 font-mono-code shrink-0 pt-0.5">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* One-Line Explanation */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[11px]">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase tracking-wider border ${getSeverityBadgeClass(item.severity)}`}>
                  {item.severity}
                </span>

                <button
                  type="button"
                  className="text-blue-400 group-hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                >
                  <span>{item.actionLabel || 'Open →'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
