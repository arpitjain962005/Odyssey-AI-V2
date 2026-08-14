import React, { useState } from 'react';
import { Search, Bell, Menu, X, Check } from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';

interface TopNavProps {
  currentUser: UserProfile;
  notifications: NotificationItem[];
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onMarkNotificationsRead: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentUser,
  notifications,
  onOpenMobileSidebar,
  onOpenSearch,
  onMarkNotificationsRead,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-[#0B0F19] border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Menu Trigger & Search Bar Input */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Minimal Search Button/Input */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#111726] border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors w-full max-w-md"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate">Search nodes, journeys, or reports...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono-code bg-slate-800/80 rounded border border-slate-700/60 text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg bg-[#111726] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {/* Minimal Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111726] border border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden divide-y divide-slate-800/80">
              <div className="px-4 py-3 flex items-center justify-between bg-[#0E1320]">
                <span className="text-xs font-semibold text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkNotificationsRead();
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark read</span>
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 text-xs space-y-1 transition-colors ${
                        item.unread ? 'bg-blue-600/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-semibold text-slate-200">
            {currentUser.name.split(' ').map((n) => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
};
