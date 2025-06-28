import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { DailyProgress } from '../types';

interface ProgressChartProps {
  progress: DailyProgress[];
}

export function ProgressChart({ progress }: ProgressChartProps) {
  const last7Days = progress.slice(-7);
  const maxSessions = Math.max(...last7Days.map(p => p.pomodoroSessions), 1);
  const maxTasks = Math.max(...last7Days.map(p => p.tasksCompleted), 1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const totalSessions = progress.reduce((sum, p) => sum + p.pomodoroSessions, 0);
  const totalTasks = progress.reduce((sum, p) => sum + p.tasksCompleted, 0);
  const totalFocusTime = progress.reduce((sum, p) => sum + p.focusTime, 0);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Progress</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSessions}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalTasks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Math.round(totalFocusTime / 60)}h</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Focus Time</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Last 7 Days</h3>
        {last7Days.length > 0 ? (
          <div className="flex items-end justify-between gap-2 h-32">
            {last7Days.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex gap-1 items-end h-24">
                  <div
                    className="bg-blue-500 rounded-t-sm min-w-[8px] flex-1 transition-all duration-300"
                    style={{ height: `${(day.pomodoroSessions / maxSessions) * 100}%` }}
                    title={`${day.pomodoroSessions} sessions`}
                  />
                  <div
                    className="bg-green-500 rounded-t-sm min-w-[8px] flex-1 transition-all duration-300"
                    style={{ height: `${(day.tasksCompleted / maxTasks) * 100}%` }}
                    title={`${day.tasksCompleted} tasks`}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(day.date)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data yet. Complete your first session!</p>
            </div>
          </div>
        )}
        
        {last7Days.length > 0 && (
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-gray-600 dark:text-gray-400">Tasks</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}