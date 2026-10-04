import React, { useState } from 'react';
import { Lightbulb, Eye, BookOpen, Volume2, ChevronDown } from 'lucide-react';
import { SpellingWord } from '../../types';
import { speakText } from '../../utils/audio';

interface HintPanelProps {
  word: SpellingWord;
  onHintUsed: (level: number) => void;
  className?: string;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  word,
  onHintUsed,
  className = ''
}) => {
  const [revealedLevels, setRevealedLevels] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleHint = (level: number) => {
    if (!revealedLevels.includes(level)) {
      setRevealedLevels(prev => [...prev, level]);
      onHintUsed(level);
    }
  };

  const speakClue = (text: string) => {
    speakText(text);
  };

  return (
    <div className={`w-full bg-amber-50/80 border border-amber-200 rounded-2xl overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full touch-target px-4 py-3 flex items-center justify-between text-left text-amber-900 font-semibold cursor-pointer hover:bg-amber-100/60 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-300" />
          <span>Need a clue? Tap for hints ({revealedLevels.length}/3 unlocked)</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-amber-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 pt-1 space-y-3 border-t border-amber-200/60 bg-white/70">
          <p className="text-xs text-stone-600 italic">
            Hints guide you step-by-step without giving away the whole answer.
          </p>

          {/* Hint 1: First letter */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <div>
              <span className="text-xs font-bold text-amber-900 block">Hint 1: First Letter</span>
              {revealedLevels.includes(1) ? (
                <span className="text-sm font-semibold text-emerald-800">
                  Starts with: <span className="font-mono text-base font-black px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 uppercase">{word.word[0]}</span>
                </span>
              ) : (
                <span className="text-xs text-stone-500">Unlocks the starting letter</span>
              )}
            </div>
            {!revealedLevels.includes(1) && (
              <button
                type="button"
                onClick={() => toggleHint(1)}
                className="touch-target px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold cursor-pointer"
              >
                Reveal
              </button>
            )}
          </div>

          {/* Hint 2: Word pattern / syllables */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <div>
              <span className="text-xs font-bold text-amber-900 block">Hint 2: Word Pattern & Syllables</span>
              {revealedLevels.includes(2) ? (
                <div className="mt-0.5 space-y-0.5">
                  <div className="text-xs font-mono font-bold tracking-widest text-emerald-900 bg-emerald-50 px-2 py-1 rounded inline-block">
                    {word.letterPattern || word.word.split('').map((c, i) => i === 0 || i === word.word.length - 1 ? c : '_').join(' ')}
                  </div>
                  <div className="text-xs text-stone-600">
                    Syllables: <span className="font-semibold text-stone-800">{word.syllables}</span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-stone-500">Shows letter spaces and syllable beats</span>
              )}
            </div>
            {!revealedLevels.includes(2) && (
              <button
                type="button"
                onClick={() => toggleHint(2)}
                className="touch-target px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold cursor-pointer"
              >
                Reveal
              </button>
            )}
          </div>

          {/* Hint 3: Meaning & Example sentence */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <div className="pr-2">
              <span className="text-xs font-bold text-amber-900 block">Hint 3: Meaning & Sentence Clue</span>
              {revealedLevels.includes(3) ? (
                <div className="mt-1 space-y-1 text-xs text-stone-700">
                  <p><span className="font-medium text-stone-900">Meaning:</span> {word.definition}</p>
                  <p className="italic text-emerald-800">"{word.exampleSentence}"</p>
                </div>
              ) : (
                <span className="text-xs text-stone-500">Explains what the word means in daily life</span>
              )}
            </div>
            {!revealedLevels.includes(3) && (
              <button
                type="button"
                onClick={() => toggleHint(3)}
                className="touch-target px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold cursor-pointer shrink-0"
              >
                Reveal
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
