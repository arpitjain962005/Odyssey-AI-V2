import React, { useState } from 'react';
import { JourneyItem } from '../../types/journey';
import { FileText, Download, Compass, Box, MapPin, Clock, Eye, CheckCircle2, Shield } from 'lucide-react';

interface JourneyDetailsPanelProps {
  journey: JourneyItem;
}

export const JourneyDetailsPanel: React.FC<JourneyDetailsPanelProps> = ({ journey }) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownloadDoc = (docName: string) => {
    setDownloadToast(`Downloaded ${docName}`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md flex flex-col h-full space-y-4 relative">
      {/* Download Notification Toast */}
      {downloadToast && (
        <div className="absolute top-3 right-3 z-30 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono-code">
            Consignment Specification
          </h2>
        </div>
        <span className="font-mono-code text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          {journey.id}
        </span>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Carrier */}
        <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono-code">Carrier & Vehicle</span>
          <div className="text-xs font-semibold text-slate-200 truncate">{journey.carrier}</div>
          <p className="text-[11px] text-slate-400 truncate">{journey.vesselOrFlight || 'Fleet Conveyance'}</p>
        </div>

        {/* Route Corridor */}
        <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono-code">Route Corridor</span>
          <div className="text-xs font-semibold text-slate-200 truncate">{journey.origin}</div>
          <p className="text-[11px] text-slate-400 truncate">→ {journey.destination}</p>
        </div>

        {/* Distance Remaining */}
        <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono-code">Remaining Distance</span>
          <div className="text-xs font-semibold text-slate-200 font-mono-code">{journey.distanceRemaining}</div>
          <p className="text-[11px] text-slate-400">{100 - journey.progressPercent}% of journey left</p>
        </div>

        {/* ETA & Variance */}
        <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono-code">Estimated Arrival</span>
          <div className="text-xs font-semibold text-slate-200 font-mono-code">{journey.eta}</div>
          <p className={`text-[11px] font-medium font-mono-code ${
            journey.etaVariance?.includes('delay') ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {journey.etaVariance || 'On schedule'}
          </p>
        </div>
      </div>

      {/* Progress Bar & Telemetry */}
      <div className="p-3 rounded-xl bg-[#0E1320] border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Journey Progress</span>
          <span className="font-mono-code font-bold text-blue-400">{journey.progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${journey.progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono-code">
          <span>Dep: {journey.departureDate}</span>
          <span>Last AIS: {journey.lastUpdated}</span>
        </div>
      </div>

      {/* Containers Tag List */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 uppercase font-mono-code">
          Assigned Containers ({journey.containersCount})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {journey.containerNumbers.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded bg-[#0E1320] border border-slate-800 text-[11px] font-mono-code text-slate-300"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Consignment Documents Section */}
      <div className="flex-1 space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Consignment Documents ({journey.documents.length})</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
            <Shield className="w-3 h-3" /> E-Signed
          </span>
        </div>

        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
          {journey.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-2 rounded-lg bg-[#0E1320] border border-slate-800/80 hover:border-slate-700 flex items-center justify-between text-xs transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">{doc.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono-code">{doc.size} • {doc.date}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadDoc(doc.name)}
                className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors shrink-0"
                title="Download Document"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
