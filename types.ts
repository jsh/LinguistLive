
export interface Language {
  code: string;
  name: string;
  flag: string;
  welcomeMessage: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  instruction: string;
  icon: string;
}

export type ProficiencyLevel = 'Beginning' | 'Intermediate' | 'Advanced';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum SessionStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}
