import React, { useState } from 'react';
import { Team, Match, MatchTeamEntry, EsportsMap, ScoringRule } from '../types/tournament';
import { calculateMatchEntry } from '../utils/scoringEngine';
import { parseMatchText, parseTableWithMapping, ColumnMapping } from '../utils/matchParser';
import { 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Trash2, 
  Copy, 
  RotateCcw, 
  MapPin, 
  Trophy, 
  Crosshair, 
  AlertCircle 
} from 'lucide-react';

interface MatchEntryProps {
  teams: Team[];
  matches: Match[];
  scoringRule: ScoringRule;
  onSaveMatch: (match: Match) => void;
  onClose?: () => void;
}

const MAP_OPTIONS: EsportsMap[] = ['Bermuda', 'Purgatory', 'Alpine', 'NexTerra', 'Kalahari', 'Solara'];

export const MatchEntry: React.FC<MatchEntryProps> = ({
  teams = [],
  matches = [],
  scoringRule,
  onSaveMatch,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'quick' | 'smart_import'>('spreadsheet');

  // Match details state
  const safeMatches = matches || [];
  const safeTeams = teams || [];
  const nextMatchNum = safeMatches.length + 1;
  const [matchNumber, setMatchNumber] = useState<number>(nextMatchNum);
  const [mapName, setMapName] = useState<EsportsMap>(MAP_OPTIONS[(nextMatchNum - 1) % MAP_OPTIONS.length]);
  const [matchTitle, setMatchTitle] = useState<string>(`MATCH 0${nextMatchNum} — ${mapName.toUpperCase()}`);
  const [matchDate, setMatchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [matchTime, setMatchTime] = useState<string>('20:00 WIB');

  // Spreadsheet entries state (default 12 slots for teams)
  const [rows, setRows] = useState<{
    teamId: string;
    placement: number;
    kills: number;
    bonus: number;
    penalty: number;
  }[]>(() => {
    return safeTeams.slice(0, 12).map((t, idx) => ({
      teamId: t.id,
      placement: idx + 1,
      kills: idx === 0 ? 8 : Math.max(0, 7 - idx),
      bonus: 0,
      penalty: 0,
    }));
  });

  // Smart Import state
  const [importText, setImportText] = useState<string>(
`MATCH 0${nextMatchNum} — ${mapName.toUpperCase()}
1. Team Alpha — 8 Kills — 1st
2. Team Bravo — 5 Kills — 2nd
3. Team Charlie — 10 Kills — 3rd
4. Team Delta — 3 Kills — 4th
5. Team Echo — 4 Kills — 5th
6. Team Foxtrot — 2 Kills — 6th
7. Team Genesis — 6 Kills — 7th
8. Team Hydra — 1 Kills — 8th
9. Team Ignite — 3 Kills — 9th
10. Team Juggernaut — 2 Kills — 10th
11. Team Kraken — 0 Kills — 11th
12. Team Luna — 1 Kills — 12th`
  );

  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  // Column mapping modal state for CSV/Excel
  const [rawTabularData, setRawTabularData] = useState<string[][] | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    teamIndex: 0,
    placementIndex: 1,
    killsIndex: 2,
    bonusIndex: -1,
    penaltyIndex: -1,
  });

  // Handle row updates in spreadsheet
  const handleRowChange = (index: number, field: keyof typeof rows[0], value: any) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add row
  const handleAddRow = () => {
    const unselectedTeam = teams.find((t) => !rows.some((r) => r.teamId === t.id));
    setRows((prev) => [
      ...prev,
      {
        teamId: unselectedTeam ? unselectedTeam.id : (teams[0]?.id || 'team_custom'),
        placement: prev.length + 1,
        kills: 0,
        bonus: 0,
        penalty: 0,
      },
    ]);
  };

  // Remove row
  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-fill placement 1..N
  const handleAutoFillPlacements = () => {
    setRows((prev) => prev.map((r, idx) => ({ ...r, placement: idx + 1 })));
  };

  // Handle clipboard paste in spreadsheet mode
  const handlePasteSpreadsheet = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (!text || (!text.includes('\t') && !text.includes(','))) return;

    e.preventDefault();
    const parsed = parseMatchText(text, teams);
    if (parsed.entries.length > 0) {
      setRows(
        parsed.entries.map((en) => ({
          teamId: en.teamId,
          placement: en.placement,
          kills: en.kills,
          bonus: en.bonus || 0,
          penalty: en.penalty || 0,
        }))
      );
      setPasteFeedback(`Successfully pasted ${parsed.entries.length} team results from clipboard!`);
      setTimeout(() => setPasteFeedback(null), 4000);
    }
  };

  // Handle Smart Import process
  const handleProcessImportText = () => {
    const parsed = parseMatchText(importText, teams);
    if (parsed.entries.length > 0) {
      if (parsed.matchName) setMatchTitle(parsed.matchName);
      if (parsed.map) setMapName(parsed.map);

      setRows(
        parsed.entries.map((en) => ({
          teamId: en.teamId,
          placement: en.placement,
          kills: en.kills,
          bonus: en.bonus || 0,
          penalty: en.penalty || 0,
        }))
      );
      setActiveTab('spreadsheet');
      setPasteFeedback(`Imported ${parsed.entries.length} teams automatically! Recalculating...`);
      setTimeout(() => setPasteFeedback(null), 4000);
    } else {
      setPasteFeedback('Could not detect valid match rows. Check formatting.');
      setTimeout(() => setPasteFeedback(null), 4000);
    }
  };

  // Submit complete match
  const handleSave = () => {
    const newMatch: Match = {
      id: `match_${Date.now()}`,
      matchNumber,
      name: matchTitle,
      map: mapName,
      date: matchDate,
      time: matchTime,
      entries: rows.map((r) => ({
        teamId: r.teamId,
        placement: r.placement,
        kills: r.kills,
        bonus: r.bonus,
        penalty: r.penalty,
      })),
    };

    // Calculate MVP
    const highestKiller = [...rows].sort((a, b) => b.kills - a.kills)[0];
    if (highestKiller && highestKiller.kills > 0) {
      const killerTeam = teams.find((t) => t.id === highestKiller.teamId);
      newMatch.mvp = {
        teamId: highestKiller.teamId,
        playerName: killerTeam?.players?.[0] || `${killerTeam?.tag || 'PRO'}_FRAGGER`,
        kills: highestKiller.kills,
        damage: highestKiller.kills * 240 + 150,
      };
    }

    onSaveMatch(newMatch);
  };

  return (
    <div className="bg-[#10121d] rounded-2xl border border-purple-900/40 p-5 shadow-2xl space-y-5">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
              STEP 6: ENTER RESULTS
            </span>
            <h3 className="text-xl font-bold font-rajdhani text-white">
              RECORD MATCH SCORECARD
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enter team placements and frags. Points engine will auto-calculate kills, placement, tie-breakers, and graphics.
          </p>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('spreadsheet')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'spreadsheet'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Fast Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('smart_import')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'smart_import'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Smart Text / CSV Import
          </button>
        </div>
      </div>

      {/* Match Meta Controls */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
            Match #
          </label>
          <input
            type="number"
            min={1}
            value={matchNumber}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10) || 1;
              setMatchNumber(num);
              setMatchTitle(`MATCH 0${num} — ${mapName.toUpperCase()}`);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
            Map Selection
          </label>
          <select
            value={mapName}
            onChange={(e) => {
              const selectedMap = e.target.value as EsportsMap;
              setMapName(selectedMap);
              setMatchTitle(`MATCH 0${matchNumber} — ${selectedMap.toUpperCase()}`);
            }}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-medium"
          >
            {MAP_OPTIONS.map((map) => (
              <option key={map} value={map}>
                {map}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
            Match Title
          </label>
          <input
            type="text"
            value={matchTitle}
            onChange={(e) => setMatchTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
            Date & Schedule
          </label>
          <input
            type="text"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {pasteFeedback && (
        <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{pasteFeedback}</span>
        </div>
      )}

      {/* SPREADSHEET MODE */}
      {activeTab === 'spreadsheet' && (
        <div className="space-y-3" onPaste={handlePasteSpreadsheet}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Tip: You can paste columns directly from Excel or Google Sheets (Team, Placement, Kills).
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoFillPlacements}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition cursor-pointer"
              >
                Auto-sort Placement 1..{rows.length}
              </button>
              <button
                type="button"
                onClick={handleAddRow}
                className="px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Add Team Row
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0c0d16]">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#161826] text-slate-400 uppercase font-rajdhani text-[11px] tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-4 min-w-[200px]">TEAM</th>
                  <th className="py-2.5 px-3 text-center w-24">PLACEMENT</th>
                  <th className="py-2.5 px-3 text-center w-24 text-amber-300">KILLS</th>
                  <th className="py-2.5 px-2 text-center w-20 text-emerald-400">BONUS</th>
                  <th className="py-2.5 px-2 text-center w-20 text-rose-400">PENALTY</th>
                  <th className="py-2.5 px-3 text-center w-24 text-purple-300 font-bold bg-purple-950/30">
                    CALCULATED
                  </th>
                  <th className="py-2.5 px-2 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {rows.map((row, idx) => {
                  const calculated = calculateMatchEntry(
                    {
                      teamId: row.teamId,
                      placement: row.placement,
                      kills: row.kills,
                      bonus: row.bonus,
                      penalty: row.penalty,
                    },
                    scoringRule
                  );
                  const selectedTeam = teams.find((t) => t.id === row.teamId);

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        row.placement === 1 ? 'bg-yellow-950/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center text-slate-500 font-mono">
                        {idx + 1}
                      </td>

                      {/* Team Selector */}
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          {selectedTeam?.logo && (
                            <img
                              src={selectedTeam.logo}
                              alt=""
                              className="w-6 h-6 object-contain flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <select
                            value={row.teamId}
                            onChange={(e) => handleRowChange(idx, 'teamId', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-white font-rajdhani font-bold focus:border-purple-500"
                          >
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.tag})
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Placement */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={24}
                            value={row.placement}
                            onChange={(e) =>
                              handleRowChange(idx, 'placement', parseInt(e.target.value, 10) || 1)
                            }
                            className="w-14 text-center bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-xs text-white font-mono"
                          />
                          {row.placement === 1 && (
                            <span title="Booyah! (1st place)" className="text-yellow-400 text-sm">
                              👑
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kills */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          value={row.kills}
                          onChange={(e) =>
                            handleRowChange(idx, 'kills', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-14 text-center bg-slate-900 border border-amber-900/60 rounded px-1.5 py-1 text-xs text-amber-300 font-bold font-mono"
                        />
                      </td>

                      {/* Bonus */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          value={row.bonus}
                          onChange={(e) =>
                            handleRowChange(idx, 'bonus', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 text-center bg-slate-900 border border-emerald-900/60 rounded px-1 py-1 text-xs text-emerald-400 font-mono"
                        />
                      </td>

                      {/* Penalty */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          value={row.penalty}
                          onChange={(e) =>
                            handleRowChange(idx, 'penalty', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 text-center bg-slate-900 border border-rose-900/60 rounded px-1 py-1 text-xs text-rose-400 font-mono"
                        />
                      </td>

                      {/* Calculated Preview */}
                      <td className="py-2 px-3 text-center bg-purple-950/20 font-bold text-white font-rajdhani text-sm">
                        <span>{calculated.totalPoints} PTS</span>
                        <div className="text-[9px] text-slate-400 font-normal font-mono">
                          {calculated.killPoints}k + {calculated.placementPoints}p
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-slate-600 hover:text-rose-400 p-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SMART IMPORT MODE */}
      {activeTab === 'smart_import' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-950/30 border border-purple-900/40 rounded-xl text-xs text-slate-300">
            <h4 className="font-bold text-purple-300 font-rajdhani text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              INTELLIGENT RESULT PARSER & SPREADSHEET IMPORT
            </h4>
            <p className="text-slate-400 text-xs">
              Paste tournament match results in any format: freeform text, comma separated, or copy-pasted Excel rows.
              The engine automatically identifies teams, kills, placement, and map details!
            </p>
          </div>

          <textarea
            rows={10}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste match lines here, e.g.:&#10;1. Team Alpha — 8 Kills — 15 Placement&#10;2. Team Bravo — 5 Kills — 12 Placement..."
            className="w-full font-mono text-xs bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setImportText(
`MATCH 0${nextMatchNum} — BERMUDA
1. Team Alpha — 11 Kills — 1st
2. Team Bravo — 7 Kills — 2nd
3. Team Charlie — 5 Kills — 3rd
4. Team Delta — 4 Kills — 4th
5. Team Echo — 2 Kills — 5th`
                );
              }}
              className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Load Example Template
            </button>

            <button
              type="button"
              onClick={handleProcessImportText}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Parse & Auto-Populate Table
            </button>
          </div>
        </div>
      )}

      {/* Save Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-400 font-mono">
          Total Recorded: {rows.length} Teams • Total Match Kills: {rows.reduce((sum, r) => sum + r.kills, 0)}
        </div>

        <div className="flex items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-rajdhani text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            CALCULATE & COMMIT MATCH RESULTS
          </button>
        </div>
      </div>
    </div>
  );
};
