import React, { useState } from 'react';
import { ScoringRule, TieBreakerCriterion } from '../types/tournament';
import { SCORING_PRESETS } from '../data/scoringPresets';
import { 
  Sliders, 
  ArrowUpDown, 
  RotateCcw, 
  Check, 
  Info, 
  Trophy, 
  Flame, 
  Award, 
  ShieldAlert, 
  X 
} from 'lucide-react';

interface ScoringRulesModalProps {
  currentRule: ScoringRule;
  currentTieBreakers: TieBreakerCriterion[];
  qualificationSlots: number;
  onSave: (rule: ScoringRule, tieBreakers: TieBreakerCriterion[], qualificationSlots: number) => void;
  onClose: () => void;
}

const TIE_BREAKER_LABELS: Record<TieBreakerCriterion, { label: string; desc: string }> = {
  totalPoints: { label: 'Total Points', desc: 'Sum of all match points (Kill + Placement + Bonus - Penalty)' },
  totalKills: { label: 'Total Kills', desc: 'Overall frags across all matches' },
  placementPoints: { label: 'Placement Points', desc: 'Points accumulated purely from survival rank' },
  wwcdCount: { label: 'Number of WWCDs / Booyahs', desc: 'Total number of 1st place match finishes' },
  bestMatchScore: { label: 'Highest Single Match Score', desc: 'Peak score achieved in any individual match' },
};

export const ScoringRulesModal: React.FC<ScoringRulesModalProps> = ({
  currentRule,
  currentTieBreakers,
  qualificationSlots: initialSlots,
  onSave,
  onClose,
}) => {
  const [rule, setRule] = useState<ScoringRule>({ ...currentRule });
  const [tieBreakers, setTieBreakers] = useState<TieBreakerCriterion[]>([...currentTieBreakers]);
  const [qualSlots, setQualSlots] = useState<number>(initialSlots);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Handle Preset change
  const handleApplyPreset = (presetId: string) => {
    const preset = SCORING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setRule({ ...preset.rule });
      setSelectedPreset(presetId);
    }
  };

  // Move tie breaker up/down
  const moveTieBreaker = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tieBreakers.length) return;

    const updated = [...tieBreakers];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTieBreakers(updated);
  };

  const handleSave = () => {
    onSave(rule, tieBreakers, qualSlots);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#10121d] border border-purple-900/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141624]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-rajdhani text-white">
                CUSTOM SCORING ENGINE & TIE-BREAKER MATRIX
              </h3>
              <p className="text-xs text-slate-400">
                Formula: TOTAL = KILL POINTS + PLACEMENT POINTS + BONUS − PENALTY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          {/* Preset Selector */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase font-rajdhani text-xs tracking-wide">
                Quick Scoring Presets
              </label>
              <span className="text-[11px] text-purple-400">Choose official rule or customize below</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCORING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedPreset === p.id
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-200 font-rajdhani">{p.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Scoring Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-amber-400 font-bold block mb-1 uppercase">
                Kill Point Multiplier
              </label>
              <input
                type="number"
                min={0}
                value={rule.killPoints}
                onChange={(e) => setRule({ ...rule, killPoints: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Pts per enemy frag</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-yellow-400 font-bold block mb-1 uppercase">
                WWCD / Booyah Bonus
              </label>
              <input
                type="number"
                min={0}
                value={rule.wwcdBonus}
                onChange={(e) => setRule({ ...rule, wwcdBonus: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-yellow-300 font-bold font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Extra bonus for 1st rank</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-emerald-400 font-bold block mb-1 uppercase">
                Survival Bonus
              </label>
              <input
                type="number"
                min={0}
                value={rule.survivalBonus}
                onChange={(e) => setRule({ ...rule, survivalBonus: parseInt(e.target.value, 10) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 font-bold font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Custom stage bonus</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[10px] text-purple-400 font-bold block mb-1 uppercase">
                Finals Cutoff Slots
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={qualSlots}
                onChange={(e) => setQualSlots(parseInt(e.target.value, 10) || 6)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-purple-300 font-bold font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Top # advance</span>
            </div>
          </div>

          {/* Placement Points Table (1st through 12th) */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase font-rajdhani text-xs tracking-wide">
                Placement Points Ladder
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Points awarded based on match standing
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pos) => (
                <div key={pos} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] font-bold text-slate-400 font-rajdhani mb-1">
                    {pos === 1 ? '🥇 1st Place' : pos === 2 ? '🥈 2nd Place' : pos === 3 ? '🥉 3rd Place' : `${pos}th Place`}
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={rule.placementPoints[pos] ?? 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setRule((prev) => ({
                        ...prev,
                        placementPoints: {
                          ...prev.placementPoints,
                          [pos]: val,
                        },
                      }));
                    }}
                    className="w-full text-center bg-slate-950 border border-purple-900/60 rounded px-1 py-1 text-xs font-bold font-mono text-purple-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tie-Breaker Priority Configurator */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-300 uppercase font-rajdhani text-xs tracking-wide">
                  Automatic Tie-Breaker Ranking Priority
                </label>
                <p className="text-[11px] text-slate-500">
                  When two teams have identical scores, the system automatically checks criteria in this exact sequence:
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {tieBreakers.map((criterion, idx) => (
                <div
                  key={criterion}
                  className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-purple-950 text-purple-300 font-bold font-mono text-xs flex items-center justify-center border border-purple-700/50">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-white font-rajdhani tracking-wide">
                        {TIE_BREAKER_LABELS[criterion].label}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {TIE_BREAKER_LABELS[criterion].desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveTieBreaker(idx, 'up')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-300"
                      title="Move up in priority"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === tieBreakers.length - 1}
                      onClick={() => moveTieBreaker(idx, 'down')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-300"
                      title="Move down in priority"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#141624]">
          <button
            type="button"
            onClick={() => handleApplyPreset('ffws_official')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Official FFWS Standard
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-rajdhani text-xs tracking-wider shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-white" />
              APPLY & RECALCULATE STANDINGS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
