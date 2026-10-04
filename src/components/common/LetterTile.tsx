import React from 'react';

interface LetterTileProps {
  letter: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  status?: 'default' | 'correct' | 'incorrect' | 'empty';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  className?: string;
}

export const LetterTile: React.FC<LetterTileProps> = ({
  letter,
  onClick,
  disabled = false,
  selected = false,
  status = 'default',
  size = 'md',
  ariaLabel,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg min-h-[44px] min-w-[44px]',
    md: 'w-12 h-13 text-2xl min-h-[48px] min-w-[48px]',
    lg: 'w-14 h-16 text-3xl min-h-[56px] min-w-[56px]'
  };

  const statusClasses = {
    default: 'bg-amber-50 hover:bg-amber-100 text-stone-900 border-2 border-amber-300 shadow-[0_3px_0_#d97706] active:translate-y-1 active:shadow-none',
    correct: 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 shadow-[0_3px_0_#059669]',
    incorrect: 'bg-rose-50 text-rose-950 border-2 border-rose-400 shadow-[0_3px_0_#e11d48]',
    empty: 'bg-stone-100 text-stone-400 border-2 border-dashed border-stone-300 shadow-none'
  };

  const selectedClass = selected ? 'ring-3 ring-emerald-500 ring-offset-2' : '';
  const disabledClass = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || `Letter ${letter || 'blank'}`}
      className={`touch-target rounded-xl font-bold uppercase transition-all flex items-center justify-center select-none font-mono ${sizeClasses[size]} ${statusClasses[status]} ${selectedClass} ${disabledClass} ${className}`}
    >
      <span>{letter || ''}</span>
    </button>
  );
};
