import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';
import { Calendar, Plus, CheckCircle2, BookOpen } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AssignmentCreator: React.FC = () => {
  const { words, assignments, createAssignment, pupils, accessibility } = useApp();

  const [title, setTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState('Grade 4A');
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [activityType, setActivityType] = useState<ActivityType>('listen-and-spell');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [createdNotice, setCreatedNotice] = useState(false);

  const toggleWord = (id: string) => {
    setSelectedWordIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const handleSelectAllCategory = (cat: string) => {
    const catWordIds = words.filter(w => w.category === cat).map(w => w.id);
    setSelectedWordIds(prev => Array.from(new Set([...prev, ...catWordIds])));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedWordIds.length === 0) return;

    createAssignment(title.trim(), selectedClass, selectedWordIds, activityType, dueDate);
    playSound('success', accessibility.soundEffects);

    setCreatedNotice(true);
    setTitle('');
    setSelectedWordIds([]);
    setTimeout(() => setCreatedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-900">
          Create Spelling Assignment & Weekly Challenge
        </h3>
        <p className="text-xs text-stone-500">
          Assign curated word lists and activities to your Grade 4 class.
        </p>
      </div>

      {createdNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Spelling assignment dispatched to Grade 4 pupils!</span>
        </div>
      )}

      {/* Assignment Creator Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Assignment Title: *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Week 5: Tricky Silent Letters & Harvest Words"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Target Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="Grade 4A">Grade 4A</option>
              <option value="Grade 4B">Grade 4B</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Activity Game Mode:
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="listen-and-spell">Listen and Spell</option>
              <option value="build-the-word">Build the Word (Tiles)</option>
              <option value="missing-letters">Missing Letters</option>
              <option value="picture-match">Picture and Word Match</option>
              <option value="word-detective">Word Detective</option>
              <option value="spelling-race">Spelling Race</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Due Date:
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Word Selection Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-700">
              Select Words ({selectedWordIds.length} chosen): *
            </label>
            <div className="flex gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleSelectAllCategory('Food and farming words')}
                className="text-amber-800 hover:underline cursor-pointer"
              >
                + Farming Words
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleSelectAllCategory('Commonly confused words')}
                className="text-amber-800 hover:underline cursor-pointer"
              >
                + Tricky Words
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-3 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {words.map((w) => {
              const isChecked = selectedWordIds.includes(w.id);
              return (
                <label
                  key={w.id}
                  className={`touch-target px-2.5 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer text-xs transition-colors ${
                    isChecked
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleWord(w.id)}
                    className="accent-amber-600 rounded"
                  />
                  <span className="font-mono">{w.word}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || selectedWordIds.length === 0}
          className="touch-target w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-sm shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Assignment</span>
        </button>
      </form>

      {/* Active Assignments List */}
      <div>
        <h4 className="text-sm font-bold text-stone-900 mb-2">
          Current Active Assignments ({assignments.length})
        </h4>

        <div className="space-y-2">
          {assignments.map(a => (
            <div key={a.id} className="p-3.5 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-stone-900 text-sm block">{a.title}</span>
                <span className="text-stone-500">
                  {a.className} · {a.wordIds.length} words · Mode: <strong className="capitalize">{a.activityType.replace(/-/g, ' ')}</strong> · Due: {a.dueDate}
                </span>
              </div>
              <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
