import React from 'react';
import { Home, Calendar, Compass, Layers } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavigationProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'inicio' as AppTab, label: 'Início', icon: Home },
    { id: 'percurso' as AppTab, label: '21 Dias', icon: Calendar },
    { id: 'preciso_agora' as AppTab, label: 'Preciso Agora', icon: Compass },
    { id: 'praticas' as AppTab, label: 'Práticas', icon: Layers },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-t border-[#EDE7DC] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer select-none ${
                isActive
                  ? 'text-[#20362E]'
                  : 'text-[#8C857B] hover:text-[#5A544C]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#BA6640]" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-semibold text-[#20362E]' : 'font-medium'
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
