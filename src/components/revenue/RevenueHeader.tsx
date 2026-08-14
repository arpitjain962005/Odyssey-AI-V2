import React from 'react';
import {
  Search,
  Sparkles,
  DollarSign,
  TrendingUp,
  X,
  ArrowRight,
  Filter,
  Calendar,
} from 'lucide-react';
import { TimeFilterType } from '../../types/revenue';

interface RevenueHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  timeFilter: TimeFilterType;
  onTimeFilterChange: (t: TimeFilterType) => void;
  filterCategory: string;
  onFilterCategoryChange: (cat: string) => void;
  aiPromptText: string;
  onAiPromptChange: (text: string) => void;
  onSubmitAiCommand: (cmdText: string) => void;
}

export const RevenueHeader: React.FC<RevenueHeaderProps> = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  filterCategory,
  onFilterCategoryChange,
  aiPromptText,
  onAiPromptChange,
  onSubmitAiCommand,
}) => {
  const categories = [
    { id: 'all', label: 'All Operations' },
    { id: 'high_margin', label: 'High Margin (>30%)' },
    { id: 'high_growth', label: 'Fast Growth (>20%)' },
    { id: 'cost_savings', label: 'Cost Savings Targeted' },
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
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Revenue & Financial Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
              Q3 Real-Time P&L
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Executive financial control center: yield management, cost breakdown, customer margins, and AI revenue optimization.
          </p>
        </div>

        {/* Currency & Live Benchmark Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-[#111726] border border-slate-800 text-xs text-slate-300 flex items-center gap-2 shadow-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium font-mono-code">USD ($) Enterprise Reporting</span>
          </div>
        </div>
      </div>

      {/* Integrated AI Financial Copilot Command Bar */}
      <form
        onSubmit={handleAiFormSubmit}
        className="w-full bg-[#111726] border border-slate-800 focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl p-2 pl-3 flex items-center gap-2 transition-all shadow-md"
      >
        <div className="flex items-center gap-1.5 text-emerald-400 shrink-0 border-r border-slate-800 pr-2.5">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[11px] font-mono-code font-semibold text-slate-400">
            FINANCIAL AI
          </span>
        </div>

        <input
          type="text"
          value={aiPromptText}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="Ask Financial AI: 'How to cut fuel cost by 5%?', 'Top grossing region', 'Tesla margin review'..."
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
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
        >
          <span>Analyze</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Toolbar: Search, Category Filters, Time Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726]/80 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customer, cost category, region, contract..."
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
                    ? 'bg-blue-600 text-white font-bold'
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
