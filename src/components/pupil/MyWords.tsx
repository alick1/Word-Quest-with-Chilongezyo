import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WordCard } from '../common/WordCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import { SpellingWord } from '../../types';

export const MyWords: React.FC = () => {
  const { words, currentPupil, startActivity } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const pupilRecords = currentPupil.masteryRecords || {};

  const categories = ['all', ...Array.from(new Set(words.map(w => w.category)))];

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          word.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;

    const stage = pupilRecords[word.id]?.stage || 'New';
    const matchesStage = selectedStage === 'all' || stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const handlePracticeWord = (word: SpellingWord) => {
    startActivity('listen-and-spell', [word.id]);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 mb-1">
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>Curriculum Dictionary</span>
        </div>
        <h2 className="text-2xl font-bold">My Words Dictionary</h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Explore all {words.length} Grade 4 spelling words. Hear standard pronunciation, read syllable beats, and practise anytime!
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spelling words..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter bars (Buttons/Segmented controls) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-stone-500 font-semibold mr-1">Category:</span>
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`touch-target px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat === 'all' ? 'All Themes' : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1 border-t border-stone-100">
          <span className="text-stone-500 font-semibold mr-1">Mastery:</span>
          {['all', 'Mastered', 'Improving', 'Practising', 'New'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStage(st)}
              className={`touch-target px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedStage === st
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {st === 'all' ? 'All Stages' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredWords.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
            No words match your search. Try another word!
          </div>
        ) : (
          filteredWords.map(word => {
            const stage = pupilRecords[word.id]?.stage || 'New';
            return (
              <WordCard
                key={word.id}
                word={word}
                masteryStage={stage}
                onPracticeClick={() => handlePracticeWord(word)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
