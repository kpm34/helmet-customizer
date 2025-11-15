/**
 * useConsoleCapture Hook
 * Automatically captures console.log, console.error, console.warn messages
 * and stores them in state for display in the UI
 */

import { useEffect, useState } from 'react';

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
  args: any[];
}

interface UseConsoleCaptureOptions {
  enabled?: boolean;
  maxMessages?: number;
  filter?: (message: ConsoleMessage) => boolean;
}

export function useConsoleCapture(options: UseConsoleCaptureOptions = {}) {
  const { enabled = true, maxMessages = 100, filter } = options;
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    // Helper to add message to state
    const addMessage = (type: ConsoleMessage['type'], args: any[]) => {
      const message: ConsoleMessage = {
        type,
        message: args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: Date.now(),
        args,
      };

      // Apply filter if provided
      if (filter && !filter(message)) {
        return;
      }

      setMessages(prev => {
        const updated = [...prev, message];
        // Keep only the last maxMessages
        return updated.slice(-maxMessages);
      });
    };

    // Override console methods
    console.log = (...args) => {
      originalLog(...args);
      addMessage('log', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addMessage('error', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addMessage('warn', args);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addMessage('info', args);
    };

    // Cleanup: restore original console methods
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    };
  }, [enabled, maxMessages, filter]);

  const clearMessages = () => setMessages([]);

  const getMessagesByType = (type: ConsoleMessage['type']) =>
    messages.filter(m => m.type === type);

  const searchMessages = (query: string) =>
    messages.filter(m => m.message.toLowerCase().includes(query.toLowerCase()));

  return {
    messages,
    clearMessages,
    getMessagesByType,
    searchMessages,
    logCount: messages.filter(m => m.type === 'log').length,
    errorCount: messages.filter(m => m.type === 'error').length,
    warnCount: messages.filter(m => m.type === 'warn').length,
  };
}
