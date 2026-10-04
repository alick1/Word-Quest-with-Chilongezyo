import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PupilProfile } from '../../types';
import { UserPlus, Trash2, RotateCcw, Award, Star, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ClassManagement: React.FC = () => {
  const { pupils, deletePupil, resetPupilProgress, createPupil, accessibility } = useApp();

  const [isAddingPupil, setIsAddingPupil] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newClass, setNewClass] = useState('Grade 4A');
  const [selectedPupilForReport, setSelectedPupilForReport] = useState<PupilProfile | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname.trim()) return;
    createPupil(newNickname.trim(), newClass, 9, 'lion-cub');
    playSound('success', accessibility.soundEffects);
    setNewNickname('');
    setIsAddingPupil(false);
  };

  const handleReset = (pupilId: string, name: string) => {
    if (confirm(`Reset progress for ${name}? This will clear their stars and attempts so they can restart.`)) {
      resetPupilProgress(pupilId);
      playSound('tap', accessibility.soundEffects);
    }
  };

  const handleDelete = (pupilId: string, name: string) => {
    if (confirm(`Delete pupil ${name} from class roster?`)) {
      deletePupil(pupilId);
      playSound('tap', accessibility.soundEffects);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-stone-900">
            Class Roster Management (Grade 4A & 4B)
          </h3>
          <p className="text-xs text-stone-500">
            {pupils.length} pupils enrolled. View individual records, assign revision, or reset attempts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingPupil(!isAddingPupil)}
          className="touch-target px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAddingPupil ? 'Cancel' : 'Enroll New Pupil'}</span>
        </button>
      </div>

      {/* Add Pupil Form */}
      {isAddingPupil && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-emerald-950 block mb-1">
              Pupil Nickname / Full Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Takudzwa Sibanda"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-emerald-950 block mb-1">
              Class Section:
            </label>
            <select
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Grade 4A">Grade 4A</option>
              <option value="Grade 4B">Grade 4B</option>
            </select>
          </div>

          <button
            type="submit"
            className="touch-target px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Create Pupil Account
          </button>
        </form>
      )}

      {/* Pupils Table / Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {pupils.map((pupil) => {
            const records = pupil.masteryRecords || {};
            const mastered = Object.values(records).filter(r => r.stage === 'Mastered').length;
            const needsSupport = Object.values(records).filter(r => r.stage === 'Practising').length;
            const minutes = Math.round(pupil.totalTimeSpentSeconds / 60);

            return (
              <div key={pupil.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                {/* Pupil Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xl shrink-0">
                    {pupil.avatar === 'crowned-crane' ? '🦅' : pupil.avatar === 'cheetah' ? '🐆' : pupil.avatar === 'sunbird' ? '🦜' : '🦁'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900">{pupil.fullName}</h4>
                      <span className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {pupil.className}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{pupil.stars} stars</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{mastered} Mastered</span>
                      </span>
                      <span>·</span>
                      <span>{minutes} mins spent</span>
                      <span>·</span>
                      <span className="font-mono text-[10px] text-stone-400">Parent Code: {pupil.parentCode}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center gap-2">
                  {needsSupport > 2 && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{needsSupport} words need support</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleReset(pupil.id, pupil.fullName)}
                    title="Reset attempts to let pupil restart"
                    className="touch-target p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(pupil.id, pupil.fullName)}
                    title="Remove pupil from system"
                    className="touch-target p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
