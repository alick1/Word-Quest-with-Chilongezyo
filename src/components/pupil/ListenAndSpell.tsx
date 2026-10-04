import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { AudioButton } from '../common/AudioButton';
import { WordIllustration } from '../common/WordIllustration';
import { HintPanel } from '../common/HintPanel';
import { ProgressBar } from '../common/ProgressBar';
import { playSound, speakText } from '../../utils/audio';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ListenAndSpellProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const ListenAndSpell: React.FC<ListenAndSpellProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);
  const [audioPlayCount, setAudioPlayCount] = useState(0);

  // Reset per word
  useEffect(() => {
    setInputVal('');
    setFeedback('idle');
    setAttempts(0);
    setHintsCount(0);
    setAudioPlayCount(0);

    // Auto pronounce word on load if sound is on
    const timer = setTimeout(() => {
      speakText(currentWord.audioPronunciationText || `The word is ${currentWord.word}.`, {
        rate: accessibility.speechRate,
        customAudioUrl: currentWord.customAudioUrl
      });
      setAudioPlayCount(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || feedback === 'correct') return;

    const isCorrect = inputVal.trim().toLowerCase() === currentWord.word.toLowerCase();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      setFeedback('correct');
      playSound('success', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, true, hintsCount, audioPlayCount);

      if (!accessibility.reducedMotion) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      }

      speakText(`Excellent work! ${currentWord.word} is spelled correctly.`, {
        rate: accessibility.speechRate
      });
    } else {
      setFeedback('incorrect');
      playSound('encourage', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, false, hintsCount, audioPlayCount);

      speakText(`The correct spelling is: ${currentWord.word}. Listen carefully and try once more.`, {
        rate: accessibility.speechRate
      });
    }
  };

  const handleRetry = () => {
    setInputVal('');
    setFeedback('idle');
    speakText(`Listen again: ${currentWord.word}`, {
      rate: accessibility.speechRate,
      customAudioUrl: currentWord.customAudioUrl
    });
  };

  // Safe encourage phrases from design doc
  const encourageMessages = [
    'Great listening!',
    'You are improving!',
    'Try again, you can do it.',
    'Almost correct. Listen carefully and try once more.',
    'Well done, spelling explorer!'
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Progress header */}
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Listen and Spell Quest"
      />

      {/* Main Game Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center relative overflow-hidden">
        {/* Topic Tag & Mascot encouragement */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {currentWord.category}
          </span>
          <span className="text-amber-800 font-medium">
            Grade 4 · {currentWord.difficulty}
          </span>
        </div>

        {/* Visual Clue with safe SVG */}
        <div className="flex justify-center my-2">
          <WordIllustration name={currentWord.imageIcon} size={110} />
        </div>

        {/* Audio control center */}
        <div className="my-4 flex flex-col items-center gap-2">
          <p className="text-sm text-stone-600 font-medium">
            Listen to the word and type the spelling below:
          </p>

          <AudioButton
            textToSpeak={currentWord.audioPronunciationText || `The word is ${currentWord.word}.`}
            word={currentWord.word}
            customAudioUrl={currentWord.customAudioUrl}
            size="lg"
            variant="primary"
            label="Play Word Audio"
          />
        </div>

        {/* Typing Input */}
        <form onSubmit={handleSubmit} className="my-4 space-y-3">
          <label htmlFor="spelling-input" className="sr-only">
            Type the word you heard
          </label>
          <div className="relative">
            <input
              id="spelling-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={feedback === 'correct'}
              placeholder="Type word here..."
              className={`w-full text-center text-2xl sm:text-3xl font-mono font-bold tracking-wider py-3.5 px-4 rounded-2xl border-2 transition-all shadow-inner focus:outline-none ${
                feedback === 'correct'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : feedback === 'incorrect'
                  ? 'border-rose-400 bg-rose-50 text-rose-950'
                  : 'border-stone-300 focus:border-emerald-600 bg-stone-50'
              }`}
            />
          </div>

          {/* Action buttons */}
          {feedback === 'idle' && (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-base shadow-sm transition-transform active:scale-98 cursor-pointer"
            >
              Check My Spelling
            </button>
          )}
        </form>

        {/* Feedback States */}
        {feedback === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 animate-gentle-bounce space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Excellent work! Well done, spelling explorer!</span>
            </div>
            <p className="text-xs text-emerald-800">
              "{currentWord.exampleSentence}"
            </p>
            <button
              type="button"
              onClick={onNext}
              className="touch-target mt-3 w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Word</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3">
            <div className="flex items-center justify-center gap-2 font-bold text-base text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Almost correct! Listen carefully and try once more.</span>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-sm">
              <p className="text-stone-700 mb-1">The correct spelling is:</p>
              <div className="font-mono text-2xl font-bold tracking-widest text-emerald-800 bg-emerald-50 py-1 px-3 rounded-lg inline-block">
                {currentWord.word}
              </div>
              <p className="text-xs text-stone-600 mt-2">
                Syllable beats: <span className="font-semibold text-stone-900">{currentWord.syllables}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="touch-target flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="touch-target px-4 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-sm cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Multi-level hint accordion */}
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
