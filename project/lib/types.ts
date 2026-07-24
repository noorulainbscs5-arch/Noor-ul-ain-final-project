export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizLength = 3 | 5 | 10;

export type ApiProvider = 'gemini' | 'openai';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  createdAt: number;
  source: 'ai' | 'mock';
}

export interface QuizResult {
  total: number;
  correct: number;
  percentage: number;
  perQuestion: { questionId: number; selected: number | null; correct: boolean }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  content: string;
  createdAt: number;
}

export interface ApiKeyConfig {
  provider: ApiProvider;
  key: string;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'Core concepts & recall',
  medium: 'Application & analysis',
  hard: 'Synthesis & edge cases',
};

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
