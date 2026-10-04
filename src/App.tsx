/**
 * Word Quest with Chilongezyo: Grade 4 Spelling Adventure
 * Chinego Primary School, Zimbabwe
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { WelcomeScreen } from './components/common/WelcomeScreen';
import { SettingsModal } from './components/settings/SettingsModal';

// Pupil screens
import { PupilHome } from './components/pupil/PupilHome';
import { QuestMap } from './components/pupil/QuestMap';
import { PractiseHub } from './components/pupil/PractiseHub';
import { RevisionGarden } from './components/pupil/RevisionGarden';
import { MyProgress } from './components/pupil/MyProgress';
import { MyWords } from './components/pupil/MyWords';
import { Onboarding } from './components/pupil/Onboarding';
import { DiagnosticAssessment } from './components/pupil/DiagnosticAssessment';
import { ResultsFeedback } from './components/pupil/ResultsFeedback';

// Game modes
import { ListenAndSpell } from './components/pupil/ListenAndSpell';
import { BuildTheWord } from './components/pupil/BuildTheWord';
import { MissingLetters } from './components/pupil/MissingLetters';
import { PictureWordMatch } from './components/pupil/PictureWordMatch';
import { WordDetective } from './components/pupil/WordDetective';
import { SpellingRace } from './components/pupil/SpellingRace';

// Teacher, Parent, Admin
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { 
    role, 
    setRole, 
    activeScreen, 
    setActiveScreen, 
    activeActivity, 
    nextActivityWord,
    startActivity,
    accessibility
  } = useApp();

  const renderPupilContent = () => {
    switch (activeScreen) {
      case 'welcome':
        return <WelcomeScreen onSelectRole={setRole} />;
      case 'onboarding':
        return <Onboarding />;
      case 'diagnostic':
        return <DiagnosticAssessment />;
      case 'home':
        return <PupilHome />;
      case 'quest-map':
        return <QuestMap />;
      case 'practise':
        return <PractiseHub />;
      case 'revision-garden':
        return <RevisionGarden />;
      case 'my-progress':
        return <MyProgress />;
      case 'my-words':
        return <MyWords />;
      case 'activity':
        if (!activeActivity || activeActivity.words.length === 0) {
          return <PupilHome />;
        }
        switch (activeActivity.type) {
          case 'listen-and-spell':
            return (
              <ListenAndSpell
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          case 'build-the-word':
            return (
              <BuildTheWord
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          case 'missing-letters':
            return (
              <MissingLetters
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          case 'picture-match':
            return (
              <PictureWordMatch
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          case 'word-detective':
            return (
              <WordDetective
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          case 'spelling-race':
            return (
              <SpellingRace
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
          default:
            return (
              <ListenAndSpell
                words={activeActivity.words}
                currentIndex={activeActivity.currentIndex}
                onNext={nextActivityWord}
              />
            );
        }
      case 'results':
        return (
          <ResultsFeedback
            onReturnToMap={() => setActiveScreen('quest-map')}
            onRetry={() => {
              if (activeActivity) {
                startActivity(
                  activeActivity.type,
                  activeActivity.words.map(w => w.id),
                  activeActivity.levelId
                );
              }
            }}
          />
        );
      default:
        return <PupilHome />;
    }
  };

  const showBottomNav = role === 'pupil' && !['activity', 'results', 'diagnostic', 'onboarding', 'welcome'].includes(activeScreen);

  // Scaled text size container
  const textSizeClass = 
    accessibility.textSize === 'large' 
      ? 'text-lg' 
      : accessibility.textSize === 'extra-large' 
        ? 'text-xl' 
        : 'text-base';

  return (
    <div className={`min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans ${textSizeClass}`}>
      {/* Top Demo Role Switcher */}
      <RoleSwitcher />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3.5 sm:p-5">
        {role === 'teacher' && <TeacherDashboard />}
        {role === 'parent' && <ParentDashboard />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'pupil' && renderPupilContent()}
      </main>

      {/* Bottom Nav for Pupils */}
      {showBottomNav && <BottomNav />}

      {/* Accessibility & Audio Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
