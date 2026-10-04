import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { WordIllustration } from '../common/WordIllustration';
import { ProgressBar } from '../common/ProgressBar';
import { playSound, speakText } from '../../utils/audio';
import { CheckCircle2, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PictureWordMatchProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const PictureWordMatch: React.FC<PictureWordMatchProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, words: allWords, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  const [options, setOptions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  useEffect(() => {
    setSelectedWord(null);
    setFeedback('idle');

    // Build 3 plausible choices including the current word and a common misspelling or similar category word
    const distractors = allWords
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(w => w.word);

    // If word has a common misspelling, include it as an educational distractor!
    const choicePool = currentWord.commonMisspelling 
      ? [currentWord.word, currentWord.commonMisspelling, distractors[0] || 'garden']
      : [currentWord.word, ...distractors];

    setOptions(choicePool.sort(() => Math.random() - 0.5));

    const timer = setTimeout(() => {
      speakText(`Look at the picture. Which word matches? Tap each word to listen.`, {
        rate: accessibility.speechRate
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord, allWords]);

  const handleHearOption = (e: React.MouseEvent, wordOption: string) => {
    e.stopPropagation();
    speakText(wordOption, { rate: accessibility.speechRate });
  };

  const handleSelectOption = (wordOption: string) => {
    if (feedback === 'correct') return;
    setSelectedWord(wordOption);

    const isCorrect = wordOption.toLowerCase() === currentWord.word.toLowerCase();
    if (isCorrect) {
      setFeedback('correct');
      playSound('success', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, true, 0, 1);

      if (!accessibility.reducedMotion) {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      }

      speakText(`Spot on! The picture is ${currentWord.word}.`, {
        rate: accessibility.speechRate
      });
    } else {
      setFeedback('incorrect');
      playSound('encourage', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, false, 0, 1);

      speakText(`Not quite. Listen carefully: ${currentWord.word}. Try again.`, {
        rate: accessibility.speechRate
      });
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Picture and Word Match"
      />

      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {currentWord.category}
          </span>
          <span className="text-stone-500">Tap to hear & match</span>
        </div>

        {/* Big Clue Illustration */}
        <div className="my-3 flex flex-col items-center">
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 shadow-inner">
            <WordIllustration name={currentWord.imageIcon} size={130} />
          </div>
          <p className="text-xs text-stone-600 mt-2 italic max-w-sm">
            {currentWord.imageDescription}
          </p>
        </div>

        {/* Word Choices (Large touch targets with audio speakers) */}
        <div className="my-5 space-y-2.5">
          {options.map((option) => {
            const isSelected = selectedWord === option;
            const isCorrectAnswer = option.toLowerCase() === currentWord.word.toLowerCase();

            let stateStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-800';
            if (feedback === 'correct' && isCorrectAnswer) {
              stateStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 font-bold';
            } else if (feedback === 'incorrect' && isSelected) {
              stateStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
            }

            return (
              <div
                key={option}
                onClick={() => handleSelectOption(option)}
                className={`touch-target w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer shadow-xs ${stateStyle}`}
              >
                <span className="text-xl font-bold tracking-wide font-mono lowercase">
                  {option}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleHearOption(e, option)}
                  aria-label={`Read option ${option} aloud`}
                  title="Listen to option"
                  className="touch-target p-2 rounded-xl bg-white/80 hover:bg-white text-stone-700 border border-stone-200 shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-5 h-5 text-emerald-700" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Feedback area */}
        {feedback === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Correct match! You identified {currentWord.word}!</span>
            </div>
            <p className="text-xs text-stone-600">
              {currentWord.definition}
            </p>
            <button
              type="button"
              onClick={onNext}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Next Picture</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
