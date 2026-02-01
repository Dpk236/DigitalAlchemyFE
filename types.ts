
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VIDEO = 'VIDEO',
  NOTES = 'NOTES',
  PRACTICE = 'PRACTICE',
  REVISION = 'REVISION'
}

export type TabType = 'Chat' | 'Flashcards' | 'Challenge Zone' | 'Simulation' | 'Summary' | 'Notes';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  reasoning: string;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type Language = 'english' | 'hindi' | 'marathi' | 'tamil' | 'telugu';

export interface ConceptNote {
  title: string;
  content: string;
  formulas: string[];
  importance: string;
}
