import { useState, useEffect, useCallback } from 'react';
import { TimerState, SessionType } from '../types';

interface UseTimerProps {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  onSessionComplete: (type: SessionType, duration: number) => void;
  soundEnabled: boolean;
}

export function useTimer({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  longBreakInterval,
  onSessionComplete,
  soundEnabled,
}: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [state, setState] = useState<TimerState>('idle');
  const [currentSession, setCurrentSession] = useState<SessionType>('work');
  const [completedSessions, setCompletedSessions] = useState(0);

  const getCurrentSessionDuration = useCallback(() => {
    switch (currentSession) {
      case 'work':
        return workDuration * 60;
      case 'shortBreak':
        return shortBreakDuration * 60;
      case 'longBreak':
        return longBreakDuration * 60;
    }
  }, [currentSession, workDuration, shortBreakDuration, longBreakDuration]);

  const start = useCallback(() => {
    setState('running');
  }, []);

  const pause = useCallback(() => {
    setState('paused');
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setTimeLeft(getCurrentSessionDuration());
  }, [getCurrentSessionDuration]);

  const nextSession = useCallback(() => {
    const sessionDuration = getCurrentSessionDuration() / 60;
    onSessionComplete(currentSession, sessionDuration);

    if (currentSession === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      const shouldTakeLongBreak = newCompletedSessions % longBreakInterval === 0;
      setCurrentSession(shouldTakeLongBreak ? 'longBreak' : 'shortBreak');
    } else {
      setCurrentSession('work');
    }
  }, [currentSession, completedSessions, longBreakInterval, onSessionComplete, getCurrentSessionDuration]);

  useEffect(() => {
    setTimeLeft(getCurrentSessionDuration());
  }, [getCurrentSessionDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state === 'running') {
      setState('idle');
      nextSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, timeLeft, nextSession]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = ((getCurrentSessionDuration() - timeLeft) / getCurrentSessionDuration()) * 100;

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    state,
    currentSession,
    completedSessions,
    progress,
    start,
    pause,
    reset,
    nextSession,
  };
}