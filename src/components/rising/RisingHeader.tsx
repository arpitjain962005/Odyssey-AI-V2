import React from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  X,
  ArrowRight,
  Filter,
  Zap,
} from 'lucide-react';
import { TimeFilterType } from '../../types/rising';

interface RisingHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeFilter: TimeFilterType;
  onTimeFilterChange: (t: TimeFilterType) => void;
  filterCategory: string;
  onFilterCategoryChange: (cat: string) => void;
  aiPromptText: string;
  onAiPromptChange: (text: string) => void;
  onSubmitAiCommand: (cmdText: string) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const RisingHeader: React.FC<RisingHeaderProps> = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  filterCategory,
  onFilterCategoryChange,
  aiPromptText,
  onAiPromptChange,
  onSubmitAiCommand,
  onNavigateToView,
}) => {
  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'cargo', label: 'High-Demand Cargo' },
    { id: 'tradelane', label: 'High-Margin Trade Lanes' },
    { id: 'region', label: 'Fast-Growing Regions' },
    { id: 'customer', label: 'Top Accounts' },
    { id: 'market', label: 'Expanding Markets' },
  ];

  const suggestedPromptChips = [
    'High yield trade lanes',
    'Expand Vietnam hub',
    'Top semiconductor accounts',
    'Bypass Suez corridor',
  ];

  const handleAiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPromptText.trim()) {
      onSubmitAiCommand(aiPromptText.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Rising
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Opportunity Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-driven decision-support workspace: identify accelerating trade corridors, high-margin freight, and strategic investment targets.
          </p>
        </div>

        {/* View in Falling Connected Link */}
        {onNavigateToView && (
          <button
            onClick={() => onNavigateToView('falling')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/30 text-xs text-slate-300 hover:text-rose-400 transition-all shadow-xs group shrink-0"
          >
            <span className="font-medium">View Decelerating Signals in Falling</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Layer 1: AI Command Bar with Integrated Status Indicator */}
      <form
        onSubmit={handleAiFormSubmit}
        className="w-full bg-[#111726] border border-slate-800 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl p-2 pl-3 flex flex-col sm:flex-row sm:items-center gap-2 transition-all shadow-md"
      >
        <div className="flex items-center gap-2 text-emerald-400 shrink-0 border-r border-slate-800 pr-2.5">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[11px] font-mono-code font-bold tracking-wider text-emerald-400">
            OPPORTUNITY AI
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-400 font-mono-code border border-emerald-500/20 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Ready • Opportunity AI Active
          </span>
        </div>

        <input
          type="text"
          value={aiPromptText}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Ask Opportunity AI: 'Which corridors have >30% margin?', 'Where should we allocate capital?', 'Top semiconductor lanes'..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none py-1"
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
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Analyze</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Layer 2: Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
        <span className="text-[11px] text-slate-500 font-mono-code shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" /> Quick Prompts:
        </span>
        {suggestedPromptChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              onAiPromptChange(chip);
              onSubmitAiCommand(chip);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#111726] hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 text-xs font-medium transition-all shrink-0 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Toolbar: Search, Category Filters, Time Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726]/80 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search corridors, cargo, customers, regions..."
            className="w-full bg-[#090D16] border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none"
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterCategoryChange(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800">
          {(['7D', '30D', 'Quarter', 'Year'] as TimeFilterType[]).map((tf) => {
            const isActive = timeFilter === tf;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => onTimeFilterChange(tf)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
