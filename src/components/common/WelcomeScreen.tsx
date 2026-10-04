import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Sparkles, ArrowRight, ShieldCheck, Heart, GraduationCap, Compass } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface WelcomeScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
  const { accessibility, setActiveScreen } = useApp();

  const handleChoose = (role: UserRole) => {
    playSound('tap', accessibility.soundEffects);
    onSelectRole(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 max-w-xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-6 w-full">
        {/* Crest & Title */}
        <div className="space-y-2">
          <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white mx-auto flex items-center justify-center text-4xl shadow-md border-4 border-amber-400">
            <span role="img" aria-label="Chilongezyo bird">🦅</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
            Chinego Primary School · Zimbabwe
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
            Word Quest with Chilongezyo
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
            Grade 4 English Spelling Adventure with audio pronunciations, fun quests, and teacher guidance.
          </p>
        </div>

        {/* Role Selection Buttons */}
        <div className="space-y-3 pt-2 text-left">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block text-center">
            Select Your Role to Enter:
          </span>

          {/* Pupil Button */}
          <button
            type="button"
            onClick={() => handleChoose('pupil')}
            className="touch-target w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between transition-all active:scale-98 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎒</span>
              <div>
                <span className="font-bold text-base block text-emerald-950">Pupil Explorer</span>
                <span className="text-xs text-emerald-800">Play spelling quests, earn stars, and water your garden</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-700 shrink-0" />
          </button>

          {/* Teacher Button */}
          <button
            type="button"
            onClick={() => handleChoose('teacher')}
            className="touch-target w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 flex items-center justify-between transition-all active:scale-98 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍🏫</span>
              <div>
                <span className="font-bold text-base block text-amber-950">Teacher Portal (Mr. Chuma)</span>
                <span className="text-xs text-amber-800">Class roster, difficult words, custom audio recording & assignments</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-700 shrink-0" />
          </button>

          {/* Parent Button */}
          <button
            type="button"
            onClick={() => handleChoose('parent')}
            className="touch-target w-full p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 text-teal-950 flex items-center justify-between transition-all active:scale-98 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏡</span>
              <div>
                <span className="font-bold text-base block text-teal-950">Parent / Guardian View</span>
                <span className="text-xs text-teal-800">Review child progress and practice words together at home</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-700 shrink-0" />
          </button>

          {/* Administrator Button */}
          <button
            type="button"
            onClick={() => handleChoose('admin')}
            className="touch-target w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 flex items-center justify-between transition-all active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <span className="font-bold text-xs">Administrator Console</span>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-700 shrink-0" />
          </button>
        </div>

        {/* Quick New Pupil Registration Link */}
        <div className="pt-2 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={() => {
              onSelectRole('pupil');
              setActiveScreen('onboarding');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            New Pupil? Create your nickname & avatar here →
          </button>
        </div>
      </div>
    </div>
  );
};
