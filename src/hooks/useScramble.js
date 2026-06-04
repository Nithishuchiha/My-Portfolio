import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

/**
 * useScramble(text, active)
 *
 * While `active` is false → returns target text as-is.
 * When `active` flips to true → runs a scramble animation that resolves
 * the string character-by-character from left to right over ~600 ms,
 * then returns the final text.
 */
export default function useScramble(text, active) {
  const [display, setDisplay] = useState(text);
  const rafRef   = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    frameRef.current = 0;
    const TOTAL = 50; // total animation frames

    const tick = () => {
      frameRef.current += 1;
      const f = frameRef.current;
      const progress = f / TOTAL;
      const resolved = Math.floor(progress * text.length);

      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < resolved) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (f < TOTAL) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text); // guarantee exact final text
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, active]);

  return display;
}
