import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { AudioButton } from '../common/AudioButton';
import { ProgressBar } from '../common/ProgressBar';
import { WordIllustration } from '../common/WordIllustration';
import { HintPanel } from '../common/HintPanel';
import { playSound, speakText } from '../../utils/audio';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissingLettersProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const MissingLetters: React.FC<MissingLettersProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  // We mask 1 to 2 key letters (e.g. vowels or tricky digraphs)
  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [filledLetters, setFilledLetters] = useState<Record<number, string>>({});
  const [choiceOptions, setChoiceOptions] = useState<string[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hintsCount, setHintsCount] = useState(0);

  useEffect(() => {
    const letters = currentWord.word.split('');
    // Pick 1 or 2 indices to mask (prefer vowels or tricky middle letters)
    const indices: number[] = [];
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    
    // Find vowel positions or second letter
    letters.forEach((l, i) => {
      if (i > 0 && i < letters.length - 1 && vowels.includes(l.toLowerCase())) {
        indices.push(i);
      }
    });

    const finalMasked = indices.length > 0 ? indices.slice(0, 2) : [1];
    setMissingIndices(finalMasked);
    setActiveSlot(finalMasked[0]);
    setFilledLetters({});
    setFeedback('idle');
    setHintsCount(0);

    // Create 4 distinct letter choices including the correct missing letters
    const correctMissing = finalMasked.map(idx => letters[idx].toLowerCase());
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const randomPicks = alphabet
      .filter(l => !correctMissing.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4 - correctMissing.length);

    const choices = Array.from(new Set([...correctMissing, ...randomPicks])).sort();
    setChoiceOptions(choices);

    const timer = setTimeout(() => {
      speakText(`Fill in the missing letters for: ${currentWord.word}.`, {
        rate: accessibility.speechRate
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord]);

  const handleSelectLetter = (char: string) => {
    if (activeSlot === null || feedback === 'correct') return;
    playSound('tap', accessibility.soundEffects);

    const nextFilled = { ...filledLetters, [activeSlot]: char };
    setFilledLetters(nextFilled);

    // Advance to next empty slot if any
    const remainingSlot = missingIndices.find(idx => idx !== activeSlot && !nextFilled[idx]);
    if (remainingSlot !== undefined) {
      setActiveSlot(remainingSlot);
    } else {
      // All filled! Verify
      const constructed = currentWord.word.split('').map((char, i) => {
        return missingIndices.includes(i) ? (nextFilled[i] || '_') : char;
      }).join('');

      const isCorrect = constructed.toLowerCase() === currentWord.word.toLowerCase();
      if (isCorrect) {
        setFeedback('correct');
        playSound('success', accessibility.soundEffects);
        recordWordAttempt(currentWord.id, true, hintsCount, 1);

        if (!accessibility.reducedMotion) {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
        }

        speakText(`Excellent work! ${currentWord.word} is complete!`, {
          rate: accessibility.speechRate
        });
      } else {
        setFeedback('incorrect');
        playSound('encourage', accessibility.soundEffects);
        recordWordAttempt(currentWord.id, false, hintsCount, 1);

        speakText(`Try again. The correct word is ${currentWord.word}.`, {
          rate: accessibility.speechRate
        });
      }
    }
  };

  const handleResetSlots = () => {
    setFilledLetters({});
    setFeedback('idle');
    setActiveSlot(missingIndices[0]);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Missing Letters Challenge"
      />

      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {currentWord.category}
          </span>
          <span className="text-amber-800 font-medium">
            Grade 4 · {currentWord.difficulty}
          </span>
        </div>

        {/* Visual clue */}
        <div className="flex justify-center my-2">
          <WordIllustration name={currentWord.imageIcon} size={90} />
        </div>

        {/* Audio helper */}
        <div className="my-2">
          <AudioButton
            textToSpeak={currentWord.audioPronunciationText || `The word is ${currentWord.word}.`}
            word={currentWord.word}
            customAudioUrl={currentWord.customAudioUrl}
            size="md"
            variant="secondary"
            label="Listen to Word"
          />
        </div>

        {/* Word Display with Missing Letter Gaps */}
        <div className="my-5 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap font-mono">
          {currentWord.word.split('').map((char, idx) => {
            const isMissing = missingIndices.includes(idx);
            const filledChar = filledLetters[idx];
            const isSelected = activeSlot === idx;

            if (isMissing) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveSlot(idx);
                    playSound('tap', accessibility.soundEffects);
                  }}
                  className={`touch-target w-11 h-14 sm:w-13 sm:h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold uppercase transition-transform cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 scale-105 shadow-md'
                      : filledChar
                      ? feedback === 'correct'
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                        : feedback === 'incorrect'
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-amber-400 bg-amber-50 text-stone-900'
                      : 'border-dashed border-stone-400 bg-stone-100 text-stone-400'
                  }`}
                  aria-label={`Missing letter slot ${idx + 1}`}
                >
                  {filledChar || '_'}
                </button>
              );
            }

            return (
              <div
                key={idx}
                className="w-11 h-14 sm:w-13 sm:h-16 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center text-2xl font-bold uppercase select-none"
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Letter Choice Keys */}
        {feedback !== 'correct' && (
          <div className="my-4">
            <p className="text-xs font-semibold text-stone-500 mb-2.5">
              Choose the missing letter:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {choiceOptions.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleSelectLetter(letter)}
                  className="touch-target w-13 h-14 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-stone-900 text-2xl font-bold uppercase font-mono shadow-[0_3px_0_#d97706] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center"
                  aria-label={`Select letter ${letter}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback states */}
        {feedback === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Great job! You found all the missing letters!</span>
            </div>
            <button
              type="button"
              onClick={onNext}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Next Word</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 text-sm space-y-2">
            <p>The word is <strong className="text-emerald-800 text-base">{currentWord.word}</strong>.</p>
            <button
              type="button"
              onClick={handleResetSlots}
              className="touch-target px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Hint Accordion */}
        <div className="mt-4 text-left">
          <HintPanel
            word={currentWord}
            onHintUsed={() => setHintsCount(prev => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
};
