import React from 'react';
import { 
  TeamStanding, 
  TournamentConfig, 
  Team 
} from '../types/tournament';
import { 
  Trophy, 
  Flame, 
  Crown, 
  Shield, 
  Crosshair, 
  Users, 
  Clock, 
  Calendar, 
  Gamepad2, 
  Award,
  Sparkles,
  ChevronRight,
  Target
} from 'lucide-react';

interface TemplateRendererProps {
  layoutType: string;
  displayTeams: TeamStanding[];
  tournament: TournamentConfig;
  headlineFont: string;
  bodyFont: string;
  numbersFont: string;
  accentColor: string;
  customPhase: string;
  customGroup: string;
  customDate: string;
  customTime: string;
  customMatches: string;
  customSponsors: string;
  customMvpNick: string;
  customMvpTeam: string;
  customMvpKills: number;
  customMvpDamage: number;
  customMvpPhoto: string | null;
  showPointsBars: boolean;
  maxPoints: number;
  onSelectTeam: (team: Team, standing?: TeamStanding) => void;
}

export const EsportsTemplateRenderer: React.FC<TemplateRendererProps> = ({
  layoutType,
  displayTeams,
  tournament,
  headlineFont,
  bodyFont,
  numbersFont,
  accentColor,
  customPhase,
  customGroup,
  customDate,
  customTime,
  customMatches,
  customSponsors,
  customMvpNick,
  customMvpTeam,
  customMvpKills,
  customMvpDamage,
  customMvpPhoto,
  showPointsBars,
  maxPoints,
  onSelectTeam,
}) => {
  // Common slices
  const teams12 = displayTeams.slice(0, 12);
  const teams16 = displayTeams.slice(0, 16);
  const teams18 = displayTeams.slice(0, 18);
  const teams20 = displayTeams.slice(0, 20);

  // 1. PMNC 20-TEAM DUAL COLUMN WITH 5 WWCD WINNERS BANNER
  if (layoutType === 'pmnc_vietnam_20') {
    const col1 = teams20.slice(0, 10);
    const col2 = teams20.slice(10, 20);
    const matchWinners = [
      { match: 'TRẬN 1', teamTag: displayTeams[0]?.team.tag || 'DYX', kills: 15, logo: displayTeams[0]?.team.logo },
      { match: 'TRẬN 2', teamTag: displayTeams[1]?.team.tag || 'EGX', kills: 12, logo: displayTeams[1]?.team.logo },
      { match: 'TRẬN 3', teamTag: displayTeams[2]?.team.tag || 'BAT', kills: 6, logo: displayTeams[2]?.team.logo },
      { match: 'TRẬN 4', teamTag: displayTeams[3]?.team.tag || 'BAT', kills: 8, logo: displayTeams[3]?.team.logo },
      { match: 'TRẬN 5', teamTag: displayTeams[4]?.team.tag || 'NCI', kills: 7, logo: displayTeams[4]?.team.logo },
    ];

    return (
      <div className="space-y-2 text-white">
        {/* Championship Header Badges */}
        <div className="flex items-center justify-between px-1">
          <div className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
            2026 PUBG MOBILE NATIONAL CHAMPIONSHIP
          </div>
          <div className="px-2 py-0.5 rounded bg-emerald-500 text-black font-mono font-black text-[10px] uppercase">
            {customPhase || 'VÒNG LOẠI • NGÀY 1'}
          </div>
        </div>

        {/* 5 WWCD Winner Capsules Banner */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-black/70 rounded-xl border border-emerald-500/40">
          {matchWinners.map((w, idx) => (
            <div key={idx} className="flex items-center bg-zinc-950/90 rounded-lg border border-emerald-500/30 overflow-hidden">
              <div className="bg-emerald-500 text-black px-1 py-1 font-mono font-black text-[7px] [writing-mode:vertical-lr] rotate-180 flex items-center justify-center">
                WWCD
              </div>
              <div className="p-1 flex-1 min-w-0 text-center">
                <div className="text-[8px] font-mono text-emerald-300 uppercase leading-none font-bold">{w.match}</div>
                <div className="font-teko text-xs font-black text-white leading-tight truncate">{w.teamTag}</div>
                <div className="text-[7px] font-mono text-zinc-400">{w.kills} HẠ GỤC</div>
              </div>
            </div>
          ))}
        </div>

        {/* 20-Team Dual Column Leaderboard */}
        <div className="grid grid-cols-2 gap-2">
          {[col1, col2].map((col, cIdx) => (
            <div key={cIdx} className="space-y-1">
              <div className="grid grid-cols-12 px-1.5 py-0.5 text-[8px] font-mono uppercase bg-emerald-950/60 rounded border border-emerald-500/30 text-emerald-300 font-black">
                <div className="col-span-2 text-center">#</div>
                <div className="col-span-5 truncate">ĐỘI</div>
                <div className="col-span-2 text-center truncate">ĐIỂM</div>
                <div className="col-span-3 text-center truncate">TỔNG</div>
              </div>

              {col.map((s) => (
                <div
                  key={s.team.id}
                  onClick={() => onSelectTeam(s.team, s)}
                  className="grid grid-cols-12 items-center px-1.5 py-0.5 rounded bg-white text-zinc-950 font-bold shadow-sm hover:ring-2 hover:ring-emerald-400 transition cursor-pointer"
                >
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-black text-emerald-700">#{s.rank}</span>
                  </div>
                  <div className="col-span-5 flex items-center gap-1 truncate pr-1">
                    <div className="w-3.5 h-3.5 rounded bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-300 overflow-hidden">
                      {s.team.logo ? <img src={s.team.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-[7px] font-black text-black">{s.team.tag}</span>}
                    </div>
                    <span className="text-[10px] font-black uppercase truncate text-zinc-900 leading-tight" style={{ fontFamily: bodyFont }}>
                      {s.team.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-[9px] font-mono text-zinc-700" style={{ fontFamily: numbersFont }}>
                    {s.totalKills}
                  </div>
                  <div className="col-span-3 text-center text-[11px] font-mono font-black text-emerald-800" style={{ fontFamily: numbersFont }}>
                    {s.totalPoints}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Broadcast Live & Social Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-black/80 rounded-lg border border-emerald-500/30 text-[8px] font-mono text-zinc-300">
          <span className="text-emerald-300 font-bold">LIVESTREAM: 16:45 TOURNAMENT DAYS</span>
          <span className="text-zinc-400">PUBG MOBILE ESPORTS OFFICIAL</span>
        </div>
      </div>
    );
  }

  // 2. BGMI / FREE FIRE GOLDEN PODIUM TEAMS PLAYING (Image 2: 8k.jpg)
  if (layoutType === 'bgmi_grands_teams_playing') {
    return (
      <div className="space-y-3 text-center">
        {/* 3D Metallic Badge Center Header */}
        <div className="inline-block px-5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 p-[2px] shadow-2xl">
          <div className="bg-[#120e06] px-6 py-1 rounded-[14px]">
            <span className="font-teko text-2xl font-black text-yellow-300 uppercase tracking-widest block">
              {customPhase || 'TEAMS PLAYING • QUALIFIED'}
            </span>
          </div>
        </div>

        {/* Parachutes & Battlefield Atmosphere Note */}
        <div className="flex justify-between items-center text-[9px] font-mono text-amber-300/80 px-2 uppercase font-bold">
          <span>{customGroup || 'GROUP STAGE • 18 TEAMS'}</span>
          <span>{customMatches || 'BATTLE ROYALE SURVIVAL'}</span>
        </div>

        {/* Golden Polaroid-Style 3D Team Frames */}
        <div className="grid grid-cols-6 gap-2">
          {teams18.map((s, idx) => (
            <div
              key={s.team.id || idx}
              onClick={() => onSelectTeam(s.team, s)}
              className="flex flex-col items-center bg-gradient-to-b from-[#2a1e06] via-[#150f03] to-black p-1.5 rounded-xl border border-amber-500/50 shadow-lg hover:border-yellow-400 hover:scale-105 transition cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-lg bg-black/80 border border-amber-500/40 p-1 flex items-center justify-center overflow-hidden mb-1 group-hover:border-yellow-300">
                {s.team.logo ? (
                  <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Shield className="w-6 h-6 text-amber-400" />
                )}
              </div>
              <span className="font-teko text-[11px] font-black uppercase text-amber-200 truncate w-full tracking-wider">
                {s.team.tag || s.team.name}
              </span>
              <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-mono font-black text-[8px] rounded px-0.5 mt-0.5 truncate">
                SLOT #{idx + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 rounded-xl bg-black/60 border border-amber-500/30 text-[9px] font-mono text-amber-300 flex items-center justify-between">
          <span>SPONSORED BY: {customSponsors}</span>
          <span className="font-black text-yellow-400">BGMI ESPORTS TOURNAMENT</span>
        </div>
      </div>
    );
  }

  // 3. XTREINO CORUJAO FF 12-TEAM DUAL COLUMN WITH TOP 3 BOXES (Image 3: 778770960619556536.jpg)
  if (layoutType === 'xtreino_ff_red_top3') {
    const top3 = teams12.slice(0, 3);
    const colLeft = teams12.slice(0, 6);
    const colRight = teams12.slice(6, 12);

    return (
      <div className="space-y-3">
        {/* Top 3 Winner Podium Blocks (2nd, 1st, 3rd) */}
        <div className="grid grid-cols-3 gap-2 px-2 pt-1">
          {/* 2nd Place */}
          <div
            onClick={() => top3[1] && onSelectTeam(top3[1].team, top3[1])}
            className="flex flex-col items-center bg-black/70 border-2 border-red-500/60 rounded-xl p-2 cursor-pointer hover:border-red-400 transition"
          >
            <span className="font-mono text-[9px] font-black text-zinc-300 uppercase mb-1">2º LUGAR</span>
            <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center mb-1 overflow-hidden shadow">
              {top3[1]?.team.logo ? <img src={top3[1].team.logo} alt="" className="w-full h-full object-contain" /> : <span className="font-teko text-black text-xl font-bold">{top3[1]?.team.tag || '2ND'}</span>}
            </div>
            <span className="font-teko text-xs font-bold text-white uppercase truncate w-full text-center">{top3[1]?.team.name || 'LINE 02'}</span>
            <span className="font-mono text-[10px] font-black text-red-400">{top3[1]?.totalPoints || 0} PTS</span>
          </div>

          {/* 1st Place */}
          <div
            onClick={() => top3[0] && onSelectTeam(top3[0].team, top3[0])}
            className="flex flex-col items-center bg-gradient-to-b from-red-950 via-black to-black border-2 border-red-500 rounded-xl p-2 cursor-pointer hover:border-red-300 transition shadow-lg shadow-red-600/30 scale-105"
          >
            <div className="flex items-center gap-1 font-mono text-[10px] font-black text-yellow-400 uppercase mb-1">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>1º LUGAR</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-lg p-1 flex items-center justify-center mb-1 overflow-hidden shadow">
              {top3[0]?.team.logo ? <img src={top3[0].team.logo} alt="" className="w-full h-full object-contain" /> : <span className="font-teko text-black text-2xl font-bold">{top3[0]?.team.tag || '1ST'}</span>}
            </div>
            <span className="font-teko text-sm font-black text-yellow-300 uppercase truncate w-full text-center">{top3[0]?.team.name || 'LINE 01'}</span>
            <span className="font-mono text-xs font-black text-red-400">{top3[0]?.totalPoints || 0} PTS</span>
          </div>

          {/* 3rd Place */}
          <div
            onClick={() => top3[2] && onSelectTeam(top3[2].team, top3[2])}
            className="flex flex-col items-center bg-black/70 border-2 border-red-500/60 rounded-xl p-2 cursor-pointer hover:border-red-400 transition"
          >
            <span className="font-mono text-[9px] font-black text-zinc-300 uppercase mb-1">3º LUGAR</span>
            <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center mb-1 overflow-hidden shadow">
              {top3[2]?.team.logo ? <img src={top3[2].team.logo} alt="" className="w-full h-full object-contain" /> : <span className="font-teko text-black text-xl font-bold">{top3[2]?.team.tag || '3RD'}</span>}
            </div>
            <span className="font-teko text-xs font-bold text-white uppercase truncate w-full text-center">{top3[2]?.team.name || 'LINE 03'}</span>
            <span className="font-mono text-[10px] font-black text-red-400">{top3[2]?.totalPoints || 0} PTS</span>
          </div>
        </div>

        {/* Dual Column Line / Points Table */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Left Lines 01 - 06 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-red-400 font-bold px-1 uppercase">
              <span>LINE (01-06)</span>
              <span>PT</span>
            </div>
            {colLeft.map((s, idx) => (
              <div
                key={s.team.id}
                onClick={() => onSelectTeam(s.team, s)}
                className="flex items-center gap-1 bg-black/80 p-1 rounded border border-red-600/40 cursor-pointer hover:border-red-400 transition"
              >
                <span className="w-5 text-center font-mono font-black text-[10px] text-red-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 bg-white px-2 py-0.5 rounded text-black font-black uppercase text-xs truncate" style={{ fontFamily: bodyFont }}>
                  {s.team.name}
                </div>
                <div className="w-8 text-center bg-red-600 text-white font-mono font-black text-xs py-0.5 rounded">
                  {s.totalPoints}
                </div>
              </div>
            ))}
          </div>

          {/* Right Lines 07 - 12 */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-red-400 font-bold px-1 uppercase">
              <span>LINE (07-12)</span>
              <span>PT</span>
            </div>
            {colRight.map((s, idx) => (
              <div
                key={s.team.id}
                onClick={() => onSelectTeam(s.team, s)}
                className="flex items-center gap-1 bg-black/80 p-1 rounded border border-red-600/40 cursor-pointer hover:border-red-400 transition"
              >
                <span className="w-5 text-center font-mono font-black text-[10px] text-red-500">
                  {String(idx + 7).padStart(2, '0')}
                </span>
                <div className="flex-1 bg-white px-2 py-0.5 rounded text-black font-black uppercase text-xs truncate" style={{ fontFamily: bodyFont }}>
                  {s.team.name}
                </div>
                <div className="w-8 text-center bg-red-600 text-white font-mono font-black text-xs py-0.5 rounded">
                  {s.totalPoints}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center font-mono text-[9px] text-zinc-400 tracking-wider pt-1">
          DESIGN ESPORTS CORUJÃO • TOURNAMENT SYSTEM
        </div>
      </div>
    );
  }

  // 4. TOP 3 MELHORES MEDIEVAL SHIELD BANNERS (Image 4: 1196337397705264.jpg)
  if (layoutType === 'top3_melhores_banners') {
    const top3 = teams12.slice(0, 3);
    return (
      <div className="space-y-5 py-4 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs uppercase font-bold tracking-widest">
          #TOP3 MELHORES DA RODADA
        </div>

        {/* 3 Medieval Hanging V-Banners */}
        <div className="grid grid-cols-3 gap-3 px-2 pt-2 items-end">
          {/* 2nd Place */}
          <div
            onClick={() => top3[1] && onSelectTeam(top3[1].team, top3[1])}
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="font-mono text-xs font-black text-cyan-300 uppercase mb-2">2º LUGAR</span>
            <div className="w-full bg-gradient-to-b from-[#08202d] to-black border-2 border-cyan-400/70 p-3 flex flex-col items-center [clip-path:polygon(0_0,100%_0,100%_80%,50%_100%,0_80%)] pb-8 pt-4 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-300 transition">
              <div className="w-14 h-14 rounded-xl bg-cyan-950/60 border border-cyan-400/40 p-1 flex items-center justify-center mb-2">
                {top3[1]?.team.logo ? <img src={top3[1].team.logo} alt="" className="w-full h-full object-contain" /> : <Shield className="w-8 h-8 text-cyan-400" />}
              </div>
              <span className="font-teko text-base font-black text-white uppercase truncate w-full text-center">{top3[1]?.team.name || 'RUNNER UP'}</span>
              <span className="font-mono text-xs font-black text-cyan-300 mt-1">{top3[1]?.totalPoints || 0} PONTOS</span>
              <span className="text-[9px] font-mono text-zinc-400">{top3[1]?.totalKills || 0} KILLS</span>
            </div>
          </div>

          {/* 1st Place Champion (Taller) */}
          <div
            onClick={() => top3[0] && onSelectTeam(top3[0].team, top3[0])}
            className="flex flex-col items-center cursor-pointer group -translate-y-2"
          >
            <div className="flex items-center gap-1 font-mono text-xs font-black text-yellow-300 uppercase mb-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>1º LUGAR</span>
            </div>
            <div className="w-full bg-gradient-to-b from-[#0e3042] via-[#08202d] to-black border-2 border-cyan-300 p-4 flex flex-col items-center [clip-path:polygon(0_0,100%_0,100%_80%,50%_100%,0_80%)] pb-10 pt-5 shadow-2xl shadow-cyan-400/40 group-hover:scale-105 transition">
              <div className="w-18 h-18 rounded-2xl bg-cyan-950/80 border-2 border-yellow-400 p-1 flex items-center justify-center mb-2 shadow-lg">
                {top3[0]?.team.logo ? <img src={top3[0].team.logo} alt="" className="w-full h-full object-contain" /> : <Crown className="w-10 h-10 text-yellow-400" />}
              </div>
              <span className="font-teko text-xl font-black text-yellow-300 uppercase truncate w-full text-center tracking-wider">{top3[0]?.team.name || 'CHAMPION'}</span>
              <span className="font-mono text-sm font-black text-cyan-200 mt-1">{top3[0]?.totalPoints || 0} PONTOS</span>
              <span className="text-[10px] font-mono text-yellow-400 font-bold">{top3[0]?.wwcdCount || 0} BOOYAH! • {top3[0]?.totalKills || 0} KILLS</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div
            onClick={() => top3[2] && onSelectTeam(top3[2].team, top3[2])}
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="font-mono text-xs font-black text-cyan-300 uppercase mb-2">3º LUGAR</span>
            <div className="w-full bg-gradient-to-b from-[#08202d] to-black border-2 border-cyan-400/70 p-3 flex flex-col items-center [clip-path:polygon(0_0,100%_0,100%_80%,50%_100%,0_80%)] pb-8 pt-4 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-300 transition">
              <div className="w-14 h-14 rounded-xl bg-cyan-950/60 border border-cyan-400/40 p-1 flex items-center justify-center mb-2">
                {top3[2]?.team.logo ? <img src={top3[2].team.logo} alt="" className="w-full h-full object-contain" /> : <Shield className="w-8 h-8 text-cyan-400" />}
              </div>
              <span className="font-teko text-base font-black text-white uppercase truncate w-full text-center">{top3[2]?.team.name || '3RD PLACE'}</span>
              <span className="font-mono text-xs font-black text-cyan-300 mt-1">{top3[2]?.totalPoints || 0} PONTOS</span>
              <span className="text-[9px] font-mono text-zinc-400">{top3[2]?.totalKills || 0} KILLS</span>
            </div>
          </div>
        </div>

        <div className="pt-3 font-teko text-xl tracking-widest text-cyan-300 uppercase">
          AGRADECEMOS A TODAS AS EQUIPES!
        </div>
      </div>
    );
  }

  // 5. ELITE RANK MVP POSTER (Image 5: 64880050876100142.jpg)
  if (layoutType === 'elite_rank_mvp_yellow') {
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between px-2">
          <div className="px-3 py-1 bg-yellow-400 text-black font-mono font-black text-xs uppercase tracking-wider rounded">
            ELITE RANK ESPORTS
          </div>
          <span className="font-mono text-xs text-yellow-300 font-bold">{customPhase || 'MVP OF THE MATCH'}</span>
        </div>

        {/* Center Split: Big Photo Frame + Nick/Line/Kill Bars */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Large MVP Avatar / Character Window */}
          <div className="col-span-6 bg-black/80 rounded-2xl border-2 border-yellow-400 p-2 relative shadow-2xl shadow-yellow-500/30 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {customMvpPhoto ? (
              <img src={customMvpPhoto} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-3">
                <Crown className="w-16 h-16 text-yellow-400 mb-2 drop-shadow" />
                <span className="font-teko text-2xl font-black text-white uppercase">{customMvpNick}</span>
                <span className="font-mono text-xs text-yellow-400">{customMvpTeam}</span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-black font-mono font-black text-[9px] rounded">
              MVP
            </div>
          </div>

          {/* Yellow Stencil Stat Bars */}
          <div className="col-span-6 space-y-2.5">
            <div className="bg-yellow-400 text-black p-2.5 rounded-xl shadow-md">
              <span className="font-mono text-[9px] font-black uppercase block tracking-wider opacity-80">NICK -</span>
              <span className="font-teko text-2xl font-black uppercase leading-none block truncate">{customMvpNick}</span>
            </div>

            <div className="bg-yellow-400 text-black p-2.5 rounded-xl shadow-md">
              <span className="font-mono text-[9px] font-black uppercase block tracking-wider opacity-80">LINE / TEAM -</span>
              <span className="font-teko text-xl font-black uppercase leading-none block truncate">{customMvpTeam}</span>
            </div>

            <div className="bg-yellow-400 text-black p-2.5 rounded-xl shadow-md">
              <span className="font-mono text-[9px] font-black uppercase block tracking-wider opacity-80">TOTAL KILLS -</span>
              <span className="font-mono text-3xl font-black leading-none block">{customMvpKills} KILLS</span>
            </div>

            <div className="bg-black/60 border border-yellow-400/40 text-yellow-300 p-2 rounded-xl text-center font-mono text-xs font-bold">
              DAMAGE DEALT: {customMvpDamage} HP
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-black/70 rounded-xl border border-yellow-400/30 text-[10px] font-mono text-zinc-300">
          <span>DATE: {customDate}</span>
          <span className="text-yellow-400 font-bold">OFFICIAL TOURNAMENT MVP</span>
        </div>
      </div>
    );
  }

  // 6. CLASH OF TITANS 12-TEAM GREEN/LIME BRACKET STANDINGS (Image 6: 50243352088046355.jpg)
  if (layoutType === 'clash_of_titans_green') {
    return (
      <div className="space-y-2 text-white">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-mono text-lime-400 uppercase font-bold tracking-widest">
            {customPhase || 'SEMI FINALS'}
          </span>
          <span className="text-xs font-mono text-zinc-400">CLASH OF TITANS 4</span>
        </div>

        {/* Column Labels */}
        <div className="grid grid-cols-12 px-2 py-1 bg-lime-950/80 rounded-lg text-[9px] font-mono font-black text-lime-300 uppercase border border-lime-500/30">
          <div className="col-span-2 text-center">#</div>
          <div className="col-span-4">TEAM NAME</div>
          <div className="col-span-2 text-center">BOOYAH!</div>
          <div className="col-span-2 text-center">KILL</div>
          <div className="col-span-2 text-center">TOTAL</div>
        </div>

        {/* 12-Team Curved Rows */}
        <div className="space-y-1">
          {teams12.map((s) => (
            <div
              key={s.team.id}
              onClick={() => onSelectTeam(s.team, s)}
              className="grid grid-cols-12 items-center px-2 py-1 rounded-xl bg-[#062413] border border-lime-500/40 hover:border-lime-300 transition cursor-pointer group shadow"
            >
              <div className="col-span-2 flex justify-center">
                <span className="w-6 h-6 rounded bg-lime-400 text-black font-mono font-black text-xs flex items-center justify-center">
                  {String(s.rank).padStart(2, '0')}
                </span>
              </div>

              <div className="col-span-4 flex items-center gap-1.5 truncate pr-1">
                <div className="w-5 h-5 rounded bg-black/60 border border-lime-400/40 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                  {s.team.logo ? <img src={s.team.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-[8px] font-bold text-lime-300">{s.team.tag}</span>}
                </div>
                <span className="font-black uppercase truncate text-white text-xs" style={{ fontFamily: bodyFont }}>
                  {s.team.name}
                </span>
              </div>

              <div className="col-span-2 text-center font-mono font-black text-xs text-lime-300" style={{ fontFamily: numbersFont }}>
                {s.wwcdCount ? String(s.wwcdCount).padStart(2, '0') : '--'}
              </div>

              <div className="col-span-2 text-center font-mono font-bold text-xs text-zinc-300" style={{ fontFamily: numbersFont }}>
                {s.totalKills}
              </div>

              <div className="col-span-2 text-center">
                <span className="px-2 py-0.5 rounded bg-lime-400 text-black font-mono font-black text-xs" style={{ fontFamily: numbersFont }}>
                  {s.totalPoints}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 pt-1 px-1">
          <span>YOUTUBE • INSTAGRAM @4ENDS_ESPORTS</span>
          <span className="text-lime-400 font-bold">VISUAL PARTNER</span>
        </div>
      </div>
    );
  }

  // 7. MEET THE TEAMS DOTA 2 / BATTLE ROYALE RED BANNER (Image 7: Meet the Teams Dota 2 Banner)
  if (layoutType === 'meet_the_teams_red') {
    return (
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-zinc-400 uppercase">
          <span>SPONSORED BY: {customSponsors}</span>
          <span className="text-red-400 font-bold">{customPhase || 'CHAMPIONSHIP ROSTER'}</span>
        </div>

        {/* 12 Solid Crimson Team Square Cards */}
        <div className="grid grid-cols-4 gap-2.5 px-1">
          {teams12.map((s, idx) => (
            <div
              key={s.team.id || idx}
              onClick={() => onSelectTeam(s.team, s)}
              className="flex flex-col items-center bg-[#b91c1c] hover:bg-[#dc2626] rounded-xl p-2 cursor-pointer transition shadow-lg shadow-red-950/50 hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-white/95 rounded-lg p-1 flex items-center justify-center mb-1.5 shadow overflow-hidden group-hover:bg-white">
                {s.team.logo ? (
                  <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Shield className="w-6 h-6 text-red-600" />
                )}
              </div>
              <span className="font-teko text-xs font-black uppercase text-white truncate w-full tracking-wide">
                {s.team.name}
              </span>
              <span className="font-mono text-[8px] text-red-200">SEED #{idx + 1}</span>
            </div>
          ))}
        </div>

        <div className="text-center font-mono text-[9px] text-zinc-400">
          ASGARD CHAMPIONSHIP • MEET THE TEAMS TOURNAMENT BANNER
        </div>
      </div>
    );
  }

  // 8. JADWAL ESPORTS HARI INI - FIXTURES & MATCH SCHEDULE (Image 8: JADWAL ESPORTS HARI INI.jpg)
  if (layoutType === 'jadwal_esports_fixtures') {
    const fixtures = [
      { t1: displayTeams[0]?.team || { name: 'ILBRIS ESPORTS', tag: 'ILB' }, t2: displayTeams[1]?.team || { name: 'RUNE EATERS', tag: 'RE' }, game: 'DOTA 2', time: '22:00 WIB', date: '9 AGU 2026' },
      { t1: displayTeams[2]?.team || { name: 'TEAM HERETICS', tag: 'TH' }, t2: displayTeams[3]?.team || { name: 'FIRE FLUX', tag: 'FF' }, game: 'VALORANT', time: '22:00 WIB', date: '9 AGU 2026' },
      { t1: displayTeams[4]?.team || { name: 'LOUD ESPORTS', tag: 'LLL' }, t2: displayTeams[5]?.team || { name: 'VIVO KEYD', tag: 'VK' }, game: 'LEAGUE OF LEGENDS', time: '22:59 WIB', date: '9 AGU 2026' },
      { t1: displayTeams[6]?.team || { name: 'GREMIO ESPORTS', tag: 'GRE' }, t2: displayTeams[7]?.team || { name: 'PROCYON TEAM', tag: 'PRC' }, game: 'CS 2', time: '00:00 WIB', date: '10 AGU 2026' },
      { t1: displayTeams[8]?.team || { name: 'FNATIC', tag: 'FNC' }, t2: displayTeams[9]?.team || { name: 'KARMINE CORP', tag: 'KC' }, game: 'LEAGUE OF LEGENDS', time: '00:15 WIB', date: '10 AGU 2026' },
    ];

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-zinc-400 uppercase">
          <span className="text-amber-400 font-bold">{customPhase || 'JADWAL ESPORTS HARI INI'}</span>
          <span>DATE: {customDate}</span>
        </div>

        {/* Fixtures Match Cards */}
        <div className="space-y-1.5">
          {fixtures.map((f, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center bg-black/80 border border-zinc-700/60 rounded-xl p-1.5 shadow hover:border-amber-400 transition"
            >
              {/* Team 1 */}
              <div className="col-span-4 flex items-center justify-end gap-1.5 truncate">
                <span className="font-teko text-sm font-bold text-white uppercase truncate">{f.t1.name}</span>
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center p-0.5 shrink-0">
                  {'logo' in f.t1 && (f.t1 as { logo?: string }).logo ? (
                    <img src={(f.t1 as { logo: string }).logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[8px] text-amber-400 font-bold">{f.t1.tag}</span>
                  )}
                </div>
              </div>

              {/* Match Time & Game Badge */}
              <div className="col-span-4 text-center px-1">
                <div className="text-[7px] font-mono text-zinc-400 uppercase leading-none">{f.date}</div>
                <div className="font-mono text-[10px] font-black text-amber-400 leading-tight">{f.time}</div>
                <div className="inline-block px-1.5 py-0.2 bg-zinc-800 rounded text-[7px] font-mono text-zinc-300 uppercase">
                  {f.game}
                </div>
              </div>

              {/* Team 2 */}
              <div className="col-span-4 flex items-center justify-start gap-1.5 truncate">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center p-0.5 shrink-0">
                  {'logo' in f.t2 && (f.t2 as { logo?: string }).logo ? (
                    <img src={(f.t2 as { logo: string }).logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[8px] text-amber-400 font-bold">{f.t2.tag}</span>
                  )}
                </div>
                <span className="font-teko text-sm font-bold text-white uppercase truncate">{f.t2.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Game Logos Ribbon */}
        <div className="p-2 bg-black/90 rounded-xl border border-zinc-800 flex items-center justify-between text-[8px] font-mono text-zinc-400">
          <span>PUBG • CS2 • VALORANT • DOTA 2 • LOL</span>
          <span className="text-amber-400 font-bold">VIRTUAL SPORTS ARENA</span>
        </div>
      </div>
    );
  }

  // 9. ESPORTS WORLD CUP 16-TEAM SEEDING POOLS (Image 9: 520447300714560687.jpg)
  if (layoutType === 'ewc_pools_seeding_16') {
    const pools = [
      { name: 'POOL 1', teams: teams16.slice(0, 4) },
      { name: 'POOL 2', teams: teams16.slice(4, 8) },
      { name: 'POOL 3', teams: teams16.slice(8, 12) },
      { name: 'POOL 4', teams: teams16.slice(12, 16) },
    ];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-purple-300 font-bold uppercase">
          <span>TEAMS SEEDING • 4 POOLS MATRIX</span>
          <span>{customPhase || 'WORLD CHAMPIONSHIP'}</span>
        </div>

        {/* 4 Pools Grid Rows */}
        <div className="space-y-2">
          {pools.map((p, pIdx) => (
            <div key={pIdx} className="grid grid-cols-12 gap-1.5 items-center bg-black/70 p-1.5 rounded-xl border border-purple-500/30">
              <div className="col-span-2 text-center">
                <span className="font-mono text-[9px] font-black text-purple-400 block leading-tight">{p.name}</span>
              </div>
              <div className="col-span-10 grid grid-cols-4 gap-1">
                {p.teams.map((s, tIdx) => (
                  <div
                    key={s.team.id || tIdx}
                    onClick={() => onSelectTeam(s.team, s)}
                    className="flex flex-col items-center bg-zinc-950 p-1 rounded-lg border border-purple-500/40 hover:border-purple-300 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded bg-black flex items-center justify-center p-0.5 overflow-hidden">
                      {s.team.logo ? <img src={s.team.logo} alt="" className="w-full h-full object-contain" /> : <span className="text-[8px] font-black text-white">{s.team.tag}</span>}
                    </div>
                    <span className="font-teko text-[10px] font-bold text-white uppercase truncate w-full text-center mt-0.5">
                      {s.team.tag || s.team.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center font-mono text-[8px] text-zinc-400">
          ESPORTS WORLD CUP OFFICIAL SEEDING MATRIX • {customSponsors}
        </div>
      </div>
    );
  }

  // 10. PCCI / STORM ESPORTS NEON PURPLE 20-SLOT MATRIX (Image 10: STORM ESPORTS TOURNAMENT ONLINE.jpg)
  if (layoutType === 'pcci_storm_purple_20') {
    return (
      <div className="space-y-2.5 text-center">
        <div className="inline-block px-4 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/60 text-fuchsia-300 font-mono text-xs uppercase font-bold tracking-wider">
          {customGroup || 'QUALIFICATION • GRUP A'}
        </div>

        {/* 20 Glowing Purple Capsule Slots (5x4) */}
        <div className="grid grid-cols-5 gap-2 px-1">
          {teams20.map((s, idx) => (
            <div
              key={s.team.id || idx}
              onClick={() => onSelectTeam(s.team, s)}
              className="flex flex-col items-center bg-gradient-to-b from-[#250836] to-[#0a0210] p-1.5 rounded-xl border border-fuchsia-500/50 hover:border-fuchsia-300 hover:scale-105 transition cursor-pointer shadow-md shadow-fuchsia-950/50 group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/80 border border-fuchsia-500/40 p-0.5 flex items-center justify-center overflow-hidden mb-1">
                {s.team.logo ? <img src={s.team.logo} alt="" className="w-full h-full object-contain" /> : <Shield className="w-5 h-5 text-fuchsia-400" />}
              </div>
              <span className="font-teko text-[10px] font-black uppercase text-white truncate w-full">
                {s.team.name}
              </span>
              <span className="font-mono text-[7px] text-fuchsia-300">SLOT #{idx + 1}</span>
            </div>
          ))}
        </div>

        <div className="text-[8px] font-mono text-zinc-400 pt-1">
          SUPPORTED BY: {customSponsors}
        </div>
      </div>
    );
  }

  // 11. WARRIOR CUP FREE FIRE 16-SLOT MATRIX (Image 11: Esports Creatives - Xenthetix Graphic.jpg)
  if (layoutType === 'warrior_cup_ff_slots_16') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-orange-400 font-bold uppercase">
          <span>FREE FIRE WARRIOR CUP (SEASON 1)</span>
          <span>{customPhase || 'SLOT LIST'}</span>
        </div>

        {/* Character Backdrop Note + 16 Team Slot Boxes (4x4) */}
        <div className="grid grid-cols-4 gap-2">
          {teams16.map((s, idx) => (
            <div
              key={s.team.id || idx}
              onClick={() => onSelectTeam(s.team, s)}
              className="flex flex-col items-center bg-black/80 border border-orange-500/60 rounded-xl overflow-hidden hover:border-orange-400 transition cursor-pointer shadow group"
            >
              <div className="w-full h-11 bg-zinc-950 flex items-center justify-center p-1">
                {s.team.logo ? (
                  <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="font-teko text-sm text-orange-400 font-bold">{s.team.tag || `SL${idx + 1}`}</span>
                )}
              </div>
              <div className="w-full bg-white text-black py-0.5 text-center font-black uppercase text-[9px] truncate px-1" style={{ fontFamily: bodyFont }}>
                {s.team.name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2 py-1 bg-black/80 rounded-lg border border-orange-500/30 text-[8px] font-mono text-zinc-400">
          <span>YOUTUBE: VIRTUALITY ESPORTS</span>
          <span>DISCORD: VIRTUALITYGG</span>
          <span>INSTAGRAM: VIRTUALITY.IN</span>
        </div>
      </div>
    );
  }

  // Fallback: Return null so caller handles default/other layouts
  return null;
};
