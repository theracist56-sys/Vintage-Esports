import React, { useState, useRef } from 'react';
import { Team } from '../types/tournament';
import { createEsportsSvgLogo } from '../data/defaultTournament';
import { 
  Users, 
  Upload, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Sparkles, 
  Palette, 
  Shield 
} from 'lucide-react';

interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
}

const PRESET_COLORS = [
  '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#84cc16', 
  '#eab308', '#f97316', '#ef4444', '#ec4899', '#d946ef'
];

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
}) => {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTag, setNewTeamTag] = useState('');
  const [newTeamGroup, setNewTeamGroup] = useState('Pot 1');
  const [newTeamColor, setNewTeamColor] = useState('#8b5cf6');
  const [newTeamPlayers, setNewTeamPlayers] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const tag = newTeamTag.trim() || newTeamName.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    const finalLogo = logoPreview || createEsportsSvgLogo(
      newTeamName, 
      newTeamColor, 
      '#ffffff', 
      'M50 22 L62 26 L62 36 C62 44 50 48 50 48 C50 48 38 44 38 36 L38 26 Z'
    );

    const playersList = newTeamPlayers
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (editingTeam) {
      onUpdateTeam({
        ...editingTeam,
        name: newTeamName,
        tag,
        group: newTeamGroup,
        color: newTeamColor,
        logo: finalLogo,
        players: playersList,
      });
      setEditingTeam(null);
    } else {
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: newTeamName,
        tag,
        group: newTeamGroup,
        color: newTeamColor,
        logo: finalLogo,
        players: playersList.length > 0 ? playersList : [`${tag}_Captain`, `${tag}_Fragger`, `${tag}_Support`, `${tag}_Sniper`],
      };
      onAddTeam(newTeam);
    }

    // Reset fields
    setNewTeamName('');
    setNewTeamTag('');
    setLogoPreview('');
    setNewTeamPlayers('');
  };

  const startEdit = (t: Team) => {
    setEditingTeam(t);
    setNewTeamName(t.name);
    setNewTeamTag(t.tag);
    setNewTeamGroup(t.group || 'Pot 1');
    setNewTeamColor(t.color || '#8b5cf6');
    setLogoPreview(t.logo);
    setNewTeamPlayers((t.players || []).join(', '));
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setNewTeamName('');
    setNewTeamTag('');
    setLogoPreview('');
    setNewTeamPlayers('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#121420]/80 p-4 rounded-xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-rajdhani text-white">
              TEAMS & SMART LOGO ROSTER
            </h2>
            <p className="text-xs text-slate-400">
              Manage tournament team profiles, upload custom badges/logos, configure groups (Pot 1 / Pot 2), and set player lineups.
            </p>
          </div>
        </div>

        <div className="text-xs text-purple-300 font-mono font-bold px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/60">
          {teams.length} Registered Teams
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team Form */}
        <div className="bg-[#10121d] p-5 rounded-2xl border border-slate-800 lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold font-rajdhani text-white flex items-center gap-2">
            {editingTeam ? <Edit className="w-4 h-4 text-purple-400" /> : <Plus className="w-4 h-4 text-purple-400" />}
            {editingTeam ? 'EDIT TEAM PROFILE' : 'ADD NEW TOURNAMENT TEAM'}
          </h3>

          <form onSubmit={handleCreateOrUpdate} className="space-y-3 text-xs">
            {/* Logo Uploader / Preview */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5">
                Team Badge / Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <Shield className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    Upload Custom PNG/SVG
                  </button>
                  <div className="text-[10px] text-slate-500">
                    Or leave empty to auto-generate esports shield
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Team Alpha"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-rajdhani font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">
                  Tag / Abbr
                </label>
                <input
                  type="text"
                  placeholder="e.g. ALPHA"
                  value={newTeamTag}
                  onChange={(e) => setNewTeamTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">
                  Group / Pot
                </label>
                <select
                  value={newTeamGroup}
                  onChange={(e) => setNewTeamGroup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                >
                  <option value="Pot 1">Pot 1</option>
                  <option value="Pot 2">Pot 2</option>
                  <option value="Group A">Group A</option>
                  <option value="Group B">Group B</option>
                  <option value="Finals">Finals</option>
                </select>
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                Team Brand Color
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNewTeamColor(col)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      newTeamColor === col ? 'scale-110 border-white ring-2 ring-purple-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Player Squad (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Alpha_Ghost, Alpha_Striker, Alpha_Viper..."
                value={newTeamPlayers}
                onChange={(e) => setNewTeamPlayers(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              {editingTeam && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-rajdhani tracking-wider cursor-pointer shadow-md shadow-purple-600/30"
              >
                {editingTeam ? 'SAVE CHANGES' : 'REGISTER TEAM'}
              </button>
            </div>
          </form>
        </div>

        {/* Team Grid Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div
                key={t.id}
                className="bg-[#10121d] p-3.5 rounded-xl border border-slate-800/80 hover:border-purple-500/50 transition-all flex items-start justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700/60 p-1 flex items-center justify-center flex-shrink-0">
                    <img src={t.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-bold text-white font-rajdhani text-base flex items-center gap-1.5">
                      {t.name}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">
                        {t.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-400 border border-purple-800/40 text-[10px]">
                        {t.group || 'Pot 1'}
                      </span>
                      <span>{t.players?.length || 4} Players</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    title="Edit Team"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTeam(t.id)}
                    className="p-1.5 rounded-md hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Delete Team"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
