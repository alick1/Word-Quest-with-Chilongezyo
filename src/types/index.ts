export type UserRole = 'pupil' | 'teacher' | 'parent' | 'admin';

export type DifficultyLevel = 'Beginner' | 'Developing' | 'Challenge';

export type MasteryStage = 'New' | 'Practising' | 'Improving' | 'Mastered';

export type ActivityType = 
  | 'listen-and-spell'
  | 'build-the-word'
  | 'missing-letters'
  | 'picture-match'
  | 'word-detective'
  | 'spelling-race'
  | 'revision-garden';

export interface SpellingWord {
  id: string;
  word: string;
  category: string;
  gradeLevel: number;
  difficulty: DifficultyLevel;
  audioPronunciationText?: string;
  slowAudioText?: string;
  customAudioUrl?: string; // base64 or audio file URL recorded by teacher
  imageDescription: string;
  imageIcon: string; // key for child-safe SVG illustration
  definition: string;
  exampleSentence: string;
  syllables: string; // e.g. "har-vest"
  letterPattern?: string; // e.g. "_ _ r _ e _"
  commonMisspelling: string; // e.g. "havest"
  hint: string;
  curriculumTag: string;
  teacherNotes?: string;
  accessibilityNotes?: string;
  dateAdded: string;
  status: 'active' | 'inactive';
}

export interface QuestZone {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  theme: string;
  iconName: string;
  bgGradient: string;
  order: number;
  unlockedLevelRequired: number;
  levels: QuestLevel[];
}

export interface QuestLevel {
  id: string;
  zoneId: string;
  levelNumber: number;
  title: string;
  description: string;
  activityType: ActivityType;
  wordIds: string[];
  starsRequiredToUnlock: number;
  badgeRewardId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export interface WordMasteryRecord {
  wordId: string;
  stage: MasteryStage;
  correctCount: number;
  incorrectCount: number;
  hintsUsedCount: number;
  lastPracticed: string;
  firstAttemptSuccess: boolean;
  audioReplays: number;
}

export interface PupilProfile {
  id: string;
  nickname: string;
  fullName: string;
  className: string;
  age: number;
  avatar: string; // avatar identifier
  stars: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  currentZoneId: string;
  currentLevelId: string;
  completedLevelIds: string[];
  masteryRecords: Record<string, WordMasteryRecord>;
  unlockedBadgeIds: string[];
  revisionGardenPlantStage: number; // 0 to 4 (Seedling, Sprout, Growing, Blooming)
  totalTimeSpentSeconds: number;
  preferredActivity?: ActivityType;
  parentCode: string;
  diagnosticCompleted: boolean;
  recommendedDifficulty: DifficultyLevel;
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  title: string; // e.g. "Mr."
  schoolName: string;
  classes: string[];
  email: string;
}

export interface Assignment {
  id: string;
  title: string;
  className: string;
  assignedPupilIds?: string[]; // empty means whole class
  wordIds: string[];
  dueDate: string;
  activityType: ActivityType;
  completedPupilIds: string[];
  createdAt: string;
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  darkMode: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  extraTime: boolean;
  soundEffects: boolean;
  readInstructionsAloud: boolean;
  speechRate: number; // 0.7 for slow, 1.0 for normal
  calmMode: boolean; // fewer animations & softer cues
}

export interface DiagnosticQuestion {
  word: SpellingWord;
  scrambledOptions: string[];
}
