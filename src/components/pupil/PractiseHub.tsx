import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';
import { 
  Headphones, 
  Puzzle, 
  HelpCircle, 
  Image as ImageIcon, 
  Search, 
  Zap, 
  Sprout,
  ArrowRight
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const PractiseHub: React.FC = () => {
  const { startActivity, setActiveScreen, words, accessibility } = useApp();

  const activities: {
    type: ActivityType | 'revision';
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    border: string;
  }[] = [
    {
      type: 'listen-and-spell',
      title: 'Listen and Spell',
      desc: 'Hear pronunciation with normal and slow playback, then type the spelling.',
      icon: <Headphones className="w-6 h-6 text-emerald-700" />,
      color: 'bg-emerald-50 hover:bg-emerald-100',
      border: 'border-emerald-200'
    },
    {
      type: 'build-the-word',
      title: 'Build the Word',
      desc: 'Tap scrambled letter tiles into the correct sequential order.',
      icon: <Puzzle className="w-6 h-6 text-amber-700" />,
      color: 'bg-amber-50 hover:bg-amber-100',
      border: 'border-amber-200'
    },
    {
      type: 'missing-letters',
      title: 'Missing Letters',
      desc: 'Find the tricky missing vowels and consonants in words.',
      icon: <HelpCircle className="w-6 h-6 text-teal-700" />,
      color: 'bg-teal-50 hover:bg-teal-100',
      border: 'border-teal-200'
    },
    {
      type: 'picture-match',
      title: 'Picture and Word Match',
      desc: 'Visual learning with Zimbabwean illustrations and spoken word audio.',
      icon: <ImageIcon className="w-6 h-6 text-blue-700" />,
      color: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-200'
    },
    {
      type: 'word-detective',
      title: 'Word Detective',
      desc: 'Inspect real sentences, identify spelling mistakes, and correct them.',
      icon: <Search className="w-6 h-6 text-purple-700" />,
      color: 'bg-purple-50 hover:bg-purple-100',
      border: 'border-purple-200'
    },
    {
      type: 'spelling-race',
      title: 'Spelling Race (Timed or Relaxed)',
      desc: 'Fast-paced friendly spelling sprint with an optional timer toggle.',
      icon: <Zap className="w-6 h-6 text-orange-700" />,
      color: 'bg-orange-50 hover:bg-orange-100',
      border: 'border-orange-200'
    },
    {
      type: 'revision',
      title: 'Revision Garden',
      desc: 'Spaced repetition to nourish and grow your blooming Baobab tree.',
      icon: <Sprout className="w-6 h-6 text-lime-700" />,
      color: 'bg-lime-50 hover:bg-lime-100',
      border: 'border-lime-200'
    }
  ];

  const handleLaunch = (type: ActivityType | 'revision') => {
    playSound('tap', accessibility.soundEffects);
    if (type === 'revision') {
      setActiveScreen('revision-garden');
      return;
    }

    // Pick 4 words matching current activity
    const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, 4);
    startActivity(type, shuffledWords.map(w => w.id));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Spelling Practice Lab</h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Choose a game mode to train your spelling skills with joyful audio and visual clues.
        </p>
      </div>

      {/* Grid of activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {activities.map((act) => (
          <button
            key={act.title}
            type="button"
            onClick={() => handleLaunch(act.type)}
            className={`touch-target p-4 rounded-3xl border-2 text-left transition-all active:scale-98 cursor-pointer shadow-xs flex items-start gap-3.5 ${act.color} ${act.border}`}
          >
            <div className="p-3 bg-white rounded-2xl shadow-xs shrink-0">
              {act.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm">{act.title}</h3>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {act.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
