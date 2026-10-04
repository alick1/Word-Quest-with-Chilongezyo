import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { Star, Flame, Award, Wifi, WifiOff, Volume2 } from 'lucide-react';
import { speakText } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const { currentPupil, role, isOffline, accessibility } = useApp();

  const speakHeader = () => {
    speakText(`Word Quest with Chilongezyo. Welcome, ${currentPupil.nickname}! You have ${currentPupil.stars} stars and a ${currentPupil.streakDays} day spelling streak.`, {
      rate: accessibility.speechRate
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-800 text-white shadow-sm px-3 py-2 sm:px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand and Mascot icon */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 p-1 flex items-center justify-center shadow-inner">
            <span className="text-xl select-none" role="img" aria-label="Chilongezyo mascot bird">🦅</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-tight text-white">
                Word Quest
              </h1>
              <span className="text-[11px] font-medium text-emerald-200 hidden sm:inline">
                with Chilongezyo
              </span>
            </div>
            <p className="text-[10px] text-emerald-100 flex items-center gap-1">
              <span>Chinego Primary School</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">Grade 4</span>
            </p>
          </div>

          <button
            type="button"
            onClick={speakHeader}
            aria-label="Read header info aloud"
            title="Listen to header info"
            className="touch-target p-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pupil Stats (Stars, Streaks, Offline status) */}
        <div className="flex items-center gap-2">
          {role === 'pupil' && (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Stars */}
              <div 
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 font-bold text-xs shadow-xs"
                title={`${currentPupil.stars} stars earned`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-950" />
                <span>{currentPupil.stars}</span>
              </div>

              {/* Day Streak */}
              <div 
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs"
                title={`${currentPupil.streakDays} day practice streak! Regular practice makes words stay.`}
              >
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>{currentPupil.streakDays}d</span>
              </div>
            </div>
          )}

          {/* Offline Ready Indicator */}
          {isOffline ? (
            <span 
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-stone-700 text-amber-200 px-2 py-1 rounded-lg"
              title="You are currently offline. All lessons and games work without internet!"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline Mode</span>
            </span>
          ) : (
            <span 
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-900/60 text-emerald-200 px-2 py-1 rounded-lg"
              title="Connected & Offline Cached"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden lg:inline">Saved Offline</span>
            </span>
          )}

          {/* Quick Accessibility controls */}
          <AccessibilityToolbar isCompact />
        </div>
      </div>
    </header>
  );
};
