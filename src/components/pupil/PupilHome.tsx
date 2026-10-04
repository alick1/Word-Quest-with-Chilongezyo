import React from 'react';
import { useApp } from '../../context/AppContext';
import { WordCard } from '../common/WordCard';
import { 
  Compass, 
  Headphones, 
  Sprout, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Star, 
  Flame, 
  Volume2, 
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playSound, speakText } from '../../utils/audio';

export const PupilHome: React.FC = () => {
  const { 
    currentPupil, 
    zones, 
    words, 
    assignments, 
    startActivity, 
    setActiveScreen, 
    accessibility 
  } = useApp();

  // Find active zone
  const activeZone = zones.find(z => z.id === currentPupil.currentZoneId) || zones[0];
  const activeLevel = activeZone.levels.find(l => l.id === currentPupil.currentLevelId) || activeZone.levels[0];

  // Recently learned words (mastered or improving)
  const pupilRecords = currentPupil.masteryRecords || {};
  const recentlyLearned = words
    .filter(w => pupilRecords[w.id] && (pupilRecords[w.id].stage === 'Mastered' || pupilRecords[w.id].stage === 'Improving'))
    .slice(0, 3);

  // Difficult words requiring revision (in Practising)
  const difficultWords = words
    .filter(w => pupilRecords[w.id] && pupilRecords[w.id].stage === 'Practising')
    .slice(0, 3);

  const dailyGoal = 5;
  const practicedTodayCount = Object.values(pupilRecords).filter(r => r.lastPracticed === new Date().toISOString().split('T')[0]).length || 3;
  const dailyPercent = Math.min(100, Math.round((practicedTodayCount / dailyGoal) * 100));

  const speakDashboard = () => {
    speakText(`Wapona bieni, ${currentPupil.nickname}! You are currently exploring ${activeZone.title}. Your daily practice goal is ${practicedTodayCount} of ${dailyGoal} words. Keep up the brilliant effort!`, {
      rate: accessibility.speechRate
    });
  };

  const handleContinueQuest = () => {
    playSound('tap', accessibility.soundEffects);
    startActivity(activeLevel.activityType, activeLevel.wordIds, activeLevel.id);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              {currentPupil.className} · Chinego Primary
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Wapona bieni {currentPupil.nickname}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Ready for today's spelling adventure? You're making tremendous progress!
            </p>
          </div>

          <button
            type="button"
            onClick={speakDashboard}
            aria-label="Read dashboard aloud"
            title="Listen to dashboard greeting"
            className="touch-target p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors shrink-0"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Practice Goal Meter */}
        <div className="mt-4 p-3.5 bg-black/20 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
              <span>Daily Practice Goal</span>
            </span>
            <span className="text-white font-mono">
              {practicedTodayCount} / {dailyGoal} words ({dailyPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${dailyPercent}%` }}
            />
          </div>
        </div>

        {/* Primary Call to Action: Continue Quest */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleContinueQuest}
            className="touch-target flex-1 min-w-[200px] py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-base shadow-sm inline-flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-amber-900" />
            <span>Continue Quest: {activeZone.title}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Launch Game Modes (Large child-friendly cards) */}
      <div>
        <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
          <span>Game Activities</span>
          <span className="text-xs font-normal text-stone-500">Pick any activity to practise</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Listen and Spell */}
          <button
            type="button"
            onClick={() => startActivity('listen-and-spell', ['w-school', 'w-harvest', 'w-because', 'w-friend'])}
            className="touch-target p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-left transition-all active:scale-95 cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Listen & Spell</span>
              <span className="text-[11px] text-emerald-800">Audio typing</span>
            </div>
          </button>

          {/* Revision Garden */}
          <button
            type="button"
            onClick={() => setActiveScreen('revision-garden')}
            className="touch-target p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-left transition-all active:scale-95 cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Revision Garden</span>
              <span className="text-[11px] text-amber-800">Water your plant</span>
            </div>
          </button>

          {/* My Words Dictionary */}
          <button
            type="button"
            onClick={() => setActiveScreen('my-words')}
            className="touch-target p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 text-left transition-all active:scale-95 cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">My Words</span>
              <span className="text-[11px] text-sky-800">Dictionary</span>
            </div>
          </button>

          {/* Weekly Challenge */}
          <button
            type="button"
            onClick={() => {
              const assign = assignments[0];
              if (assign) {
                startActivity(assign.activityType, assign.wordIds);
              } else {
                startActivity('listen-and-spell', ['w-harvest', 'w-maize', 'w-sadza']);
              }
            }}
            className="touch-target p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 text-left transition-all active:scale-95 cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Weekly Task</span>
              <span className="text-[11px] text-purple-800">Teacher assigned</span>
            </div>
          </button>
        </div>
      </div>

      {/* Encouragement message banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
        <span className="text-2xl select-none">🌟</span>
        <div className="text-xs text-amber-950">
          <strong className="block text-sm font-bold">Chilongezyo says:</strong>
          "Mistakes are simply stepping stones to mastery! Keep practicing with patience and pride."
        </div>
      </div>

      {/* Difficult Words Requiring Revision Section */}
      {difficultWords.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Words Requiring Revision</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveScreen('revision-garden')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Open Garden →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {difficultWords.map(w => (
              <WordCard
                key={w.id}
                word={w}
                masteryStage="Practising"
                onPracticeClick={() => startActivity('listen-and-spell', [w.id])}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recently Mastered Words */}
      {recentlyLearned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recently Mastered Words</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveScreen('my-words')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View All ({words.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recentlyLearned.map(w => (
              <WordCard
                key={w.id}
                word={w}
                masteryStage="Mastered"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
