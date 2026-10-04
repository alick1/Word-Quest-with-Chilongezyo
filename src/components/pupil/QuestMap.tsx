import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuestZone, QuestLevel } from '../../types';
import { Lock, Check, Star, Play, Compass, Trophy } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const QuestMap: React.FC = () => {
  const { zones, currentPupil, startActivity, accessibility } = useApp();

  const handleStartLevel = (level: QuestLevel, isUnlocked: boolean) => {
    if (!isUnlocked) {
      playSound('encourage', accessibility.soundEffects);
      return;
    }
    playSound('tap', accessibility.soundEffects);
    startActivity(level.activityType, level.wordIds, level.id);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
          <Compass className="w-4 h-4" />
          <span>Chinego Spelling Expedition</span>
        </div>
        <h2 className="text-2xl font-bold">The Quest Map</h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Journey through 8 Zimbabwean regions from Chinego School to the Spelling Champion Castle!
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            Total Stars: <strong className="text-amber-300 font-bold">{currentPupil.stars} ★</strong>
          </span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            Completed: <strong className="text-emerald-300 font-bold">{currentPupil.completedLevelIds.length} levels</strong>
          </span>
        </div>
      </div>

      {/* 8 Zones Trail */}
      <div className="space-y-6 relative before:absolute before:left-7 sm:before:left-9 before:top-10 before:bottom-10 before:w-1 before:bg-stone-300 before:z-0">
        {zones.map((zone, zIdx) => {
          const isZoneUnlocked = currentPupil.stars >= zone.unlockedLevelRequired;

          return (
            <div key={zone.id} className="relative z-10">
              {/* Zone Header Card */}
              <div className={`p-4 rounded-3xl border-2 transition-all ${
                isZoneUnlocked
                  ? 'bg-white border-emerald-400 shadow-md'
                  : 'bg-stone-100 border-stone-300 opacity-80'
              }`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Zone Icon Badge */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner text-white font-bold text-lg ${
                    isZoneUnlocked
                      ? 'bg-gradient-to-br from-emerald-600 to-green-700'
                      : 'bg-stone-400'
                  }`}>
                    {isZoneUnlocked ? (
                      <span>{zIdx + 1}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-stone-200" />
                    )}
                  </div>

                  {/* Title and descriptions */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-stone-900">
                        {zone.title}
                      </h3>
                      {!isZoneUnlocked && (
                        <span className="text-xs font-semibold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-md">
                          Requires {zone.unlockedLevelRequired} ★
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">
                      {zone.subtitle} · {zone.theme}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      {zone.description}
                    </p>
                  </div>
                </div>

                {/* Levels inside this Zone */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                  {zone.levels.map((level) => {
                    const isCompleted = currentPupil.completedLevelIds.includes(level.id);
                    const isLevelUnlocked = isZoneUnlocked && currentPupil.stars >= level.starsRequiredToUnlock;

                    return (
                      <div
                        key={level.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                          isCompleted
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : isLevelUnlocked
                            ? 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                            : 'bg-stone-100/50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isLevelUnlocked
                              ? 'bg-amber-400 text-amber-950'
                              : 'bg-stone-300 text-stone-500'
                          }`}>
                            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : level.levelNumber}
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-stone-900">
                              {level.title}
                            </h4>
                            <p className="text-xs text-stone-500">
                              {level.description} · <span className="capitalize">{level.activityType.replace(/-/g, ' ')}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action button */}
                        <div>
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => handleStartLevel(level, true)}
                              className="touch-target px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Replay</span>
                            </button>
                          ) : isLevelUnlocked ? (
                            <button
                              type="button"
                              onClick={() => handleStartLevel(level, true)}
                              className="touch-target px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play</span>
                            </button>
                          ) : (
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              <span>{level.starsRequiredToUnlock} ★</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
