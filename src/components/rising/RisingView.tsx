import React, { useState } from 'react';
import { RisingHeader } from './RisingHeader';
import { OpportunityBoardHero } from './OpportunityBoardHero';
import { GrowthSignalsSection } from './GrowthSignalsSection';
import { OpportunityHeatMap } from './OpportunityHeatMap';
import { TopPerformingRoutesLeaderboard } from './TopPerformingRoutesLeaderboard';
import { TopCustomersSection } from './TopCustomersSection';
import { CargoPerformanceSection } from './CargoPerformanceSection';
import { ExternalSignalsSection } from './ExternalSignalsSection';
import { AiOpportunityRecommendations } from './AiOpportunityRecommendations';
import { RouteComparisonTool } from './RouteComparisonTool';

import {
  MOCK_OPPORTUNITY_CORRIDORS,
  MOCK_GROWTH_SIGNALS,
  MOCK_OPPORTUNITY_REGIONS,
  MOCK_TOP_PERFORMING_ROUTES,
  MOCK_TOP_CUSTOMERS,
  MOCK_CARGO_PERFORMANCE,
  MOCK_EXTERNAL_SIGNALS,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_ROUTE_COMPARISON,
} from '../../data/mockRisingData';

import { TimeFilterType, OpportunityCorridorItem, OpportunityRegionItem, TopRouteItem } from '../../types/rising';
import { CommandFilterState } from '../../types';

interface RisingViewProps {
  onNavigateToView?: (viewId: string) => void;
  commandState?: CommandFilterState | null;
}

export const RisingView: React.FC<RisingViewProps> = ({ onNavigateToView, commandState }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('30D');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [aiPromptText, setAiPromptText] = useState<string>('');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(
    MOCK_OPPORTUNITY_CORRIDORS[0].id
  );
  const [selectedRegionId, setSelectedRegionId] = useState<string>(
    MOCK_OPPORTUNITY_REGIONS[0].id
  );

  // Sync with commandState
  React.useEffect(() => {
    if (commandState?.targetSectionId) {
      setTimeout(() => {
        const el = document.getElementById(commandState.targetSectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [commandState]);

  const handleAiCommandSubmit = (cmd: string) => {
    // Process AI Command search filter or highlight trigger
    setSearchQuery(cmd);
  };

  // Filter corridors based on search
  const filteredCorridors = MOCK_OPPORTUNITY_CORRIDORS.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.origin.toLowerCase().includes(q) ||
      c.destination.toLowerCase().includes(q) ||
      c.routeCode.toLowerCase().includes(q) ||
      c.aiSummary.toLowerCase().includes(q)
    );
  });

  // Filter growth signals based on search and category
  const filteredGrowthSignals = MOCK_GROWTH_SIGNALS.filter((s) => {
    if (filterCategory !== 'all' && s.category !== filterCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#090D16] min-h-screen max-w-7xl mx-auto w-full pb-32">
      {/* 1. Page Header with AI Command Bar */}
      <RisingHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        aiPromptText={aiPromptText}
        onAiPromptChange={setAiPromptText}
        onSubmitAiCommand={handleAiCommandSubmit}
        onNavigateToView={onNavigateToView}
      />

      {/* 2. Hero Section: Opportunity Board */}
      <div id="opportunity-board">
        <OpportunityBoardHero
          corridors={filteredCorridors}
          selectedCorridorId={selectedCorridorId}
          onSelectCorridor={(c) => setSelectedCorridorId(c.id)}
          onNavigateToView={onNavigateToView}
        />
      </div>

      {/* 3. Growth Signals & Momentum Drivers */}
      <div id="growth-signals">
        <GrowthSignalsSection
          signals={filteredGrowthSignals}
          filterCategory={filterCategory}
          onNavigateToView={onNavigateToView}
        />
      </div>

      {/* 4. Opportunity Heat Map */}
      <div id="opportunity-map">
        <OpportunityHeatMap
          regions={MOCK_OPPORTUNITY_REGIONS}
          selectedRegionId={selectedRegionId}
          onSelectRegion={(r) => setSelectedRegionId(r.id)}
          onNavigateToView={onNavigateToView}
        />
      </div>

      {/* 5. Top Performing Trade Routes Leaderboard */}
      <div id="top-routes">
        <TopPerformingRoutesLeaderboard
          routes={MOCK_TOP_PERFORMING_ROUTES}
          onNavigateToView={onNavigateToView}
        />
      </div>

      {/* 6. Top Customers & Accounts */}
      <div id="top-customers">
        <TopCustomersSection customers={MOCK_TOP_CUSTOMERS} />
      </div>

      {/* 7. Cargo Category Performance */}
      <div id="cargo-performance">
        <CargoPerformanceSection cargoList={MOCK_CARGO_PERFORMANCE} />
      </div>

      {/* 8. External Macro Signals */}
      <ExternalSignalsSection signals={MOCK_EXTERNAL_SIGNALS} />

      {/* 9. AI Executive Opportunity Recommendations */}
      <AiOpportunityRecommendations recommendations={MOCK_AI_RECOMMENDATIONS} />

      {/* 10. Route Comparison Tool */}
      <div id="route-comparison">
        <RouteComparisonTool
          comparisonData={MOCK_ROUTE_COMPARISON}
          availableRoutes={MOCK_TOP_PERFORMING_ROUTES}
          onNavigateToView={onNavigateToView}
        />
      </div>
    </div>
  );
};
