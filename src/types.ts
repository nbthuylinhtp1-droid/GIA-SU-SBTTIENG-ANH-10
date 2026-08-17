export type DifficultyLevel = 'recognition' | 'comprehension' | 'application' | 'all';

export interface Question {
  id: string;
  unitId: string; // 'unit-1', 'unit-2', ..., 'test-1', etc.
  unitName: string;
  topic: string;
  difficulty: 'recognition' | 'comprehension' | 'application';
  category: 'Pronunciation' | 'Vocabulary' | 'Grammar' | 'Reading' | 'Speaking & Communication' | 'Writing Structure';
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  grammarTip?: string;
}

export interface UnitInfo {
  id: string;
  number: number | string;
  title: string;
  vietnameseTitle: string;
  grammarHighlight: string;
  vocabHighlight: string;
  pronunciationHighlight: string;
  isTest?: boolean;
}

export interface UserConfig {
  studentName: string;
  className: string;
  selectedUnitId: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  timeLimit: number; // in seconds, default 60
}

export interface AnswerRecord {
  question: Question;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  id: string;
  studentName: string;
  className: string;
  unitId: string;
  unitTitle: string;
  difficulty: DifficultyLevel;
  score: number;
  totalQuestionsAnswered: number;
  targetQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracyRate: number;
  timeSpent: number;
  maxCombo: number;
  answers: AnswerRecord[];
  timestamp: number;
  rankBadge: string;
  teacherComment: string;
}
