
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum FeedType {
  BREAST = 'Breast',
  BOTTLE = 'Bottle',
  PUMP = 'Pump'
}

export interface FeedLog {
  id: string;
  type: FeedType;
  timestamp: Date;
  durationMinutes?: number; // For breastfeeding
  amountMl?: number; // For bottle/pump
  side?: 'Left' | 'Right' | 'Both';
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  babyName?: string;
  babyDob?: string;
}

export interface VideoContent {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
}

export interface AnalysisResult {
  title: string;
  content: string;
  safetyWarning: string;
  actions: string[];
}

export interface JournalEntry {
  id: string;
  timestamp: Date;
  text: string;
  mood: 'happy' | 'calm' | 'tired' | 'stressed' | 'sad';
}

export type ViewState = 'dashboard' | 'cry-analyzer' | 'symptom-checker' | 'feeding' | 'chat' | 'mom-care' | 'journal';
