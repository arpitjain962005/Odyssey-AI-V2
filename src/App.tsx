import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MainView } from './components/MainView';
import { SearchModal } from './components/SearchModal';
import { CommandBar } from './components/CommandBar';
import { matchIntent } from './utils/intentMatcher';
import { IntentMatchResult } from './types/intent';
import {
  NAVIGATION_ITEMS,
  CURRENT_USER,
  NOTIFICATIONS_MOCK,
} from './data/mockData';
import { NotificationItem, CommandFilterState, ExecutiveAttentionItem } from './types';

export default function App() {
  const [activeNavId, setActiveNavId] = useState<string>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_MOCK);
  const [commandState, setCommandState] = useState<CommandFilterState | null>(null);

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSelectExecutiveEvent = (item: ExecutiveAttentionItem) => {
    if (activeNavId !== 'dashboard') {
      setActiveNavId('dashboard');
    }
    setCommandState({
      activeEventId: item.id,
      activeCommandText: item.title,
      activeExplanation: `Live event inspection: ${item.title}. ${item.explanation}`,
      regionFilter: item.regionFilter,
      statusFilter: item.statusFilter,
      highlightedCardId: item.highlightedCardId,
      highlightedNodeIds: item.highlightedNodeIds,
      highlightedRouteIds: item.highlightedRouteIds,
    });
  };

  const handleExecuteCommand = (cmdText: string, providedResult?: IntentMatchResult) => {
    const result = providedResult || matchIntent(cmdText, activeNavId);

    if (!result.matched) {
      setCommandState({
        activeCommandText: cmdText,
        activeExplanation: "I couldn't recognize that yet.",
      });
      return;
    }

    const { intent, action } = result;

    // Navigate to target view if defined and different from current
    if (action?.navId && action.navId !== activeNavId) {
      setActiveNavId(action.navId);
    }

    // Set full commandState
    setCommandState({
      activeCommandText: cmdText,
      activeExplanation: result.responseMessage,
      statusFilter: action?.filters?.status || null,
      regionFilter: action?.filters?.region || null,
      targetSectionId: action?.sectionId || null,
      selectedShipmentId: action?.shipmentId || null,
      isCompareMode: action?.type === 'compare',
      highlightedCardId:
        action?.navId === 'revenue' || intent?.id === 'profit'
          ? 'revenue'
          : action?.filters?.status === 'delayed'
          ? 'shipments'
          : intent?.id === 'major_risks' || intent?.id === 'attention'
          ? 'risk'
          : null,
      highlightedNodeIds:
        intent?.id === 'profitable_routes'
          ? ['node-shanghai', 'node-rotterdam', 'node-la']
          : intent?.id === 'declining_routes'
          ? ['node-rotterdam']
          : undefined,
    });

    // Smooth scroll to section if specified
    if (action?.sectionId) {
      setTimeout(() => {
        const el = document.getElementById(action.sectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  };

  const handleClearCommand = () => {
    setCommandState(null);
  };

  return (
    <div className="flex h-screen w-screen bg-[#090D16] text-slate-100 overflow-hidden font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Sidebar Navigation (Exact 9 pages) */}
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        activeNavId={activeNavId}
        onSelectNav={setActiveNavId}
        currentUser={CURRENT_USER}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative">
        {/* Minimal Top Bar */}
        <TopNav
          currentUser={CURRENT_USER}
          notifications={notifications}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onMarkNotificationsRead={handleMarkNotificationsRead}
        />

        {/* Workspace Views */}
        <MainView
          activeNavId={activeNavId}
          onNavigateToView={setActiveNavId}
          commandState={commandState}
          onSelectExecutiveEvent={handleSelectExecutiveEvent}
        />

        {/* Floating Odyssey AI Command Bar (Permanent, Docked at bottom) */}
        <CommandBar
          currentPage={activeNavId}
          onExecuteCommand={handleExecuteCommand}
          onClearCommand={handleClearCommand}
          activeCommand={commandState?.activeCommandText || null}
          activeExplanation={commandState?.activeExplanation || null}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navItems={NAVIGATION_ITEMS}
        onSelectNav={setActiveNavId}
      />
    </div>
  );
}
