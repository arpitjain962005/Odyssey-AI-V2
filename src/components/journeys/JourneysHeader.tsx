import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Sparkles,
  Ship,
  Plane,
  Truck,
  Train,
  Layers,
  X,
  ArrowRight,
} from 'lucide-react';
import { TransportMode, JourneyStatus } from '../../types/journey';

interface JourneysHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMode: TransportMode;
  onSelectMode: (m: TransportMode) => void;
  selectedStatus: JourneyStatus;
  onSelectStatus: (s: JourneyStatus) => void;
  dateRange: string;
  onDateRangeChange: (d: string) => void;
  aiPromptText: string;
  onAiPromptChange: (text: string) => void;
  onSubmitAiCommand: (cmdText: string) => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  comparedJourneyIds: string[];
}

export const JourneysHeader: React.FC<JourneysHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedMode,
  onSelectMode,
  selectedStatus,
  onSelectStatus,
  dateRange,
  onDateRangeChange,
  aiPromptText,
  onAiPromptChange,
  onSubmitAiCommand,
  isCompareMode,
  onToggleCompareMode,
  comparedJourneyIds,
}) => {
  const modes: { id: TransportMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Modes', icon: Layers },
    { id: 'sea', label: 'Sea', icon: Ship },
    { id: 'air', label: 'Air', icon: Plane },
    { id: 'road', label: 'Road', icon: Truck },
    { id: 'rail', label: 'Rail', icon: Train },
  ];

  const statuses: { id: JourneyStatus; label: string; color: string }[] = [
    { id: 'all', label: 'All Statuses', color: 'text-slate-300' },
    { id: 'active', label: 'Active', color: 'text-blue-400' },
    { id: 'delayed', label: 'Delayed', color: 'text-amber-400' },
    { id: 'critical', label: 'High Risk', color: 'text-rose-400' },
    { id: 'delivered', label: 'Delivered', color: 'text-emerald-400' },
  ];

  const handleAiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPromptText.trim()) {
      onSubmitAiCommand(aiPromptText.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Journeys
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">
              Live Fleet Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shipment telemetry, route health diagnostics, and automated AI journey optimization.
          </p>
        </div>

        {/* Compare Mode Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleCompareMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 shadow-xs ${
              isCompareMode
                ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/20 shadow-blue-950/40'
                : 'bg-[#111726] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare Mode</span>
            {comparedJourneyIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-white text-[10px] font-bold">
                {comparedJourneyIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Integrated AI Command Bar for Journeys */}
      <form
        onSubmit={handleAiFormSubmit}
        className="w-full bg-[#111726] border border-slate-800 focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl p-2 pl-3 flex items-center gap-2 transition-all shadow-md"
      >
        <div className="flex items-center gap-1.5 text-blue-400 shrink-0 border-r border-slate-800 pr-2.5">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[11px] font-mono-code font-semibold text-slate-400">
            JOURNEY AI
          </span>
        </div>

        <input
          type="text"
          value={aiPromptText}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Ask Journey AI: 'Find delayed sea shipments', 'Reroute Gotthard truck', 'Compare Shanghai vs Tokyo'..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        {aiPromptText && (
          <button
            type="button"
            onClick={() => onAiPromptChange('')}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={!aiPromptText.trim()}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
        >
          <span>Run</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Filter Toolbar: Search, Mode, Status, Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726]/80 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Shipment ID, carrier, port, container #..."
            className="w-full bg-[#090D16] border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Transport Mode Pills */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = selectedMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMode(m.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Dropdown / Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {statuses.map((s) => {
            const isActive = selectedStatus === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectStatus(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 border-slate-600 text-white font-semibold'
                    : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={s.color}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 bg-[#090D16] px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer text-xs font-medium text-slate-200"
          >
            <option value="today" className="bg-[#111726]">Today</option>
            <option value="7days" className="bg-[#111726]">Last 7 Days</option>
            <option value="30days" className="bg-[#111726]">This Month</option>
            <option value="all" className="bg-[#111726]">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
};
