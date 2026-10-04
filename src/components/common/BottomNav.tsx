import React from 'react';
import { Home, Compass, BookOpen, Award, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, accessibility, setActiveModal } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quest-map', label: 'Quest', icon: Compass },
    { id: 'practise', label: 'Practise', icon: BookOpen },
    { id: 'my-progress', label: 'My Progress', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings, isModal: true }
  ];

  const handleNavClick = (id: string, isModal?: boolean) => {
    playSound('tap', accessibility.soundEffects);
    if (isModal) {
      setActiveModal('settings');
    } else {
      setActiveScreen(id);
    }
  };

  return (
    <nav 
      aria-label="Pupil bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isModal && (
            activeScreen === item.id || 
            (item.id === 'practise' && (activeScreen === 'my-words' || activeScreen === 'revision-garden'))
          );

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id, item.isModal)}
              aria-current={isActive ? 'page' : undefined}
              className={`touch-target flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-bold bg-emerald-50/80 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : ''} transition-transform`} />
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
