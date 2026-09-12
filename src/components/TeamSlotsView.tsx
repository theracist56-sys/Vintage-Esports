import React, { useState } from 'react';
import { Team } from '../types/tournament';
import { 
  Users, 
  Upload, 
  Plus, 
  Trash2, 
  Edit2, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon,
  Check,
  X,
  Layers
} from 'lucide-react';

interface TeamSlotsViewProps {
  teams: Team[];
  onAddTeam: (newTeam: Team) => void;
  onUpdateTeam: (updatedTeam: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onOpenGraphicStudio: (layoutType: string) => void;
}

export const TeamSlotsView: React.FC<TeamSlotsViewProps> = ({
  teams,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onOpenGraphicStudio,
}) => {
  const [slotCount, setSlotCount] = useState<12 | 18>(12);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedTag, setEditedTag] = useState<string>('');
  const [editedGroup, setEditedGroup] = useState<string>('Pot 1');

  // Handle direct team logo upload from computer
  const handleLogoUpload = (team: Team, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Logo = event.target?.result as string;
      onUpdateTeam({
        ...team,
        logo: base64Logo,
      });
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditedName(team.name);
    setEditedTag(team.tag);
    setEditedGroup(team.group || 'Pot 1');
  };

  const saveEdit = (team: Team) => {
    onUpdateTeam({
      ...team,
      name: editedName,
      tag: editedTag.toUpperCase(),
      group: editedGroup,
    });
    setEditingTeamId(null);
  };

  const handleAddNewSlot = () => {
    const slotNum = teams.length + 1;
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: `Team Slot ${slotNum}`,
      tag: `SL${slotNum}`,
      logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><polygon points="50,4 94,22 84,82 50,98 16,82 6,22" fill="%231a160e" stroke="%23eab308" stroke-width="4"/><text x="50" y="58" font-family="sans-serif" font-weight="900" font-size="28" fill="%23fef08a" text-anchor="middle" dominant-baseline="middle">${slotNum}</text></svg>`,
      group: slotNum <= 6 ? 'Pot 1' : 'Pot 2',
      color: '#eab308',
      players: [`Player_${slotNum}_A`, `Player_${slotNum}_B`],
    };
    onAddTeam(newTeam);
  };

  // Pad or slice teams to the selected slot count
  const displayedSlots = Array.from({ length: slotCount }).map((_, idx) => {
    return (
      teams[idx] || {
        id: `empty_${idx}`,
        name: `[SLOT ${idx + 1} OPEN]`,
        tag: `OPEN`,
        logo: '',
        group: idx < 6 ? 'Pot 1' : 'Pot 2',
        isEmpty: true,
      }
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Slot Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f0d09] border border-amber-500/30 shadow-xl shadow-amber-500/5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="font-teko text-3xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 leading-none">
              TOURNAMENT SLOTS & ROSTERS
            </h2>
          </div>
          <p className="text-xs text-amber-200/70 font-rajdhani mt-1">
            Manage 12 or 18 registered teams, upload high-res custom logos, assign pot groups, and generate lobby posters
          </p>
        </div>

        {/* Slot Mode and Poster Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/60 rounded-xl p-1 border border-amber-500/30">
            <button
              onClick={() => setSlotCount(12)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-rajdhani cursor-pointer transition ${
                slotCount === 12
                  ? 'bg-amber-500 text-black font-extrabold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              12 Slots
            </button>
            <button
              onClick={() => setSlotCount(18)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-rajdhani cursor-pointer transition ${
                slotCount === 18
                  ? 'bg-amber-500 text-black font-extrabold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              18 Slots
            </button>
          </div>

          <button
            onClick={() => onOpenGraphicStudio('slots_vintage_gold_12')}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-extrabold font-rajdhani text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Vintage Slot Poster</span>
          </button>

          <button
            onClick={() => onOpenGraphicStudio('slots_pmes_tactical_18')}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-bold font-rajdhani text-xs tracking-wide flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
          >
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>PMES 18-Slot Ref</span>
          </button>

          <button
            onClick={handleAddNewSlot}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold font-rajdhani text-xs tracking-wide flex items-center gap-1 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedSlots.map((team: any, index) => {
          const slotNumber = index + 1;
          const isEmpty = team.isEmpty;
          const isEditing = editingTeamId === team.id;

          return (
            <div
              key={team.id || index}
              className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isEmpty
                  ? 'bg-[#0b0906]/60 border-zinc-800 border-dashed opacity-60'
                  : 'bg-[#120f09] border-amber-500/25 hover:border-amber-500/50 shadow-lg shadow-black/40'
              }`}
            >
              <div>
                {/* Slot Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SLOT {slotNumber < 10 ? `0${slotNumber}` : slotNumber}
                  </span>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                    {team.group || (slotNumber <= 6 ? 'POT 1' : 'POT 2')}
                  </span>
                </div>

                {/* Team Identity */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Team Logo with Upload Trigger */}
                  <label className="relative w-12 h-12 rounded-xl bg-black/60 border border-amber-500/30 flex items-center justify-center p-1 cursor-pointer group flex-shrink-0 hover:border-amber-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(team, e)}
                      disabled={isEmpty}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="font-teko text-xl font-bold text-amber-500">
                        {team.tag || 'FF'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-amber-300 transition">
                      <Upload className="w-4 h-4" />
                    </div>
                  </label>

                  {/* Team Name / Tag Details */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full bg-black border border-amber-500/50 rounded px-2 py-0.5 text-xs font-bold text-amber-200"
                          placeholder="Team Name"
                        />
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={editedTag}
                            onChange={(e) => setEditedTag(e.target.value)}
                            className="w-16 bg-black border border-amber-500/50 rounded px-2 py-0.5 text-[11px] font-mono text-amber-200 uppercase"
                            placeholder="TAG"
                          />
                          <select
                            value={editedGroup}
                            onChange={(e) => setEditedGroup(e.target.value)}
                            className="bg-black border border-amber-500/50 rounded px-1 text-[11px] text-zinc-300"
                          >
                            <option value="Pot 1">Pot 1</option>
                            <option value="Pot 2">Pot 2</option>
                            <option value="Group A">Group A</option>
                            <option value="Group B">Group B</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-teko text-xl font-bold text-white uppercase leading-none truncate">
                          {team.name}
                        </h4>
                        <span className="font-mono text-[11px] text-amber-400 font-bold">
                          [{team.tag || 'TAG'}]
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Players Roster */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Squad Lineup
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.players && team.players.length > 0 ? (
                      team.players.slice(0, 4).map((p: string, pIdx: number) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-zinc-800 text-zinc-400"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600 italic">
                        No players registered yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-amber-500/10 flex items-center justify-between">
                {isEmpty ? (
                  <button
                    onClick={handleAddNewSlot}
                    className="w-full py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold font-rajdhani cursor-pointer text-center"
                  >
                    + Fill Open Slot
                  </button>
                ) : isEditing ? (
                  <div className="flex items-center justify-end gap-1 w-full">
                    <button
                      onClick={() => setEditingTeamId(null)}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveEdit(team)}
                      className="p-1 rounded bg-amber-500 text-black hover:bg-amber-400"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <label className="text-[11px] font-rajdhani font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(team, e)}
                        className="hidden"
                      />
                      <Upload className="w-3 h-3" />
                      <span>Upload Logo</span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(team)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 cursor-pointer"
                        title="Edit Team"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTeam(team.id)}
                        className="p-1 rounded hover:bg-red-950/50 text-zinc-500 hover:text-red-400 cursor-pointer"
                        title="Delete Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
