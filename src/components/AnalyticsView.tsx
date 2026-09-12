import React, { useState } from 'react';
import { TeamStanding, Match } from '../types/tournament';
import { 
  BarChart3, 
  Flame, 
  Crosshair, 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  Award,
  Sparkles
} from 'lucide-react';

interface AnalyticsViewProps {
  standings: TeamStanding[];
  matches: Match[];
  onOpenGraphicStudio: (layoutType?: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  standings,
  matches,
  onOpenGraphicStudio,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'totalPoints' | 'totalKills' | 'avgPoints' | 'wwcdCount'>('totalPoints');

  const totalTournamentKills = standings.reduce((sum, s) => sum + s.totalKills, 0);
  const totalTournamentPoints = standings.reduce((sum, s) => sum + s.totalPoints, 0);
  const totalBooyahs = standings.reduce((sum, s) => sum + s.wwcdCount, 0);

  // Top fragger team
  const topFragTeam = [...standings].sort((a, b) => b.totalKills - a.totalKills)[0];
  // Most consistent team (highest average points)
  const mostConsistent = [...standings].sort((a, b) => b.avgPoints - a.avgPoints)[0];
  // Booyah King
  const booyahKing = [...standings].sort((a, b) => b.wwcdCount - a.wwcdCount)[0];

  const sortedForChart = [...standings].sort((a, b) => b[selectedMetric] - a[selectedMetric]).slice(0, 12);
  const maxVal = Math.max(...sortedForChart.map((s) => s[selectedMetric])) || 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#121420]/80 p-4 rounded-xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-rajdhani text-white">
              TOURNAMENT PERFORMANCE ANALYTICS
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated statistics across {matches.length} matches, kill ratios, averages, and team progression.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenGraphicStudio('mvp_showcase')}
          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          Generate MVP / Top Fragger Graphic
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#10121d] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TOTAL KILLS LOGGED</span>
            <Crosshair className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-rajdhani text-amber-400 mt-1">
            {totalTournamentKills}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Top Fragger: {topFragTeam?.team.name} ({topFragTeam?.totalKills} frags)
          </div>
        </div>

        <div className="bg-[#10121d] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>BOOYAH WINNERS</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black font-rajdhani text-yellow-400 mt-1">
            {totalBooyahs} WWCD
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Booyah Leader: {booyahKing?.team.name} ({booyahKing?.wwcdCount} wins)
          </div>
        </div>

        <div className="bg-[#10121d] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>PEAK SINGLE MATCH</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-rajdhani text-purple-300 mt-1">
            {Math.max(...standings.map((s) => s.bestMatchScore), 0)} PTS
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Avg Tourney Score: {(totalTournamentPoints / (standings.length || 1)).toFixed(0)} pts
          </div>
        </div>

        <div className="bg-[#10121d] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MOST CONSISTENT</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-rajdhani text-emerald-400 mt-1">
            {mostConsistent?.avgPoints || 0} PPG
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {mostConsistent?.team.name} average per game
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart for Teams */}
      <div className="bg-[#10121d] p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold font-rajdhani text-white">
              TEAM COMPARATIVE BENCHMARK
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing performance across top 12 contenders
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedMetric('totalPoints')}
              className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                selectedMetric === 'totalPoints' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Total Points
            </button>
            <button
              onClick={() => setSelectedMetric('totalKills')}
              className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                selectedMetric === 'totalKills' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Total Kills
            </button>
            <button
              onClick={() => setSelectedMetric('avgPoints')}
              className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                selectedMetric === 'avgPoints' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Avg PPG
            </button>
            <button
              onClick={() => setSelectedMetric('wwcdCount')}
              className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                selectedMetric === 'wwcdCount' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Booyahs
            </button>
          </div>
        </div>

        {/* Custom SVG / Esports Neon Bar Chart */}
        <div className="space-y-2.5 pt-2">
          {sortedForChart.map((s, idx) => {
            const val = s[selectedMetric];
            const pct = Math.min(100, Math.max(8, (val / maxVal) * 100));

            return (
              <div key={s.team.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono font-bold text-slate-500">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white font-rajdhani text-sm">
                      {s.team.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({s.totalKills}k • {s.totalPlacementPoints}p • {s.wwcdCount}W)
                    </span>
                  </div>
                  <span className="font-bold font-mono text-purple-300">
                    {val} {selectedMetric === 'wwcdCount' ? 'Wins' : 'PTS'}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Team Metric Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0d0e17]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#151828] text-slate-400 uppercase font-rajdhani text-xs tracking-wider border-b border-slate-800">
              <th className="py-2.5 px-3 text-center">Rank</th>
              <th className="py-2.5 px-4">Team</th>
              <th className="py-2.5 px-3 text-center text-amber-300">Total Kills</th>
              <th className="py-2.5 px-3 text-center">Kill Share %</th>
              <th className="py-2.5 px-3 text-center">Avg Kills/G</th>
              <th className="py-2.5 px-3 text-center text-sky-300">Place Pts</th>
              <th className="py-2.5 px-3 text-center text-yellow-400">Booyah</th>
              <th className="py-2.5 px-3 text-center">Best Match</th>
              <th className="py-2.5 px-3 text-center">Worst Match</th>
              <th className="py-2.5 px-4 text-center font-bold text-white bg-purple-950/30">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            {standings.map((s) => (
              <tr key={s.team.id} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 text-center font-bold font-mono text-purple-400">
                  #{s.rank}
                </td>
                <td className="py-2.5 px-4 font-bold font-rajdhani text-white text-sm">
                  {s.team.name}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-amber-300">
                  {s.totalKills}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                  {s.killPercentage}%
                </td>
                <td className="py-2.5 px-3 text-center font-mono">
                  {s.avgKills}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-sky-300">
                  {s.totalPlacementPoints}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-yellow-400 font-bold">
                  {s.wwcdCount}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-emerald-400">
                  {s.bestMatchScore}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-rose-400">
                  {s.worstMatchScore === 9999 ? 0 : s.worstMatchScore}
                </td>
                <td className="py-2.5 px-4 text-center font-bold font-rajdhani text-sm text-white bg-purple-950/30">
                  {s.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
