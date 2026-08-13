import React from 'react';
import { LayoutDashboard, FilePlus2, Eye } from 'lucide-react';

export type TabType = 'dashboard' | 'builder' | 'preview';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasPreviewDoc: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasPreviewDoc,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'builder' as TabType,
      label: 'New Doc',
      icon: FilePlus2,
    },
    {
      id: 'preview' as TabType,
      label: 'Preview',
      icon: Eye,
      badge: hasPreviewDoc,
    },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center min-w-[72px] py-1 transition-all group cursor-pointer"
            >
              {/* Active Pill Indicator */}
              <div
                className={`relative flex items-center justify-center px-5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-600' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse border-2 border-white" />
                )}
              </div>
              <span
                className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
