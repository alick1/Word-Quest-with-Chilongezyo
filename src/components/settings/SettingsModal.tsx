import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Type, 
  Eye, 
  Volume2, 
  Sparkles, 
  Clock, 
  Moon, 
  Sun, 
  Check, 
  RotateCcw,
  VolumeX
} from 'lucide-react';
import { speakText, playSound } from '../../utils/audio';

export const SettingsModal: React.FC = () => {
  const { accessibility, updateAccessibility, activeModal, setActiveModal } = useApp();

  if (activeModal !== 'settings') return null;

  const handleTestAudio = () => {
    playSound('star', accessibility.soundEffects);
    speakText('Testing speech audio: Chinego Primary School Grade 4 spelling quest!', {
      rate: accessibility.speechRate
    });
  };

  const handleResetDefaults = () => {
    updateAccessibility({
      textSize: 'normal',
      highContrast: false,
      darkMode: false,
      dyslexiaFont: false,
      reducedMotion: false,
      extraTime: false,
      soundEffects: true,
      readInstructionsAloud: false,
      speechRate: 1.0,
      calmMode: false
    });
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">⚙️</span>
            <div>
              <h2 id="settings-title" className="text-xl font-bold text-stone-900">
                Accessibility & Audio Settings
              </h2>
              <p className="text-xs text-stone-500">
                Customise reading and audio preferences for your comfort.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="touch-target p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Text Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
            <Type className="w-4 h-4 text-emerald-600" />
            <span>Text Size:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'extra-large'] as const).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => updateAccessibility({ textSize: size })}
                className={`touch-target py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-colors cursor-pointer ${
                  accessibility.textSize === size
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {size.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Dyslexia-Friendly Font */}
        <div className="space-y-2">
          <label className="touch-target p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-sm text-stone-900 block font-mono">
                Dyslexia-Friendly Font & Spacing
              </span>
              <span className="text-xs text-stone-500">
                Enhanced character distinctions and wider letter spacing.
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.dyslexiaFont}
              onChange={(e) => updateAccessibility({ dyslexiaFont: e.target.checked })}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </label>
        </div>

        {/* Setting 3: High Contrast Mode */}
        <div className="space-y-2">
          <label className="touch-target p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-sm text-stone-900 block">
                High-Contrast Mode
              </span>
              <span className="text-xs text-stone-500">
                Increases boundary contrast and darkens text.
              </span>
            </div>
            <input
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </label>
        </div>

        {/* Setting 4: Audio Speed & Voice Testing */}
        <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Spoken Speech Rate:</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-900">
              {accessibility.speechRate === 1.0 ? 'Normal (1.0x)' : 'Slower (0.7x)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateAccessibility({ speechRate: 1.0 })}
              className={`touch-target py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                accessibility.speechRate === 1.0 ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              Normal Speed (1.0x)
            </button>
            <button
              type="button"
              onClick={() => updateAccessibility({ speechRate: 0.7 })}
              className={`touch-target py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                accessibility.speechRate === 0.7 ? 'bg-amber-600 text-white' : 'bg-white text-stone-700 border border-stone-300'
              }`}
            >
              Slow Speed (0.7x)
            </button>
          </div>

          <button
            type="button"
            onClick={handleTestAudio}
            className="touch-target w-full py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-amber-300 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Test Audio & Synthesizer</span>
          </button>
        </div>

        {/* Setting 5: Sound Effects & Calm Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label className="touch-target p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between cursor-pointer text-xs">
            <span className="font-bold text-stone-800">Sound Effects</span>
            <input
              type="checkbox"
              checked={accessibility.soundEffects}
              onChange={(e) => updateAccessibility({ soundEffects: e.target.checked })}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </label>

          <label className="touch-target p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between cursor-pointer text-xs">
            <span className="font-bold text-stone-800">Calm Mode (Less Motion)</span>
            <input
              type="checkbox"
              checked={accessibility.calmMode}
              onChange={(e) => updateAccessibility({ calmMode: e.target.checked })}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </label>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t flex justify-between items-center">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="touch-target px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="touch-target px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
