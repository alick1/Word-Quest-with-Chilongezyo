import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  Trash2, 
  Check, 
  RefreshCw, 
  FileText,
  Volume2,
  Users
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AdminDashboard: React.FC = () => {
  const { words, pupils, assignments, zones, deleteWord, accessibility } = useApp();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'stats' | 'system'>('curriculum');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(words.map(w => w.category)))];

  const filteredWords = words.filter(w => filterCategory === 'all' || w.category === filterCategory);

  const handleDeleteWord = (id: string, name: string) => {
    if (confirm(`Remove word "${name}" from curriculum?`)) {
      deleteWord(id);
      playSound('tap', accessibility.soundEffects);
    }
  };

  const handleResetToFactoryData = () => {
    if (confirm('Restore initial Chinego Primary seed database? Custom additions will reset.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
              Chinego Primary School · IT & Curriculum Administration
            </span>
            <h2 className="text-2xl font-bold">
              Administrator Console
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Curriculum governance, vocabulary moderation, system backups, and usage statistics.
            </p>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-purple-200 text-xs block">Active Words</span>
            <div className="text-2xl font-black text-white mt-1">{words.length}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-purple-200 text-xs block">Quest Zones</span>
            <div className="text-2xl font-black text-amber-300 mt-1">{zones.length}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-purple-200 text-xs block">Registered Learners</span>
            <div className="text-2xl font-black text-emerald-300 mt-1">{pupils.length}</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-purple-200 text-xs block">Assignments</span>
            <div className="text-2xl font-black text-sky-300 mt-1">{assignments.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white p-1 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'curriculum' ? 'bg-purple-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Curriculum Words ({words.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'stats' ? 'bg-purple-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Learning Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`touch-target px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'system' ? 'bg-purple-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Offline Database & System Settings</span>
        </button>
      </div>

      {/* Tab: Curriculum Moderation */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 text-xs">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilterCategory(c)}
                  className={`touch-target px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    filterCategory === c ? 'bg-purple-700 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {c === 'all' ? 'All Themes' : c}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {filteredWords.map(w => (
                <div key={w.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-stone-900">{w.word}</span>
                      <span className="text-xs text-stone-400 font-mono">[{w.syllables}]</span>
                      <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {w.category}
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        {w.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                      {w.definition}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {w.customAudioUrl && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Audio
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteWord(w.id, w.word)}
                      title="Delete word"
                      className="touch-target p-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: System & Data */}
      {activeTab === 'system' && (
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            PWA Offline Storage & Seed Maintenance
          </h3>
          <p className="text-xs text-stone-600">
            All curriculum content, audio recordings, learner attempts, and badges are cached in the browser's persistent storage for uninterrupted offline rural classroom use.
          </p>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-stone-900 block">Reset Demo & Seed Database</span>
              <span className="text-xs text-stone-500">Restores all original Grade 4 sample words and demo pupil progress.</span>
            </div>

            <button
              type="button"
              onClick={handleResetToFactoryData}
              className="touch-target px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Reset to Factory Seed
            </button>
          </div>
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            Chinego Primary School Learning Impact
          </h3>
          <p className="text-xs text-stone-600">
            Privacy-respecting internal metrics. No personal data or pupil names are transmitted externally.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-bold block">First Attempt Success</span>
              <span className="text-2xl font-black text-emerald-700">82%</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-bold block">Total Audio Replays</span>
              <span className="text-2xl font-black text-amber-700">148</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-xs text-stone-500 font-bold block">Revision Garden Plants Grown</span>
              <span className="text-2xl font-black text-teal-700">12 Plants</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
