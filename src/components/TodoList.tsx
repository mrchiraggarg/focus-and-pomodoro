import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2, Timer } from 'lucide-react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
  onDeleteTodo: (id: string) => void;
  activeTodoId?: string;
  onSetActiveTodo: (id: string | undefined) => void;
}

export function TodoList({
  todos,
  onAddTodo,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  activeTodoId,
  onSetActiveTodo,
}: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      onEditTodo(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tasks</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              activeTodoId === todo.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
            }`}
          >
            {editingId === todo.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors duration-200"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3" />}
                </button>
                
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
                
                {todo.pomodoroSessions > 0 && (
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Timer className="w-4 h-4" />
                    {todo.pomodoroSessions}
                  </span>
                )}
                
                <div className="flex gap-1">
                  <button
                    onClick={() => onSetActiveTodo(activeTodoId === todo.id ? undefined : todo.id)}
                    className={`p-1 rounded transition-colors duration-200 ${
                      activeTodoId === todo.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                    }`}
                    title={activeTodoId === todo.id ? 'Stop tracking' : 'Track with Pomodoro'}
                  >
                    <Timer className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(todo)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks yet. Add one above to get started!
          </div>
        )}
      </div>
    </div>
  );
}