import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AudioButton } from '../common/AudioButton';
import { WordIllustration } from '../common/WordIllustration';
import { Heart, Star, Clock, CheckCircle2, AlertCircle, Volume2, Shield } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ParentDashboard: React.FC = () => {
  const { pupils, words, accessibility } = useApp();

  // Parent code verification
  const [parentCode, setParentCode] = useState('ROSE-4A');
  const [isLinked, setIsLinked] = useState(true);

  const matchedPupil = pupils.find(p => p.parentCode.toUpperCase() === parentCode.trim().toUpperCase()) || pupils[0];

  const pupilRecords = matchedPupil.masteryRecords || {};
  const masteredWords = words.filter(w => pupilRecords[w.id]?.stage === 'Mastered');
  const trickyWords = words.filter(w => pupilRecords[w.id]?.stage === 'Practising');
  const minutesSpent = Math.round(matchedPupil.totalTimeSpentSeconds / 60);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentCode.trim()) return;
    setIsLinked(true);
    playSound('success', accessibility.soundEffects);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-200 mb-1">
          <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
          <span>Parent & Guardian Home Support</span>
        </div>
        <h2 className="text-2xl font-bold">
          {matchedPupil.fullName}'s Learning Journey
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 mt-1">
          Supportive progress insights for home reading. Celebrate every milestone without stressful comparisons.
        </p>

        {/* 3 Family Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-teal-200 text-xs block">Active Streak</span>
            <div className="text-xl font-black text-amber-300 mt-1">{matchedPupil.streakDays} Days 🔥</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-teal-200 text-xs block">Words Mastered</span>
            <div className="text-xl font-black text-emerald-300 mt-1">{masteredWords.length} Words</div>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-teal-200 text-xs block">Practice Time</span>
            <div className="text-xl font-black text-white mt-1">{minutesSpent} Mins</div>
          </div>
        </div>
      </div>

      {/* Supportive Encouragement Note for Parents */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3">
        <span className="text-2xl select-none">💬</span>
        <div className="text-xs text-teal-950 space-y-1">
          <span className="font-bold text-sm block text-teal-900">
            Encouraging Home Tip from Chinego School:
          </span>
          <p className="text-stone-700">
            "Ask {matchedPupil.nickname} to teach you 2 new words while cooking or gardening. Explaining the spelling to a parent builds profound confidence and long-term memory!"
          </p>
        </div>
      </div>

      {/* Words to Practise Together at Home */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Words to Practise Together at Home</span>
          </h3>
          <span className="text-xs text-stone-500">Tap audio to listen together</span>
        </div>

        {trickyWords.length === 0 ? (
          <p className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
            {matchedPupil.nickname} is progressing smoothly with all current words!
          </p>
        ) : (
          <div className="space-y-2.5">
            {trickyWords.map(w => (
              <div key={w.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <WordIllustration name={w.imageIcon} size={48} />
                  <div>
                    <h4 className="font-bold text-base text-stone-900 font-mono lowercase">
                      {w.word}
                    </h4>
                    <span className="text-xs text-stone-500">
                      Syllables: <strong className="text-emerald-700">{w.syllables}</strong>
                    </span>
                    <p className="text-xs text-stone-600 italic">
                      "{w.exampleSentence}"
                    </p>
                  </div>
                </div>

                <AudioButton
                  textToSpeak={w.audioPronunciationText || `The word is ${w.word}.`}
                  word={w.word}
                  customAudioUrl={w.customAudioUrl}
                  size="sm"
                  variant="secondary"
                  label="Play Word Audio"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Parent Code Section */}
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Shield className="w-4 h-4 text-stone-500" />
          <span>Parent Access Code</span>
        </div>
        <p className="text-xs text-stone-500">
          Linked to: <strong>{matchedPupil.fullName}</strong> using code <span className="font-mono bg-stone-200 px-2 py-0.5 rounded text-stone-900 font-bold">{matchedPupil.parentCode}</span>.
        </p>
      </div>
    </div>
  );
};
