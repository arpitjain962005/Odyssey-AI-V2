import React, { useState } from 'react';
import { RevenueHeader } from './RevenueHeader';
import { RevenueKpiCards } from './RevenueKpiCards';
import { FinancialChartHero } from './FinancialChartHero';
import { RevenueBreakdownCards } from './RevenueBreakdownCards';
import { CostBreakdownCards } from './CostBreakdownCards';
import { RegionalPerformanceMap } from './RegionalPerformanceMap';
import { CustomerLeaderboard } from './CustomerLeaderboard';
import { RevenueAiInsights } from './RevenueAiInsights';
import { RevenueOpportunities } from './RevenueOpportunities';
import { FinancialActivityFeed } from './FinancialActivityFeed';
import { RevenueMetricType, TimeFilterType, FinancialAiInsight } from '../../types/revenue';
import { CommandFilterState } from '../../types';

interface RevenueViewProps {
  commandState?: CommandFilterState | null;
}

export const RevenueView: React.FC<RevenueViewProps> = ({ commandState }) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<RevenueMetricType>('revenue');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('Year');
  const [filterCategory, setFilterCategory] = useState('all');
  const [aiPromptText, setAiPromptText] = useState('');
  const [activeFilterNotification, setActiveFilterNotification] = useState<string | null>(null);

  // Sync with commandState
  React.useEffect(() => {
    if (commandState) {
      if (commandState.targetSectionId === 'profit-kpis') {
        setSelectedMetric('profit');
      }
      if (commandState.targetSectionId) {
        setTimeout(() => {
          const el = document.getElementById(commandState.targetSectionId!);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [commandState]);

  // Handle AI Command Submission
  const handleSubmitAiCommand = (cmd: string) => {
    setActiveFilterNotification(`AI Financial Analysis executed: "${cmd}". Re-indexing yield matrices...`);
    setTimeout(() => {
      setActiveFilterNotification(null);
    }, 4000);
    setAiPromptText('');
  };

  // Handle Executed AI Directive
  const handleExecuteAiInsight = (insight: FinancialAiInsight) => {
    setActiveFilterNotification(`Executed directive: ${insight.title} (${insight.impactValue})`);
    setTimeout(() => {
      setActiveFilterNotification(null);
    }, 4000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen text-slate-100">
      {/* 1. Header */}
      <RevenueHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        aiPromptText={aiPromptText}
        onAiPromptChange={setAiPromptText}
        onSubmitAiCommand={handleSubmitAiCommand}
      />

      {/* Filter Notification Toast */}
      {activeFilterNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code flex items-center justify-between shadow-lg animate-fade-in">
          <span>{activeFilterNotification}</span>
          <button
            onClick={() => setActiveFilterNotification(null)}
            className="text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div id="profit-kpis">
        <RevenueKpiCards
          selectedMetric={selectedMetric}
          onSelectMetric={setSelectedMetric}
        />
      </div>

      {/* 3. Hero Section: Financial Chart */}
      <div id="revenue-chart">
        <FinancialChartHero
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
      </div>

      {/* 4 & 5: Revenue Breakdown and Cost Breakdown */}
      <div id="cost-breakdown" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdownCards
          onFilterByDistribution={(item) => {
            setActiveFilterNotification(`Filtered workspace by distribution: ${item.name} (${item.percentage}%)`);
            setTimeout(() => setActiveFilterNotification(null), 3500);
          }}
        />
        <CostBreakdownCards
          onSelectCategory={(item) => {
            setActiveFilterNotification(`Inspecting cost category: ${item.category} ($${item.amount}M)`);
            setTimeout(() => setActiveFilterNotification(null), 3500);
          }}
        />
      </div>

      {/* 6. Regional Performance World Map */}
      <RegionalPerformanceMap
        onSelectRegion={(reg) => {
          setActiveFilterNotification(`Focused region: ${reg.region} (${reg.revenue} Revenue, ${reg.margin} Margin)`);
          setTimeout(() => setActiveFilterNotification(null), 3500);
        }}
      />

      {/* 7. Customer Performance Leaderboard */}
      <div id="top-customers">
        <CustomerLeaderboard
          onSelectCustomer={(cust) => {
            setActiveFilterNotification(`Selected Customer: ${cust.name} (${cust.revenue}, Margin ${cust.profitMargin})`);
            setTimeout(() => setActiveFilterNotification(null), 3500);
          }}
        />
      </div>

      {/* 8. AI Insights */}
      <RevenueAiInsights onExecuteAction={handleExecuteAiInsight} />

      {/* 9 & 10: Opportunities & Financial Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueOpportunities
            onSelectOpportunity={(opp) => {
              setActiveFilterNotification(`Viewing Opportunity: ${opp.title} (${opp.potentialValue})`);
              setTimeout(() => setActiveFilterNotification(null), 3500);
            }}
          />
        </div>
        <div className="lg:col-span-4">
          <FinancialActivityFeed />
        </div>
      </div>
    </div>
  );
};
