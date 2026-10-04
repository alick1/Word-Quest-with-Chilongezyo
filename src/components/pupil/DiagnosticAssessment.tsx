import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DifficultyLevel } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { ProgressBar } from '../common/ProgressBar';
import { playSound, speakText } from '../../utils/audio';
import { CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiagnosticAssessment: React.FC = () => {
  const { words, completeDiagnostic, accessibility } = useApp();

  // 5 diagnostic words across difficulties: Beginner, Developing, Challenge
  const diagnosticWords = [
    words.find(w => w.word === 'school') || words[0],
    words.find(w => w.word === 'maize') || words[1],
    words.find(w => w.word === 'harvest') || words[2],
    words.find(w => w.word === 'because') || words[3],
    words.find(w => w.word === 'beautiful') || words[4]
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentWord = diagnosticWords[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const isCorrect = inputVal.trim().toLowerCase() === currentWord.word.toLowerCase();
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(nextCorrect);

    if (isCorrect) {
      playSound('success', accessibility.soundEffects);
    } else {
      playSound('encourage', accessibility.soundEffects);
    }

    if (currentIndex + 1 < diagnosticWords.length) {
      setCurrentIndex(prev => prev + 1);
      setInputVal('');
    } else {
      setIsFinished(true);
      if (!accessibility.reducedMotion) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  // Determine recommendation
  let recommendedLevel: DifficultyLevel = 'Beginner';
  if (correctCount >= 4) {
    recommendedLevel = 'Challenge';
  } else if (correctCount >= 2) {
    recommendedLevel = 'Developing';
  }

  const handleFinish = () => {
    completeDiagnostic(recommendedLevel);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md text-center space-y-4">
          <ProgressBar
            current={currentIndex + 1}
            total={diagnosticWords.length}
            label="Spelling Check-in"
          />

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left">
            <span className="font-bold block mb-0.5">Spelling Check-in:</span>
            Listen carefully to each of the 5 words. Don't worry about making mistakes—this helps find your best starting quest!
          </div>

          <div className="my-4">
            <AudioButton
              textToSpeak={currentWord.audioPronunciationText || `The word is ${currentWord.word}.`}
              word={currentWord.word}
              size="lg"
              variant="primary"
              label="Listen to Word"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type spelling here..."
              autoFocus
              className="w-full text-center text-2xl font-mono font-bold tracking-wider py-3.5 px-4 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 bg-stone-50 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-base shadow-sm cursor-pointer"
            >
              Submit Word ({currentIndex + 1}/5)
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-stone-900">
            Check-in Complete! 🎉
          </h2>

          <p className="text-sm text-stone-600">
            You spelled <strong className="text-emerald-700">{correctCount} of 5</strong> words correctly.
          </p>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-left space-y-2">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Recommended Starting Track:
            </span>
            <div className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{recommendedLevel} Track</span>
            </div>
            <p className="text-xs text-stone-700">
              We recommend beginning in <strong>School Station & Family Village</strong>. You will earn 5 bonus welcome stars!
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs text-stone-600 space-y-1">
            <strong className="text-stone-900 block font-bold">Reward System:</strong>
            <p>⭐ Earn stars by completing quest activities.</p>
            <p>🏅 Unlock badges for milestones like First Listen & Farm Words Hero.</p>
            <p>🌿 Water and grow your Revision Garden plant as you master words!</p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="touch-target w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
          >
            <span>Start My Spelling Adventure</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
