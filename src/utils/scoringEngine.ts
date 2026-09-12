import {
  ScoringRule,
  Team,
  Match,
  MatchTeamEntry,
  CalculatedMatchResult,
  TeamStanding,
  TieBreakerCriterion,
} from '../types/tournament';

/**
 * Calculates points for a single team in a single match.
 * Formula: TOTAL MATCH POINTS = KILL POINTS + PLACEMENT POINTS + BONUS - PENALTY
 */
export function calculateMatchEntry(
  entry: MatchTeamEntry,
  rule: ScoringRule
): CalculatedMatchResult {
  const killPoints = Math.max(0, entry.kills || 0) * (rule.killPoints || 1);
  const placementPoints = rule.placementPoints[entry.placement] ?? 0;
  const isWWCD = entry.placement === 1;
  const wwcdBonus = isWWCD ? (rule.wwcdBonus || 0) : 0;
  const bonus = (entry.bonus || 0) + wwcdBonus;
  const penalty = entry.penalty || 0;

  let totalPoints = killPoints + placementPoints + bonus - penalty;
  if (!rule.allowNegativePoints && totalPoints < 0) {
    totalPoints = 0;
  }

  return {
    ...entry,
    killPoints,
    placementPoints,
    totalPoints,
    isWWCD,
  };
}

/**
 * Recalculates full tournament standings across all teams and matches
 * Applies tie-breakers dynamically according to organizer's chosen priority.
 */
export function calculateTournamentStandings(
  teams: Team[],
  matches: Match[],
  rule: ScoringRule,
  tieBreakers: TieBreakerCriterion[] = [
    'totalPoints',
    'totalKills',
    'placementPoints',
    'wwcdCount',
    'bestMatchScore',
  ],
  qualificationSlots: number = 6
): TeamStanding[] {
  // Aggregate stats per team
  const standingsMap: Record<string, TeamStanding> = {};

  // Initialize for all registered teams
  teams.forEach((team) => {
    standingsMap[team.id] = {
      rank: 0,
      team,
      matchesPlayed: 0,
      matchPoints: {},
      matchKills: {},
      totalKills: 0,
      totalPlacementPoints: 0,
      totalKillPoints: 0,
      totalBonus: 0,
      totalPenalty: 0,
      totalPoints: 0,
      wwcdCount: 0,
      bestMatchScore: 0,
      worstMatchScore: 9999,
      avgKills: 0,
      avgPoints: 0,
      killPercentage: 0,
      isQualified: false,
    };
  });

  // Calculate each match
  matches.forEach((match) => {
    match.entries.forEach((entry) => {
      let standing = standingsMap[entry.teamId];
      if (!standing) {
        // If team was added dynamically during match entry
        const fallbackTeam: Team = {
          id: entry.teamId,
          name: entry.teamId.replace(/_/g, ' '),
          tag: entry.teamId.substring(0, 4).toUpperCase(),
          logo: '',
          group: 'Pot 1',
        };
        standing = {
          rank: 0,
          team: fallbackTeam,
          matchesPlayed: 0,
          matchPoints: {},
          matchKills: {},
          totalKills: 0,
          totalPlacementPoints: 0,
          totalKillPoints: 0,
          totalBonus: 0,
          totalPenalty: 0,
          totalPoints: 0,
          wwcdCount: 0,
          bestMatchScore: 0,
          worstMatchScore: 9999,
          avgKills: 0,
          avgPoints: 0,
          killPercentage: 0,
          isQualified: false,
        };
        standingsMap[entry.teamId] = standing;
      }

      const calculated = calculateMatchEntry(entry, rule);

      standing.matchesPlayed += 1;
      standing.matchPoints[match.id] = calculated.totalPoints;
      standing.matchKills[match.id] = calculated.kills;
      standing.totalKills += calculated.kills;
      standing.totalPlacementPoints += calculated.placementPoints;
      standing.totalKillPoints += calculated.killPoints;
      standing.totalBonus += (calculated.bonus || 0);
      standing.totalPenalty += (calculated.penalty || 0);
      standing.totalPoints += calculated.totalPoints;

      if (calculated.isWWCD) {
        standing.wwcdCount += 1;
      }

      if (calculated.totalPoints > standing.bestMatchScore) {
        standing.bestMatchScore = calculated.totalPoints;
      }
      if (calculated.totalPoints < standing.worstMatchScore) {
        standing.worstMatchScore = calculated.totalPoints;
      }
    });
  });

  // Compute averages
  const standingsList = Object.values(standingsMap).map((s) => {
    if (s.matchesPlayed === 0) {
      s.worstMatchScore = 0;
    }
    s.avgKills = s.matchesPlayed > 0 ? Number((s.totalKills / s.matchesPlayed).toFixed(1)) : 0;
    s.avgPoints = s.matchesPlayed > 0 ? Number((s.totalPoints / s.matchesPlayed).toFixed(1)) : 0;
    return s;
  });

  // Calculate tournament total kills for percentage
  const grandTotalKills = standingsList.reduce((sum, s) => sum + s.totalKills, 0);
  standingsList.forEach((s) => {
    s.killPercentage = grandTotalKills > 0 ? Number(((s.totalKills / grandTotalKills) * 100).toFixed(1)) : 0;
  });

  // Sort by organizer's tie-breaker priorities
  standingsList.sort((a, b) => {
    for (const criterion of tieBreakers) {
      let diff = 0;
      switch (criterion) {
        case 'totalPoints':
          diff = b.totalPoints - a.totalPoints;
          break;
        case 'totalKills':
          diff = b.totalKills - a.totalKills;
          break;
        case 'placementPoints':
          diff = b.totalPlacementPoints - a.totalPlacementPoints;
          break;
        case 'wwcdCount':
          diff = b.wwcdCount - a.wwcdCount;
          break;
        case 'bestMatchScore':
          diff = b.bestMatchScore - a.bestMatchScore;
          break;
      }
      if (diff !== 0) return diff;
    }
    // Final deterministic fallback
    return a.team.name.localeCompare(b.team.name);
  });

  // Assign ranks & qualification flags
  return standingsList.map((standing, index) => ({
    ...standing,
    rank: index + 1,
    isQualified: (index + 1) <= qualificationSlots,
  }));
}
