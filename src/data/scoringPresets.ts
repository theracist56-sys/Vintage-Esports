import { ScoringRule } from '../types/tournament';

export interface ScoringPreset {
  id: string;
  name: string;
  description: string;
  rule: ScoringRule;
}

export const SCORING_PRESETS: ScoringPreset[] = [
  {
    id: 'ffws_official',
    name: 'Official Free Fire World Series (12-Pt System)',
    description: 'Standard competitive FFWS point matrix (1st: 12pts, 2nd: 9pts, 3rd: 8pts... 10th: 1pt, Kill: 1pt)',
    rule: {
      killPoints: 1,
      placementPoints: {
        1: 12,
        2: 9,
        3: 8,
        4: 7,
        5: 6,
        6: 5,
        7: 4,
        8: 3,
        9: 2,
        10: 1,
        11: 0,
        12: 0,
      },
      wwcdBonus: 0,
      survivalBonus: 0,
      customBonus: 0,
      penaltyPoints: 0,
      allowNegativePoints: false,
    },
  },
  {
    id: 'vintage_classic_15',
    name: 'Vintage Esports Classic (15-Pt System)',
    description: 'High placement incentive: 1st: 15pts, 2nd: 12pts, 3rd: 10pts, 4th: 8pts, 5th: 6pts, 6th: 4pts, 7th: 2pts, 8th: 1pt',
    rule: {
      killPoints: 1,
      placementPoints: {
        1: 15,
        2: 12,
        3: 10,
        4: 8,
        5: 6,
        6: 4,
        7: 2,
        8: 1,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      wwcdBonus: 3, // Bonus for Booyah!
      survivalBonus: 0,
      customBonus: 0,
      penaltyPoints: 0,
      allowNegativePoints: true,
    },
  },
  {
    id: 'modern_10_pt',
    name: 'Esports 10-Point Fast Pace',
    description: '1st: 10, 2nd: 6, 3rd: 5, 4th: 4, 5th: 3, 6th: 2, 7th: 1, 8th: 1, 9th: 0, 10th: 0',
    rule: {
      killPoints: 1,
      placementPoints: {
        1: 10,
        2: 6,
        3: 5,
        4: 4,
        5: 3,
        6: 2,
        7: 1,
        8: 1,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      wwcdBonus: 0,
      survivalBonus: 0,
      customBonus: 0,
      penaltyPoints: 0,
      allowNegativePoints: false,
    },
  },
  {
    id: 'kill_rush_bounty',
    name: 'Aggressive Kill Rush (2-Pt Kills)',
    description: 'High bounty for aggressive teams: 2 points per kill with standard 12 placement points',
    rule: {
      killPoints: 2,
      placementPoints: {
        1: 12,
        2: 9,
        3: 8,
        4: 7,
        5: 6,
        6: 5,
        7: 4,
        8: 3,
        9: 2,
        10: 1,
        11: 0,
        12: 0,
      },
      wwcdBonus: 2,
      survivalBonus: 0,
      customBonus: 0,
      penaltyPoints: 0,
      allowNegativePoints: true,
    },
  },
];
