import React from 'react';
import { Play, Pause, RotateCcw, Coffee, Clock } from 'lucide-react';
import { TimerState, SessionType } from '../types';

interface PomodoroTimerProps {
  formattedTime: string;
  state: TimerState;
  currentSession: SessionType;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function PomodoroTimer({
  formattedTime,
  state,
  currentSession,
  progress,
  onStart,
  onPause,
  onReset,
}: PomodoroTimerProps) {
  const getSessionInfo = () => {
    switch (currentSession) {
      case 'work':
        return { label: 'Focus Time', icon: Clock, color: 'text-blue-600 dark:text-blue-400' };
      case 'shortBreak':
        return { label: 'Short Break', icon: Coffee, color: 'text-green-600 dark:text-green-400' };
      case 'longBreak':
        return { label: 'Long Break', icon: Coffee, color: 'text-purple-600 dark:text-purple-400' };
    }
  };

  const { label, icon: Icon, color } = getSessionInfo();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Icon className={`w-6 h-6 ${color}`} />
          <h2 className={`text-xl font-semibold ${color}`}>{label}</h2>
        </div>
        
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  currentSession === 'work' 
                    ? 'text-blue-500' 
                    : currentSession === 'shortBreak'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-mono font-bold text-gray-800 dark:text-white">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {state === 'idle' || state === 'paused' ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Play className="w-5 h-5" />
              {state === 'paused' ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}