import React from 'react';
import { 
  Eye, 
  Type, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Settings2,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AccessibilityToolbarProps {
  className?: string;
  isCompact?: boolean;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  className = '',
  isCompact = false
}) => {
  const { accessibility, updateAccessibility, setActiveModal } = useApp();

  const cycleTextSize = () => {
    const nextSize = accessibility.textSize === 'normal' 
      ? 'large' 
      : accessibility.textSize === 'large' 
        ? 'extra-large' 
        : 'normal';
    updateAccessibility({ textSize: nextSize });
  };

  const toggleDyslexia = () => {
    updateAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont });
  };

  const toggleContrast = () => {
    updateAccessibility({ highContrast: !accessibility.highContrast });
  };

  const toggleAudio = () => {
    updateAccessibility({ soundEffects: !accessibility.soundEffects });
  };

  const toggleCalmMode = () => {
    updateAccessibility({ calmMode: !accessibility.calmMode });
  };

  return (
    <aside 
      aria-label="Accessibility quick controls"
      className={`flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm ${className}`}
    >
      {/* Dyslexia Friendly Font */}
      <button
        type="button"
        onClick={toggleDyslexia}
        aria-pressed={accessibility.dyslexiaFont}
        title="Toggle Dyslexia-Friendly Font (increases letter spacing and readability)"
        className={`touch-target px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
          accessibility.dyslexiaFont
            ? 'bg-amber-100 text-amber-950 border border-amber-400 font-mono'
            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
        }`}
      >
        <span className="font-mono text-sm underline decoration-wavy decoration-amber-500">Aa</span>
        <span className="hidden sm:inline">Dyslexia</span>
      </button>

      {/* Text Size Scale */}
      <button
        type="button"
        onClick={cycleTextSize}
        title={`Text Size: ${accessibility.textSize}`}
        className="touch-target px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
      >
        <Type className="w-3.5 h-3.5 text-stone-600" />
        <span className="uppercase font-mono text-[11px]">
          {accessibility.textSize === 'normal' ? '1x' : accessibility.textSize === 'large' ? '1.25x' : '1.5x'}
        </span>
      </button>

      {/* High Contrast */}
      <button
        type="button"
        onClick={toggleContrast}
        aria-pressed={accessibility.highContrast}
        title="Toggle High Contrast Mode for clearer visibility"
        className={`touch-target p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
          accessibility.highContrast
            ? 'bg-black text-yellow-300 border-2 border-yellow-400'
            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
        }`}
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Sound Effects */}
      <button
        type="button"
        onClick={toggleAudio}
        aria-pressed={accessibility.soundEffects}
        title={accessibility.soundEffects ? 'Sound Effects ON' : 'Sound Effects OFF'}
        className={`touch-target p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
          accessibility.soundEffects
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            : 'bg-stone-100 text-stone-400 border border-stone-200'
        }`}
      >
        {accessibility.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Calm mode */}
      <button
        type="button"
        onClick={toggleCalmMode}
        aria-pressed={accessibility.calmMode}
        title={accessibility.calmMode ? 'Calm Mode Active (Reduced animations)' : 'Enable Calm Mode'}
        className={`touch-target px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors hidden md:inline-flex items-center gap-1 cursor-pointer ${
          accessibility.calmMode
            ? 'bg-blue-100 text-blue-900 border border-blue-400'
            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Calm</span>
      </button>

      {/* Full Settings dialog */}
      <button
        type="button"
        onClick={() => setActiveModal('settings')}
        title="Open complete accessibility & audio settings"
        className="touch-target p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition-colors cursor-pointer"
      >
        <Settings2 className="w-4 h-4" />
      </button>
    </aside>
  );
};
