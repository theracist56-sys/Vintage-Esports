import React from 'react';
import { TournamentConfig } from '../types/tournament';
import { VintageEsportsLogo } from './VintageEsportsLogo';
import { 
  Trophy, 
  Sparkles, 
  PlusCircle, 
  Users, 
  Crown, 
  Flame, 
  Layers, 
  SlidersHorizontal,
  Camera,
  Zap,
  Smartphone
} from 'lucide-react';

export type AppTab = 'standings' | 'mvp' | 'slots' | 'graphics' | 'rules';

interface HeaderProps {
  tournament: TournamentConfig;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenMatchEntry: () => void;
  onOpenScreenshotScanner: () => void;
  onOpenGraphicStudio: () => void;
  onOpenInstallApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tournament,
  activeTab,
  onSelectTab,
  onOpenMatchEntry,
  onOpenScreenshotScanner,
  onOpenGraphicStudio,
  onOpenInstallApp,
}) => {
  return (
    <header className="bg-[#090704] border-b border-amber-500/25 sticky top-0 z-40 backdrop-blur-xl shadow-lg shadow-black/80">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Official Vintage Esports Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onSelectTab('standings')}>
            <VintageEsportsLogo size={44} showGlow={true} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 leading-none">
                VINTAGE ESPORTS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                STUDIO PRO
              </span>
            </div>
            <p className="text-xs text-amber-200/60 truncate max-w-md font-rajdhani mt-0.5">
              {tournament?.name || 'Vintage Esports'} • {tournament?.season || 'Season 1'} • {(tournament?.matches || []).length} Matches Logged
            </p>
          </div>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Auto Screenshot Scanner */}
          <button
            onClick={onOpenScreenshotScanner}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-950 to-[#1e1507] hover:from-amber-900 hover:to-[#2a1d0a] text-amber-200 border border-amber-500/50 text-xs font-bold font-rajdhani tracking-wide flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md shadow-black"
            title="Upload Free Fire scoreboard screenshot to auto-generate points table"
          >
            <Camera className="w-4 h-4 text-yellow-400" />
            <span>SCAN SCREENSHOT</span>
          </button>

          {/* Record Match Manually */}
          <button
            onClick={onOpenMatchEntry}
            className="px-3.5 py-1.5 rounded-lg bg-[#14110b] hover:bg-[#1f1a10] text-zinc-200 border border-amber-500/30 text-xs font-bold font-rajdhani tracking-wide flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>ENTER RESULTS</span>
          </button>

          {/* Golden Generate Poster */}
          <button
            onClick={onOpenGraphicStudio}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-extrabold font-rajdhani tracking-wider shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer transition active:scale-95 uppercase"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>GENERATE POSTER</span>
          </button>

          {/* Install Mobile / PWA App */}
          <button
            onClick={onOpenInstallApp}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold font-rajdhani tracking-wide flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Install Vintage Esports Studio as an app on your phone or tablet"
          >
            <Smartphone className="w-4 h-4 text-yellow-400" />
            <span>INSTALL APP</span>
          </button>
        </div>
      </div>

      {/* Main Studio Streamlined Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
        <nav className="flex items-center gap-1 border-t border-amber-500/15 pt-1 pb-1 text-xs">
          {[
            { id: 'standings' as const, label: 'POINTS TABLE', icon: Trophy, badge: 'AUTO' },
            { id: 'mvp' as const, label: 'MVP & TOP PREDATORS', icon: Crown, badge: 'FRAGGERS' },
            { id: 'slots' as const, label: 'TEAM SLOTS (12/18)', icon: Users },
            { id: 'graphics' as const, label: 'GRAPHICS STUDIO', icon: Sparkles, badge: '20 THEMES' },
            { id: 'rules' as const, label: 'SCORING RULES', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg font-bold font-rajdhani tracking-wider text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer relative uppercase ${
                  isActive
                    ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-[#141009]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
