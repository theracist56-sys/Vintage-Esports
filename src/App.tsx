import React, { useState, useMemo, useEffect } from 'react';
import { 
  TournamentConfig, 
  ScoringRule, 
  TieBreakerCriterion, 
  Match, 
  Team,
  TeamStanding 
} from './types/tournament';
import { INITIAL_TOURNAMENT } from './data/defaultTournament';
import { USER_SCREENSHOT_TEAMS, USER_SCREENSHOT_MATCH } from './data/userScreenshotMatch';
import { calculateTournamentStandings } from './utils/scoringEngine';
import { Header, AppTab } from './components/Header';
import { StandingsTable } from './components/StandingsTable';
import { MvpShowcaseView } from './components/MvpShowcaseView';
import { TeamSlotsView } from './components/TeamSlotsView';
import { GraphicsStudio } from './components/GraphicsStudio';
import { ScreenshotScanner } from './components/ScreenshotScanner';
import { MatchEntry } from './components/MatchEntry';
import { ScoringRulesModal } from './components/ScoringRulesModal';
import { PWAInstallModal } from './components/PWAInstallModal';

const STORAGE_KEY = 'vintage_esports_tourney_state_v2';

export default function App() {
  // Load initial tournament state from localStorage or default
  const [tournament, setTournament] = useState<TournamentConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_TOURNAMENT,
            ...parsed,
            teams: Array.isArray(parsed.teams) && parsed.teams.length > 0 ? parsed.teams : INITIAL_TOURNAMENT.teams,
            matches: Array.isArray(parsed.matches) ? parsed.matches : INITIAL_TOURNAMENT.matches,
            contactInfo: {
              ...INITIAL_TOURNAMENT.contactInfo,
              ...(parsed.contactInfo || {}),
            },
            scoringRule: {
              ...INITIAL_TOURNAMENT.scoringRule,
              ...(parsed.scoringRule || {}),
              placementPoints: {
                ...INITIAL_TOURNAMENT.scoringRule.placementPoints,
                ...(parsed.scoringRule?.placementPoints || {}),
              },
            },
          };
        }
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return INITIAL_TOURNAMENT;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [tournament]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('standings');

  // Modals & overlay views
  const [isScoringModalOpen, setIsScoringModalOpen] = useState<boolean>(false);
  const [isMatchEntryOpen, setIsMatchEntryOpen] = useState<boolean>(false);
  const [isScreenshotScannerOpen, setIsScreenshotScannerOpen] = useState<boolean>(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);
  const [selectedStudioLayout, setSelectedStudioLayout] = useState<string>('vintage_obsidian_gold');

  // Reactively calculate tournament standings whenever teams, matches, or rules change!
  const standings = useMemo<TeamStanding[]>(() => {
    return calculateTournamentStandings(
      tournament.teams,
      tournament.matches,
      tournament.scoringRule,
      tournament.tieBreakers,
      tournament.qualificationSlots
    );
  }, [
    tournament.teams,
    tournament.matches,
    tournament.scoringRule,
    tournament.tieBreakers,
    tournament.qualificationSlots,
  ]);

  // LIVE IN-PLACE CELL EDITING
  const handleUpdateMatchEntry = (
    matchId: string,
    teamId: string,
    field: 'kills' | 'placement' | 'bonus' | 'penalty',
    value: number
  ) => {
    setTournament((prev) => {
      const updatedMatches = prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        const updatedEntries = m.entries.map((entry) => {
          if (entry.teamId !== teamId) return entry;
          return {
            ...entry,
            [field]: value,
          };
        });
        return {
          ...m,
          entries: updatedEntries,
        };
      });

      return {
        ...prev,
        matches: updatedMatches,
      };
    });
  };

  // Append newly recorded match
  const handleSaveMatch = (newMatch: Match) => {
    setTournament((prev) => ({
      ...prev,
      matches: [...prev.matches, newMatch],
    }));
    setIsMatchEntryOpen(false);
    setActiveTab('standings');
  };

  // Apply match scanned from Free Fire Screenshot
  const handleApplyScannedMatch = (
    newMatch: Match,
    updatedTeams?: Team[],
    resetExistingMatches?: boolean
  ) => {
    setTournament((prev) => ({
      ...prev,
      teams: updatedTeams || prev.teams,
      matches: resetExistingMatches ? [newMatch] : [...prev.matches, newMatch],
    }));
    setIsScreenshotScannerOpen(false);
    setActiveTab('standings');
  };

  // Reset Points Table
  const handleResetPointsTable = (
    mode: 'clear_matches' | 'free_fire_screenshot' | 'default_tournament' | 'blank'
  ) => {
    if (mode === 'clear_matches') {
      setTournament((prev) => ({
        ...prev,
        matches: [],
      }));
    } else if (mode === 'free_fire_screenshot') {
      setTournament((prev) => ({
        ...prev,
        name: 'FREE FIRE ESPORTS CHAMPIONSHIP',
        teams: USER_SCREENSHOT_TEAMS,
        matches: [USER_SCREENSHOT_MATCH],
      }));
    } else if (mode === 'default_tournament') {
      setTournament(INITIAL_TOURNAMENT);
    } else if (mode === 'blank') {
      setTournament({
        ...INITIAL_TOURNAMENT,
        name: 'CUSTOM TOURNAMENT',
        teams: [],
        matches: [],
      });
    }
  };

  // Update Scoring Rules and Tie-Breakers
  const handleSaveScoringRules = (
    newRule: ScoringRule,
    newTieBreakers: TieBreakerCriterion[],
    newQualSlots: number
  ) => {
    setTournament((prev) => ({
      ...prev,
      scoringRule: newRule,
      tieBreakers: newTieBreakers,
      qualificationSlots: newQualSlots,
    }));
  };

  // Team management (for TeamSlotsView)
  const handleAddTeam = (newTeam: Team) => {
    setTournament((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)),
    }));
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!window.confirm('Delete this team from the tournament roster?')) return;
    setTournament((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
    }));
  };

  // Jump to Graphics Studio with specific layout preset
  const handleOpenGraphicStudio = (layoutType: string = 'vintage_obsidian_gold') => {
    setSelectedStudioLayout(layoutType);
    setActiveTab('graphics');
  };

  return (
    <div className="min-h-screen bg-[#080705] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        tournament={tournament}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMatchEntry={() => setIsMatchEntryOpen(true)}
        onOpenScreenshotScanner={() => setIsScreenshotScannerOpen(true)}
        onOpenGraphicStudio={() => handleOpenGraphicStudio('vintage_obsidian_gold')}
        onOpenInstallApp={() => setIsPWAInstallOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: POINTS TABLE (STANDINGS & QUICK SCREENSHOT SCANNER) */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            {isScreenshotScannerOpen && (
              <ScreenshotScanner
                teams={tournament.teams}
                scoringRule={tournament.scoringRule}
                onApplyMatch={handleApplyScannedMatch}
                onClose={() => setIsScreenshotScannerOpen(false)}
              />
            )}

            <StandingsTable
              standings={standings}
              matches={tournament.matches}
              scoringRule={tournament.scoringRule}
              qualificationSlots={tournament.qualificationSlots}
              onUpdateMatchEntry={handleUpdateMatchEntry}
              onOpenGraphicStudio={handleOpenGraphicStudio}
              onOpenScoringRules={() => setIsScoringModalOpen(true)}
              onOpenScreenshotScanner={() => setIsScreenshotScannerOpen(true)}
              onResetPointsTable={handleResetPointsTable}
            />
          </div>
        )}

        {/* TAB 2: MVP & TOP PREDATORS */}
        {activeTab === 'mvp' && (
          <MvpShowcaseView
            standings={standings}
            matches={tournament.matches}
            onOpenGraphicStudio={handleOpenGraphicStudio}
          />
        )}

        {/* TAB 3: TEAM SLOTS (12/18) & ROSTERS */}
        {activeTab === 'slots' && (
          <TeamSlotsView
            teams={tournament.teams}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
            onOpenGraphicStudio={handleOpenGraphicStudio}
          />
        )}

        {/* TAB 4: GRAPHICS STUDIO & 20 TEMPLATES */}
        {activeTab === 'graphics' && (
          <GraphicsStudio
            tournament={tournament}
            standings={standings}
            matches={tournament.matches}
            initialLayoutType={selectedStudioLayout}
            onUpdateTournament={setTournament}
          />
        )}

        {/* TAB 5: SCORING RULES & TIE-BREAKERS */}
        {activeTab === 'rules' && (
          <div className="max-w-3xl mx-auto">
            <ScoringRulesModal
              currentRule={tournament.scoringRule}
              currentTieBreakers={tournament.tieBreakers}
              qualificationSlots={tournament.qualificationSlots}
              onSave={handleSaveScoringRules}
              onClose={() => setActiveTab('standings')}
            />
          </div>
        )}
      </main>

      {/* Floating Manual Match Entry Modal */}
      {isMatchEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl w-full">
            <MatchEntry
              teams={tournament.teams}
              matches={tournament.matches}
              scoringRule={tournament.scoringRule}
              onSaveMatch={handleSaveMatch}
              onClose={() => setIsMatchEntryOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Scoring Rules Modal when opened from button */}
      {isScoringModalOpen && (
        <ScoringRulesModal
          currentRule={tournament.scoringRule}
          currentTieBreakers={tournament.tieBreakers}
          qualificationSlots={tournament.qualificationSlots}
          onSave={handleSaveScoringRules}
          onClose={() => setIsScoringModalOpen(false)}
        />
      )}

      {/* PWA Mobile Installation Modal */}
      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />
    </div>
  );
}
