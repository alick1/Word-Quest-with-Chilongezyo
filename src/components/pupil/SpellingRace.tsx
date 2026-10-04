import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { AudioButton } from '../common/AudioButton';
import { playSound, speakText } from '../../utils/audio';
import { Timer, ToggleLeft, ToggleRight, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpellingRaceProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const SpellingRace: React.FC<SpellingRaceProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(25);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'timesUp'>('idle');

  useEffect(() => {
    setInputVal('');
    setFeedback('idle');
    setTimeLeft(accessibility.extraTime ? 45 : 25);

    const timer = setTimeout(() => {
      speakText(`Spelling sprint! Spell: ${currentWord.word}`, {
        rate: accessibility.speechRate
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord, accessibility.extraTime]);

  // Countdown effect
  useEffect(() => {
    if (!timerEnabled || feedback !== 'idle') return;

    if (timeLeft <= 0) {
      setFeedback('timesUp');
      speakText(`Take your time! The word is ${currentWord.word}. Let's write it down together.`, {
        rate: accessibility.speechRate
      });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerEnabled, feedback, currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || feedback === 'correct') return;

    const isCorrect = inputVal.trim().toLowerCase() === currentWord.word.toLowerCase();
    if (isCorrect) {
      setFeedback('correct');
      playSound('success', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, true, 0, 1);

      if (!accessibility.reducedMotion) {
        confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
      }

      speakText(`Speedy and correct! Well done!`, {
        rate: accessibility.speechRate
      });
    } else {
      playSound('encourage', accessibility.soundEffects);
      speakText(`Almost! Check your spelling for ${currentWord.word}.`, {
        rate: accessibility.speechRate
      });
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Spelling Race"
      />

      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center">
        {/* Timer Accessibility Toggle (Anxiety prevention) */}
        <div className="flex items-center justify-between text-xs mb-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Timer className="w-4 h-4 text-amber-600" />
            <span>Gentle Timer</span>
          </div>

          <button
            type="button"
            onClick={() => setTimerEnabled(!timerEnabled)}
            className="flex items-center gap-1 font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            aria-label={timerEnabled ? 'Disable countdown timer' : 'Enable countdown timer'}
          >
            <span>{timerEnabled ? 'Timer ON' : 'Untimed (Relaxed)'}</span>
            {timerEnabled ? (
              <ToggleRight className="w-6 h-6 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-stone-400" />
            )}
          </button>
        </div>

        {/* Big Friendly Timer Clock if enabled */}
        {timerEnabled && (
          <div className="my-2">
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono text-lg font-bold border ${
              timeLeft <= 5 ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{timeLeft}s remaining</span>
            </div>
          </div>
        )}

        {/* Word Audio */}
        <div className="my-3">
          <AudioButton
            textToSpeak={currentWord.audioPronunciationText || `The word is ${currentWord.word}.`}
            word={currentWord.word}
            size="lg"
            variant="primary"
            label="Hear Word"
          />
        </div>

        {/* Typing Form */}
        <form onSubmit={handleSubmit} className="my-4 space-y-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={feedback === 'correct'}
            placeholder="Type quickly..."
            className="w-full text-center text-2xl font-mono font-bold tracking-wider py-3.5 px-4 rounded-2xl border-2 border-stone-300 focus:border-amber-500 bg-stone-50 focus:outline-none"
          />

          {feedback === 'idle' && (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="touch-target w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm disabled:opacity-40 cursor-pointer"
            >
              Submit Word
            </button>
          )}
        </form>

        {/* Times up gentle fallback (no shaming) */}
        {feedback === 'timesUp' && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
            <p className="font-semibold text-sm">
              Time is up, but no rush at all! Learning takes patience.
            </p>
            <p className="text-stone-700 text-xs">
              The correct spelling is: <strong className="font-mono text-base text-emerald-800">{currentWord.word}</strong>
            </p>
            <button
              type="button"
              onClick={onNext}
              className="touch-target px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {feedback === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Lightning fast and completely correct!</span>
            </div>
            <button
              type="button"
              onClick={onNext}
              className="touch-target w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Continue Race</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
