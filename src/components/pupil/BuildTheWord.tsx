import React, { useState, useEffect } from 'react';
import { SpellingWord } from '../../types';
import { useApp } from '../../context/AppContext';
import { LetterTile } from '../common/LetterTile';
import { AudioButton } from '../common/AudioButton';
import { ProgressBar } from '../common/ProgressBar';
import { WordIllustration } from '../common/WordIllustration';
import { HintPanel } from '../common/HintPanel';
import { playSound, speakText } from '../../utils/audio';
import { RotateCcw, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuildTheWordProps {
  words: SpellingWord[];
  currentIndex: number;
  onNext: () => void;
}

export const BuildTheWord: React.FC<BuildTheWordProps> = ({
  words,
  currentIndex,
  onNext
}) => {
  const { accessibility, recordWordAttempt } = useApp();
  const currentWord = words[currentIndex] || words[0];

  // Scrambled letters pool
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string }[]>([]);
  const [placedTiles, setPlacedTiles] = useState<{ id: string; letter: string }[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hintsCount, setHintsCount] = useState(0);

  // Initialize and scramble letters
  useEffect(() => {
    const letters = currentWord.word.split('').map((letter, idx) => ({
      id: `${letter}-${idx}-${Math.random()}`,
      letter
    }));

    // Deterministic shuffle
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setPlacedTiles([]);
    setFeedback('idle');
    setHintsCount(0);

    const timer = setTimeout(() => {
      speakText(`Build the word: ${currentWord.word}. Tap letters in order.`, {
        rate: accessibility.speechRate
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord]);

  const handleTileClick = (tile: { id: string; letter: string }) => {
    if (feedback === 'correct') return;
    playSound('tap', accessibility.soundEffects);

    setAvailableTiles(prev => prev.filter(t => t.id !== tile.id));
    setPlacedTiles(prev => [...prev, tile]);
  };

  const handlePlacedTileClick = (tile: { id: string; letter: string }) => {
    if (feedback === 'correct') return;
    playSound('tap', accessibility.soundEffects);

    setPlacedTiles(prev => prev.filter(t => t.id !== tile.id));
    setAvailableTiles(prev => [...prev, tile]);
    setFeedback('idle');
  };

  const handleClearAnswer = () => {
    playSound('tap', accessibility.soundEffects);
    const all = [...availableTiles, ...placedTiles];
    setAvailableTiles(all.sort(() => Math.random() - 0.5));
    setPlacedTiles([]);
    setFeedback('idle');
  };

  const handleCheck = () => {
    const built = placedTiles.map(t => t.letter).join('');
    const isCorrect = built.toLowerCase() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      playSound('success', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, true, hintsCount, 1);

      if (!accessibility.reducedMotion) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      }

      speakText(`Great listening and building! You spelled ${currentWord.word}!`, {
        rate: accessibility.speechRate
      });
    } else {
      setFeedback('incorrect');
      playSound('encourage', accessibility.soundEffects);
      recordWordAttempt(currentWord.id, false, hintsCount, 1);

      speakText(`Almost there! Check the order of letters and try again.`, {
        rate: accessibility.speechRate
      });
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <ProgressBar
        current={currentIndex + 1}
        total={words.length}
        label="Build the Word"
      />

      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm text-center">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {currentWord.category}
          </span>
          <span className="text-amber-800 font-medium">
            Length: {currentWord.word.length} letters
          </span>
        </div>

        {/* Clue illustration */}
        <div className="flex justify-center my-1">
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
            label="Hear Word"
          />
        </div>

        {/* Target Slots / Placed Letters */}
        <div className="my-4 p-3 bg-stone-100 rounded-2xl border border-stone-200 min-h-[72px] flex flex-wrap items-center justify-center gap-2">
          {placedTiles.length === 0 ? (
            <span className="text-stone-400 text-sm font-medium italic">
              Tap letters below to spell "{currentWord.word}"
            </span>
          ) : (
            placedTiles.map((tile) => (
              <LetterTile
                key={tile.id}
                letter={tile.letter}
                onClick={() => handlePlacedTileClick(tile)}
                status={feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : 'default'}
                ariaLabel={`Placed letter ${tile.letter}. Tap to remove.`}
              />
            ))
          )}
        </div>

        {/* Available Scrambled Letter Tiles */}
        <div className="my-4">
          <p className="text-xs font-semibold text-stone-500 mb-2">
            Available Letters (Tap to place):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {availableTiles.map((tile) => (
              <LetterTile
                key={tile.id}
                letter={tile.letter}
                onClick={() => handleTileClick(tile)}
                ariaLabel={`Letter ${tile.letter}. Tap to add.`}
              />
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleClearAnswer}
            disabled={placedTiles.length === 0 || feedback === 'correct'}
            className="touch-target px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Answer</span>
          </button>

          {feedback !== 'correct' ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={placedTiles.length === 0}
              className="touch-target flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm disabled:opacity-40 cursor-pointer"
            >
              Check Order
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="touch-target flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Word</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Feedback message */}
        {feedback === 'correct' && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-900 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Excellent work! You built {currentWord.word}!</span>
          </div>
        )}

        {/* Progressive Hints */}
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
