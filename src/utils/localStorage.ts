import { Todo, PomodoroSession, DailyProgress, AppSettings } from '../types';

const STORAGE_KEYS = {
  TODOS: 'pomodoro_todos',
  SESSIONS: 'pomodoro_sessions',
  PROGRESS: 'pomodoro_progress',
  SETTINGS: 'pomodoro_settings',
} as const;

export const storage = {
  getTodos: (): Todo[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      })) : [];
    } catch {
      return [];
    }
  },

  saveTodos: (todos: Todo[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  },

  getSessions: (): PomodoroSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data).map((session: any) => ({
        ...session,
        completedAt: new Date(session.completedAt),
      })) : [];
    } catch {
      return [];
    }
  },

  saveSessions: (sessions: PomodoroSession[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  },

  getProgress: (): DailyProgress[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveProgress: (progress: DailyProgress[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        soundEnabled: true,
        theme: 'light',
      };
    } catch {
      return {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        soundEnabled: true,
        theme: 'light',
      };
    }
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },
};