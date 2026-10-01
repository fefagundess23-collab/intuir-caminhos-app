import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Sparkles } from 'lucide-react';

interface TopAppBarProps {
  completedCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ completedCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#EDE7DC]/80 px-4 py-3 flex items-center justify-between">
      {/* Brand title - single wordmark element */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#BA6640]" />
        <span className="text-xs uppercase tracking-[0.2em] text-[#20362E] font-semibold">
          Intuir Caminhos
        </span>
      </div>

      {/* Right primary actions */}
      <div className="flex items-center gap-2.5">
        {completedCount > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#6E685F] bg-[#EDE7DC]/50 px-2.5 py-1 rounded-full border border-[#DDD4C4]/60">
            <Sparkles className="w-3 h-3 text-[#BA6640]" />
            <span>{completedCount} feitas</span>
          </div>
        )}
        <PWAInstallButton />
      </div>
    </header>
  );
};
