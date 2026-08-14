import React from 'react';
import { JourneyItem } from '../../types/journey';
import { Clock, CheckCircle2, Navigation, MapPin, AlertTriangle } from 'lucide-react';

interface JourneyTimelinePanelProps {
  journey: JourneyItem;
}

export const JourneyTimelinePanel: React.FC<JourneyTimelinePanelProps> = ({ journey }) => {
  const currentStage = journey.stops.find((s) => s.status === 'in_progress') || journey.stops[journey.stops.length - 1];
  const nextStage = journey.stops.find((s) => s.status === 'upcoming');

  return (
    <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
            Journey Stage Timeline
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 font-mono-code">
          {journey.stops.filter((s) => s.status === 'completed').length} / {journey.stops.length} Stages Passed
        </span>
      </div>

      {/* Current Active Stage Highlight Banner */}
      {currentStage && (
        <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Current Stage
            </span>
            <span className="text-slate-300 font-mono-code text-[11px]">{currentStage.actualTime || currentStage.scheduledTime}</span>
          </div>
          <div className="text-sm font-bold text-white">{currentStage.name}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{currentStage.location}</span>
          </div>
          {currentStage.note && (
            <p className="text-[11px] text-amber-300/90 pt-1 font-mono-code">
              Note: {currentStage.note}
            </p>
          )}
        </div>
      )}

      {/* Timeline Steps List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {journey.stops.map((stop, idx) => {
          const isCompleted = stop.status === 'completed';
          const isInProgress = stop.status === 'in_progress';

          return (
            <div key={stop.id} className="relative pl-8 text-xs space-y-0.5 group">
              {/* Timeline Indicator Node */}
              <div
                className={`absolute left-1.5 top-0.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : isInProgress
                    ? 'bg-blue-500 border-white ring-2 ring-blue-500/30'
                    : 'bg-[#090D16] border-slate-700'
                }`}
              >
                {isCompleted && <CheckCircle2 className="w-2.5 h-2.5" />}
              </div>

              {/* Stop Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-semibold ${
                    isInProgress ? 'text-blue-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stop.name}
                </span>
                <span className="text-[10px] font-mono-code text-slate-500">
                  {stop.actualTime || stop.scheduledTime}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">{stop.location}</div>
            </div>
          );
        })}
      </div>

      {/* Next Stop Footer */}
      {nextStage && (
        <div className="p-2.5 rounded-xl bg-[#0E1320] border border-slate-800/80 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-mono-code">Next Stop</span>
            <div className="font-semibold text-slate-200">{nextStage.name}</div>
          </div>
          <div className="text-right font-mono-code text-[11px] text-slate-400">
            ETA: {nextStage.scheduledTime}
          </div>
        </div>
      )}
    </div>
  );
};
