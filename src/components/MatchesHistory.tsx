import React, { useState } from 'react';
import { Match, Team, ScoringRule } from '../types/tournament';
import { calculateMatchEntry } from '../utils/scoringEngine';
import { 
  History, 
  MapPin, 
  Clock, 
  Trophy, 
  Crosshair, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Flame, 
  Award,
  Sparkles
} from 'lucide-react';

interface MatchesHistoryProps {
  matches: Match[];
  teams: Team[];
  scoringRule: ScoringRule;
  onDeleteMatch: (matchId: string) => void;
  onOpenGraphicStudio: (layoutType?: string) => void;
  onSelectMatchToEdit?: (match: Match) => void;
}

export const MatchesHistory: React.FC<MatchesHistoryProps> = ({
  matches,
  teams,
  scoringRule,
  onDeleteMatch,
  onOpenGraphicStudio,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  if (matches.length === 0) {
    return (
      <div className="p-8 text-center bg-[#10121d] rounded-2xl border border-slate-800 text-slate-400">
        <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white font-rajdhani">NO MATCHES RECORDED YET</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Record Match 01 via the &ldquo;Enter Match Results&rdquo; tab to view individual game histories, MVP frag reports, and scorecards.
        </p>
      </div>
    );
  }

  // Calculate results for the selected match and sort by rank
  const matchResults = (selectedMatch?.entries || []).map((entry) => {
    const calc = calculateMatchEntry(entry, scoringRule);
    const team = teams.find((t) => t.id === entry.teamId);
    return {
      ...calc,
      teamName: team?.name || entry.teamId,
      teamTag: team?.tag || '',
      teamLogo: team?.logo || '',
    };
  });

  matchResults.sort((a, b) => a.placement - b.placement);
  const booyahTeam = matchResults.find((r) => r.placement === 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#121420]/80 p-4 rounded-xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-rajdhani text-white">
              TOURNAMENT MATCH HISTORY & SCORECARDS
            </h2>
            <p className="text-xs text-slate-400">
              Select any past match to inspect kill breakdowns, Booyah champion, and generate individual match graphics.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenGraphicStudio('match_results')}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          Generate Match Results Poster
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Match List Selector */}
        <div className="space-y-2 lg:col-span-1">
          <div className="text-xs font-bold font-rajdhani text-slate-400 uppercase tracking-wider px-1">
            Recorded Matches ({matches.length})
          </div>
          <div className="space-y-2">
            {matches.map((m) => {
              const isSelected = m.id === selectedMatch?.id;
              const booyah = m.entries.find((e) => e.placement === 1);
              const booyahTeamInfo = booyah ? teams.find((t) => t.id === booyah.teamId) : null;
              const totalKills = m.entries.reduce((sum, e) => sum + e.kills, 0);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatchId(m.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/80 to-[#181a29] border-purple-500 shadow-lg shadow-purple-900/20'
                      : 'bg-[#10121d]/80 border-slate-800 hover:border-slate-700 hover:bg-[#141624]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                      M{m.matchNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {m.map}
                    </div>
                  </div>

                  <div className="font-bold text-white font-rajdhani text-base mt-1.5 truncate">
                    {m.name}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-[11px]">
                      👑 {booyahTeamInfo ? booyahTeamInfo.name : 'Booyah'}
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                      <Crosshair className="w-3 h-3" />
                      {totalKills} frags
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Match Detailed Scorecard */}
        {selectedMatch && (
          <div className="lg:col-span-2 space-y-3">
            {/* Match Header Spotlight */}
            <div className="bg-[#121422] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    OFFICIAL SCORECARD
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedMatch.time}</span>
                </div>
                <h3 className="text-xl font-bold font-rajdhani text-white mt-1">
                  {selectedMatch.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDeleteMatch(selectedMatch.id)}
                  className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:bg-rose-900/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  title="Delete match"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Match
                </button>
              </div>
            </div>

            {/* Booyah & MVP Highlight Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {booyahTeam && (
                <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-[#121422] p-3 rounded-xl border border-amber-500/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black text-xl shadow-md">
                    👑
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400 uppercase font-bold font-rajdhani">
                      MATCH WINNER (BOOYAH)
                    </div>
                    <div className="text-base font-bold text-white font-rajdhani">
                      {booyahTeam.teamName}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {booyahTeam.kills} Kills • {booyahTeam.totalPoints} Total Points
                    </div>
                  </div>
                </div>
              )}

              {selectedMatch.mvp && (
                <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#121422] p-3 rounded-xl border border-purple-500/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md">
                    🎯
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400 uppercase font-bold font-rajdhani">
                      PLAYER OF THE MATCH (MVP)
                    </div>
                    <div className="text-base font-bold text-white font-rajdhani">
                      {selectedMatch.mvp.playerName}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {selectedMatch.mvp.kills} Frags • {selectedMatch.mvp.damage || 0} Damage
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Match Placements Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0d0e17]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#151828] text-slate-400 uppercase font-rajdhani text-xs tracking-wider border-b border-slate-800">
                    <th className="py-2.5 px-3 text-center w-12">Rank</th>
                    <th className="py-2.5 px-4">Team</th>
                    <th className="py-2.5 px-3 text-center w-20 text-amber-300">Kills</th>
                    <th className="py-2.5 px-3 text-center w-24 text-purple-300">Kill Pts</th>
                    <th className="py-2.5 px-3 text-center w-24 text-sky-300">Place Pts</th>
                    <th className="py-2.5 px-3 text-center w-20 text-emerald-400">Bonus</th>
                    <th className="py-2.5 px-3 text-center w-20 text-rose-400">Penalty</th>
                    <th className="py-2.5 px-4 text-center w-24 text-white font-bold bg-purple-950/40">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {matchResults.map((res) => (
                    <tr
                      key={res.teamId}
                      className={`hover:bg-slate-800/30 ${
                        res.placement === 1 ? 'bg-yellow-950/15' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold font-rajdhani text-xs ${
                            res.placement === 1
                              ? 'bg-amber-500 text-black'
                              : res.placement === 2
                              ? 'bg-slate-300 text-black'
                              : res.placement === 3
                              ? 'bg-amber-800 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {res.placement}
                        </span>
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          {res.teamLogo && (
                            <img
                              src={res.teamLogo}
                              alt=""
                              className="w-6 h-6 object-contain"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="font-bold font-rajdhani text-white text-sm">
                            {res.teamName}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center font-bold font-mono text-amber-400">
                        {res.kills}
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                        {res.killPoints}
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                        {res.placementPoints}
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono text-emerald-400">
                        {res.bonus || 0}
                      </td>

                      <td className="py-2.5 px-3 text-center font-mono text-rose-400">
                        {res.penalty || 0}
                      </td>

                      <td className="py-2.5 px-4 text-center font-bold font-rajdhani text-sm text-white bg-purple-950/30">
                        {res.totalPoints} PTS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
