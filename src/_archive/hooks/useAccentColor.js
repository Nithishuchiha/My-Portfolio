import { useState, useEffect, useCallback } from 'react';

export default function useAccentColor() {
  const [accent, setAccentState] = useState(() => {
    try {
      return localStorage.getItem('portfolio-accent') || 'green';
    } catch {
      return 'green';
    }
  });

  const setAccent = useCallback((newAccent) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem('portfolio-accent', newAccent);
    } catch {
      // localStorage unavailable
    }
    document.documentElement.setAttribute('data-accent', newAccent);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  return [accent, setAccent];
}
