import React, { useState } from 'react';
import { Volume2, Play, Turtle, RotateCcw } from 'lucide-react';
import { speakText, speakWordSlowly } from '../../utils/audio';
import { useApp } from '../../context/AppContext';

interface AudioButtonProps {
  textToSpeak: string;
  word?: string;
  customAudioUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  label?: string;
  showSlowOption?: boolean;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  word,
  customAudioUrl,
  size = 'md',
  variant = 'primary',
  label,
  showSlowOption = true,
  className = ''
}) => {
  const { accessibility } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);

  const handlePlayNormal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    speakText(textToSpeak, {
      rate: accessibility.speechRate,
      customAudioUrl,
      onEnd: () => setIsPlaying(false)
    });
  };

  const handlePlaySlow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingSlow) return;
    setIsPlayingSlow(true);
    if (word) {
      speakWordSlowly(word, () => setIsPlayingSlow(false));
    } else {
      speakText(textToSpeak, {
        rate: 0.65,
        onEnd: () => setIsPlayingSlow(false)
      });
    }
  };

  const sizeClasses = {
    sm: 'p-2 text-xs min-h-[44px] min-w-[44px]',
    md: 'px-4 py-2.5 text-sm min-h-[48px]',
    lg: 'px-6 py-3.5 text-base min-h-[54px]'
  };

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-500 active:scale-95',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 active:scale-95',
    ghost: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 active:scale-95'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handlePlayNormal}
        aria-label={label || `Play audio pronunciation for ${word || textToSpeak}`}
        className={`touch-target rounded-xl font-medium inline-flex items-center justify-center gap-2 transition-transform cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        {isPlaying ? (
          <>
            <span className="flex gap-0.5 items-center h-4">
              <span className="w-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
              <span className="w-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s] h-4"></span>
              <span className="w-1 bg-current rounded-full animate-bounce h-2"></span>
            </span>
            <span>Playing...</span>
          </>
        ) : (
          <>
            <Volume2 className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5 text-current'} />
            <span>{label || 'Hear Word'}</span>
          </>
        )}
      </button>

      {showSlowOption && (
        <button
          type="button"
          onClick={handlePlaySlow}
          aria-label="Play slow letter-by-letter pronunciation"
          title="Play slow letter-by-letter"
          className="touch-target px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Turtle className="w-4 h-4 text-amber-600" />
          <span>{isPlayingSlow ? 'Spelling...' : 'Slow Audio'}</span>
        </button>
      )}
    </div>
  );
};
