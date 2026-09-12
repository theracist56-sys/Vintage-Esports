import React, { useState, useRef } from 'react';
import { Team, TeamStanding } from '../types/tournament';
import { createEsportsSvgLogo, LOGO_PRESETS_LIST } from '../data/defaultTournament';
import { 
  X, 
  Upload, 
  Check, 
  Trash2, 
  Sparkles, 
  Shield, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

export interface TeamEditData {
  name: string;
  tag: string;
  logo: string;
  color: string;
  totalKills?: number;
  totalPoints?: number;
  wwcdCount?: number;
  trend?: 'up' | 'down' | 'same';
}

interface TeamLogoEditorModalProps {
  team: Team;
  standing?: TeamStanding;
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamId: string, updatedTeam: Partial<Team>, statOverrides?: {
    totalKills?: number;
    totalPoints?: number;
    wwcdCount?: number;
    trend?: 'up' | 'down' | 'same';
  }) => void;
}

export const TeamLogoEditorModal: React.FC<TeamLogoEditorModalProps> = ({
  team,
  standing,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(team.name);
  const [tag, setTag] = useState(team.tag);
  const [logo, setLogo] = useState(team.logo || '');
  const [color, setColor] = useState(team.color || '#eab308');
  const [kills, setKills] = useState<number>(standing?.totalKills ?? 0);
  const [points, setPoints] = useState<number>(standing?.totalPoints ?? 0);
  const [booyahs, setBooyahs] = useState<number>(standing?.wwcdCount ?? 0);
  const [trend, setTrend] = useState<'up' | 'down' | 'same'>('same');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof LOGO_PRESETS_LIST[0]) => {
    const newSvg = createEsportsSvgLogo(name || 'TEAM', preset.bg, preset.accent, preset.symbol);
    setLogo(newSvg);
    setColor(preset.bg);
  };

  const handleSave = () => {
    onSave(
      team.id,
      {
        name: name.trim() || team.name,
        tag: tag.trim() || (name.trim().substring(0, 4).toUpperCase()),
        logo,
        color,
      },
      {
        totalKills: Number(kills) || 0,
        totalPoints: Number(points) || 0,
        wwcdCount: Number(booyahs) || 0,
        trend,
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f0d09] border border-amber-500/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl shadow-black/90 space-y-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/60 border border-amber-500/40 p-1 flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={name} className="w-full h-full object-contain" />
              ) : (
                <Shield className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="font-teko text-2xl font-bold uppercase tracking-wide text-amber-200 leading-none">
                Edit Team & Logo
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                Customizing #{standing?.rank || 1} • {team.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/60 text-zinc-400 hover:text-white hover:bg-amber-500/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EVOS LUNA"
              className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-white font-bold font-rajdhani focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
              Team Tag / Short
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value.toUpperCase())}
              placeholder="e.g. EVOS"
              maxLength={6}
              className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-amber-300 font-black font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Logo Selection Section */}
        <div className="space-y-3 bg-black/40 p-3.5 rounded-2xl border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              Team Crest / Logo
            </span>

            {/* Logo mode toggle */}
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-amber-500/20 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  activeTab === 'upload' ? 'bg-amber-500 text-black' : 'text-zinc-400'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  activeTab === 'presets' ? 'bg-amber-500 text-black' : 'text-zinc-400'
                }`}
              >
                Presets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  activeTab === 'url' ? 'bg-amber-500 text-black' : 'text-zinc-400'
                }`}
              >
                URL
              </button>
            </div>
          </div>

          {/* Current Logo Preview */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-black/80 border-2 border-amber-500/50 p-1.5 flex items-center justify-center shrink-0 shadow-lg shadow-black">
              {logo ? (
                <img src={logo} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="font-teko text-2xl text-amber-400 font-black">{tag || 'TEAM'}</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              {activeTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-rajdhani font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo (PNG, JPG, SVG)
                  </button>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    Transparent PNG or SVG recommended for best esports render
                  </span>
                </div>
              )}

              {activeTab === 'presets' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    Choose an Esports Crest:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {LOGO_PRESETS_LIST.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="flex flex-col items-center p-1 rounded-lg bg-black/60 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400 transition text-[9px] font-mono cursor-pointer"
                      >
                        <div
                          className="w-5 h-5 rounded-full mb-0.5 flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: p.bg }}
                        >
                          ✦
                        </div>
                        <span className="truncate max-w-[55px] text-zinc-300">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'url' && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 bg-black/70 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrl) setLogo(customUrl);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overrides for Poster (Points, Kills, Booyahs, Trend) */}
        <div className="space-y-2.5 bg-black/40 p-3.5 rounded-2xl border border-amber-500/20">
          <span className="text-xs font-bold font-rajdhani uppercase text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Poster Score & Trend Overrides
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                Total Points
              </label>
              <input
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-xs text-amber-200 font-mono font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                Total Kills
              </label>
              <input
                type="number"
                min="0"
                value={kills}
                onChange={(e) => setKills(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                Booyah / WWCD
              </label>
              <input
                type="number"
                min="0"
                value={booyahs}
                onChange={(e) => setBooyahs(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/70 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-xs text-yellow-300 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Trend Indicator (Up, Down, Same) */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">Rank Trend Indicator:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTrend('up')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  trend === 'up'
                    ? 'bg-emerald-500 text-black font-black shadow'
                    : 'bg-black/60 text-zinc-400 hover:text-emerald-300'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" /> Up
              </button>
              <button
                type="button"
                onClick={() => setTrend('down')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  trend === 'down'
                    ? 'bg-red-500 text-black font-black shadow'
                    : 'bg-black/60 text-zinc-400 hover:text-red-300'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" /> Down
              </button>
              <button
                type="button"
                onClick={() => setTrend('same')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                  trend === 'same'
                    ? 'bg-zinc-300 text-black font-black shadow'
                    : 'bg-black/60 text-zinc-400 hover:text-white'
                }`}
              >
                <Minus className="w-3.5 h-3.5" /> Same
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black/60 text-zinc-300 hover:text-white font-rajdhani font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-rajdhani font-black text-sm uppercase tracking-wider hover:brightness-110 transition cursor-pointer shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
