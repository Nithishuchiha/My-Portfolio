/**
 * PageTransition.jsx
 *
 * A full-viewport overlay that plays a cinematic wipe whenever a nav link is
 * clicked.  The animation is driven purely by GSAP so it's silky-smooth even
 * on mid-tier hardware.
 *
 * Usage
 * -----
 * Render <PageTransition /> once at the top level (inside App).
 * Fire the transition from anywhere with:
 *
 *   import { firePageTransition } from './PageTransition';
 *   firePageTransition(() => { /* run at midpoint *\/ });
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ── Shared trigger so any component can kick off the wipe ─────────────────────
let _triggerFn = null;
export const firePageTransition = (cb) => {
  if (_triggerFn) _triggerFn(cb);
  else if (cb) setTimeout(cb, 0);
};

export default function PageTransition() {
  const barRef  = useRef(null);   // top accent progress bar
  const wipeRef = useRef(null);   // full-screen wipe panel
  const activeTlRef = useRef(null);

  useEffect(() => {
    const bar  = barRef.current;
    const wipe = wipeRef.current;
    if (!bar || !wipe) return;

    // Register the trigger so callers can fire it
    _triggerFn = (onMidpoint) => {
      // Avoid stacking timelines if the user clicks rapidly.
      activeTlRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (activeTlRef.current === tl) activeTlRef.current = null;
        },
      });
      activeTlRef.current = tl;

      // 1. Wipe in from left → full width
      tl.fromTo(
        wipe,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.38, ease: 'power3.inOut' }
      );

      // 2. At midpoint fire the scroll / section jump
      tl.call(() => { if (onMidpoint) onMidpoint(); });

      // 3. Wipe out to the right
      tl.to(wipe, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.34,
        ease: 'power3.inOut',
      });

      // 4. Top progress bar in parallel
      gsap.fromTo(
        bar,
        { width: '0%', opacity: 1 },
        {
          width: '100%',
          duration: 0.72,
          ease: 'power2.inOut',
          onComplete: () => gsap.to(bar, { opacity: 0, duration: 0.22 }),
        }
      );
    };

    return () => {
      _triggerFn = null;
      activeTlRef.current?.kill();
      activeTlRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Top progress bar — starts hidden */}
      <div
        aria-hidden="true"
        ref={barRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: '0%',
          opacity: 0,
          zIndex: 9999,
          background:
            'linear-gradient(to right, var(--accent,#39FF14), rgba(var(--accent-rgb,57,255,20),0.5))',
          boxShadow: '0 0 12px var(--accent-glow,rgba(57,255,20,0.4))',
          pointerEvents: 'none',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Full-screen wipe panel — transform:scaleX(0) hides it completely */}
      <div
        aria-hidden="true"
        ref={wipeRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          /* Solid accent-tinted panel — NO backdropFilter so it never blurs content */
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb,57,255,20),0.12) 0%, rgba(246,250,255,0.97) 100%)',
          borderRight: '1.5px solid rgba(var(--accent-rgb,57,255,20),0.35)',
          pointerEvents: 'none',
          /* Start fully collapsed so it never covers the screen on mount */
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />
    </>
  );
}
