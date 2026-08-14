import React from 'react';
import {
  LayoutDashboard,
  Navigation,
  TrendingUp,
  TrendingDown,
  Network,
  DollarSign,
  Target,
  FileText,
  Settings,
  X,
  Compass,
  Bot
} from 'lucide-react';
import { NavItem, UserProfile } from '../types';

interface SidebarProps {
  navItems: NavItem[];
  activeNavId: string;
  onSelectNav: (id: string) => void;
  currentUser: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeNavId,
  onSelectNav,
  currentUser,
  isOpenMobile,
  onCloseMobile,
}) => {
  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconProps = {
      className: `w-4 h-4 transition-colors ${
        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
      }`,
    };

    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard {...iconProps} />;
      case 'Navigation': return <Navigation {...iconProps} />;
      case 'TrendingUp': return <TrendingUp {...iconProps} />;
      case 'TrendingDown': return <TrendingDown {...iconProps} />;
      case 'Network': return <Network {...iconProps} />;
      case 'DollarSign': return <DollarSign {...iconProps} />;
      case 'Target': return <Target {...iconProps} />;
      case 'FileText': return <FileText {...iconProps} />;
      case 'Bot': return <Bot {...iconProps} />;
      case 'Settings': return <Settings {...iconProps} />;
      default: return <LayoutDashboard {...iconProps} />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white font-sans">
                  Odyssey AI
                </span>
                <span className="text-[11px] text-slate-500">
                  Supply Chain Intelligence
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const isActive = item.id === activeNavId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectNav(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-3 group ${
                    isActive
                      ? 'bg-blue-600/10 text-white font-semibold border border-blue-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {renderIcon(item.iconName, isActive)}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080C14]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-semibold text-slate-200">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
