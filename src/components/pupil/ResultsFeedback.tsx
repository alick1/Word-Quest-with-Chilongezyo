import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Award, RotateCcw, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playSound, speakText } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ResultsFeedbackProps {
  onReturnToMap: () => void;
  onRetry: () => void;
}

export const ResultsFeedback: React.FC<ResultsFeedbackProps> = ({
  onReturnToMap,
  onRetry
}) => {
  const { activeActivity, finishActivitySession, accessibility } = useApp();

  const [resultsData, setResultsData] = React.useState<{ starsEarned: number; newBadge?: any } | null>(null);

  useEffect(() => {
    const outcome = finishActivitySession();
    setResultsData(outcome);

    playSound('fanfare', accessibility.soundEffects);

    if (!accessibility.reducedMotion) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });
    }

    speakText(`Quest activity completed! You earned ${outcome.starsEarned} stars! Outstanding effort, spelling explorer!`, {
      rate: accessibility.speechRate
    });
  }, []);

  if (!activeActivity || !resultsData) {
    return null;
  }

  const correctResults = activeActivity.results.filter(r => r.correct);
  const total = activeActivity.words.length;
  const scorePercent = Math.round((correctResults.length / total) * 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-5">
        {/* Mascot / Star Header */}
        <div className="flex justify-center gap-2">
          {[...Array(resultsData.starsEarned)].map((_, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md animate-gentle-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <Star className="w-8 h-8 fill-amber-950" />
            </div>
          ))}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Quest Activity Complete
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 mt-2">
            Splendid Work!
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            You spelled <strong className="text-emerald-700 font-bold">{correctResults.length} out of {total}</strong> words correctly ({scorePercent}%)!
          </p>
        </div>

        {/* New Badge Unlocked Notice if applicable */}
        {resultsData.newBadge && (
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                New Badge Unlocked!
              </span>
              <h4 className="font-bold text-base">{resultsData.newBadge.title}</h4>
              <p className="text-xs text-amber-900">{resultsData.newBadge.description}</p>
            </div>
          </div>
        )}

        {/* Word Review list */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
            Words Practiced in this Session:
          </h4>
          <div className="divide-y divide-stone-200">
            {activeActivity.words.map((w) => {
              const res = activeActivity.results.find(r => r.wordId === w.id);
              const isCorrect = res ? res.correct : false;

              return (
                <div key={w.id} className="py-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{w.word}</span>
                    <span className="text-xs text-stone-500 font-normal">({w.syllables})</span>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {isCorrect ? 'Mastered Attempt' : 'Saved to Revision'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="touch-target flex-1 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practise Again</span>
          </button>

          <button
            type="button"
            onClick={onReturnToMap}
            className="touch-target flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5" />
            <span>Continue on Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
