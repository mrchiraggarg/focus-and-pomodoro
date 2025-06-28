import React from 'react';
import { Flame, Target, Clock } from 'lucide-react';
import { DailyProgress } from '../types';

interface ProductivityStreakProps {
  progress: DailyProgress[];
}

export function ProductivityStreak({ progress }: ProductivityStreakProps) {
  const calculateCurrentStreak = (): number => {
    if (progress.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    
    // Check if user has progress today
    const hasProgressToday = progress.some(p => new Date(p.date).toDateString() === today);
    
    for (let i = progress.length - 1; i >= 0; i--) {
      const progressDate = new Date(progress[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - (progress.length - 1 - i));
      
      if (progressDate.toDateString() === expectedDate.toDateString() && progress[i].pomodoroSessions > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateBestStreak = (): number => {
    let bestStreak = 0;
    let currentStreak = 0;
    
    for (const day of progress) {
      if (day.pomodoroSessions > 0) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  };

  const getTotalFocusTime = (): string => {
    const totalMinutes = progress.reduce((sum, p) => sum + p.focusTime, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const currentStreak = calculateCurrentStreak();
  const bestStreak = calculateBestStreak();
  const totalFocusTime = getTotalFocusTime();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Streak</h2>
      </div>

      <div className="space-y-4">
        {/* Current Streak */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Current Streak</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days in a row</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {currentStreak}
          </div>
        </div>

        {/* Best Streak */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Best Streak</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Personal record</div>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {bestStreak}
          </div>
        </div>

        {/* Total Focus Time */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">Total Focus Time</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">All time</div>
            </div>
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {totalFocusTime}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentStreak === 0 ? (
              "Start your first session today! 🚀"
            ) : currentStreak === 1 ? (
              "Great start! Keep the momentum going! 💪"
            ) : currentStreak < 7 ? (
              `${currentStreak} days strong! You're building a great habit! 🎯`
            ) : currentStreak < 30 ? (
              `Amazing! ${currentStreak} days of consistency! 🔥`
            ) : (
              `Incredible! ${currentStreak} days of dedication! You're unstoppable! 🏆`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}