import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * WaterCursor
 *
 * On every mousemove a ripple element is pulled from a fixed DOM pool,
 * snapped to the pointer, then GSAP-animated:
 *
 *   scale  0.05  →  1          (ring expands outward)
 *   blur   0 px  →  14 px      (gets increasingly watery/diffuse)
 *   opacity 0.65 →  0          (fades away)
 *
 * A tiny sharp dot always follows the cursor exactly.
 * Touch / coarse-pointer devices: nothing rendered.
 */

const POOL_SIZE          = 22;   // number of reusable ripple divs
const RIPPLE_DURATION    = 1.2;   // seconds for a single ripple to die
const SPAWN_THROTTLE_MS  = 20;   // min ms between spawns (≈50 fps of ripples)

export default function WaterCursor() {
  const dotRef      = useRef(null);
  const poolRef     = useRef([]);   // array of div refs
  const poolIdxRef  = useRef(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const dot  = dotRef.current;
    const pool = poolRef.current;
    if (!dot || !pool.length) return;

    // quickTo for the dot — zero-lag snap
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.04 });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.04 });

    const spawnRipple = (x, y) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return;
      lastSpawnRef.current = now;

      // Round-robin through the pool
      const el = pool[poolIdxRef.current % POOL_SIZE];
      poolIdxRef.current += 1;

      // Kill any live tween on this element so we can restart it cleanly
      gsap.killTweensOf(el);

      // Snap to position instantly (no transform-origin offset tricks needed
      // because the element is already centred via translate(-50%,-50%))
      gsap.set(el, {
        x,
        y,
        scale: 0.06,
        opacity: 0.92,
        filter: 'blur(0px)',
        display: 'block',
      });

      // Animate outward — water ripple expanding & blurring away
      gsap.to(el, {
        scale: 1,
        opacity: 0,
        filter: 'blur(18px)',
        duration: RIPPLE_DURATION,
        ease: 'power2.out',
        onComplete: () => gsap.set(el, { display: 'none' }),
      });
    };

    const onMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      spawnRipple(e.clientX, e.clientY);
    };

    const onLeave = () => gsap.to(dot, { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to(dot, { opacity: 1, duration: 0.3 });

    // Press — dot squish
    const onDown = () => gsap.to(dot, { scale: 0.5, duration: 0.15, ease: 'power2.out' });
    const onUp   = () => gsap.to(dot, { scale: 1,   duration: 0.5,  ease: 'elastic.out(1.4, 0.5)' });

    window.addEventListener('mousemove',    onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
    document.addEventListener('mouseenter', onEnter, { passive: true });
    window.addEventListener('mousedown',    onDown,  { passive: true });
    window.addEventListener('mouseup',      onUp,    { passive: true });

    return () => {
      window.removeEventListener('mousemove',    onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown',    onDown);
      window.removeEventListener('mouseup',      onUp);
      gsap.killTweensOf([dot, ...pool]);
    };
  }, []);

  // Touch / coarse devices → no cursor overlay
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const centred = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    willChange: 'transform, opacity, filter',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      {/* ── Ripple pool ─────────────────────────────────────────────────── */}
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) poolRef.current[i] = el; }}
          aria-hidden="true"
          style={{
            ...centred,
            display: 'none',
            zIndex: 99998,
            width: 140,
            height: 140,
            borderRadius: '50%',
            // Bright water ring + vivid radial fill
            border: '2px solid rgba(var(--accent-rgb), 0.95)',
            background:
              'radial-gradient(circle, rgba(var(--accent-rgb), 0.40) 0%, rgba(var(--accent-rgb), 0.18) 45%, transparent 75%)',
            boxShadow:
              '0 0 28px 10px rgba(var(--accent-rgb), 0.55), inset 0 0 20px 4px rgba(var(--accent-rgb), 0.25)',
          }}
        />
      ))}

      {/* ── Sharp dot — always at exact pointer position ─────────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...centred,
          zIndex: 99999,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 18px 6px var(--accent-glow), 0 0 40px 10px rgba(var(--accent-rgb), 0.35)',
          opacity: 0,
        }}
      />
    </>
  );
}
