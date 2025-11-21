export type ConsumptionType = 
  | 'cigarettes' 
  | 'joints' 
  | 'thc'
  | 'nicotine';

export interface UserData {
  consumptionType: ConsumptionType;
  quitDate: string;
  dailyConsumption: number;
  costPerUnit: number;
  currency: string;
  isOnboarded: boolean;
}

export interface CravingEntry {
  id: string;
  timestamp: string;
  avoided: boolean;
  intensity: number;
}

export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: 'excellent' | 'good' | 'okay' | 'difficult' | 'struggling';
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  daysRequired: number;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface DailyLog {
  id: string;
  date: string;
  count: number;
  notes?: string;
}
