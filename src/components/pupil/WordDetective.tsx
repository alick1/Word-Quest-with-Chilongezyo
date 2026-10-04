import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { playSound, speakText } from '../../utils/audio';
import { Search, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordDetectiveProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const WordDetective: React.FC<WordDetectiveProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  // Sentence with the word intentionally replaced by common misspelling
  const [sentenceWords, setSentenceWords] = useState<{ text: string; clean: string; isTarget: boolean }[]>([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [correctionInput, setCorrectionInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'spotted' | 'correct' | 'incorrect'>('idle');

  useEffect(() => {
    setSelectedWordIndex(null);
    setCorrectionInput('');
    setFeedback('idle');

    // Create sentence with intentional misspelling
    const misspelledTarget = currentWord.commonMisspelling || `${currentWord.word}e`;
    const cleanSentence = currentWord.exampleSentence;

    // Replace the target word in the sentence
    const regex = new RegExp(`\\b${currentWord.word}\\b`, 'i');
    const modifiedSentence = cleanSentence.replace(regex, misspelledTarget);

    const parts = modifiedSentence.split(' ').map(token => {
      const clean = token.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const isTarget = clean === misspelledTarget.toLowerCase();
      return {
        text: token,
        clean,
        isTarget
      };
    });

    setSentenceWords(parts);

    const timer = setTimeout(() => {
      speakText(`Word Detective! Read this sentence and find the misspelled word: ${modifiedSentence}`, {
        rate: accessibility.speechRate
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord]);

  const handleWordClick = (index: number) => {
    if (feedback === 'correct') return;
    playSound('tap', accessibility.soundEffects);
    setSelectedWordIndex(index);

    const clicked = sentenceWords[index];
    if (clicked.isTarget) {
      setFeedback('spotted');
      speakText(`You found the mystery word: ${clicked.clean}! Now type the correct spelling.`, {
        rate: accessibility.speechRate
      });
    } else {
      setFeedback('incorrect');
      speakText(`That word is spelled fine. Keep looking for the misspelled word!`, {
        rate: accessibility.speechRate
      });
    }
  };

  const handleCheckCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionInput.trim() || feedback === 'correct') return;

    const isCorrect = correctionInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    if (isCorrect) {
      setFeedback('correct');
      playSound('success', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, true, 0, 1);

      if (!accessibility.reducedMotion) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      }

      speakText(`Case solved! The correct spelling is ${currentWord.word}.`, {
        rate: accessibility.speechRate
      });
    } else {
      playSound('encourage', accessibility.soundEffects);
      speakText(`Almost there. The correct spelling is ${currentWord.word}. Try typing it once more.`, {
        rate: accessibility.speechRate
      });
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Word Detective Investigation"
      />

      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Detective Case</span>
          </span>
          <span className="text-stone-500">Find the spelling error</span>
        </div>

        {/* Detective Clue Card */}
        <div className="my-4 p-5 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl text-left">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            Inspect the sentence below. Tap the word with a spelling mistake:
          </p>

          <div className="flex flex-wrap gap-2 text-lg sm:text-xl font-medium leading-relaxed">
            {sentenceWords.map((item, idx) => {
              const isSelected = selectedWordIndex === idx;
              let highlight = 'hover:bg-amber-200/60 bg-white border border-stone-200 text-stone-900';

              if (isSelected) {
                if (item.isTarget) {
                  highlight = 'bg-amber-300 border-amber-600 text-stone-950 font-bold ring-2 ring-amber-500';
                } else {
                  highlight = 'bg-rose-100 border-rose-300 text-rose-900';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleWordClick(idx)}
                  className={`touch-target px-2.5 py-1 rounded-xl transition-all cursor-pointer ${highlight}`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Once spotted: prompt learner to write the correct spelling */}
        {(feedback === 'spotted' || feedback === 'correct') && (
          <form onSubmit={handleCheckCorrection} className="my-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
            <p className="text-xs font-bold text-emerald-900">
              You found the suspect word! Now fix it:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={correctionInput}
                onChange={(e) => setCorrectionInput(e.target.value)}
                placeholder="Type the correct spelling..."
                disabled={feedback === 'correct'}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-emerald-400 bg-white text-lg font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {feedback !== 'correct' && (
                <button
                  type="submit"
                  disabled={!correctionInput.trim()}
                  className="touch-target px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer disabled:opacity-40"
                >
                  Fix
                </button>
              )}
            </div>
          </form>
        )}

        {/* Feedback states */}
        {feedback === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-950 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Case Solved! Correct spelling: {currentWord.word}</span>
            </div>
            <p className="text-xs text-emerald-800">
              Syllables: <strong className="font-mono">{currentWord.syllables}</strong>
            </p>
            <button
              type="button"
              onClick={onNext}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Next Investigation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
