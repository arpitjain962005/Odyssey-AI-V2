import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_JOURNEYS, MOCK_JOURNEY_FEED } from '../../data/mockJourneys';
import { TransportMode, JourneyStatus, JourneyItem } from '../../types/journey';
import { CommandFilterState } from '../../types';
import { JourneysHeader } from './JourneysHeader';
import { JourneysKpiCards } from './JourneysKpiCards';
import { InteractiveJourneysMap } from './InteractiveJourneysMap';
import { JourneyTimelinePanel } from './JourneyTimelinePanel';
import { JourneyDetailsPanel } from './JourneyDetailsPanel';
import { JourneyAiInsightsPanel } from './JourneyAiInsightsPanel';
import { RecentActivityFeed } from './RecentActivityFeed';
import { JourneyComparePanel } from './JourneyComparePanel';
import { fetchJourneys, executeJourneyAction } from '../../services/api';

interface JourneysViewProps {
  commandState?: CommandFilterState | null;
}

export const JourneysView: React.FC<JourneysViewProps> = ({ commandState }) => {
  const [journeysList, setJourneysList] = useState<JourneyItem[]>(MOCK_JOURNEYS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<TransportMode>('all');
  const [selectedStatus, setSelectedStatus] = useState<JourneyStatus>('all');
  const [dateRange, setDateRange] = useState<string>('today');
  const [aiPromptText, setAiPromptText] = useState<string>('');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('ODY-9842-SEA');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [comparedJourneyIds, setComparedJourneyIds] = useState<string[]>(['ODY-9842-SEA', 'ODY-5298-SEA']);

  // Sync with commandState if provided by Odyssey Command Bar
  useEffect(() => {
    if (commandState) {
      if (commandState.statusFilter && ['active', 'delayed', 'critical', 'delivered', 'all'].includes(commandState.statusFilter)) {
        setSelectedStatus(commandState.statusFilter as JourneyStatus);
      }
      if (commandState.selectedShipmentId) {
        setSelectedJourneyId(commandState.selectedShipmentId);
      }
      if (commandState.isCompareMode !== undefined) {
        setIsCompareMode(commandState.isCompareMode);
      }
    }
  }, [commandState]);

  // Fetch real journeys from SQLite API
  useEffect(() => {
    fetchJourneys({ mode: selectedMode, status: selectedStatus, search: searchQuery })
      .then((data) => {
        if (data && data.journeys && data.journeys.length > 0) {
          setJourneysList(data.journeys);
        }
      })
      .catch((err) => {
        console.warn('API fetch fallback to local cache:', err);
      });
  }, [selectedMode, selectedStatus, searchQuery]);

  // Calculate KPI counts
  const activeCount = journeysList.filter((j) => j.status === 'active').length;
  const delayedCount = journeysList.filter((j) => j.status === 'delayed').length;
  const deliveredCount = journeysList.filter((j) => j.status === 'delivered').length;
  const criticalCount = journeysList.filter((j) => j.status === 'critical').length;

  // Filter journeys based on search query, mode, and status
  const filteredJourneys = useMemo(() => {
    return journeysList.filter((j) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = j.id.toLowerCase().includes(q);
        const matchesTitle = j.title.toLowerCase().includes(q);
        const matchesCarrier = j.carrier.toLowerCase().includes(q);
        const matchesOrigin = j.origin.toLowerCase().includes(q);
        const matchesDest = j.destination.toLowerCase().includes(q);
        const matchesContainers = j.containerNumbers?.some((c) => c.toLowerCase().includes(q)) || false;

        if (!matchesId && !matchesTitle && !matchesCarrier && !matchesOrigin && !matchesDest && !matchesContainers) {
          return false;
        }
      }

      // Mode filter
      if (selectedMode !== 'all' && j.mode !== selectedMode) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && j.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [journeysList, searchQuery, selectedMode, selectedStatus]);

  // Active inspected journey
  const inspectedJourney =
    filteredJourneys.find((j) => j.id === selectedJourneyId) ||
    filteredJourneys[0] ||
    journeysList[0];

  // Compared journeys
  const comparedJourneys = useMemo(() => {
    return journeysList.filter((j) => comparedJourneyIds.includes(j.id));
  }, [journeysList, comparedJourneyIds]);

  // AI Command Handler
  const handleAiCommandSubmit = (cmdText: string) => {
    const lower = cmdText.toLowerCase();

    if (lower.includes('delayed') || lower.includes('delay')) {
      setSelectedStatus('delayed');
      const delayedItem = journeysList.find((j) => j.status === 'delayed');
      if (delayedItem) setSelectedJourneyId(delayedItem.id);
    } else if (lower.includes('sea') || lower.includes('ocean')) {
      setSelectedMode('sea');
    } else if (lower.includes('air') || lower.includes('flight')) {
      setSelectedMode('air');
    } else if (lower.includes('road') || lower.includes('truck')) {
      setSelectedMode('road');
    } else if (lower.includes('rail') || lower.includes('train')) {
      setSelectedMode('rail');
    } else if (lower.includes('critical') || lower.includes('risk')) {
      setSelectedStatus('critical');
      const crit = journeysList.find((j) => j.status === 'critical');
      if (crit) setSelectedJourneyId(crit.id);
    } else if (lower.includes('compare')) {
      setIsCompareMode(true);
      setComparedJourneyIds(['ODY-9842-SEA', 'ODY-5298-SEA']);
    } else {
      // Find matching item by ID or keyword
      const match = journeysList.find(
        (j) => j.id.toLowerCase().includes(lower) || j.title.toLowerCase().includes(lower)
      );
      if (match) setSelectedJourneyId(match.id);
    }

    setAiPromptText('');
  };

  const handleToggleCompareJourney = (id: string) => {
    setComparedJourneyIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Section */}
      <JourneysHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        aiPromptText={aiPromptText}
        onAiPromptChange={setAiPromptText}
        onSubmitAiCommand={handleAiCommandSubmit}
        isCompareMode={isCompareMode}
        onToggleCompareMode={() => setIsCompareMode((prev) => !prev)}
        comparedJourneyIds={comparedJourneyIds}
      />

      {/* 2. Journey KPI Cards */}
      <JourneysKpiCards
        activeCount={activeCount}
        delayedCount={delayedCount}
        deliveredCount={deliveredCount}
        criticalCount={criticalCount}
        selectedStatus={selectedStatus}
        onSelectStatusFilter={setSelectedStatus}
      />

      {/* 3. Hero Section: Large Interactive World Map */}
      <InteractiveJourneysMap
        journeys={filteredJourneys.length > 0 ? filteredJourneys : MOCK_JOURNEYS}
        selectedJourneyId={inspectedJourney.id}
        onSelectJourney={(id) => setSelectedJourneyId(id)}
        isCompareMode={isCompareMode}
        comparedJourneyIds={comparedJourneyIds}
        onToggleCompareJourney={handleToggleCompareJourney}
      />

      {/* Side-by-Side Journey Comparison Matrix (Visible when Compare Mode is active) */}
      {isCompareMode && (
        <JourneyComparePanel
          comparedJourneys={comparedJourneys}
          onRemoveJourney={(id) => setComparedJourneyIds((prev) => prev.filter((i) => i !== id))}
          onClearCompare={() => setIsCompareMode(false)}
        />
      )}

      {/* 4. Bottom Section: Timeline, Details, and AI Insights (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Journey Timeline */}
        <div className="lg:col-span-4">
          <JourneyTimelinePanel journey={inspectedJourney} />
        </div>

        {/* Center Column: Journey Details */}
        <div className="lg:col-span-4">
          <JourneyDetailsPanel journey={inspectedJourney} />
        </div>

        {/* Right Column: AI Insights & Copilot */}
        <div className="lg:col-span-4">
          <JourneyAiInsightsPanel journey={inspectedJourney} />
        </div>
      </div>

      {/* 5. Bottom Feed: Recent Operational Activity */}
      <RecentActivityFeed
        feedItems={MOCK_JOURNEY_FEED}
        onSelectJourneyById={(id) => {
          setSelectedJourneyId(id);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
