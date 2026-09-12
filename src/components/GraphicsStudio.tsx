import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  TournamentConfig, 
  TeamStanding, 
  Match, 
  GraphicTemplate, 
  Team 
} from '../types/tournament';
import { TEMPLATE_LIBRARY } from '../data/templates';
import { EsportsTemplateRenderer } from './EsportsTemplateRenderer';
import { VintageEsportsLogo } from './VintageEsportsLogo';
import { TeamLogoEditorModal } from './TeamLogoEditorModal';
import { createEsportsSvgLogo, LOGO_PRESETS_LIST } from '../data/defaultTournament';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Sparkles, 
  Palette, 
  Sliders, 
  Layout, 
  Trophy, 
  Share2, 
  Eye, 
  Check, 
  Copy, 
  Flame, 
  Shield, 
  Layers, 
  Users, 
  Crown,
  Crosshair,
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Award,
  Edit3,
  Pencil,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  FileText,
  Calendar,
  Clock,
  Gamepad2,
  ChevronRight,
  Plus,
  Type,
  Calculator,
  BarChart3,
  Tv,
  CornerDownRight,
  Maximize2,
  X
} from 'lucide-react';

export interface PosterOverlay {
  id: string;
  type: 'logo' | 'text';
  content: string; // image url/dataUrl or text
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'header-badge';
  size: 'sm' | 'md' | 'lg' | 'xl';
  opacity: number;
  label?: string;
  badgeStyle?: 'gold' | 'neon' | 'crimson' | 'cyber' | 'minimal';
}

const PRESET_OVERLAY_LOGOS = [
  { id: 'trophy', name: 'Esports Trophy', icon: Trophy, color: '#eab308' },
  { id: 'crown', name: 'Champion Crown', icon: Crown, color: '#facc15' },
  { id: 'flame', name: 'Kill Leader Flame', icon: Flame, color: '#ef4444' },
  { id: 'shield', name: 'Tactical Shield', icon: Shield, color: '#3b82f6' },
  { id: 'crosshair', name: 'Sniper Crosshair', icon: Crosshair, color: '#10b981' },
];

const PRESET_FONTS = [
  { id: "'Teko', sans-serif", name: 'Teko (Condensed Bold)' },
  { id: "'Bebas Neue', sans-serif", name: 'Bebas Neue (Heavy Impact)' },
  { id: "'Anton', sans-serif", name: 'Anton (Ultra Display)' },
  { id: "'Russo One', sans-serif", name: 'Russo One (Military Sci-Fi)' },
  { id: "'Orbitron', sans-serif", name: 'Orbitron (Futuristic Cyber)' },
  { id: "'Black Ops One', sans-serif", name: 'Black Ops One (Tactical Stencil)' },
  { id: "'Cinzel', serif", name: 'Cinzel (Royal Vintage Gold)' },
  { id: "'Chakra Petch', sans-serif", name: 'Chakra Petch (Modern Esports)' },
  { id: "'Rajdhani', sans-serif", name: 'Rajdhani (Clean Tournament)' },
  { id: "'Montserrat', sans-serif", name: 'Montserrat (Modern Bold)' },
  { id: "'Oswald', sans-serif", name: 'Oswald (Sharp Condensed)' },
  { id: "'Audiowide', sans-serif", name: 'Audiowide (Cyberpunk)' },
  { id: "'Righteous', cursive", name: 'Righteous (Retro Neon)' },
  { id: "'Syne', sans-serif", name: 'Syne (Avant-Garde Street)' },
];

interface GraphicsStudioProps {
  tournament: TournamentConfig;
  standings: TeamStanding[];
  matches: Match[];
  initialLayoutType?: string;
  onUpdateTournament: (config: TournamentConfig) => void;
}

export const GraphicsStudio: React.FC<GraphicsStudioProps> = ({
  tournament,
  standings,
  matches,
  initialLayoutType = 'vintage_obsidian_gold',
  onUpdateTournament,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Active template state
  const [activeTemplate, setActiveTemplate] = useState<GraphicTemplate>(() => {
    if (initialLayoutType) {
      const byLayout = TEMPLATE_LIBRARY.find((t) => t.layoutType === initialLayoutType);
      if (byLayout) return byLayout;
    }
    const found = TEMPLATE_LIBRARY.find((t) => t.id === tournament.selectedTemplateId);
    return found || TEMPLATE_LIBRARY[0];
  });

  // Navigation tab: 'themes' | 'teams' | 'scoring' | 'fonts' | 'overlays' | 'design'
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'themes' | 'teams' | 'scoring' | 'fonts' | 'overlays' | 'design'
  >('themes');

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Typography state
  const [headlineFont, setHeadlineFont] = useState<string>("'Teko', sans-serif");
  const [bodyFont, setBodyFont] = useState<string>("'Rajdhani', sans-serif");
  const [numbersFont, setNumbersFont] = useState<string>("'Teko', sans-serif");
  const [customFontInput, setCustomFontInput] = useState<string>('');
  const [loadedCustomFonts, setLoadedCustomFonts] = useState<string[]>([]);

  // Function to load dynamic Google Fonts
  const handleLoadCustomFont = (fontName: string) => {
    const clean = fontName.trim();
    if (!clean) return;
    const fontId = `'${clean}', sans-serif`;
    const linkId = `gfont-${clean.toLowerCase().replace(/\s+/g, '-')}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean)}:wght@400;700;900&display=swap`;
      document.head.appendChild(link);
    }
    if (!loadedCustomFonts.includes(clean)) {
      setLoadedCustomFonts((prev) => [...prev, clean]);
    }
    setHeadlineFont(fontId);
    setCustomFontInput('');
  };

  // Editable canvas design parameters
  const [titleText, setTitleText] = useState<string>(activeTemplate.settings.headerTitle || 'OFFICIAL STANDINGS');
  const [subtitleText, setSubtitleText] = useState<string>(
    activeTemplate.settings.headerSubtitle || 'VINTAGE ESPORTS CHAMPIONSHIP'
  );
  const [accentColor, setAccentColor] = useState<string>(activeTemplate.settings.accentColor || '#eab308');
  const [teamCount, setTeamCount] = useState<number>(
    typeof activeTemplate.teamCountVariation === 'number' ? activeTemplate.teamCountVariation : 12
  );
  const [showKillsCol, setShowKillsCol] = useState<boolean>(activeTemplate.settings.showKills ?? true);
  const [showPlacementCol, setShowPlacementCol] = useState<boolean>(activeTemplate.settings.showPlacement ?? false);
  const [showCharacters, setShowCharacters] = useState<boolean>(activeTemplate.settings.showCharacterArt ?? false);
  const [showSocials, setShowSocials] = useState<boolean>(activeTemplate.settings.showSocialFooter ?? true);
  const [qualificationCutoff, setQualificationCutoff] = useState<number>(tournament.qualificationSlots || 6);

  // Quality & Graphic Elements enhancement toggles
  const [showKillGraph, setShowKillGraph] = useState<boolean>(false);
  const [showPointsBars, setShowPointsBars] = useState<boolean>(true);
  const [showCornerBrackets, setShowCornerBrackets] = useState<boolean>(true);
  const [showScanlines, setShowScanlines] = useState<boolean>(false);
  const [showVignette, setShowVignette] = useState<boolean>(true);
  const [showHazardRibbon, setShowHazardRibbon] = useState<boolean>(false);
  const [exportResolution, setExportResolution] = useState<'1080p' | '2k' | '4k'>('1080p');

  // Additional editable poster parameters (Dates, Phases, Sponsors, MVP)
  const [customPhase, setCustomPhase] = useState<string>('SEMI FINAL');
  const [customGroup, setCustomGroup] = useState<string>('GROUP - A');
  const [customDate, setCustomDate] = useState<string>('15 APRIL');
  const [customTime, setCustomTime] = useState<string>('03:00 PM');
  const [customMatches, setCustomMatches] = useState<string>('B2B 3 MATCHES');
  const [customSponsors, setCustomSponsors] = useState<string>('ROG • CHOKI CHOKI • KFC • SUKRO • GARENA');

  // Custom MVP fields
  const [customMvpNick, setCustomMvpNick] = useState<string>('Nova_Mahad');
  const [customMvpTeam, setCustomMvpTeam] = useState<string>('NOVA ESPORTS');
  const [customMvpKills, setCustomMvpKills] = useState<number>(13);
  const [customMvpDamage, setCustomMvpDamage] = useState<number>(3850);
  const [customMvpPhoto, setCustomMvpPhoto] = useState<string | null>(null);

  // Team Overrides (name, tag, logo, kills, points, booyahs, trend)
  const [teamOverrides, setTeamOverrides] = useState<
    Record<
      string,
      {
        name?: string;
        tag?: string;
        logo?: string;
        color?: string;
        kills?: number;
        points?: number;
        wwcd?: number;
        trend?: 'up' | 'down' | 'same';
      }
    >
  >({});

  // Adjustable Scoring & Points Rules state
  const [killPointsMultiplier, setKillPointsMultiplier] = useState<number>(tournament.scoringRule?.killPoints || 1);
  const [booyahBonusPoints, setBooyahBonusPoints] = useState<number>(tournament.scoringRule?.wwcdBonus || 0);
  const [placementPointsMap, setPlacementPointsMap] = useState<Record<number, number>>(() => ({
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
    ...tournament.scoringRule?.placementPoints,
  }));

  // Floating Logo & Text Overlays
  const [overlays, setOverlays] = useState<PosterOverlay[]>([
    {
      id: 'default_badge',
      type: 'text',
      content: 'PRIZE POOL $25,000',
      position: 'header-badge',
      size: 'sm',
      opacity: 0.95,
      badgeStyle: 'gold',
    },
  ]);

  // Modal & Add Team state
  const [editingTeam, setEditingTeam] = useState<{ team: Team; standing?: TeamStanding } | null>(null);
  const [teamSearchQuery, setTeamSearchQuery] = useState<string>('');
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamTag, setNewTeamTag] = useState<string>('');
  const [newTeamLogo, setNewTeamLogo] = useState<string>('');
  const [newTeamKills, setNewTeamKills] = useState<number>(0);
  const [newTeamPoints, setNewTeamPoints] = useState<number>(0);
  const [newTeamBooyahs, setNewTeamBooyahs] = useState<number>(0);

  // Background Upload & Blur State
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(0.85);
  const [bgDarkness, setBgDarkness] = useState<number>(0.55);
  const [bgBlur, setBgBlur] = useState<number>(0); // Blur in px
  const [enableBackdropBlur, setEnableBackdropBlur] = useState<boolean>(false);
  const [bgFit, setBgFit] = useState<'cover' | 'contain' | 'center'>('cover');

  // Scaling
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState<number>(1);
  const [zoomMode, setZoomMode] = useState<'fit' | '100' | '80' | '65'>('fit');

  useEffect(() => {
    const updateFit = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 16;
      if (availableWidth > 0 && availableWidth < 540) {
        setFitScale(Math.min(1, Math.max(0.42, availableWidth / 530)));
      } else {
        setFitScale(1);
      }
    };
    updateFit();
    window.addEventListener('resize', updateFit);
    return () => window.removeEventListener('resize', updateFit);
  }, []);

  const currentScale = useMemo(() => {
    if (zoomMode === 'fit') return fitScale;
    if (zoomMode === '65') return 0.65;
    if (zoomMode === '80') return 0.8;
    return 1;
  }, [zoomMode, fitScale]);

  // Export Feedback
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync controls when active template changes
  const handleSelectTemplate = (template: GraphicTemplate) => {
    setActiveTemplate(template);
    setTitleText(template.settings.headerTitle);
    setSubtitleText(template.settings.headerSubtitle);
    setAccentColor(template.settings.accentColor);
    setShowKillsCol(template.settings.showKills);
    setShowPlacementCol(template.settings.showPlacement);
    setShowCharacters(template.settings.showCharacterArt);
    setShowSocials(template.settings.showSocialFooter);
    if (typeof template.teamCountVariation === 'number') {
      setTeamCount(template.teamCountVariation);
    }
  };

  // Background & MVP Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomBgImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMvpPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomMvpPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_LIBRARY.filter((tmpl) => {
      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'points_table' && tmpl.category === 'points_table') ||
        (selectedCategory === 'championship' && tmpl.category === 'championship') ||
        (selectedCategory === 'player_mvp' && tmpl.category === 'player_mvp') ||
        (selectedCategory === 'team_list' && tmpl.category === 'team_list');

      const matchesSearch =
        tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tmpl.layoutType.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Merge standings with overrides
  const displayTeams = useMemo(() => {
    const active = standings.slice(0, teamCount).map((s) => {
      const override = teamOverrides[s.team.id];
      if (!override) return s;

      return {
        ...s,
        team: {
          ...s.team,
          name: override.name ?? s.team.name,
          tag: override.tag ?? s.team.tag,
          logo: override.logo ?? s.team.logo,
          color: override.color ?? s.team.color,
        },
        totalKills: override.kills !== undefined ? override.kills : s.totalKills,
        totalPoints: override.points !== undefined ? override.points : s.totalPoints,
        wwcdCount: override.wwcd !== undefined ? override.wwcd : s.wwcdCount,
      };
    });

    if (active.length < teamCount) {
      const remaining = teamCount - active.length;
      for (let i = 0; i < remaining; i++) {
        const dummyNum = active.length + 1;
        const dummyId = `dummy_${dummyNum}`;
        const override = teamOverrides[dummyId];

        active.push({
          team: {
            id: dummyId,
            name: override?.name ?? `Team Slot ${dummyNum}`,
            tag: override?.tag ?? `SL${dummyNum}`,
            logo: override?.logo ?? '',
            color: override?.color ?? '#eab308',
            group: dummyNum <= 6 ? 'Pot 1' : 'Pot 2',
          },
          rank: dummyNum,
          matchesPlayed: 0,
          matchKills: {},
          matchPoints: {},
          totalKills: override?.kills !== undefined ? override.kills : 0,
          totalPlacementPoints: 0,
          totalKillPoints: 0,
          totalBonus: 0,
          totalPenalty: 0,
          totalPoints: override?.points !== undefined ? override.points : 0,
          wwcdCount: override?.wwcd !== undefined ? override.wwcd : 0,
          bestMatchScore: 0,
          worstMatchScore: 0,
          avgKills: 0,
          avgPoints: 0,
          killPercentage: 0,
          isQualified: dummyNum <= qualificationCutoff,
        });
      }
    }
    return active;
  }, [standings, teamCount, qualificationCutoff, teamOverrides]);

  // Max points for proportional progress bar
  const maxPoints = useMemo(() => {
    return Math.max(1, ...displayTeams.map((t) => t.totalPoints));
  }, [displayTeams]);

  // Save team override
  const handleSaveTeamOverride = (
    teamId: string,
    updatedTeam: Partial<Team>,
    statOverrides?: {
      totalKills?: number;
      totalPoints?: number;
      wwcdCount?: number;
      trend?: 'up' | 'down' | 'same';
    }
  ) => {
    setTeamOverrides((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        name: updatedTeam.name,
        tag: updatedTeam.tag,
        logo: updatedTeam.logo,
        color: updatedTeam.color,
        kills: statOverrides?.totalKills,
        points: statOverrides?.totalPoints,
        wwcd: statOverrides?.wwcdCount,
        trend: statOverrides?.trend,
      },
    }));

    const teamExists = tournament.teams.some((t) => t.id === teamId);
    let updatedTeamsList: Team[];
    if (teamExists) {
      updatedTeamsList = tournament.teams.map((t) =>
        t.id === teamId ? { ...t, ...updatedTeam } : t
      );
    } else {
      updatedTeamsList = [
        ...tournament.teams,
        {
          id: teamId,
          name: updatedTeam.name || 'Team Name',
          tag: updatedTeam.tag || 'TEAM',
          logo: updatedTeam.logo || '',
          color: updatedTeam.color || '#eab308',
          group: 'Pot 1',
        },
      ];
    }

    onUpdateTournament({
      ...tournament,
      teams: updatedTeamsList,
    });
  };

  // 1-Click Quick inline adjustments
  const handleInlineStatChange = (
    teamId: string,
    field: 'kills' | 'points' | 'wwcd',
    delta: number
  ) => {
    const target = displayTeams.find((s) => s.team.id === teamId);
    if (!target) return;

    const currentVal =
      field === 'kills'
        ? target.totalKills
        : field === 'points'
        ? target.totalPoints
        : target.wwcdCount || 0;

    const newVal = Math.max(0, currentVal + delta);

    setTeamOverrides((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: newVal,
      },
    }));
  };

  // Add a brand new team
  const handleAddNewTeam = () => {
    if (!newTeamName.trim()) return;
    const newId = `team_${Date.now()}`;
    const generatedLogo = newTeamLogo || createEsportsSvgLogo(newTeamName, '#1e293b', '#eab308', 'shield');

    const createdTeam: Team = {
      id: newId,
      name: newTeamName.trim(),
      tag: (newTeamTag || newTeamName.slice(0, 3)).trim().toUpperCase(),
      logo: generatedLogo,
      color: '#eab308',
      group: 'Pot 1',
    };

    setTeamOverrides((prev) => ({
      ...prev,
      [newId]: {
        name: createdTeam.name,
        tag: createdTeam.tag,
        logo: createdTeam.logo,
        kills: newTeamKills,
        points: newTeamPoints,
        wwcd: newTeamBooyahs,
      },
    }));

    onUpdateTournament({
      ...tournament,
      teams: [...tournament.teams, createdTeam],
    });

    setNewTeamName('');
    setNewTeamTag('');
    setNewTeamLogo('');
    setNewTeamKills(0);
    setNewTeamPoints(0);
    setNewTeamBooyahs(0);
    setIsAddTeamModalOpen(false);
  };

  // Recalculate all total points from Kills + Placement + Booyahs
  const handleRecalculateAllPoints = () => {
    const updatedOverrides: typeof teamOverrides = { ...teamOverrides };

    displayTeams.forEach((s) => {
      const placePts = placementPointsMap[s.rank] ?? 0;
      const killPts = s.totalKills * killPointsMultiplier;
      const booyahBonus = (s.wwcdCount || 0) * booyahBonusPoints;
      const computedTotal = placePts + killPts + booyahBonus;

      updatedOverrides[s.team.id] = {
        ...updatedOverrides[s.team.id],
        points: computedTotal,
      };
    });

    setTeamOverrides(updatedOverrides);
  };

  // Add custom overlay
  const handleAddOverlay = (type: 'logo' | 'text', content: string, label?: string) => {
    const newOverlay: PosterOverlay = {
      id: `overlay_${Date.now()}`,
      type,
      content,
      position: 'top-right',
      size: 'md',
      opacity: 0.9,
      label,
      badgeStyle: 'gold',
    };
    setOverlays((prev) => [...prev, newOverlay]);
  };

  const handleRemoveOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  };

  // Export PNG
  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportSuccess(null);

    const el = canvasRef.current;
    const originalTransform = el.style.transform;

    const pixelRatio = exportResolution === '4k' ? 4 : exportResolution === '2k' ? 3 : 2.5;

    try {
      el.style.transform = 'scale(1)';
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(el, {
        pixelRatio,
        cacheBust: true,
        quality: 0.98,
      });

      el.style.transform = originalTransform;

      const link = document.createElement('a');
      const sanitizedName = (titleText || 'esports_standings').toLowerCase().replace(/\s+/g, '_');
      link.download = `${sanitizedName}_${activeTemplate.id}_${exportResolution}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#eab308', '#f59e0b', '#facc15', '#ffffff'],
      });

      setExportSuccess(`Esports Graphic Exported in Crisp ${exportResolution.toUpperCase()}!`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
      el.style.transform = originalTransform;
      alert('Unable to generate graphic export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Clipboard
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    const el = canvasRef.current;
    const originalTransform = el.style.transform;

    try {
      el.style.transform = 'scale(1)';
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(el, { pixelRatio: 2 });
      el.style.transform = originalTransform;

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      el.style.transform = originalTransform;
    }
  };

  const colA = displayTeams.filter((_, i) => i % 2 === 0);
  const colB = displayTeams.filter((_, i) => i % 2 === 1);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-[#0f0d09] border border-amber-500/30 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0a0805] rounded-[14px] flex items-center justify-center">
              <Layout className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-teko text-3xl font-bold uppercase tracking-wider text-amber-200 leading-none">
                Broadcast Graphics Studio
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/20 text-yellow-300 border border-amber-500/40">
                PRO ESPORTS SUITE
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-rajdhani mt-0.5">
              Custom fonts, team logos, adjustable kills & position points, background blur, and high-res export
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Resolution Selector */}
          <div className="flex items-center bg-black/60 border border-amber-500/30 rounded-xl p-0.5 text-xs font-mono">
            <span className="text-[10px] text-amber-300 font-bold px-2">RES:</span>
            {(['1080p', '2k', '4k'] as const).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setExportResolution(res)}
                className={`px-2.5 py-1 rounded-lg transition uppercase font-bold cursor-pointer ${
                  exportResolution === res
                    ? 'bg-amber-500 text-black font-black shadow-sm'
                    : 'text-zinc-400 hover:text-amber-200'
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-400 text-amber-200 text-xs font-rajdhani font-bold transition hover:bg-black/80 cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{isCopied ? 'Copied!' : 'Copy Image'}</span>
          </button>

          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-rajdhani font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Download className="w-4 h-4 text-black stroke-[3]" />
            )}
            <span>{isExporting ? 'Exporting...' : `Export ${exportResolution.toUpperCase()} Poster`}</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportSuccess}</span>
          </div>
          <span className="text-[10px] text-emerald-400">Ready to share on Discord / Instagram / WhatsApp</span>
        </div>
      )}

      {/* TWO COLUMN STUDIO WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: NAVIGATION & CONTROLS */}
        <div className="xl:col-span-4 space-y-4">
          {/* 6-TAB STUDIO NAVIGATION */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-[#0f0d09] border border-amber-500/30 rounded-2xl">
            <button
              onClick={() => setActiveSidebarTab('themes')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                activeSidebarTab === 'themes'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Palette className="w-4 h-4 mb-0.5" />
              <span>Themes</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('teams')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer relative ${
                activeSidebarTab === 'teams'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Shield className="w-4 h-4 mb-0.5" />
              <span>Teams</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveSidebarTab('scoring')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                activeSidebarTab === 'scoring'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Calculator className="w-4 h-4 mb-0.5" />
              <span>Scoring</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('fonts')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                activeSidebarTab === 'fonts'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Type className="w-4 h-4 mb-0.5" />
              <span>Fonts</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('overlays')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                activeSidebarTab === 'overlays'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Layers className="w-4 h-4 mb-0.5" />
              <span>Logos/Text</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('design')}
              className={`py-2 px-1 rounded-xl text-xs font-rajdhani font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                activeSidebarTab === 'design'
                  ? 'bg-amber-500 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-amber-200 hover:bg-black/40'
              }`}
            >
              <Sliders className="w-4 h-4 mb-0.5" />
              <span>Design/BG</span>
            </button>
          </div>

          {/* TAB 1: THEMES LIBRARY */}
          {activeSidebarTab === 'themes' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200">
                  Esports Themes ({filteredTemplates.length}/{TEMPLATE_LIBRARY.length})
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  {activeTemplate.name.split(' ')[0]} ACTIVE
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: `All (${TEMPLATE_LIBRARY.length})` },
                  { id: 'points_table', label: 'Points Tables' },
                  { id: 'championship', label: 'Finals & Podium' },
                  { id: 'player_mvp', label: 'MVP & Fraggers' },
                  { id: 'team_list', label: 'Team Slots' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold font-rajdhani whitespace-nowrap cursor-pointer transition ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-black font-extrabold shadow'
                        : 'bg-black/60 text-zinc-400 hover:text-amber-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search themes (e.g. FFML, Toxic, Genesis, Slanted)..."
                  className="w-full bg-black/60 border border-amber-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredTemplates.map((tmpl) => {
                  const isSelected = tmpl.id === activeTemplate.id;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                          : 'border-amber-500/15 bg-black/40 hover:border-amber-500/40 hover:bg-[#141009]'
                      }`}
                    >
                      {tmpl.badge && (
                        <span className="absolute top-1.5 right-1.5 text-[8px] font-bold font-mono px-1 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40">
                          {tmpl.badge}
                        </span>
                      )}

                      <div className="font-bold text-white font-rajdhani text-xs group-hover:text-amber-300 transition-colors leading-tight">
                        {tmpl.name}
                      </div>

                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                        <span>{tmpl.layoutType.replace(/_/g, ' ').toUpperCase()}</span>
                        {isSelected && (
                          <span className="text-yellow-400 font-bold flex items-center gap-1">
                            ACTIVE <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEAMS & LOGOS (ADD TEAMS, CHANGE LOGOS, INLINE SCORE STEPPERS) */}
          {activeSidebarTab === 'teams' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <div>
                  <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200 block leading-none">
                    Teams & Logos Management
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Add new teams, change logos, and tweak scores instantly
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-rajdhani font-black text-xs uppercase tracking-wide shadow cursor-pointer transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  Add Team
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  placeholder="Search team by name or tag..."
                  className="w-full bg-black/60 border border-amber-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Teams List with Direct In-line Steppers for Kills, Booyahs, and Points */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {displayTeams
                  .filter(
                    (s) =>
                      !teamSearchQuery ||
                      s.team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                      s.team.tag.toLowerCase().includes(teamSearchQuery.toLowerCase())
                  )
                  .map((s) => (
                    <div
                      key={s.team.id}
                      className="p-2.5 rounded-xl bg-black/50 border border-amber-500/20 hover:border-amber-400 transition space-y-2 group"
                    >
                      {/* Top Row: Rank, Logo, Name & Edit Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                            #{s.rank}
                          </span>

                          {/* Logo Preview (Click to change) */}
                          <div
                            onClick={() => setEditingTeam({ team: s.team, standing: s })}
                            className="w-8 h-8 rounded-lg bg-black/80 border border-amber-500/40 p-0.5 flex items-center justify-center shrink-0 cursor-pointer hover:border-amber-300 transition"
                            title="Click to Change Logo"
                          >
                            {s.team.logo ? (
                              <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Shield className="w-4 h-4 text-amber-400" />
                            )}
                          </div>

                          <div className="truncate">
                            <div className="font-bold text-white text-xs font-rajdhani uppercase truncate">
                              {s.team.name}
                            </div>
                            <span className="text-[10px] font-mono text-amber-400">TAG: {s.team.tag}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingTeam({ team: s.team, standing: s })}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black transition text-[11px] font-rajdhani font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>

                      {/* Bottom Row: Quick Score Steppers */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-amber-500/10 text-[10px] font-mono">
                        {/* Kills Stepper */}
                        <div className="flex items-center justify-between bg-black/70 px-2 py-1 rounded border border-amber-500/20">
                          <span className="text-zinc-400">Kills:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'kills', -1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold text-amber-300 min-w-3 text-center">{s.totalKills}</span>
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'kills', 1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Booyah Stepper */}
                        <div className="flex items-center justify-between bg-black/70 px-2 py-1 rounded border border-amber-500/20">
                          <span className="text-zinc-400">Booyah:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'wwcd', -1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-bold text-yellow-300 min-w-3 text-center">{s.wwcdCount || 0}</span>
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'wwcd', 1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total Points Stepper */}
                        <div className="flex items-center justify-between bg-black/70 px-2 py-1 rounded border border-amber-500/20">
                          <span className="text-zinc-400">Pts:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'points', -1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-black text-amber-400 min-w-4 text-center">{s.totalPoints}</span>
                            <button
                              onClick={() => handleInlineStatChange(s.team.id, 'points', 1)}
                              className="w-4 h-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCORING & POINTS ADJUSTER (CRITICAL FOR SCANNING & CUSTOM RULES) */}
          {activeSidebarTab === 'scoring' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <div>
                  <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200 block leading-none">
                    Scoring & Points Adjuster
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Adjust kill points, rank placement points, and Booyah bonus
                  </span>
                </div>
              </div>

              {/* Kill Multiplier & Booyah Bonus */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-black/50 rounded-xl border border-amber-500/20">
                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                    Points Per Kill
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setKillPointsMultiplier((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-lg text-amber-400 w-8 text-center">
                      {killPointsMultiplier}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKillPointsMultiplier((prev) => prev + 1)}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5 block">e.g. 1 pt or 2 pts per kill</span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                    Booyah Win Bonus
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBooyahBonusPoints((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-yellow-300 font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-lg text-yellow-400 w-8 text-center">
                      {booyahBonusPoints}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBooyahBonusPoints((prev) => prev + 1)}
                      className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-yellow-300 font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-0.5 block">Extra bonus points for #1</span>
                </div>
              </div>

              {/* Quick Rule Presets */}
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block mb-1.5">
                  Standard Esports Presets:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setKillPointsMultiplier(1);
                      setBooyahBonusPoints(0);
                      setPlacementPointsMap({
                        1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0,
                      });
                    }}
                    className="p-2 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-400 text-left text-xs font-rajdhani cursor-pointer transition group"
                  >
                    <div className="font-bold text-amber-200 group-hover:text-yellow-300">Free Fire Official (12-Pt)</div>
                    <div className="text-[9px] font-mono text-zinc-400">1st=12, 2nd=9, 3rd=8, 1k=1pt</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKillPointsMultiplier(1);
                      setBooyahBonusPoints(0);
                      setPlacementPointsMap({
                        1: 10, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 1, 9: 0, 10: 0, 11: 0, 12: 0,
                      });
                    }}
                    className="p-2 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-400 text-left text-xs font-rajdhani cursor-pointer transition group"
                  >
                    <div className="font-bold text-amber-200 group-hover:text-yellow-300">PUBG Mobile (10-Pt)</div>
                    <div className="text-[9px] font-mono text-zinc-400">1st=10, 2nd=6, 3rd=5, 1k=1pt</div>
                  </button>
                </div>
              </div>

              {/* Editable Placement Points Table for Ranks 1 to 12 */}
              <div className="p-3 bg-black/50 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-300 block">
                  Position Points per Rank (Editable):
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((rnk) => (
                    <div key={rnk} className="flex items-center justify-between bg-black/70 px-2 py-1 rounded border border-amber-500/20">
                      <span className="text-zinc-400 text-[10px]">#{rnk}:</span>
                      <input
                        type="number"
                        min="0"
                        value={placementPointsMap[rnk] ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setPlacementPointsMap((prev) => ({ ...prev, [rnk]: val }));
                        }}
                        className="w-7 text-right bg-transparent text-amber-300 font-bold focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recalculate Button */}
              <button
                type="button"
                onClick={handleRecalculateAllPoints}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-rajdhani font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recalculate All Total Points</span>
              </button>
            </div>
          )}

          {/* TAB 4: FONTS & TYPOGRAPHY (WITH DYNAMIC CUSTOM GOOGLE FONTS) */}
          {activeSidebarTab === 'fonts' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <div>
                  <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200 block leading-none">
                    Fonts & Typography
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Change headline fonts, number fonts, or add any custom Google Font
                  </span>
                </div>
              </div>

              {/* Add Custom Google Font */}
              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-400" />
                  Add Any Custom Google Font
                </span>
                <p className="text-[10px] text-zinc-400 font-rajdhani">
                  Type any font from Google Fonts (e.g. Bungee, Rampart One, Rubik Glitch, Silkscreen):
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customFontInput}
                    onChange={(e) => setCustomFontInput(e.target.value)}
                    placeholder="Enter font name (e.g. Bungee)"
                    className="flex-1 bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleLoadCustomFont(customFontInput)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-rajdhani font-black text-xs uppercase cursor-pointer hover:bg-amber-400 transition shrink-0"
                  >
                    + Load Font
                  </button>
                </div>
                {loadedCustomFonts.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[9px] font-mono text-zinc-400">Loaded:</span>
                    {loadedCustomFonts.map((f) => (
                      <span key={f} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Headline Font */}
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  Main Headline Font
                </label>
                <select
                  value={headlineFont}
                  onChange={(e) => setHeadlineFont(e.target.value)}
                  className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold font-rajdhani focus:outline-none"
                >
                  {PRESET_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                  {loadedCustomFonts.map((cf) => (
                    <option key={cf} value={`'${cf}', sans-serif`}>
                      ★ Custom: {cf}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Numbers & Stats Font */}
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  Numbers & Points Font
                </label>
                <select
                  value={numbersFont}
                  onChange={(e) => setNumbersFont(e.target.value)}
                  className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold font-rajdhani focus:outline-none"
                >
                  {PRESET_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                  {loadedCustomFonts.map((cf) => (
                    <option key={cf} value={`'${cf}', sans-serif`}>
                      ★ Custom: {cf}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Team Names / Body Font */}
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  Team Names & Body Font
                </label>
                <select
                  value={bodyFont}
                  onChange={(e) => setBodyFont(e.target.value)}
                  className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold font-rajdhani focus:outline-none"
                >
                  {PRESET_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                  {loadedCustomFonts.map((cf) => (
                    <option key={cf} value={`'${cf}', sans-serif`}>
                      ★ Custom: {cf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 5: LOGOS & CUSTOM TEXT OVERLAYS */}
          {activeSidebarTab === 'overlays' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-4 max-h-[520px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/15">
                <div>
                  <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200 block leading-none">
                    Logos, Text Badges & Metadata
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Edit tournament phase, dates, sponsors, MVP stats, and floating badges
                  </span>
                </div>
              </div>

              {/* Tournament Broadcast Details (Phase, Group, Date, Time, Sponsors) */}
              <div className="p-3 bg-black/50 rounded-xl border border-amber-500/20 space-y-2.5">
                <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Tournament Metadata & Fixture Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Phase / Stage</label>
                    <input
                      type="text"
                      value={customPhase}
                      onChange={(e) => setCustomPhase(e.target.value)}
                      placeholder="e.g. GRAND FINALS • DAY 1"
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Group / Pot</label>
                    <input
                      type="text"
                      value={customGroup}
                      onChange={(e) => setCustomGroup(e.target.value)}
                      placeholder="e.g. GROUP A • 18 TEAMS"
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Date</label>
                    <input
                      type="text"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      placeholder="e.g. 15 APRIL 2026"
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Time</label>
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="e.g. 03:00 PM WIB"
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Sponsors & Partners</label>
                  <input
                    type="text"
                    value={customSponsors}
                    onChange={(e) => setCustomSponsors(e.target.value)}
                    placeholder="e.g. ROG • MONSTER ENERGY • GARENA • KFC"
                    className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* MVP Player Spotlight Editor */}
              <div className="p-3 bg-black/50 rounded-xl border border-amber-500/20 space-y-2.5">
                <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  MVP Player Showcase Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Player Nickname</label>
                    <input
                      type="text"
                      value={customMvpNick}
                      onChange={(e) => setCustomMvpNick(e.target.value)}
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Team Name / Line</label>
                    <input
                      type="text"
                      value={customMvpTeam}
                      onChange={(e) => setCustomMvpTeam(e.target.value)}
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Total Kills</label>
                    <input
                      type="number"
                      value={customMvpKills}
                      onChange={(e) => setCustomMvpKills(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Total Damage (HP)</label>
                    <input
                      type="number"
                      value={customMvpDamage}
                      onChange={(e) => setCustomMvpDamage(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Add Preset Logos */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Quick Add Esports Emblem:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_OVERLAY_LOGOS.map((p) => {
                    const IconComp = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddOverlay('logo', p.id, p.name)}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-black/60 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer group text-center"
                      >
                        <IconComp className="w-5 h-5 text-amber-400 group-hover:scale-110 transition mb-0.5" />
                        <span className="text-[8px] font-mono text-zinc-300 truncate w-full">{p.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Text Badge Creator */}
              <div className="p-3 bg-black/50 rounded-xl border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Add Custom Text Badge
                </span>
                <div className="flex items-center gap-2">
                  <input
                    id="new-text-badge-input"
                    type="text"
                    placeholder="e.g. PRIZE POOL $50,000 / FINALS"
                    className="flex-1 bg-black/70 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-text-badge-input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        handleAddOverlay('text', input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-black font-rajdhani font-black text-xs uppercase cursor-pointer hover:bg-amber-400 transition shrink-0"
                  >
                    + Add Badge
                  </button>
                </div>
              </div>

              {/* Active Overlays List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Active Poster Overlays ({overlays.length}):
                </span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {overlays.map((ov) => (
                    <div
                      key={ov.id}
                      className="p-2 rounded-xl bg-black/60 border border-amber-500/20 flex items-center justify-between text-xs font-rajdhani"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] uppercase font-bold">
                          {ov.type}
                        </span>
                        <span className="text-white font-bold truncate">{ov.label || ov.content}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={ov.position}
                          onChange={(e) => {
                            const newPos = e.target.value as PosterOverlay['position'];
                            setOverlays((prev) =>
                              prev.map((o) => (o.id === ov.id ? { ...o, position: newPos } : o))
                            );
                          }}
                          className="bg-zinc-900 border border-amber-500/30 rounded px-1.5 py-0.5 text-[10px] text-amber-200 font-mono"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="header-badge">Header Ribbon</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveOverlay(ov.id)}
                          className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DESIGN, BACKGROUND BLUR & GRAPHICAL ENHANCEMENTS */}
          {activeSidebarTab === 'design' && (
            <div className="bg-[#0f0d09] border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-black/60 space-y-4 max-h-[520px] overflow-y-auto">
              <span className="font-teko text-xl font-bold uppercase tracking-wide text-amber-200 block pb-2 border-b border-amber-500/15">
                Design, Background Blur & Graphic Quality
              </span>

              {/* Background Blur Slider */}
              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-rajdhani font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Background Blur (Depth of Field)
                  </span>
                  <span className="font-mono text-amber-400">{bgBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={bgBlur}
                  onChange={(e) => setBgBlur(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Sharp (0px)</span>
                  <span>Soft (12px)</span>
                  <span>Deep Bokeh (35px)</span>
                </div>

                <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-xs font-rajdhani">
                  <span className="text-zinc-300">Glassmorphism Frosted Backdrop:</span>
                  <button
                    type="button"
                    onClick={() => setEnableBackdropBlur((prev) => !prev)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      enableBackdropBlur
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {enableBackdropBlur ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>

              {/* Graphic Elements & Graphs Enhancement Toggles */}
              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-2.5">
                <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Quality Enhancements & Graphs
                </span>

                <div className="space-y-2 text-xs font-rajdhani">
                  {/* Kill Distribution Graph */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-amber-500/10">
                    <div>
                      <div className="font-bold text-white">Kill Share Graph</div>
                      <div className="text-[10px] text-zinc-400">Visual mini bar chart of top fragger teams</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowKillGraph((prev) => !prev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                        showKillGraph ? 'bg-amber-500 text-black font-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {showKillGraph ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Points Progress Bars */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-amber-500/10">
                    <div>
                      <div className="font-bold text-white">Points Progress Bars</div>
                      <div className="text-[10px] text-zinc-400">Proportional progress accents behind points</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPointsBars((prev) => !prev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                        showPointsBars ? 'bg-amber-500 text-black font-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {showPointsBars ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Corner Tech Brackets */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-amber-500/10">
                    <div>
                      <div className="font-bold text-white">Tactical Corner Brackets</div>
                      <div className="text-[10px] text-zinc-400">Cyberpunk HUD corner borders</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCornerBrackets((prev) => !prev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                        showCornerBrackets ? 'bg-amber-500 text-black font-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {showCornerBrackets ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* CRT Scanlines */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 border border-amber-500/10">
                    <div>
                      <div className="font-bold text-white">Broadcast Scanlines</div>
                      <div className="text-[10px] text-zinc-400">CRT broadcast texture lines</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowScanlines((prev) => !prev)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                        showScanlines ? 'bg-amber-500 text-black font-black' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {showScanlines ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallpaper Upload */}
              <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    Custom Poster Wallpaper
                  </span>
                  {customBgImage && (
                    <button
                      onClick={() => setCustomBgImage(null)}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>

                <label className="flex flex-col items-center justify-center p-3 border border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl bg-black/40 hover:bg-black/60 cursor-pointer transition text-center group">
                  <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                  <Upload className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold font-rajdhani text-amber-200">
                    {customBgImage ? 'Replace Background' : 'Upload Wallpaper'}
                  </span>
                  <span className="text-[9px] text-zinc-500">PNG, JPG, WebP</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE POSTER CANVAS */}
        <div className="xl:col-span-8 flex flex-col items-center">
          <div className="w-full flex flex-wrap items-center justify-between mb-3 px-1 gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-rajdhani font-bold text-amber-200">
              <Eye className="w-4 h-4 text-amber-400" />
              Interactive Canvas • Click any team to edit logo & name
            </span>

            {/* Canvas Scaling Toolbar */}
            <div className="flex items-center gap-1.5 bg-[#141009] p-1 rounded-xl border border-amber-500/30">
              <span className="text-[10px] text-amber-300 font-mono px-1 font-bold">Zoom:</span>
              <button
                onClick={() => setZoomMode('fit')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-rajdhani transition cursor-pointer ${
                  zoomMode === 'fit' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Auto Fit
              </button>
              <button
                onClick={() => setZoomMode('65')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-rajdhani transition cursor-pointer ${
                  zoomMode === '65' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                65%
              </button>
              <button
                onClick={() => setZoomMode('80')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-rajdhani transition cursor-pointer ${
                  zoomMode === '80' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                80%
              </button>
              <button
                onClick={() => setZoomMode('100')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-rajdhani transition cursor-pointer ${
                  zoomMode === '100' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                100% HD
              </button>
            </div>
          </div>

          {/* CANVAS STAGE WRAPPER */}
          <div
            ref={containerRef}
            className="w-full flex justify-center items-start overflow-x-auto p-2 bg-[#050403] rounded-3xl border border-amber-500/20 shadow-inner"
          >
            <div
              style={{
                width: `${520 * currentScale}px`,
                height: `${780 * currentScale}px`,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                ref={canvasRef}
                id="vintage-esports-poster-canvas"
                className={`w-[520px] min-h-[780px] bg-[#070604] text-white rounded-3xl p-5 absolute top-0 left-0 overflow-hidden shadow-2xl flex flex-col justify-between select-none border border-amber-500/40 origin-top-left ${
                  enableBackdropBlur ? 'backdrop-blur-md' : ''
                }`}
                style={{
                  fontFamily: bodyFont,
                  transform: `scale(${currentScale})`,
                  transformOrigin: 'top left',
                  background:
                    activeTemplate.layoutType === 'ffml_ice_diamond'
                      ? 'radial-gradient(ellipse at 50% 15%, #0284c7 0%, #0369a1 25%, #075985 50%, #031422 100%)'
                      : activeTemplate.layoutType === 'pubg_pro_toxic_24' || activeTemplate.layoutType === 'pmnc_vietnam_20'
                      ? 'radial-gradient(ellipse at 50% 15%, #064e3b 0%, #022c22 45%, #02120d 100%)'
                      : activeTemplate.layoutType === 'genesis_cyber_magenta' || activeTemplate.layoutType === 'pcci_storm_purple_20'
                      ? 'radial-gradient(ellipse at 50% 15%, #581c87 0%, #2e1065 40%, #090214 100%)'
                      : activeTemplate.layoutType === 'ewc_pools_seeding_16'
                      ? 'radial-gradient(ellipse at 50% 15%, #3b0764 0%, #1e0536 40%, #08020d 100%)'
                      : activeTemplate.layoutType === 'pmes_crimson_fixtures' || activeTemplate.layoutType === 'xtreino_ff_red_top3' || activeTemplate.layoutType === 'meet_the_teams_red'
                      ? 'radial-gradient(ellipse at 50% 15%, #7f1d1d 0%, #450a0a 45%, #0d0202 100%)'
                      : activeTemplate.layoutType === 'red_wolf_mvp_tabela'
                      ? 'radial-gradient(ellipse at 50% 15%, #4c0519 0%, #20040b 45%, #080104 100%)'
                      : activeTemplate.layoutType === 'cpxs_tabela_geral_gold' || activeTemplate.layoutType === 'bgmi_grands_teams_playing' || activeTemplate.layoutType === 'elite_rank_mvp_yellow'
                      ? 'radial-gradient(ellipse at 50% 15%, #451a03 0%, #271003 45%, #080401 100%)'
                      : activeTemplate.layoutType === 'top3_melhores_banners'
                      ? 'radial-gradient(ellipse at 50% 15%, #083344 0%, #041f2c 45%, #01080d 100%)'
                      : activeTemplate.layoutType === 'clash_of_titans_green'
                      ? 'radial-gradient(ellipse at 50% 15%, #14532d 0%, #052e16 45%, #021007 100%)'
                      : activeTemplate.layoutType === 'warrior_cup_ff_slots_16'
                      ? 'radial-gradient(ellipse at 50% 15%, #7c2d12 0%, #431407 45%, #0c0402 100%)'
                      : activeTemplate.layoutType === 'jadwal_esports_fixtures'
                      ? 'radial-gradient(ellipse at 50% 15%, #27272a 0%, #18181b 45%, #09090b 100%)'
                      : activeTemplate.layoutType === 'bpc_ultraviolet'
                      ? 'radial-gradient(ellipse at 50% 15%, #3b0764 0%, #1c0936 40%, #070312 100%)'
                      : activeTemplate.layoutType === 'pmes_tactical_red' || activeTemplate.layoutType === 'slots_pmes_tactical_18'
                      ? 'radial-gradient(ellipse at 50% 15%, #3f0909 0%, #170505 45%, #080808 100%)'
                      : 'radial-gradient(ellipse at 50% 15%, #2e1e05 0%, #140e03 45%, #080603 100%)',
                  boxShadow: `0 0 60px -10px ${accentColor}44`,
                }}
              >
                {/* Custom Wallpaper with Blur */}
                {customBgImage && (
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${customBgImage})`,
                      backgroundSize: bgFit,
                      backgroundPosition: 'center',
                      opacity: bgOpacity,
                      filter: `blur(${bgBlur}px) brightness(${1 - bgDarkness})`,
                    }}
                  />
                )}

                {/* CRT Scanline Overlay */}
                {showScanlines && (
                  <div className="absolute inset-0 z-2 pointer-events-none opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px]" />
                )}

                {/* Vignette Overlay */}
                {showVignette && (
                  <div className="absolute inset-0 z-1 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
                )}

                {/* Tactical Corner Brackets */}
                {showCornerBrackets && (
                  <>
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/80 z-20 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/80 z-20 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/80 z-20 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/80 z-20 pointer-events-none" />
                  </>
                )}

                {/* Ambient Glow */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl opacity-40 pointer-events-none z-0"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Floating Poster Overlays (Logos / Text Badges) */}
                {overlays.map((ov) => {
                  let posClasses = 'top-4 right-4';
                  if (ov.position === 'top-left') posClasses = 'top-4 left-4';
                  if (ov.position === 'top-center') posClasses = 'top-4 left-1/2 -translate-x-1/2';
                  if (ov.position === 'bottom-left') posClasses = 'bottom-12 left-4';
                  if (ov.position === 'bottom-right') posClasses = 'bottom-12 right-4';
                  if (ov.position === 'header-badge') posClasses = 'top-10 right-3';

                  return (
                    <div
                      key={ov.id}
                      className={`absolute z-30 pointer-events-none ${posClasses}`}
                      style={{ opacity: ov.opacity }}
                    >
                      {ov.type === 'text' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-yellow-300 font-mono font-black text-[10px] uppercase shadow-lg backdrop-blur-sm">
                          {ov.content}
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-black/60 border border-amber-400/40 p-1 flex items-center justify-center shadow-lg">
                          <Trophy className="w-full h-full text-amber-400" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* POSTER HEADER */}
                <div className="relative z-10 text-center space-y-1 mb-2">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-300 uppercase font-bold">
                      <VintageEsportsLogo size={22} showGlow={false} />
                      <span>{tournament.name.toUpperCase()}</span>
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-bold">
                      {tournament.season.toUpperCase()}
                    </div>
                  </div>

                  {/* Main Headline (Applied with headlineFont) */}
                  <h1
                    className="text-6xl italic tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-yellow-400 drop-shadow-[0_4px_16px_rgba(234,179,8,0.5)] leading-none uppercase text-center mt-1"
                    style={{ fontFamily: headlineFont }}
                  >
                    {titleText || 'OFFICIAL STANDINGS'}
                  </h1>

                  {/* Subtitle Badge */}
                  <div className="text-xs font-black text-yellow-300 uppercase tracking-[0.3em] text-center">
                    {subtitleText || 'VINTAGE ESPORTS CHAMPIONSHIP'}
                  </div>

                  {/* Optional Kill Distribution Mini-Graph Header */}
                  {showKillGraph && (
                    <div className="mt-2 p-2 rounded-xl bg-black/60 border border-amber-500/30 text-left space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-300 font-bold uppercase">
                        <span>TOP KILL LEADERS SHARE</span>
                        <span>{displayTeams.reduce((acc, t) => acc + t.totalKills, 0)} TOTAL KILLS</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                        {displayTeams.slice(0, 4).map((t, idx) => (
                          <div key={t.team.id} className="bg-black/80 rounded p-1 border border-amber-500/20 text-center">
                            <span className="font-teko text-xs text-white uppercase block truncate">{t.team.tag}</span>
                            <span className="font-mono text-[10px] font-black text-amber-400">{t.totalKills} KILLS</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="relative z-10 my-2 flex-1">
                  {/* DEDICATED 11 ESPORTS TEMPLATE RENDERER */}
                  {[
                    'pmnc_vietnam_20',
                    'bgmi_grands_teams_playing',
                    'xtreino_ff_red_top3',
                    'top3_melhores_banners',
                    'elite_rank_mvp_yellow',
                    'clash_of_titans_green',
                    'meet_the_teams_red',
                    'jadwal_esports_fixtures',
                    'ewc_pools_seeding_16',
                    'pcci_storm_purple_20',
                    'warrior_cup_ff_slots_16',
                  ].includes(activeTemplate.layoutType) ? (
                    <EsportsTemplateRenderer
                      layoutType={activeTemplate.layoutType}
                      displayTeams={displayTeams}
                      tournament={tournament}
                      headlineFont={headlineFont}
                      bodyFont={bodyFont}
                      numbersFont={numbersFont}
                      accentColor={accentColor}
                      customPhase={customPhase}
                      customGroup={customGroup}
                      customDate={customDate}
                      customTime={customTime}
                      customMatches={customMatches}
                      customSponsors={customSponsors}
                      customMvpNick={customMvpNick}
                      customMvpTeam={customMvpTeam}
                      customMvpKills={customMvpKills}
                      customMvpDamage={customMvpDamage}
                      customMvpPhoto={customMvpPhoto}
                      showPointsBars={showPointsBars}
                      maxPoints={maxPoints}
                      onSelectTeam={(team, standing) => setEditingTeam({ team, standing })}
                    />
                  ) : activeTemplate.layoutType === 'ffml_ice_diamond' ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-2 py-0.5 bg-[#032f50] rounded-lg text-[9px] font-mono text-cyan-200 uppercase font-bold tracking-wider">
                        <span>FREE FIRE MASTER LEAGUE</span>
                        <span>{customPhase || 'LADIES SERIES'}</span>
                      </div>

                      <div className="grid grid-cols-12 px-2 py-1 bg-[#022036] rounded-lg text-[9px] font-mono font-black text-cyan-300 uppercase">
                        <div className="col-span-2 text-center">RANK</div>
                        <div className="col-span-4">TEAM</div>
                        <div className="col-span-2 text-center">BOOYAH!</div>
                        <div className="col-span-2 text-center">KILLS</div>
                        <div className="col-span-2 text-center">TOTAL</div>
                      </div>

                      <div className="space-y-1">
                        {displayTeams.slice(0, 12).map((s) => (
                          <div
                            key={s.team.id}
                            onClick={() => setEditingTeam({ team: s.team, standing: s })}
                            className="grid grid-cols-12 items-center px-2 py-1 rounded-lg bg-gradient-to-r from-white via-cyan-50 to-white text-[#0f172a] shadow-md hover:ring-2 hover:ring-cyan-400 transition cursor-pointer group"
                          >
                            <div className="col-span-2 flex items-center justify-center gap-1">
                              <span
                                className="w-6 h-6 rounded bg-[#1e3a8a] text-white font-mono font-black text-xs flex items-center justify-center shadow"
                                style={{ fontFamily: numbersFont }}
                              >
                                #{s.rank}
                              </span>
                            </div>

                            <div className="col-span-4 flex items-center gap-1.5 truncate pr-1">
                              <div className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center p-0.5 shrink-0">
                                {s.team.logo ? (
                                  <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <span className="font-teko text-[#1e3a8a] text-xs font-black">{s.team.tag}</span>
                                )}
                              </div>
                              <span className="font-black uppercase truncate text-[#0f172a]" style={{ fontFamily: bodyFont }}>
                                {s.team.name}
                              </span>
                            </div>

                            <div className="col-span-2 text-center font-mono font-black text-xs text-sky-700" style={{ fontFamily: numbersFont }}>
                              {s.wwcdCount || 0}
                            </div>

                            <div className="col-span-2 text-center font-mono font-bold text-xs text-slate-700" style={{ fontFamily: numbersFont }}>
                              {s.totalKills}
                            </div>

                            <div className="col-span-2 text-center">
                              <span className="text-xl font-black text-[#1e3a8a] leading-none" style={{ fontFamily: numbersFont }}>
                                {s.totalPoints}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* VINTAGE OBSIDIAN GOLD & GENERAL TABLES */
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-12 px-3 py-1 text-[10px] font-mono uppercase text-amber-300/80 font-bold border-b border-amber-500/20">
                        <div className="col-span-2 text-center">RANK</div>
                        <div className="col-span-6">TEAM NAME</div>
                        <div className="col-span-2 text-center">KILLS</div>
                        <div className="col-span-2 text-center">TOTAL PTS</div>
                      </div>

                      <div className="space-y-1">
                        {displayTeams.slice(0, 12).map((s, idx) => {
                          const isTop3 = s.rank <= 3;
                          const rankBg =
                            s.rank === 1
                              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 text-black font-black'
                              : s.rank === 2
                              ? 'bg-slate-300 text-black font-black'
                              : s.rank === 3
                              ? 'bg-amber-700 text-white font-black'
                              : 'bg-[#1a140a] text-amber-300 border border-amber-500/30 font-bold';

                          return (
                            <div
                              key={s.team.id || idx}
                              onClick={() => setEditingTeam({ team: s.team, standing: s })}
                              className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-xl border transition cursor-pointer group relative overflow-hidden ${
                                isTop3
                                  ? 'bg-amber-500/15 border-amber-400/50 shadow-sm hover:border-amber-400'
                                  : 'bg-[#100d07]/90 border-amber-500/20 hover:border-amber-500/50'
                              }`}
                            >
                              {/* Optional Points Progress Bar in Background */}
                              {showPointsBars && (
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-amber-500/10 pointer-events-none -z-0"
                                  style={{ width: `${(s.totalPoints / maxPoints) * 100}%` }}
                                />
                              )}

                              {/* Rank */}
                              <div className="col-span-2 flex justify-center relative z-1">
                                <span
                                  className={`w-6 h-6 rounded-lg text-xs font-mono flex items-center justify-center ${rankBg}`}
                                  style={{ fontFamily: numbersFont }}
                                >
                                  {s.rank}
                                </span>
                              </div>

                              {/* Team Name & Logo */}
                              <div className="col-span-6 flex items-center gap-2 truncate pr-1 relative z-1">
                                <div className="w-6 h-6 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-center p-0.5 shrink-0">
                                  {s.team.logo ? (
                                    <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-amber-400 text-sm font-bold">{s.team.tag}</span>
                                  )}
                                </div>
                                <span
                                  className="text-lg font-bold text-white uppercase truncate tracking-wide group-hover:text-amber-300 transition"
                                  style={{ fontFamily: bodyFont }}
                                >
                                  {s.team.name}
                                </span>
                              </div>

                              {/* Kills */}
                              <div
                                className="col-span-2 text-center font-mono font-bold text-xs text-amber-300 relative z-1"
                                style={{ fontFamily: numbersFont }}
                              >
                                {s.totalKills}
                              </div>

                              {/* Points */}
                              <div className="col-span-2 text-center relative z-1">
                                <span
                                  className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-yellow-300 font-mono font-extrabold text-xs"
                                  style={{ fontFamily: numbersFont }}
                                >
                                  {s.totalPoints}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* POSTER FOOTER */}
                {showSocials && (
                  <div className="relative z-10 pt-2 border-t border-amber-500/30">
                    <div className="bg-black/70 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-amber-400 font-bold">SPONSORS:</span>
                        <span>{customSponsors}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-yellow-400 font-bold">ORGANIZER:</span>
                        <span>{tournament.organizer || 'VINTAGE ESPORTS'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD NEW TEAM */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f0d09] border border-amber-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span className="font-teko text-2xl font-bold uppercase text-amber-200">
                Add New Esports Team
              </span>
              <button
                onClick={() => setIsAddTeamModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. GODLIKE ESPORTS"
                  className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-white font-bold font-rajdhani focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                    Team Tag
                  </label>
                  <input
                    type="text"
                    value={newTeamTag}
                    onChange={(e) => setNewTeamTag(e.target.value.toUpperCase())}
                    placeholder="e.g. GDLK"
                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                    Initial Points
                  </label>
                  <input
                    type="number"
                    value={newTeamPoints}
                    onChange={(e) => setNewTeamPoints(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Logo Presets Picker */}
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-300 block mb-1">
                  Pick Logo Preset or Upload
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {LOGO_PRESETS_LIST.slice(0, 6).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        const svg = createEsportsSvgLogo(newTeamName || 'TEAM', preset.bg, preset.accent, preset.symbol);
                        setNewTeamLogo(svg);
                      }}
                      className="p-1.5 rounded-lg bg-black/60 border border-amber-500/20 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="text-[8px] font-mono text-zinc-300 truncate w-full text-center mt-0.5">
                        {preset.symbol}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddTeamModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-rajdhani font-bold text-xs cursor-pointer hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewTeam}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-rajdhani font-black text-xs uppercase tracking-wider shadow cursor-pointer transition"
              >
                Save Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM LOGO & STATS MODAL */}
      {editingTeam && (
        <TeamLogoEditorModal
          team={editingTeam.team}
          standing={editingTeam.standing}
          isOpen={Boolean(editingTeam)}
          onClose={() => setEditingTeam(null)}
          onSave={handleSaveTeamOverride}
        />
      )}
    </div>
  );
};
