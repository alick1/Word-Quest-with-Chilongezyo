import React from 'react';
import { SpellingWord, MasteryStage } from '../../types';
import { AudioButton } from './AudioButton';
import { WordIllustration } from './WordIllustration';
import { AlertCircle, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface WordCardProps {
  word: SpellingWord;
  masteryStage?: MasteryStage;
  showMasteryBadge?: boolean;
  onPracticeClick?: (word: SpellingWord) => void;
  className?: string;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  masteryStage = 'New',
  showMasteryBadge = true,
  onPracticeClick,
  className = ''
}) => {
  const masteryConfig: Record<MasteryStage, { label: string; icon: React.ReactNode; color: string; border: string }> = {
    New: {
      label: 'New Word',
      icon: <Sparkles className="w-3.5 h-3.5 text-stone-500" />,
      color: 'text-stone-700 bg-stone-100',
      border: 'border-stone-200'
    },
    Practising: {
      label: 'Practising',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      color: 'text-amber-800 bg-amber-50',
      border: 'border-amber-200'
    },
    Improving: {
      label: 'Improving',
      icon: <CheckCircle className="w-3.5 h-3.5 text-teal-600" />,
      color: 'text-teal-800 bg-teal-50',
      border: 'border-teal-200'
    },
    Mastered: {
      label: 'Mastered ★',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />,
      color: 'text-emerald-800 bg-emerald-100 font-bold',
      border: 'border-emerald-300'
    }
  };

  const currentCfg = masteryConfig[masteryStage];

  return (
    <div className={`p-4 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${className}`}>
      <div>
        {/* Top Header with Word & Mastery */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xl font-bold text-stone-900 tracking-wide font-mono lowercase">
              {word.word}
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Syllables: <strong className="text-emerald-700 font-semibold">{word.syllables}</strong>
            </span>
          </div>

          {showMasteryBadge && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${currentCfg.color} border ${currentCfg.border}`}>
              {currentCfg.icon}
              <span>{currentCfg.label}</span>
            </span>
          )}
        </div>

        {/* Center with Illustration & Definition */}
        <div className="flex items-center gap-3 my-2.5 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
          <WordIllustration name={word.imageIcon} size={64} className="shrink-0" />
          <div className="text-xs text-stone-700 space-y-1">
            <p className="line-clamp-2"><strong className="text-stone-900">Meaning:</strong> {word.definition}</p>
            <p className="italic text-emerald-800 line-clamp-2">"{word.exampleSentence}"</p>
          </div>
        </div>

        {/* Common misspelling alert (supportive) */}
        {word.commonMisspelling && (
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Watch out for: <del className="text-rose-600">{word.commonMisspelling}</del> → <span className="font-semibold text-emerald-700">{word.word}</span></span>
          </div>
        )}
      </div>

      {/* Footer audio controls & action */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
        <AudioButton
          textToSpeak={word.audioPronunciationText || `The word is ${word.word}.`}
          word={word.word}
          customAudioUrl={word.customAudioUrl}
          size="sm"
          variant="secondary"
          label="Listen"
        />

        {onPracticeClick && (
          <button
            type="button"
            onClick={() => onPracticeClick(word)}
            className="touch-target px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            Practise
          </button>
        )}
      </div>
    </div>
  );
};
