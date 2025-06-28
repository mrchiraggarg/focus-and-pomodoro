import React, { useState, useEffect, useCallback } from 'react';
import { Target } from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TodoList } from './components/TodoList';
import { ProgressChart } from './components/ProgressChart';
import { ProductivityStreak } from './components/ProductivityStreak';
import { ThemeToggle } from './components/ThemeToggle';
import { MotivationalQuote } from './components/MotivationalQuote';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { storage } from './utils/localStorage';
import { playNotificationSound, showNotification, requestNotificationPermission } from './utils/sound';
import { Todo, SessionType, DailyProgress, AppSettings } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodoId, setActiveTodoId] = useState<string | undefined>();
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    theme: 'light',
  });
  const [showQuote, setShowQuote] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Load data from localStorage on mount
  useEffect(() => {
    setTodos(storage.getTodos());
    setProgress(storage.getProgress());
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);
    
    // Request notification permission
    requestNotificationPermission();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    storage.saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    storage.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  const handleSessionComplete = useCallback((type: SessionType, duration: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Play notification sound
    playNotificationSound(settings.soundEnabled);
    
    // Show browser notification
    if (type === 'work') {
      showNotification('Pomodoro Complete!', 'Great job! Time for a break.');
      setShowQuote(true);
    } else {
      showNotification('Break Complete!', 'Ready to focus again?');
    }

    // Update progress
    setProgress(prev => {
      const existingDay = prev.find(p => p.date === today);
      if (existingDay) {
        return prev.map(p => 
          p.date === today 
            ? { 
                ...p, 
                pomodoroSessions: type === 'work' ? p.pomodoroSessions + 1 : p.pomodoroSessions,
                focusTime: type === 'work' ? p.focusTime + duration : p.focusTime,
              }
            : p
        );
      } else {
        return [...prev, {
          date: today,
          pomodoroSessions: type === 'work' ? 1 : 0,
          focusTime: type === 'work' ? duration : 0,
          tasksCompleted: 0,
        }];
      }
    });

    // Update active todo's pomodoro count
    if (activeTodoId && type === 'work') {
      setTodos(prev => prev.map(todo =>
        todo.id === activeTodoId
          ? { ...todo, pomodoroSessions: todo.pomodoroSessions + 1 }
          : todo
      ));
    }
  }, [activeTodoId, settings.soundEnabled]);

  const timer = useTimer({
    workDuration: settings.workDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
    longBreakInterval: settings.longBreakInterval,
    onSessionComplete: handleSessionComplete,
    soundEnabled: settings.soundEnabled,
  });

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      pomodoroSessions: 0,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const wasCompleted = todo.completed;
        const nowCompleted = !wasCompleted;
        
        // Update daily progress when task is completed
        if (nowCompleted && !wasCompleted) {
          setProgress(prevProgress => {
            const existingDay = prevProgress.find(p => p.date === today);
            if (existingDay) {
              return prevProgress.map(p => 
                p.date === today 
                  ? { ...p, tasksCompleted: p.tasksCompleted + 1 }
                  : p
              );
            } else {
              return [...prevProgress, {
                date: today,
                pomodoroSessions: 0,
                focusTime: 0,
                tasksCompleted: 1,
              }];
            }
          });
        } else if (!nowCompleted && wasCompleted) {
          // Decrease task count if uncompleting
          setProgress(prevProgress => 
            prevProgress.map(p => 
              p.date === today 
                ? { ...p, tasksCompleted: Math.max(0, p.tasksCompleted - 1) }
                : p
            )
          );
        }
        
        return {
          ...todo,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date() : undefined,
        };
      }
      return todo;
    }));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    if (activeTodoId === id) {
      setActiveTodoId(undefined);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Focus Flow
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Boost your productivity with focused work sessions
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Timer */}
          <div className="lg:col-span-1">
            <PomodoroTimer
              formattedTime={timer.formattedTime}
              state={timer.state}
              currentSession={timer.currentSession}
              progress={timer.progress}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
            />
            
            {activeTodoId && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Currently focusing on:
                </p>
                <p className="text-blue-800 dark:text-blue-200 font-semibold">
                  {todos.find(t => t.id === activeTodoId)?.text}
                </p>
              </div>
            )}
          </div>

          {/* Middle Column - Todo List */}
          <div className="lg:col-span-1">
            <TodoList
              todos={todos}
              onAddTodo={addTodo}
              onToggleTodo={toggleTodo}
              onEditTodo={editTodo}
              onDeleteTodo={deleteTodo}
              activeTodoId={activeTodoId}
              onSetActiveTodo={setActiveTodoId}
            />
          </div>

          {/* Right Column - Progress & Streak */}
          <div className="lg:col-span-1 space-y-8">
            <ProgressChart progress={progress} />
            <ProductivityStreak progress={progress} />
          </div>
        </div>
      </div>

      {/* Motivational Quote Modal */}
      <MotivationalQuote
        showQuote={showQuote}
        onClose={() => setShowQuote(false)}
      />
    </div>
  );
}

export default App;