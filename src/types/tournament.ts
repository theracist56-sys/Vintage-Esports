export interface ScoringRule {
  killPoints: number;
  placementPoints: Record<number, number>; // 1 -> 12, 2 -> 9, etc.
  wwcdBonus: number; // Win / Booyah bonus
  survivalBonus: number;
  customBonus: number;
  penaltyPoints: number;
  allowNegativePoints: boolean;
}

export type TieBreakerCriterion =
  | 'totalPoints'
  | 'totalKills'
  | 'placementPoints'
  | 'wwcdCount'
  | 'bestMatchScore';

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo: string; // URL, data URL, or SVG
  group?: string; // e.g. 'Pot 1', 'Pot 2', 'Group A'
  color?: string;
  players?: string[];
}

export interface MatchTeamEntry {
  teamId: string;
  placement: number;
  kills: number;
  bonus?: number;
  penalty?: number;
  playerKills?: Record<string, number>;
}

export interface CalculatedMatchResult extends MatchTeamEntry {
  killPoints: number;
  placementPoints: number;
  totalPoints: number;
  isWWCD: boolean;
}

export type EsportsMap =
  | 'Bermuda'
  | 'Purgatory'
  | 'Alpine'
  | 'NexTerra'
  | 'Kalahari'
  | 'Solara';

export interface Match {
  id: string;
  matchNumber: number;
  name: string;
  map: EsportsMap;
  date: string;
  time: string;
  entries: MatchTeamEntry[];
  mvp?: {
    teamId: string;
    playerName: string;
    kills: number;
    damage?: number;
  };
}

export interface TeamStanding {
  rank: number;
  previousRank?: number;
  team: Team;
  matchesPlayed: number;
  matchPoints: Record<string, number>; // matchId -> totalPoints
  matchKills: Record<string, number>;  // matchId -> kills
  totalKills: number;
  totalPlacementPoints: number;
  totalKillPoints: number;
  totalBonus: number;
  totalPenalty: number;
  totalPoints: number;
  wwcdCount: number; // Booyah!
  bestMatchScore: number;
  worstMatchScore: number;
  avgKills: number;
  avgPoints: number;
  killPercentage: number;
  isQualified: boolean;
}

export type TemplateCategory =
  | 'points_table'
  | 'results'
  | 'team_list'
  | 'championship'
  | 'player_mvp';

export type TemplateStyle =
  | 'vintage_gold'
  | 'neon_purple' // like reference image
  | 'cyber_black'
  | 'pro_league'
  | 'tactical_red'
  | 'royal_championship'
  | 'minimal_pro'
  | 'aurora_green'
  | 'cyber_neon'
  | 'phantom_purple'
  | 'apex_orange';

export interface GraphicTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  style: TemplateStyle;
  badge?: string;
  description: string;
  thumbnailGradient: string;
  teamCountVariation: number | 'custom';
  layoutType:
    | 'single_table'
    | 'dual_pot_table' // POT 1 & POT 2 side by side
    | 'match_results'
    | 'top3_podium'
    | 'top5_list'
    | 'team_grid' // STANDING TEAM cards
    | 'mvp_showcase'
    | 'tournament_poster' // TWO DAYS UNITY TOURNAMENT style
    | 'bpc_ultraviolet' // Reference Image 1: BPC Camp Ultraviolet Points Table with Trophy Shield
    | 'pmes_tactical_red' // Reference Image 2: PMES Dual Parallelogram Slanted Fixtures
    | 'greek_gods_gold' // Reference Image 3: Greek Gods 3D Glossy Yellow Capsules
    | 'vintage_obsidian_gold' // App Signature Vintage Esports Gold Theme
    | 'booyah_yellow_carbon' // Free Fire Official Booyah Yellow & Carbon
    | 'cyber_neon_toxic' // Acid Neon Cyber Matrix
    | 'crimson_apex_blood' // Blood Red & Carbon Combat
    | 'royal_violet_gold' // Imperial Purple & Gold Majesty
    | 'frostbite_nordic_cyan' // Arctic Glacier Blue
    | 'shadow_monarch_stealth' // Titanium & Monochrome Onyx
    | 'titan_desert_mirage' // Sandstone & Camo
    | 'valkyrie_rose_gold' // Cyberpunk Magenta & Rose Gold
    | 'mvp_vintage_gold' // Vintage Gold MVP Showcase
    | 'mvp_bpc_ultraviolet' // BPC Ultraviolet MVP
    | 'top_predators_tactical' // Top 5 Fraggers / Kill Leaders
    | 'mvp_greek_gods' // Greek Gods Glossy MVP
    | 'slots_vintage_gold_12' // 12-Slot Vintage Gold Matrix
    | 'slots_pmes_tactical_18' // 18-Slot PMES Slanted Tactical Slots
    | 'slots_bpc_groups' // BPC Group Stage Slots
    | 'slots_booyah_grid' // Booyah Battle Royale Slot Board
    | 'glory_grand_finals' // Championship Gold & Diamond Trophy Podium
    | 'apex_predators_overdrive' // Electric Orange & Carbon Battle Royale
    | 'phantom_monarch_purple' // Cosmic Void Nebula & Obsidian Purple
    | 'inferno_warlord_crimson' // Molten Lava Embers & Fire Crimson
    | 'aurora_borealis_esports' // Emerald Green & Teal Matrix
    | 'tokyo_cyber_neon_nights' // Synthwave Pink & Electric Cyan
    | 'stealth_specops_military' // Tactical Dark Olive & Stencil Grid
    | 'golden_emperor_crown' // Pure White & 24K Royal Gold Dynasty
    | 'dragons_fury_blood_red' // Crimson Red & Dragon Gold Asian Cup
    | 'nova_galaxy_nebula' // Interstellar Starfield & Starlight Blue
    | 'titanium_industrial_steel' // Brushed Steel & Industrial Chevron
    | 'slots_glory_championship_12' // 12-Slot Grand Finals Gold Board
    | 'ffml_ice_diamond' // Image 1: Free Fire Master League Ice Cyan/Diamond Overall Standings
    | 'pubg_pro_toxic_24' // Image 2: PUBG Pro League Toxic Neon Green 24-Team Dual Column Leaderboard
    | 'genesis_cyber_magenta' // Image 3: GNS Genesis Cyber Magenta Tabela de Pontos
    | 'pmes_crimson_fixtures' // Image 4: PMES Crimson Red Slanted Chevrons Fixtures & Slots
    | 'red_wolf_mvp_tabela' // Image 5: Red Wolf E-Sports Tabela de Pontuação & MVP Combo Split
    | 'cpxs_tabela_geral_gold' // Image 6: CPXS Streetwear Gold Graffiti Tabela Geral
    | 'pmnc_vietnam_20' // 1. PMNC 2023 Vietnam 20-Team Overall Standings & 5 WWCD Winner Capsules
    | 'bgmi_grands_teams_playing' // 2. BGMI / FF Golden 3D 18-Team Grand Finals Slots Board
    | 'xtreino_ff_red_top3' // 3. Xtreino Corujao Free Fire 12-Team Dual Column & 3 Winner Podium Blocks
    | 'top3_melhores_banners' // 4. Top 3 Melhores da Rodada Medieval V-Shaped Crest Banners
    | 'elite_rank_mvp_yellow' // 5. Elite Rank Yellow Bold Stencil MVP Showcase Poster
    | 'clash_of_titans_green' // 6. Clash of Titans Season 4 Curved Lime Green 12-Team Table
    | 'meet_the_teams_red' // 7. Meet The Teams Dota 2 / Battle Royale 12 Crimson Roster Cards
    | 'jadwal_esports_fixtures' // 8. Jadwal Esports Hari Ini Multi-Game Match Fixtures Schedule
    | 'ewc_pools_seeding_16' // 9. Esports World Cup 16-Team 4-Pools Matrix
    | 'pcci_storm_purple_20' // 10. Storm Esports / PCCI 20-Slot Glowing Purple Matrix
    | 'warrior_cup_ff_slots_16'; // 11. Warrior Cup Free Fire 16-Team Slot Grid Board
  settings: {
    accentColor: string;
    secondaryColor: string;
    bgStyle: 'cyber_grid' | 'dark_gradient' | 'freefire_purple' | 'gold_luxury' | 'tactical_hex' | 'custom';
    showKills: boolean;
    showPlacement: boolean;
    showMatchBreakdown: boolean;
    showCharacterArt: boolean;
    showSocialFooter: boolean;
    headerTitle: string;
    headerSubtitle: string;
    qualificationCutoff: number;
    customBgUrl?: string;
    customBgOpacity?: number;
    customBgDarkness?: number;
    customBgBlur?: number;
    customBgFit?: 'cover' | 'contain' | 'center';
  };
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface TournamentConfig {
  id: string;
  name: string;
  season: string;
  subTitle: string;
  prizePool: string;
  organizer: string;
  organizerLogo?: string;
  sponsorLogo?: string;
  feeRegister?: string;
  openSlots?: string;
  mainEventDates?: string;
  contactInfo: {
    whatsapp1: string;
    whatsapp2: string;
    instagram: string;
    youtube: string;
  };
  scoringRule: ScoringRule;
  tieBreakers: TieBreakerCriterion[];
  qualificationSlots: number;
  teams: Team[];
  matches: Match[];
  selectedTemplateId: string;
}
