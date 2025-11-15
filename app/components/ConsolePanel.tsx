'use client';

import { useState } from 'react';
import { useConsoleCapture, ConsoleMessage } from '../hooks/useConsoleCapture';

export default function ConsolePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'log' | 'error' | 'warn'>('all');
  const { messages, clearMessages, logCount, errorCount, warnCount } = useConsoleCapture();

  const filteredMessages = filter === 'all'
    ? messages
    : messages.filter(m => m.type === filter);

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  const getMessageIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors z-50 flex items-center gap-2"
      >
        <span>Console</span>
        {errorCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {errorCount}
          </span>
        )}
      </button>

      {/* Console Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[600px] h-[400px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-semibold">Console Logs</h3>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('log')}
                  className={`px-2 py-1 rounded ${filter === 'log' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Logs ({logCount})
                </button>
                <button
                  onClick={() => setFilter('error')}
                  className={`px-2 py-1 rounded ${filter === 'error' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Errors ({errorCount})
                </button>
                <button
                  onClick={() => setFilter('warn')}
                  className={`px-2 py-1 rounded ${filter === 'warn' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Warnings ({warnCount})
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearMessages}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 bg-gray-700 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
            {filteredMessages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No messages</div>
            ) : (
              filteredMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded bg-gray-800 border-l-2 ${
                    msg.type === 'error' ? 'border-red-500' :
                    msg.type === 'warn' ? 'border-yellow-500' :
                    msg.type === 'info' ? 'border-blue-500' :
                    'border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0">{getMessageIcon(msg.type)}</span>
                    <div className="flex-1">
                      <div className={`${getMessageColor(msg.type)} whitespace-pre-wrap break-words`}>
                        {msg.message}
                      </div>
                      <div className="text-gray-500 text-[10px] mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
