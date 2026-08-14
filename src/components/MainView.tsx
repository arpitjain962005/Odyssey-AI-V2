import React from 'react';
import { CommandCenterHeader } from './CommandCenterHeader';
import { OperationalOverview } from './OperationalOverview';
import { PrimaryWorkspace } from './PrimaryWorkspace';
import { ExecutiveAttentionPanel } from './ExecutiveAttentionPanel';
import { QuickActions } from './QuickActions';
import { JourneysView } from './journeys/JourneysView';
import { RevenueView } from './revenue/RevenueView';
import { RisingView } from './rising/RisingView';
import { FallingView } from './falling/FallingView';
import { NetworkView } from './network/NetworkView';
import { TargetsView } from './targets/TargetsView';
import { ReportsView } from './reports/ReportsView';
import { SmartStaffView } from './smartstaff/SmartStaffView';
import { SettingsView } from './settings/SettingsView';
import {
  OPERATIONAL_STATUS_CARDS,
  SUPPLY_NODES,
  SUPPLY_ROUTES,
  EXECUTIVE_ATTENTION_ITEMS,
} from '../data/mockData';
import { CommandFilterState, ExecutiveAttentionItem } from '../types';

interface MainViewProps {
  activeNavId: string;
  onNavigateToView: (viewId: string) => void;
  commandState?: CommandFilterState | null;
  onSelectExecutiveEvent?: (item: ExecutiveAttentionItem) => void;
}

export const MainView: React.FC<MainViewProps> = ({
  activeNavId,
  onNavigateToView,
  commandState,
  onSelectExecutiveEvent,
}) => {
  // 1. Dashboard (Command Center Workspace)
  if (activeNavId === 'dashboard') {
    return (
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-32 space-y-8 bg-[#090D16] max-w-7xl mx-auto w-full">
        {/* SECTION 1: Header */}
        <CommandCenterHeader
          title="Command Center"
          subtitle="Real-time overview of your global supply chain."
        />

        {/* SECTION 2: Operational Overview (5 status cards) */}
        <OperationalOverview
          cards={OPERATIONAL_STATUS_CARDS}
          highlightedCardId={commandState?.highlightedCardId}
        />

        {/* SECTION 3: Primary Workspace & Executive Attention Panel Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 xl:col-span-8">
            <PrimaryWorkspace
              nodes={SUPPLY_NODES}
              routes={SUPPLY_ROUTES}
              onNavigateToView={onNavigateToView}
              commandFilterRegion={commandState?.regionFilter}
              commandFilterStatus={commandState?.statusFilter}
              highlightedNodeIds={commandState?.highlightedNodeIds}
              highlightedRouteIds={commandState?.highlightedRouteIds}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <ExecutiveAttentionPanel
              items={EXECUTIVE_ATTENTION_ITEMS}
              activeEventId={commandState?.activeEventId}
              onSelectEvent={(item) => {
                if (onSelectExecutiveEvent) {
                  onSelectExecutiveEvent(item);
                }
              }}
            />
          </div>
        </div>

        {/* SECTION 4: Quick Actions */}
        <QuickActions onSelectAction={onNavigateToView} />
      </main>
    );
  }

  // 2. Dedicated Journeys Page
  if (activeNavId === 'journeys') {
    return (
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#090D16] max-w-7xl mx-auto w-full">
        <JourneysView commandState={commandState} />
      </main>
    );
  }

  // 3. Dedicated Rising (Opportunity Intelligence) Page
  if (activeNavId === 'rising') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <RisingView onNavigateToView={onNavigateToView} commandState={commandState} />
      </main>
    );
  }

  // 4. Dedicated Falling & Risk Page
  if (activeNavId === 'falling') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <FallingView onNavigateToView={onNavigateToView} commandState={commandState} />
      </main>
    );
  }

  // 5. Dedicated Network Topology Page
  if (activeNavId === 'network') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <NetworkView onNavigateToView={onNavigateToView} />
      </main>
    );
  }

  // 6. Dedicated Revenue Page
  if (activeNavId === 'revenue') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <RevenueView commandState={commandState} />
      </main>
    );
  }

  // 7. Dedicated Targets & SLA Tracking Page
  if (activeNavId === 'targets') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <TargetsView onNavigateToView={onNavigateToView} />
      </main>
    );
  }

  // 8. Dedicated Reports & Briefings Page
  if (activeNavId === 'reports') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <ReportsView onNavigateToView={onNavigateToView} />
      </main>
    );
  }

  // 9. Dedicated Smart Staff (Autonomous AI Workforce) Page
  if (activeNavId === 'smart-staff') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <SmartStaffView onNavigateToView={onNavigateToView} />
      </main>
    );
  }

  // 10. Dedicated Settings Page
  if (activeNavId === 'settings') {
    return (
      <main className="flex-1 overflow-y-auto bg-[#090D16] w-full">
        <SettingsView />
      </main>
    );
  }

  // Fallback default
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#090D16] max-w-7xl mx-auto w-full">
      <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 text-center text-slate-400">
        Select a navigation item from the sidebar to view workspace intelligence.
      </div>
    </main>
  );
};
