import React from 'react';
import { useApp } from '../../context/AppContext';
import { WordCard } from '../common/WordCard';
import { Sprout, Droplets, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { playSound, speakText } from '../../utils/audio';

export const RevisionGarden: React.FC = () => {
  const { currentPupil, words, waterGardenPlant, startActivity, accessibility } = useApp();

  // Find pupil's mastery records
  const pupilRecords = currentPupil.masteryRecords || {};

  // Group words into stages
  const wordsByStage = {
    Mastered: [] as typeof words,
    Improving: [] as typeof words,
    Practising: [] as typeof words,
    New: [] as typeof words
  };

  words.forEach(w => {
    const record = pupilRecords[w.id];
    if (record) {
      wordsByStage[record.stage].push(w);
    } else {
      wordsByStage.New.push(w);
    }
  });

  const plantStages = [
    { title: 'Planted Seed', desc: 'A tiny spelling seed asleep in rich soil.', icon: '🌱' },
    { title: 'Tender Sprout', desc: 'The first green shoots have sprouted!', icon: '🌿' },
    { title: 'Growing Sapling', desc: 'Growing sturdy with each practiced word.', icon: '🪴' },
    { title: 'Young Baobab', desc: 'Reaching high toward the Zimbabwean sky!', icon: '🌳' },
    { title: 'Blooming Baobab of Chinego', desc: 'Fully in bloom with golden flowers and songbirds!', icon: '🌸' }
  ];

  const currentStage = Math.min(plantStages.length - 1, currentPupil.revisionGardenPlantStage || 0);

  const handlePracticeRevision = () => {
    // Pick words in Practising or Improving
    const revisionWords = [...wordsByStage.Practising, ...wordsByStage.Improving];
    const targetWordIds = revisionWords.length > 0 
      ? revisionWords.slice(0, 4).map(w => w.id)
      : words.slice(0, 4).map(w => w.id);

    startActivity('listen-and-spell', targetWordIds);
  };

  const handleWater = () => {
    const success = waterGardenPlant();
    if (success) {
      speakText('Splash! You watered your Revision Garden plant with spelling knowledge!', {
        rate: accessibility.speechRate
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-800 text-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 mb-1">
          <Sprout className="w-4 h-4 text-emerald-300" />
          <span>Spaced Repetition & Care</span>
        </div>
        <h2 className="text-2xl font-bold">The Revision Garden</h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Every word you practice and master nourishes your virtual garden. Watch your plant blossom into a majestic Zimbabwean Baobab!
        </p>

        {/* Plant Status Visualizer */}
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl select-none" role="img" aria-label="Garden Plant Stage">
              {plantStages[currentStage].icon}
            </span>
            <div>
              <h3 className="font-bold text-base text-amber-300">
                {plantStages[currentStage].title}
              </h3>
              <p className="text-xs text-stone-200">
                {plantStages[currentStage].desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWater}
            disabled={currentStage >= 4}
            className="touch-target px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-40"
          >
            <Droplets className="w-4 h-4 fill-amber-950" />
            <span>Water Plant</span>
          </button>
        </div>
      </div>

      {/* Action to Start Revision Practice */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-amber-950 text-sm">
            {wordsByStage.Practising.length + wordsByStage.Improving.length} Words Ready for Practice
          </h4>
          <p className="text-xs text-stone-600">
            Revisiting words at the right time helps lock them into your long-term memory.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePracticeRevision}
          className="touch-target px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Practise Tricky Words</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mastery Stages Breakdown */}
      <div className="space-y-4">
        {/* Practising (Needs revision) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Words We Are Practising ({wordsByStage.Practising.length})</span>
            </h3>
            <span className="text-xs text-stone-500">Keep watering these</span>
          </div>

          {wordsByStage.Practising.length === 0 ? (
            <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded-xl">
              No words in practice right now. Complete quests to add new words!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wordsByStage.Practising.map(w => (
                <WordCard
                  key={w.id}
                  word={w}
                  masteryStage="Practising"
                  onPracticeClick={() => startActivity('listen-and-spell', [w.id])}
                />
              ))}
            </div>
          )}
        </div>

        {/* Improving */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>Words Improving ({wordsByStage.Improving.length})</span>
            </h3>
            <span className="text-xs text-stone-500">Almost mastered!</span>
          </div>

          {wordsByStage.Improving.length === 0 ? (
            <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded-xl">
              No improving words yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wordsByStage.Improving.map(w => (
                <WordCard
                  key={w.id}
                  word={w}
                  masteryStage="Improving"
                  onPracticeClick={() => startActivity('listen-and-spell', [w.id])}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mastered */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Mastered Words ({wordsByStage.Mastered.length})</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">True spelling stars!</span>
          </div>

          {wordsByStage.Mastered.length === 0 ? (
            <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded-xl">
              Spell words correctly 3 times across activities to reach Mastered status.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wordsByStage.Mastered.map(w => (
                <WordCard
                  key={w.id}
                  word={w}
                  masteryStage="Mastered"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
