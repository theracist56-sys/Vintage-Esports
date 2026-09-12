import { MatchTeamEntry, Team, EsportsMap } from '../types/tournament';

export interface ParsedMatchData {
  matchName?: string;
  map?: EsportsMap;
  entries: MatchTeamEntry[];
  unmatchedTeams: string[];
  rawLines: string[];
}

export interface ColumnMapping {
  teamIndex: number;
  placementIndex: number;
  killsIndex: number;
  bonusIndex: number;
  penaltyIndex: number;
}

const MAP_NAMES: EsportsMap[] = ['Bermuda', 'Purgatory', 'Alpine', 'NexTerra', 'Kalahari', 'Solara'];

/**
 * Finds matching team ID or fuzzy matches team name
 */
export function findTeamMatch(inputName: string, teams: Team[]): Team | undefined {
  const cleanInput = inputName.trim().toLowerCase().replace(/^(team\s+|tim\s+)/i, '');
  
  // Exact name or tag match
  const exact = teams.find(
    (t) =>
      t.name.toLowerCase() === inputName.trim().toLowerCase() ||
      t.tag.toLowerCase() === inputName.trim().toLowerCase() ||
      t.id.toLowerCase() === inputName.trim().toLowerCase()
  );
  if (exact) return exact;

  // Partial or fuzzy match (without 'team ' prefix)
  const partial = teams.find((t) => {
    const cleanTeam = t.name.toLowerCase().replace(/^(team\s+|tim\s+)/i, '');
    return cleanTeam === cleanInput || cleanTeam.includes(cleanInput) || cleanInput.includes(cleanTeam);
  });
  return partial;
}

/**
 * Smart natural language & paste parser
 * Supports:
 * - "MATCH 01 — BERMUDA"
 * - "1. Team Alpha — 8 Kills — 15 Placement"
 * - "Team Alpha\t1\t8" (Excel/Sheets tab delimited)
 * - "Team Alpha, 1, 8" (CSV)
 * - "1 - Team Alpha - 8 kills"
 */
export function parseMatchText(
  rawText: string,
  existingTeams: Team[]
): ParsedMatchData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let matchName: string | undefined;
  let map: EsportsMap | undefined;
  const entries: MatchTeamEntry[] = [];
  const unmatchedTeams: string[] = [];

  lines.forEach((line, lineIdx) => {
    // Check if line is a header like "MATCH 01 — BERMUDA"
    const headerMatch = line.match(/MATCH\s*(\d+)?\s*[-—:]?\s*(.+)?/i);
    if (headerMatch && (line.includes('—') || line.includes('-') || line.toUpperCase().includes('MATCH'))) {
      if (!matchName) matchName = line;
      // check for map
      for (const m of MAP_NAMES) {
        if (line.toLowerCase().includes(m.toLowerCase())) {
          map = m;
          break;
        }
      }
      return;
    }

    // Check for Tab / Comma / Pipe delimited (Spreadsheet paste)
    let columns: string[] = [];
    if (line.includes('\t')) {
      columns = line.split('\t').map((c) => c.trim());
    } else if (line.includes(',')) {
      columns = line.split(',').map((c) => c.trim());
    } else if (line.includes('|')) {
      columns = line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    if (columns.length >= 3) {
      // Possible spreadsheet row: e.g. [Team, Placement, Kills] or [Rank, Team, Kills]
      // Detect numeric vs string
      const firstNum = !isNaN(Number(columns[0]));
      let teamStr = '';
      let placeNum = lineIdx + 1;
      let killNum = 0;
      let bonusNum = 0;
      let penaltyNum = 0;

      if (firstNum) {
        // [Placement/Rank, Team, Kills, (Bonus), (Penalty)]
        placeNum = Number(columns[0]);
        teamStr = columns[1];
        killNum = parseInt(columns[2].replace(/[^0-9-]/g, ''), 10) || 0;
        if (columns[3]) bonusNum = parseInt(columns[3].replace(/[^0-9-]/g, ''), 10) || 0;
        if (columns[4]) penaltyNum = parseInt(columns[4].replace(/[^0-9-]/g, ''), 10) || 0;
      } else {
        // [Team, Placement/Rank, Kills, (Bonus), (Penalty)]
        teamStr = columns[0];
        placeNum = parseInt(columns[1].replace(/[^0-9]/g, ''), 10) || (lineIdx + 1);
        killNum = parseInt(columns[2].replace(/[^0-9-]/g, ''), 10) || 0;
        if (columns[3]) bonusNum = parseInt(columns[3].replace(/[^0-9-]/g, ''), 10) || 0;
        if (columns[4]) penaltyNum = parseInt(columns[4].replace(/[^0-9-]/g, ''), 10) || 0;
      }

      const matchedTeam = findTeamMatch(teamStr, existingTeams);
      const teamId = matchedTeam ? matchedTeam.id : teamStr.toLowerCase().replace(/[^a-z0-9]/g, '_');
      if (!matchedTeam) {
        unmatchedTeams.push(teamStr);
      }

      entries.push({
        teamId,
        placement: placeNum,
        kills: killNum,
        bonus: bonusNum,
        penalty: penaltyNum,
      });
      return;
    }

    // Free form pattern: "1. Team Alpha — 8 Kills — 15 Placement"
    // Or "1. Team Alpha - 8 Kills"
    // Regex for: optional number, team name, kills, placement
    const freeformRegex = /(?:(\d+)[\.\s\-\)]+)?([A-Za-z0-9\s_\-\[\]]+?)(?:[-—:\s]+)(\d+)\s*(?:kills?|k|frag|frags)?(?:[-—:\s]+)?(?:(\d+)\s*(?:placement|pos|rank|st|nd|rd|th)?)?/i;
    const match = line.match(freeformRegex);

    if (match) {
      const parsedRank = match[1] ? parseInt(match[1], 10) : lineIdx + 1;
      const parsedTeamName = match[2].trim();
      const parsedKills = parseInt(match[3], 10) || 0;
      const parsedPlacement = match[4] ? parseInt(match[4], 10) : parsedRank;

      if (parsedTeamName && parsedTeamName.length > 1) {
        const matchedTeam = findTeamMatch(parsedTeamName, existingTeams);
        const teamId = matchedTeam ? matchedTeam.id : parsedTeamName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (!matchedTeam) {
          unmatchedTeams.push(parsedTeamName);
        }

        entries.push({
          teamId,
          placement: parsedPlacement,
          kills: parsedKills,
          bonus: 0,
          penalty: 0,
        });
      }
    }
  });

  return {
    matchName,
    map,
    entries,
    unmatchedTeams: Array.from(new Set(unmatchedTeams)),
    rawLines: lines,
  };
}

/**
 * Parses spreadsheet tabular data with user-selected column mappings
 */
export function parseTableWithMapping(
  rows: string[][],
  mapping: ColumnMapping,
  existingTeams: Team[]
): MatchTeamEntry[] {
  const entries: MatchTeamEntry[] = [];

  rows.forEach((row, idx) => {
    if (!row || row.length === 0) return;
    const teamName = mapping.teamIndex >= 0 ? (row[mapping.teamIndex] || '').trim() : '';
    if (!teamName) return;

    const placementStr = mapping.placementIndex >= 0 ? row[mapping.placementIndex] : '';
    const placement = parseInt(String(placementStr).replace(/[^0-9]/g, ''), 10) || (idx + 1);

    const killsStr = mapping.killsIndex >= 0 ? row[mapping.killsIndex] : '0';
    const kills = parseInt(String(killsStr).replace(/[^0-9-]/g, ''), 10) || 0;

    const bonusStr = mapping.bonusIndex >= 0 ? row[mapping.bonusIndex] : '0';
    const bonus = parseInt(String(bonusStr).replace(/[^0-9-]/g, ''), 10) || 0;

    const penaltyStr = mapping.penaltyIndex >= 0 ? row[mapping.penaltyIndex] : '0';
    const penalty = parseInt(String(penaltyStr).replace(/[^0-9-]/g, ''), 10) || 0;

    const matched = findTeamMatch(teamName, existingTeams);
    const teamId = matched ? matched.id : teamName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    entries.push({
      teamId,
      placement,
      kills,
      bonus,
      penalty,
    });
  });

  return entries;
}
