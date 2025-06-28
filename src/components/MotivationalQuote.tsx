import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../utils/quotes';

interface MotivationalQuoteProps {
  showQuote: boolean;
  onClose: () => void;
}

export function MotivationalQuote({ showQuote, onClose }: MotivationalQuoteProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (showQuote) {
      setQuote(getRandomQuote());
    }
  }, [showQuote]);

  const handleNewQuote = () => {
    setQuote(getRandomQuote());
  };

  if (!showQuote) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="text-center">
          <div className="mb-6">
            <Quote className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Great Work!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {quote}
            </p>
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={handleNewQuote}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              New Quote
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}