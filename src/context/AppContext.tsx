import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  SpellingWord, 
  QuestZone, 
  PupilProfile, 
  TeacherProfile, 
  Badge, 
  Assignment, 
  AccessibilitySettings, 
  ActivityType,
  DifficultyLevel,
  WordMasteryRecord
} from '../types';
import { 
  SEED_WORDS, 
  SEED_QUEST_ZONES, 
  SEED_BADGES, 
  SEED_PUPILS, 
  SEED_TEACHER, 
  SEED_ASSIGNMENTS 
} from '../data/seedData';
import { playSound, speakText } from '../utils/audio';

interface ActivitySession {
  type: ActivityType;
  words: SpellingWord[];
  currentIndex: number;
  levelId?: string;
  results: {
    wordId: string;
    correct: boolean;
    attempts: number;
    hintsUsed: number;
  }[];
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPupil: PupilProfile;
  pupils: PupilProfile[];
  teacher: TeacherProfile;
  words: SpellingWord[];
  zones: QuestZone[];
  badges: Badge[];
  assignments: Assignment[];
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  activeActivity: ActivitySession | null;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  switchPupil: (pupilId: string) => void;
  createPupil: (nickname: string, className: string, age: number, avatar: string) => PupilProfile;
  deletePupil: (pupilId: string) => void;
  resetPupilProgress: (pupilId: string) => void;
  startActivity: (type: ActivityType, wordIds: string[], levelId?: string) => void;
  nextActivityWord: () => void;
  recordWordAttempt: (wordId: string, isCorrect: boolean, hintsUsed: number, audioReplays: number) => void;
  finishActivitySession: () => { starsEarned: number; newBadge?: Badge };
  waterGardenPlant: () => boolean;
  addWord: (wordData: Partial<SpellingWord>) => SpellingWord;
  updateWord: (word: SpellingWord) => void;
  deleteWord: (id: string) => void;
  createAssignment: (title: string, className: string, wordIds: string[], activityType: ActivityType, dueDate: string) => void;
  completeDiagnostic: (difficulty: DifficultyLevel) => void;
  isOffline: boolean;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const STORAGE_KEYS = {
  WORDS: 'wq_words_v1',
  PUPILS: 'wq_pupils_v1',
  ASSIGNMENTS: 'wq_assignments_v1',
  SETTINGS: 'wq_settings_v1',
  ACTIVE_PUPIL_ID: 'wq_active_pupil_v1',
  ACTIVE_ROLE: 'wq_active_role_v1'
};

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  darkMode: false,
  dyslexiaFont: false,
  reducedMotion: false,
  extraTime: false,
  soundEffects: true,
  readInstructionsAloud: false,
  speechRate: 1.0,
  calmMode: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Offline detection
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // State initialization with localStorage fallback
  const [words, setWords] = useState<SpellingWord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WORDS);
      return stored ? JSON.parse(stored) : SEED_WORDS;
    } catch {
      return SEED_WORDS;
    }
  });

  const [pupils, setPupils] = useState<PupilProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PUPILS);
      return stored ? JSON.parse(stored) : SEED_PUPILS;
    } catch {
      return SEED_PUPILS;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return stored ? JSON.parse(stored) : SEED_ASSIGNMENTS;
    } catch {
      return SEED_ASSIGNMENTS;
    }
  });

  const [activePupilId, setActivePupilId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PUPIL_ID);
      return stored || 'p-rose';
    } catch {
      return 'p-rose';
    }
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      return (stored as UserRole) || 'pupil';
    } catch {
      return 'pupil';
    }
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivitySession | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    } catch (e) {
      console.warn('Storage save note:', e);
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PUPILS, JSON.stringify(pupils));
    } catch (e) {
      console.warn('Storage save note:', e);
    }
  }, [pupils]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.warn('Storage save note:', e);
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PUPIL_ID, activePupilId);
    } catch (e) {
      console.warn('Storage save note:', e);
    }
  }, [activePupilId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    } catch (e) {
      console.warn('Storage save note:', e);
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(accessibility));
    } catch (e) {
      console.warn('Storage save note:', e);
    }

    // Apply accessibility classes to document body
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (accessibility.dyslexiaFont) {
        body.classList.add('font-dyslexia');
      } else {
        body.classList.remove('font-dyslexia');
      }

      if (accessibility.highContrast) {
        body.classList.add('high-contrast');
      } else {
        body.classList.remove('high-contrast');
      }

      if (accessibility.darkMode) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    }
  }, [accessibility]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'pupil') {
      setActiveScreen('home');
    } else if (newRole === 'teacher') {
      setActiveScreen('teacher-dashboard');
    } else if (newRole === 'parent') {
      setActiveScreen('parent-dashboard');
    } else if (newRole === 'admin') {
      setActiveScreen('admin-dashboard');
    }
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...newSettings }));
  };

  const currentPupil = pupils.find(p => p.id === activePupilId) || pupils[0] || SEED_PUPILS[0];

  const switchPupil = (pupilId: string) => {
    setActivePupilId(pupilId);
    setActiveScreen('home');
    playSound('tap', accessibility.soundEffects);
  };

  const createPupil = (nickname: string, className: string, age: number, avatar: string): PupilProfile => {
    const id = `p-${Date.now()}`;
    const newPupil: PupilProfile = {
      id,
      nickname,
      fullName: nickname,
      className,
      age,
      avatar,
      stars: 0,
      coins: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      currentZoneId: 'zone-1',
      currentLevelId: 'lvl-1-1',
      completedLevelIds: [],
      masteryRecords: {},
      unlockedBadgeIds: [],
      revisionGardenPlantStage: 0,
      totalTimeSpentSeconds: 0,
      parentCode: `${nickname.toUpperCase().replace(/\s+/g, '')}-4A`,
      diagnosticCompleted: false,
      recommendedDifficulty: 'Developing'
    };

    setPupils(prev => [...prev, newPupil]);
    setActivePupilId(id);
    return newPupil;
  };

  const deletePupil = (pupilId: string) => {
    setPupils(prev => {
      const filtered = prev.filter(p => p.id !== pupilId);
      if (activePupilId === pupilId && filtered.length > 0) {
        setActivePupilId(filtered[0].id);
      }
      return filtered;
    });
  };

  const resetPupilProgress = (pupilId: string) => {
    setPupils(prev => prev.map(p => {
      if (p.id !== pupilId) return p;
      return {
        ...p,
        stars: 0,
        coins: 0,
        completedLevelIds: [],
        masteryRecords: {},
        unlockedBadgeIds: [],
        revisionGardenPlantStage: 0
      };
    }));
  };

  const startActivity = (type: ActivityType, wordIds: string[], levelId?: string) => {
    const activityWords = wordIds
      .map(id => words.find(w => w.id === id))
      .filter((w): w is SpellingWord => Boolean(w));

    if (activityWords.length === 0) return;

    setActiveActivity({
      type,
      words: activityWords,
      currentIndex: 0,
      levelId,
      results: []
    });

    if (accessibility.readInstructionsAloud) {
      speakText(`Starting ${type.replace(/-/g, ' ')}. Listen carefully and spell each word.`, {
        rate: accessibility.speechRate
      });
    }

    setActiveScreen('activity');
  };

  const nextActivityWord = () => {
    if (!activeActivity) return;
    if (activeActivity.currentIndex + 1 < activeActivity.words.length) {
      setActiveActivity(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null);
    } else {
      setActiveScreen('results');
    }
  };

  const recordWordAttempt = (wordId: string, isCorrect: boolean, hintsUsed: number, audioReplays: number) => {
    if (!activeActivity) return;

    // Track attempt in current session
    setActiveActivity(prev => {
      if (!prev) return null;
      const existing = prev.results.find(r => r.wordId === wordId);
      if (existing) {
        existing.correct = isCorrect;
        existing.attempts += 1;
        existing.hintsUsed += hintsUsed;
        return { ...prev };
      }
      return {
        ...prev,
        results: [...prev.results, { wordId, correct: isCorrect, attempts: 1, hintsUsed }]
      };
    });

    // Update pupil mastery record based on spaced repetition rules:
    // - New -> Practising on 1st exposure
    // - Practising -> Improving after 2 correct attempts on separate sessions
    // - Improving -> Mastered after 3 correct attempts with <= 1 hint
    // - Returned to revision if repeatedly misspelled
    setPupils(prevPupils => prevPupils.map(p => {
      if (p.id !== currentPupil.id) return p;

      const currentRecord: WordMasteryRecord = p.masteryRecords[wordId] || {
        wordId,
        stage: 'New',
        correctCount: 0,
        incorrectCount: 0,
        hintsUsedCount: 0,
        lastPracticed: new Date().toISOString().split('T')[0],
        firstAttemptSuccess: isCorrect,
        audioReplays: 0
      };

      const correctCount = currentRecord.correctCount + (isCorrect ? 1 : 0);
      const incorrectCount = currentRecord.incorrectCount + (isCorrect ? 0 : 1);
      const hintsUsedCount = currentRecord.hintsUsedCount + hintsUsed;
      const totalAudioReplays = currentRecord.audioReplays + audioReplays;

      let nextStage = currentRecord.stage;
      if (isCorrect) {
        if (currentRecord.stage === 'New') {
          nextStage = 'Practising';
        } else if (currentRecord.stage === 'Practising' && correctCount >= 2) {
          nextStage = 'Improving';
        } else if (currentRecord.stage === 'Improving' && correctCount >= 3 && hintsUsedCount <= 2) {
          nextStage = 'Mastered';
        }
      } else {
        if (incorrectCount >= 2 && currentRecord.stage === 'Mastered') {
          nextStage = 'Improving'; // Return to revision gently
        }
      }

      return {
        ...p,
        totalTimeSpentSeconds: p.totalTimeSpentSeconds + 45,
        masteryRecords: {
          ...p.masteryRecords,
          [wordId]: {
            wordId,
            stage: nextStage,
            correctCount,
            incorrectCount,
            hintsUsedCount,
            lastPracticed: new Date().toISOString().split('T')[0],
            firstAttemptSuccess: currentRecord.firstAttemptSuccess,
            audioReplays: totalAudioReplays
          }
        }
      };
    }));
  };

  const finishActivitySession = () => {
    if (!activeActivity) return { starsEarned: 0 };

    const totalWords = activeActivity.words.length;
    const correctCount = activeActivity.results.filter(r => r.correct).length;
    const starsEarned = Math.max(1, Math.round((correctCount / totalWords) * 3));
    const coinsEarned = correctCount * 10;

    let unlockedBadge: Badge | undefined;

    setPupils(prevPupils => prevPupils.map(p => {
      if (p.id !== currentPupil.id) return p;

      const completedLevelIds = activeActivity.levelId && !p.completedLevelIds.includes(activeActivity.levelId)
        ? [...p.completedLevelIds, activeActivity.levelId]
        : p.completedLevelIds;

      // Check level-specific badge reward
      let newBadgeIds = [...p.unlockedBadgeIds];
      if (activeActivity.levelId) {
        const zone = SEED_QUEST_ZONES.find(z => z.levels.some(l => l.id === activeActivity.levelId));
        const level = zone?.levels.find(l => l.id === activeActivity.levelId);
        if (level?.badgeRewardId && !newBadgeIds.includes(level.badgeRewardId)) {
          newBadgeIds.push(level.badgeRewardId);
          unlockedBadge = SEED_BADGES.find(b => b.id === level.badgeRewardId);
        }
      }

      // Check for Word Explorer badge if >= 3 completed levels
      if (completedLevelIds.length >= 3 && !newBadgeIds.includes('b-word-explorer')) {
        newBadgeIds.push('b-word-explorer');
        if (!unlockedBadge) unlockedBadge = SEED_BADGES.find(b => b.id === 'b-word-explorer');
      }

      return {
        ...p,
        stars: p.stars + starsEarned,
        coins: p.coins + coinsEarned,
        completedLevelIds,
        unlockedBadgeIds: newBadgeIds,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
    }));

    return { starsEarned, newBadge: unlockedBadge };
  };

  const waterGardenPlant = (): boolean => {
    let success = false;
    setPupils(prevPupils => prevPupils.map(p => {
      if (p.id !== currentPupil.id) return p;
      if (p.revisionGardenPlantStage < 4) {
        success = true;
        playSound('water', accessibility.soundEffects);
        return {
          ...p,
          revisionGardenPlantStage: p.revisionGardenPlantStage + 1
        };
      }
      return p;
    }));
    return success;
  };

  const addWord = (wordData: Partial<SpellingWord>): SpellingWord => {
    const newWord: SpellingWord = {
      id: `w-${Date.now()}`,
      word: wordData.word || 'new-word',
      category: wordData.category || 'General',
      gradeLevel: 4,
      difficulty: wordData.difficulty || 'Developing',
      audioPronunciationText: wordData.audioPronunciationText || `The word is ${wordData.word}.`,
      slowAudioText: wordData.slowAudioText || wordData.word?.split('').join('-') || '',
      customAudioUrl: wordData.customAudioUrl,
      imageDescription: wordData.imageDescription || `Illustration for ${wordData.word}`,
      imageIcon: wordData.imageIcon || 'book',
      definition: wordData.definition || 'Word definition',
      exampleSentence: wordData.exampleSentence || `We use ${wordData.word} in sentences.`,
      syllables: wordData.syllables || wordData.word || '',
      letterPattern: wordData.letterPattern || '',
      commonMisspelling: wordData.commonMisspelling || '',
      hint: wordData.hint || 'Think carefully about the syllables.',
      curriculumTag: wordData.curriculumTag || 'Grade 4 English',
      teacherNotes: wordData.teacherNotes || '',
      accessibilityNotes: wordData.accessibilityNotes || '',
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setWords(prev => [newWord, ...prev]);
    return newWord;
  };

  const updateWord = (updated: SpellingWord) => {
    setWords(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  const deleteWord = (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
  };

  const createAssignment = (
    title: string, 
    className: string, 
    wordIds: string[], 
    activityType: ActivityType, 
    dueDate: string
  ) => {
    const newAssign: Assignment = {
      id: `assign-${Date.now()}`,
      title,
      className,
      wordIds,
      activityType,
      dueDate,
      completedPupilIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAssign, ...prev]);
  };

  const completeDiagnostic = (difficulty: DifficultyLevel) => {
    setPupils(prev => prev.map(p => {
      if (p.id !== currentPupil.id) return p;
      return {
        ...p,
        diagnosticCompleted: true,
        recommendedDifficulty: difficulty,
        stars: p.stars + 5
      };
    }));
    setActiveScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentPupil,
        pupils,
        teacher: SEED_TEACHER,
        words,
        zones: SEED_QUEST_ZONES,
        badges: SEED_BADGES,
        assignments,
        activeScreen,
        setActiveScreen,
        activeActivity,
        accessibility,
        updateAccessibility,
        switchPupil,
        createPupil,
        deletePupil,
        resetPupilProgress,
        startActivity,
        nextActivityWord,
        recordWordAttempt,
        finishActivitySession,
        waterGardenPlant,
        addWord,
        updateWord,
        deleteWord,
        createAssignment,
        completeDiagnostic,
        isOffline,
        activeModal,
        setActiveModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
