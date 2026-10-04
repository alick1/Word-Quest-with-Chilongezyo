import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Flame, Award, Clock, Printer, CheckCircle2, BookOpen } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const MyProgress: React.FC = () => {
  const { currentPupil, words, badges, accessibility } = useApp();
  const [showCertificate, setShowCertificate] = useState(false);

  const pupilRecords = currentPupil.masteryRecords || {};
  const masteredCount = Object.values(pupilRecords).filter(r => r.stage === 'Mastered').length;
  const improvingCount = Object.values(pupilRecords).filter(r => r.stage === 'Improving').length;
  const practisingCount = Object.values(pupilRecords).filter(r => r.stage === 'Practising').length;

  const unlockedBadges = badges.filter(b => currentPupil.unlockedBadgeIds.includes(b.id));

  // Time in minutes
  const minutesSpent = Math.round(currentPupil.totalTimeSpentSeconds / 60);

  const handlePrintCertificate = () => {
    playSound('tap', accessibility.soundEffects);
    setShowCertificate(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
              Spelling Portfolio · Private to Learner & Teacher
            </span>
            <h2 className="text-2xl font-bold mt-0.5">
              {currentPupil.fullName}'s Progress
            </h2>
            <p className="text-xs text-stone-200 mt-1">
              Class: {currentPupil.className} · Chinego Primary School
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintCertificate}
            className="touch-target px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Award</span>
          </button>
        </div>

        {/* 4 Key Milestone Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-amber-300 text-xs font-semibold block">Total Stars</span>
            <div className="text-2xl font-black mt-1 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span>{currentPupil.stars}</span>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-orange-300 text-xs font-semibold block">Spelling Streak</span>
            <div className="text-2xl font-black mt-1 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-orange-400 text-orange-400" />
              <span>{currentPupil.streakDays} days</span>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-emerald-300 text-xs font-semibold block">Words Mastered</span>
            <div className="text-2xl font-black mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>{masteredCount}</span>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-sky-300 text-xs font-semibold block">Practice Time</span>
            <div className="text-2xl font-black mt-1 flex items-center justify-center gap-1">
              <Clock className="w-5 h-5 text-sky-300" />
              <span>{minutesSpent}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-base text-stone-900">
          Word Mastery Stages
        </h3>
        <p className="text-xs text-stone-600">
          Words graduate as you practice them correctly across different game activities.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-700">Mastered: {masteredCount}</span>
            <span className="text-teal-700">Improving: {improvingCount}</span>
            <span className="text-amber-700">Practising: {practisingCount}</span>
            <span className="text-stone-500">Total Curriculum: {words.length}</span>
          </div>

          <div className="h-4 bg-stone-200 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${(masteredCount / words.length) * 100}%` }}
              title="Mastered"
            />
            <div
              className="bg-teal-400 transition-all"
              style={{ width: `${(improvingCount / words.length) * 100}%` }}
              title="Improving"
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${(practisingCount / words.length) * 100}%` }}
              title="Practising"
            />
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Badges & Achievements ({unlockedBadges.length}/{badges.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => {
            const isUnlocked = currentPupil.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-stone-200 text-stone-400'
                }`}>
                  <Award className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{badge.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Certificate Modal View */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border-4 border-amber-400 text-center shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-4xl select-none">🏆</span>
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-2">
              Chinego Primary School · Certificate of Achievement
            </h3>
            <h2 className="text-2xl font-black text-stone-900 mt-1">
              Word Quest Spelling Champion
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Awarded in recognition of spelling dedication and perseverance to:
            </p>

            <div className="my-4 py-2 px-6 border-b-2 border-amber-400 inline-block">
              <span className="text-2xl font-extrabold text-emerald-800 font-mono">
                {currentPupil.fullName}
              </span>
            </div>

            <p className="text-xs text-stone-700 max-w-md mx-auto">
              Has earned <strong>{currentPupil.stars} Stars</strong>, maintained a <strong>{currentPupil.streakDays}-day streak</strong>, and mastered Grade 4 spelling words with pride!
            </p>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 px-4">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span>Teacher: Mr. B C Chuma</span>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="touch-target flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="touch-target px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
