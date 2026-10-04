import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, User, Check } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const Onboarding: React.FC = () => {
  const { createPupil, updateAccessibility, accessibility, setActiveScreen } = useApp();

  const [step, setStep] = useState<1 | 2>(1); // 1: Avatar & Nickname, 2: Accessibility Supports
  const [nickname, setNickname] = useState('');
  const [className, setClassName] = useState('Grade 4A');
  const [selectedAvatar, setSelectedAvatar] = useState('lion-cub');

  const avatars = [
    { id: 'lion-cub', label: 'Lion Cub', emoji: '🦁' },
    { id: 'crowned-crane', label: 'Crowned Crane', emoji: '🦅' },
    { id: 'elephant-scout', label: 'Elephant', emoji: '🐘' },
    { id: 'cheetah', label: 'Cheetah', emoji: '🐆' },
    { id: 'sunbird', label: 'Sunbird', emoji: '🦜' },
    { id: 'pangolin', label: 'Pangolin', emoji: '🦔' },
    { id: 'zebra', label: 'Zebra', emoji: '🦓' }
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    playSound('tap', accessibility.soundEffects);
    setStep(2);
  };

  const handleFinishOnboarding = () => {
    playSound('success', accessibility.soundEffects);
    createPupil(nickname.trim(), className, 9, selectedAvatar);
    // Proceed to diagnostic check-in
    setActiveScreen('diagnostic');
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl">
        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-3xl select-none">🦅</span>
              <h2 className="text-2xl font-black text-stone-900">
                Welcome to Word Quest!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Choose a fun safari avatar and your nickname to begin at Chinego Primary School.
              </p>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Choose Your Safari Mascot Avatar:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`touch-target p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedAvatar === av.id
                        ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-md'
                        : 'border-stone-200 hover:bg-stone-50 bg-white'
                    }`}
                  >
                    <span className="text-2xl select-none">{av.emoji}</span>
                    <span className="text-[10px] font-semibold text-stone-700 mt-1 truncate max-w-full">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname & Class */}
            <div className="space-y-3">
              <div>
                <label htmlFor="pupil-nickname" className="text-xs font-bold text-stone-700 block mb-1">
                  What is your nickname? (No email required)
                </label>
                <input
                  id="pupil-nickname"
                  type="text"
                  required
                  placeholder="e.g. Tendai, Thabo, Chenai"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="pupil-class" className="text-xs font-bold text-stone-700 block mb-1">
                  Your Class at Chinego Primary:
                </label>
                <select
                  id="pupil-class"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Grade 4A">Grade 4A (Mr. Chuma)</option>
                  <option value="Grade 4B">Grade 4B</option>
                  <option value="Grade 4C">Grade 4C</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!nickname.trim()}
              className="touch-target w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-base shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <span>Next: Learning Supports</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-3xl select-none">✨</span>
              <h2 className="text-2xl font-black text-stone-900">
                Choose Your Learning Supports
              </h2>
              <p className="text-xs text-stone-600">
                Turn on the tools that help you learn best. You can adjust these anytime in Settings!
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Dyslexia friendly font */}
              <label className="touch-target p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100/70 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-stone-900 block font-mono">
                    Dyslexia-Friendly Text
                  </span>
                  <span className="text-xs text-stone-500">
                    Spaced letters and weighted characters for easier reading.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.dyslexiaFont}
                  onChange={(e) => updateAccessibility({ dyslexiaFont: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>

              {/* Read instructions aloud */}
              <label className="touch-target p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100/70 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-stone-900 block">
                    Read Instructions Aloud
                  </span>
                  <span className="text-xs text-stone-500">
                    Spoken voice will explain activities and buttons.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.readInstructionsAloud}
                  onChange={(e) => updateAccessibility({ readInstructionsAloud: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>

              {/* Extra Time mode */}
              <label className="touch-target p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100/70 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-stone-900 block">
                    Extra Thinking Time
                  </span>
                  <span className="text-xs text-stone-500">
                    Provides generous unhurried time for answering questions.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.extraTime}
                  onChange={(e) => updateAccessibility({ extraTime: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>

              {/* High Contrast */}
              <label className="touch-target p-3.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100/70 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-stone-900 block">
                    High-Contrast Display
                  </span>
                  <span className="text-xs text-stone-500">
                    Sharper outlines and bold contrast for visual clarity.
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="touch-target px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="touch-target flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <span>Take 5-Word Check-in</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
