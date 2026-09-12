import { TournamentConfig, Team } from '../types/tournament';
import { SCORING_PRESETS } from './scoringPresets';

// High-fidelity SVG logo generators for esports teams
export const createEsportsSvgLogo = (name: string, bg: string, accent: string, symbol: string) => {
  const initial = name.replace(/Team\s+/i, '').substring(0, 2).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g_${initial}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#0a0c16" />
      </linearGradient>
      <linearGradient id="a_${initial}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accent}" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>
    </defs>
    <polygon points="50,4 94,22 84,82 50,98 16,82 6,22" fill="url(%23g_${initial})" stroke="${accent}" stroke-width="3.5" />
    <polygon points="50,14 84,28 76,74 50,88 24,74 16,28" fill="#131522" opacity="0.85" />
    <path d="${symbol}" fill="${accent}" opacity="0.9" />
    <text x="50" y="58" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initial}</text>
  </svg>`;
};

// Distinct symbols for esports shields
export const SYMBOLS = {
  crown: 'M50 24 L56 34 L66 28 L62 42 L38 42 L34 28 L44 34 Z',
  flame: 'M50 20 C54 28 60 30 62 38 C64 44 60 48 50 48 C40 48 36 44 38 38 C40 30 46 28 50 20 Z',
  shield: 'M50 22 L62 26 L62 36 C62 44 50 48 50 48 C50 48 38 44 38 36 L38 26 Z',
  skull: 'M42 26 C42 22 58 22 58 26 L60 34 C60 38 56 42 50 42 C44 42 40 38 40 34 Z',
  lightning: 'M52 20 L42 32 L49 32 L46 44 L58 31 L50 31 Z',
  star: 'M50 20 L53 28 L62 28 L55 33 L57 41 L50 36 L43 41 L45 33 L38 28 L47 28 Z',
  wolf: 'M50 20 L58 32 L68 28 L60 40 L56 46 L50 42 L44 46 L40 40 L32 28 L42 32 Z',
  dragon: 'M50 18 L64 26 L58 36 L66 42 L50 48 L34 42 L42 36 L36 26 Z',
  falcon: 'M50 22 L68 26 L58 34 L64 46 L50 38 L36 46 L42 34 L32 26 Z',
  cobra: 'M50 20 C58 20 64 26 64 34 C64 42 56 46 50 48 C44 46 36 42 36 34 C36 26 42 20 50 20 Z',
  tiger: 'M40 22 L46 28 L54 28 L60 22 L62 32 L50 46 L38 32 Z',
};

export const LOGO_PRESETS_LIST = [
  { id: 'wolf', label: 'Red Wolf', symbol: SYMBOLS.wolf, bg: '#ef4444', accent: '#fca5a5' },
  { id: 'crown', label: 'Royal Crown', symbol: SYMBOLS.crown, bg: '#eab308', accent: '#fef08a' },
  { id: 'dragon', label: 'Dragon Fury', symbol: SYMBOLS.dragon, bg: '#dc2626', accent: '#fbbf24' },
  { id: 'falcon', label: 'Sky Falcon', symbol: SYMBOLS.falcon, bg: '#0284c7', accent: '#38bdf8' },
  { id: 'shield', label: 'Aegis Shield', symbol: SYMBOLS.shield, bg: '#3b82f6', accent: '#93c5fd' },
  { id: 'skull', label: 'Apex Skull', symbol: SYMBOLS.skull, bg: '#71717a', accent: '#e4e4e7' },
  { id: 'flame', label: 'Inferno Flame', symbol: SYMBOLS.flame, bg: '#f97316', accent: '#fdba74' },
  { id: 'cobra', label: 'Viper Cobra', symbol: SYMBOLS.cobra, bg: '#10b981', accent: '#6ee7b7' },
  { id: 'lightning', label: 'Volt Bolt', symbol: SYMBOLS.lightning, bg: '#eab308', accent: '#facc15' },
  { id: 'star', label: 'Nova Star', symbol: SYMBOLS.star, bg: '#8b5cf6', accent: '#c4b5fd' },
  { id: 'tiger', label: 'Wild Tiger', symbol: SYMBOLS.tiger, bg: '#ea580c', accent: '#fed7aa' },
];

export const DEFAULT_TEAMS: Team[] = [
  {
    id: 'team_alpha',
    name: 'Team Alpha',
    tag: 'ALPHA',
    logo: createEsportsSvgLogo('Team Alpha', '#8b5cf6', '#a855f7', SYMBOLS.crown),
    group: 'Pot 1',
    color: '#8b5cf6',
    players: ['Alpha_Ghost', 'Alpha_Striker', 'Alpha_Viper', 'Alpha_Ace'],
  },
  {
    id: 'team_bravo',
    name: 'Team Bravo',
    tag: 'BRAVO',
    logo: createEsportsSvgLogo('Team Bravo', '#3b82f6', '#60a5fa', SYMBOLS.shield),
    group: 'Pot 1',
    color: '#3b82f6',
    players: ['Bravo_Rex', 'Bravo_Bolt', 'Bravo_Shadow', 'Bravo_Titan'],
  },
  {
    id: 'team_charlie',
    name: 'Team Charlie',
    tag: 'CHARLIE',
    logo: createEsportsSvgLogo('Team Charlie', '#eab308', '#facc15', SYMBOLS.lightning),
    group: 'Pot 1',
    color: '#eab308',
    players: ['Charlie_Pyro', 'Charlie_Blaze', 'Charlie_Havoc', 'Charlie_Storm'],
  },
  {
    id: 'team_delta',
    name: 'Team Delta',
    tag: 'DELTA',
    logo: createEsportsSvgLogo('Team Delta', '#ef4444', '#f87171', SYMBOLS.flame),
    group: 'Pot 1',
    color: '#ef4444',
    players: ['Delta_Reaper', 'Delta_Venom', 'Delta_Kage', 'Delta_Apex'],
  },
  {
    id: 'team_echo',
    name: 'Team Echo',
    tag: 'ECHO',
    logo: createEsportsSvgLogo('Team Echo', '#10b981', '#34d399', SYMBOLS.star),
    group: 'Pot 1',
    color: '#10b981',
    players: ['Echo_Vortex', 'Echo_Pulse', 'Echo_Nova', 'Echo_Flash'],
  },
  {
    id: 'team_foxtrot',
    name: 'Team Foxtrot',
    tag: 'FOXTROT',
    logo: createEsportsSvgLogo('Team Foxtrot', '#ec4899', '#f472b6', SYMBOLS.skull),
    group: 'Pot 1',
    color: '#ec4899',
    players: ['Fox_Hunter', 'Fox_Slayer', 'Fox_Rogue', 'Fox_Phantom'],
  },
  {
    id: 'team_genesis',
    name: 'Team Genesis',
    tag: 'GENESIS',
    logo: createEsportsSvgLogo('Team Genesis', '#06b6d4', '#22d3ee', SYMBOLS.crown),
    group: 'Pot 2',
    color: '#06b6d4',
    players: ['Gen_Godlike', 'Gen_Immortal', 'Gen_Valkyrie', 'Gen_Zero'],
  },
  {
    id: 'team_hydra',
    name: 'Team Hydra',
    tag: 'HYDRA',
    logo: createEsportsSvgLogo('Team Hydra', '#6366f1', '#818cf8', SYMBOLS.shield),
    group: 'Pot 2',
    color: '#6366f1',
    players: ['Hydra_Dynamo', 'Hydra_Kratos', 'Hydra_Ronin', 'Hydra_Frenzy'],
  },
  {
    id: 'team_ignite',
    name: 'Team Ignite',
    tag: 'IGNITE',
    logo: createEsportsSvgLogo('Team Ignite', '#f97316', '#fb923c', SYMBOLS.flame),
    group: 'Pot 2',
    color: '#f97316',
    players: ['Ignite_Inferno', 'Ignite_Spark', 'Ignite_Blast', 'Ignite_Cinder'],
  },
  {
    id: 'team_juggernaut',
    name: 'Team Juggernaut',
    tag: 'JUGGER',
    logo: createEsportsSvgLogo('Team Juggernaut', '#84cc16', '#a3e635', SYMBOLS.lightning),
    group: 'Pot 2',
    color: '#84cc16',
    players: ['Jugger_Tank', 'Jugger_Brute', 'Jugger_Armor', 'Jugger_Rampage'],
  },
  {
    id: 'team_kraken',
    name: 'Team Kraken',
    tag: 'KRAKEN',
    logo: createEsportsSvgLogo('Team Kraken', '#14b8a6', '#2dd4bf', SYMBOLS.star),
    group: 'Pot 2',
    color: '#14b8a6',
    players: ['Kraken_Abyss', 'Kraken_Tidal', 'Kraken_Leviathan', 'Kraken_Surge'],
  },
  {
    id: 'team_luna',
    name: 'Team Luna',
    tag: 'LUNA',
    logo: createEsportsSvgLogo('Team Luna', '#d946ef', '#e879f9', SYMBOLS.skull),
    group: 'Pot 2',
    color: '#d946ef',
    players: ['Luna_Eclipse', 'Luna_Astral', 'Luna_Cosmic', 'Luna_Starlight'],
  },
];

export const INITIAL_TOURNAMENT: TournamentConfig = {
  id: 'vintage_s3_unity',
  name: 'TWO DAYS UNITY TOURNAMENT',
  season: 'SEASON 3',
  subTitle: 'QUALIFICATION ROAD TO SEMIFINAL',
  prizePool: 'RP 550.000',
  organizer: 'VINTAGE ESPORTS',
  organizerLogo: '',
  sponsorLogo: '',
  feeRegister: 'RP 20.000',
  openSlots: '48 TEAMS (4 POTS)',
  mainEventDates: '22-24 APRIL 2026',
  contactInfo: {
    whatsapp1: '085212275701',
    whatsapp2: '085713028749',
    instagram: '@vintage.esports',
    youtube: 'VINTAGE ESPORTS TV',
  },
  scoringRule: SCORING_PRESETS[0].rule, // FFWS Official 12-pt
  tieBreakers: ['totalPoints', 'totalKills', 'placementPoints', 'wwcdCount', 'bestMatchScore'],
  qualificationSlots: 6, // #1-6 Road to Semifinal
  teams: DEFAULT_TEAMS,
  matches: [
    {
      id: 'match_01',
      matchNumber: 1,
      name: 'MATCH 01 — BERMUDA',
      map: 'Bermuda',
      date: '2026-04-22',
      time: '19:00 WIB',
      entries: [
        { teamId: 'team_alpha', placement: 1, kills: 8, bonus: 0, penalty: 0 },
        { teamId: 'team_bravo', placement: 2, kills: 5, bonus: 0, penalty: 0 },
        { teamId: 'team_charlie', placement: 3, kills: 10, bonus: 0, penalty: 0 },
        { teamId: 'team_delta', placement: 4, kills: 3, bonus: 0, penalty: 0 },
        { teamId: 'team_echo', placement: 5, kills: 4, bonus: 0, penalty: 0 },
        { teamId: 'team_foxtrot', placement: 6, kills: 2, bonus: 0, penalty: 0 },
        { teamId: 'team_genesis', placement: 7, kills: 6, bonus: 0, penalty: 0 },
        { teamId: 'team_hydra', placement: 8, kills: 1, bonus: 0, penalty: 0 },
        { teamId: 'team_ignite', placement: 9, kills: 3, bonus: 0, penalty: 0 },
        { teamId: 'team_juggernaut', placement: 10, kills: 2, bonus: 0, penalty: 0 },
        { teamId: 'team_kraken', placement: 11, kills: 0, bonus: 0, penalty: 0 },
        { teamId: 'team_luna', placement: 12, kills: 1, bonus: 0, penalty: 0 },
      ],
      mvp: {
        teamId: 'team_charlie',
        playerName: 'Charlie_Pyro',
        kills: 6,
        damage: 1420,
      },
    },
    {
      id: 'match_02',
      matchNumber: 2,
      name: 'MATCH 02 — PURGATORY',
      map: 'Purgatory',
      date: '2026-04-22',
      time: '19:45 WIB',
      entries: [
        { teamId: 'team_bravo', placement: 1, kills: 9, bonus: 0, penalty: 0 },
        { teamId: 'team_alpha', placement: 2, kills: 6, bonus: 0, penalty: 0 },
        { teamId: 'team_genesis', placement: 3, kills: 7, bonus: 0, penalty: 0 },
        { teamId: 'team_charlie', placement: 4, kills: 4, bonus: 0, penalty: 0 },
        { teamId: 'team_delta', placement: 5, kills: 5, bonus: 0, penalty: 0 },
        { teamId: 'team_echo', placement: 6, kills: 2, bonus: 0, penalty: 0 },
        { teamId: 'team_hydra', placement: 7, kills: 3, bonus: 0, penalty: 0 },
        { teamId: 'team_foxtrot', placement: 8, kills: 3, bonus: 0, penalty: 0 },
        { teamId: 'team_ignite', placement: 9, kills: 1, bonus: 0, penalty: 0 },
        { teamId: 'team_juggernaut', placement: 10, kills: 1, bonus: 0, penalty: 0 },
        { teamId: 'team_luna', placement: 11, kills: 2, bonus: 0, penalty: 0 },
        { teamId: 'team_kraken', placement: 12, kills: 0, bonus: 0, penalty: 0 },
      ],
      mvp: {
        teamId: 'team_bravo',
        playerName: 'Bravo_Rex',
        kills: 5,
        damage: 1280,
      },
    },
  ],
  selectedTemplateId: 'unity_standing_point',
};
