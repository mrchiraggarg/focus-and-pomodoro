export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoroSessions: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completedAt: Date;
  todoId?: string;
}

export interface DailyProgress {
  date: string;
  pomodoroSessions: number;
  focusTime: number; // in minutes
  tasksCompleted: number;
}

export interface AppSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export type TimerState = 'idle' | 'running' | 'paused';
export type SessionType = 'work' | 'shortBreak' | 'longBreak';