import { useEffect } from 'react';

export function useKeyboardShortcut(keys, callback, options = {}) {
  const { preventDefault = true } = options;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMatch = keys.every(key => {
        if (key.toLowerCase() === 'ctrl' || key.toLowerCase() === 'control') return event.ctrlKey;
        if (key.toLowerCase() === 'meta' || key.toLowerCase() === 'cmd') return event.metaKey;
        if (key.toLowerCase() === 'shift') return event.shiftKey;
        if (key.toLowerCase() === 'alt') return event.altKey;
        return event.key.toLowerCase() === key.toLowerCase();
      });

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, preventDefault]);
}