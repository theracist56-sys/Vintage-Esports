import React, { useState } from 'react';
import { TeamStanding, Match, ScoringRule } from '../types/tournament';
import { 
  Trophy, 
  Flame, 
  Crosshair, 
  Award, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal,
  Camera,
  Crown,
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface StandingsTableProps {
  standings: TeamStanding[];
  matches: Match[];
  scoringRule: ScoringRule;
  qualificationSlots: number;
  onUpdateMatchEntry: (matchId: string, teamId: string, field: 'kills' | 'placement' | 'bonus' | 'penalty', value: number) => void;
  onOpenGraphicStudio: (layoutType?: string) => void;
  onOpenScoringRules: () => void;
  onOpenScreenshotScanner?: () => void;
  onResetPointsTable?: (mode: 'clear_matches' | 'free_fire_screenshot' | 'default_tournament' | 'blank') => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings = [],
  matches = [],
  scoringRule,
  qualificationSlots = 6,
  onUpdateMatchEntry,
  onOpenGraphicStudio,
  onOpenScoringRules,
  onOpenScreenshotScanner,
  onResetPointsTable,
}) => {
  const [editingCell, setEditingCell] = useState<{ matchId: string; teamId: string; field: 'kills' | 'placement' } | null>(null);
  const [cellValue, setCellValue] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCompactView, setIsCompactView] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const safeMatches = matches || [];
  const safeStandings = standings || [];

  const filteredStandings = safeStandings.filter((s) =>
    (s.team?.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (s.team?.tag || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startEdit = (matchId: string, teamId: string, field: 'kills' | 'placement', currentVal: number) => {
    setEditingCell({ matchId, teamId, field });
    setCellValue(String(currentVal));
  };

  const saveEdit = () => {
    if (editingCell) {
      const val = parseInt(cellValue, 10);
      if (!isNaN(val)) {
        onUpdateMatchEntry(editingCell.matchId, editingCell.teamId, editingCell.field, Math.max(0, val));
      }
      setEditingCell(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Automated Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#17120a] via-[#100c06] to-[#0a0805] p-4 sm:p-5 rounded-2xl border border-amber-500/30 shadow-xl shadow-amber-500/5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-teko tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 leading-none">
                OFFICIAL POINTS TABLE & AUTOMATIC LEADERBOARD
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-amber-200/70 font-rajdhani mt-0.5">
              {safeMatches.length} matches logged • 1-Click Free Fire match screenshot auto-detection • Double-click cells to adjust
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenScreenshotScanner && (
            <button
              onClick={onOpenScreenshotScanner}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold font-rajdhani text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              <Camera className="w-4 h-4 text-black" />
              <span>Scan Match Screenshot</span>
            </button>
          )}

          {/* Compact / Detailed Matrix View Toggle */}
          <button
            onClick={() => setIsCompactView(!isCompactView)}
            className={`px-3 py-2 text-xs font-bold font-rajdhani rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
              isCompactView
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#1a140a] hover:bg-[#251d0e] text-amber-300 border-amber-500/30'
            }`}
            title="Toggle between compact mobile view and full match matrix"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isCompactView ? 'Compact View' : 'Full Matrix'}</span>
          </button>

          <button
            onClick={onOpenScoringRules}
            className="px-3 py-2 text-xs font-bold font-rajdhani rounded-xl bg-[#1a140a] hover:bg-[#251d0e] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Rules</span>
          </button>

          {/* Reset Points Table Button */}
          {onResetPointsTable && (
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-3 py-2 text-xs font-bold font-rajdhani rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Reset Points Table & Matches"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span>Reset Table</span>
            </button>
          )}

          {/* Quick theme launch shortcuts */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-500/20">
            <button
              onClick={() => onOpenGraphicStudio('vintage_obsidian_gold')}
              className="px-2.5 py-1 text-[11px] font-bold font-rajdhani rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 cursor-pointer transition"
              title="Open Vintage Obsidian Gold Signature Template"
            >
              <Crown className="w-3 h-3 text-yellow-400" />
              <span>Vintage Gold</span>
            </button>

            <button
              onClick={() => onOpenGraphicStudio('bpc_ultraviolet')}
              className="px-2 py-1 text-[11px] font-bold font-rajdhani rounded-lg hover:bg-purple-950/60 text-purple-300 cursor-pointer transition"
              title="Open BPC Camp Ultraviolet Leaderboard (Ref 1)"
            >
              <span>BPC Ref</span>
            </button>

            <button
              onClick={() => onOpenGraphicStudio('pmes_tactical_red')}
              className="px-2 py-1 text-[11px] font-bold font-rajdhani rounded-lg hover:bg-red-950/60 text-red-300 cursor-pointer transition"
              title="Open PMES Tactical Parallelogram (Ref 2)"
            >
              <span>PMES Ref</span>
            </button>

            <button
              onClick={() => onOpenGraphicStudio('greek_gods_gold')}
              className="px-2 py-1 text-[11px] font-bold font-rajdhani rounded-lg hover:bg-yellow-950/60 text-yellow-300 cursor-pointer transition"
              title="Open Greek Gods 3D Golden Capsules (Ref 3)"
            >
              <span>Greek Gods</span>
            </button>
          </div>
        </div>
      </div>

      {/* Qualification Ribbon */}
      <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#181309] to-transparent border-l-4 border-amber-500 text-xs text-amber-200/80 flex items-center justify-between font-rajdhani">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            <strong className="text-amber-300 font-bold uppercase">Qualification Cutoff:</strong> Top {qualificationSlots} teams advance to Grand Finals.
          </span>
        </div>
        <span className="text-[11px] text-amber-400/80 font-mono font-bold">
          Rules: 1 Kill = {scoringRule?.killPoints ?? 1} Pt • 1st = {scoringRule?.placementPoints?.[1] || 12} Pts
        </span>
      </div>

      {/* Interactive Standings Table */}
      <div className="overflow-x-auto rounded-2xl border border-amber-500/25 bg-[#0a0805] shadow-2xl">
        <table className="w-full text-left text-xs border-collapse min-w-full">
          <thead>
            <tr className="bg-[#141008] text-amber-300/80 uppercase font-mono text-[11px] tracking-wider border-b border-amber-500/20">
              <th className="py-3 px-3 text-center w-14 sticky left-0 bg-[#141008] z-20">Rank</th>
              <th className="py-3 px-4 min-w-[180px] sm:min-w-[220px] sticky left-14 bg-[#141008] z-20 border-r border-amber-500/10">Team Name</th>
              <th className="py-3 px-2 text-center w-12" title="Matches Played">MP</th>
              
              {/* Dynamic Match Columns (Hidden in Compact View) */}
              {!isCompactView && safeMatches.map((m) => (
                <th key={m.id} className="py-3 px-2 text-center w-14" title={`${m.name} (${m.map})`}>
                  <div className="text-[10px] text-amber-400 font-bold font-rajdhani">M{m.matchNumber}</div>
                  <div className="text-[9px] text-zinc-500 truncate max-w-[50px]">{m.map}</div>
                </th>
              ))}

              <th className="py-3 px-3 text-center w-16 text-amber-300">Kills</th>
              <th className="py-3 px-3 text-center w-16 text-yellow-200">Place Pts</th>
              <th className="py-3 px-3 text-center w-14 text-amber-400" title="WWCD / Booyah Wins">Booyah</th>
              <th className="py-3 px-4 text-center w-24 text-black font-extrabold bg-amber-500">Total Pts</th>
              <th className="py-3 px-3 text-center w-24">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-500/10 font-medium text-slate-200">
            {filteredStandings.map((standing) => {
              const isCutoffLine = standing.rank === qualificationSlots;
              const isTop3 = standing.rank <= 3;
              const isLeader = standing.rank === 1;

              return (
                <React.Fragment key={standing.team.id}>
                  <tr
                    className={`transition-colors duration-150 ${
                      isLeader
                        ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-100'
                        : isTop3
                        ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                        : standing.isQualified
                        ? 'hover:bg-zinc-900/50'
                        : 'text-zinc-500 hover:bg-zinc-900/30'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3 px-3 text-center sticky left-0 bg-[#0a0805] z-10">
                      <div
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-bold text-xs ${
                          standing.rank === 1
                            ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-black shadow-md shadow-amber-500/40 font-black'
                            : standing.rank === 2
                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-black font-black'
                            : standing.rank === 3
                            ? 'bg-gradient-to-br from-amber-700 to-yellow-800 text-white font-black'
                            : standing.isQualified
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {standing.rank}
                      </div>
                    </td>

                    {/* Team Name and Logo */}
                    <td className="py-3 px-4 sticky left-14 bg-[#0a0805] z-10 border-r border-amber-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/60 border border-amber-500/30 flex items-center justify-center p-0.5 flex-shrink-0">
                          {standing.team.logo ? (
                            <img
                              src={standing.team.logo}
                              alt={standing.team.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="font-bold font-teko text-amber-400 text-lg">
                              {standing.team.tag || standing.team.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white font-rajdhani text-sm tracking-wide flex items-center gap-1.5 uppercase">
                            {standing.team.name}
                            {standing.rank === 1 && (
                              <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                            <span className="px-1 rounded bg-black/50 text-amber-300">
                              [{standing.team.tag}]
                            </span>
                            {standing.team.group && (
                              <span className="text-zinc-500">• {standing.team.group}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Matches Played */}
                    <td className="py-3 px-2 text-center text-zinc-400 font-mono">
                      {standing.matchesPlayed}
                    </td>

                    {/* Match by Match breakdown (Hidden in Compact View) */}
                    {!isCompactView && safeMatches.map((m) => {
                      const points = standing.matchPoints[m.id];
                      const kills = standing.matchKills[m.id];
                      const isEditing = editingCell?.matchId === m.id && editingCell?.teamId === standing.team.id;

                      return (
                        <td
                          key={m.id}
                          className="py-3 px-2 text-center cursor-pointer hover:bg-amber-500/10 transition-colors group relative"
                          onDoubleClick={() => startEdit(m.id, standing.team.id, 'kills', kills || 0)}
                          title="Double-click to live edit kills"
                        >
                          {isEditing ? (
                            <div className="flex items-center justify-center">
                              <input
                                type="number"
                                autoFocus
                                value={cellValue}
                                onChange={(e) => setCellValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                className="w-10 px-1 py-0.5 text-xs text-center bg-black border border-amber-400 rounded text-amber-300 font-mono font-bold"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold font-mono text-xs text-slate-200">
                                {points !== undefined ? points : '-'}
                              </div>
                              {kills !== undefined && (
                                <div className="text-[9px] text-amber-400/70 flex items-center justify-center gap-0.5 font-mono">
                                  <Crosshair className="w-2.5 h-2.5 text-amber-500" />
                                  {kills}k
                                </div>
                              )}
                              <Edit3 className="w-2.5 h-2.5 text-amber-400/0 group-hover:text-amber-400 absolute top-1 right-1 transition-opacity" />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Kills */}
                    <td className="py-3 px-3 text-center font-bold font-mono text-amber-400">
                      {standing.totalKills}
                    </td>

                    {/* Total Placement Points */}
                    <td className="py-3 px-3 text-center font-bold font-mono text-zinc-300">
                      {standing.totalPlacementPoints}
                    </td>

                    {/* Booyah / WWCD count */}
                    <td className="py-3 px-3 text-center font-bold font-mono">
                      {standing.wwcdCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/40 text-xs font-bold">
                          {standing.wwcdCount} 👑
                        </span>
                      ) : (
                        <span className="text-zinc-600">0</span>
                      )}
                    </td>

                    {/* Total Points */}
                    <td className="py-3 px-4 text-center bg-amber-500/10">
                      <span className="font-black font-rajdhani text-base tracking-wider text-amber-300">
                        {standing.totalPoints}
                      </span>
                    </td>

                    {/* Qualification Status */}
                    <td className="py-3 px-3 text-center">
                      {standing.isQualified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-rajdhani bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium font-rajdhani text-zinc-600 uppercase">
                          ELIMINATED
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Visual cutoff divider line */}
                  {isCutoffLine && (
                    <tr className="bg-gradient-to-r from-amber-600/30 via-yellow-500/40 to-amber-600/30 border-y border-amber-500/60">
                      <td colSpan={8 + matches.length} className="py-1 px-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-yellow-200 tracking-wider font-rajdhani uppercase">
                          <Award className="w-3.5 h-3.5 text-yellow-400" />
                          ROAD TO SEMIFINAL CUTOFF LINE (TOP {qualificationSlots} ADVANCE)
                          <Award className="w-3.5 h-3.5 text-yellow-400" />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reset Points Table Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#120e09] border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-teko text-2xl font-bold uppercase text-white tracking-wide leading-none">
                    Reset Points Table
                  </h3>
                  <p className="text-xs text-zinc-400 font-rajdhani">
                    Choose how you want to reset tournament match standings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Load Free Fire Screenshot Match */}
              <button
                onClick={() => {
                  onResetPointsTable?.('free_fire_screenshot');
                  setIsResetModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-rajdhani text-sm flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    Load Free Fire Screenshot Match (Bloodline #1)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Sets the points table with your uploaded screenshot: Team 1 BLOODLINE in 1st place with 12 position pts, 16 kills (16 pts), and 28 total points.
                </p>
              </button>

              {/* Option 2: Clear all matches (Zero points) */}
              <button
                onClick={() => {
                  onResetPointsTable?.('clear_matches');
                  setIsResetModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition cursor-pointer"
              >
                <span className="font-bold text-slate-200 font-rajdhani text-sm flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  Clear All Matches (Reset All Points to 0)
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Wipes all recorded matches so every team's placement points, kill points, and total points reset to 0. Keeps your team roster.
                </p>
              </button>

              {/* Option 3: Restore Default Championship Sample */}
              <button
                onClick={() => {
                  onResetPointsTable?.('default_tournament');
                  setIsResetModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition cursor-pointer"
              >
                <span className="font-bold text-slate-200 font-rajdhani text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Restore Default 12-Team Championship Sample
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Restores the standard 12-team tournament sample with 3 matches.
                </p>
              </button>

              {/* Option 4: Complete Blank Tournament */}
              <button
                onClick={() => {
                  onResetPointsTable?.('blank');
                  setIsResetModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-left transition cursor-pointer"
              >
                <span className="font-bold text-red-300 font-rajdhani text-sm flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  Blank Reset (Clear Teams & Matches)
                </span>
                <p className="text-xs text-zinc-400 mt-1">
                  Clears all teams and matches to start completely blank.
                </p>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold font-rajdhani cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
