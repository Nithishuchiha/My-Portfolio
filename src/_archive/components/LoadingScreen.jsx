import { useEffect, useState } from 'react';

const HERO_FRAMES = Array.from({ length: 8 }, (_, i) => `/hero/hero-${i + 1}.png`);

export default function LoadingScreen({ onComplete }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Preload hero frames so the flipbook hero swaps instantly on scroll.
    const imgs = HERO_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const completeTimer = setTimeout(() => onComplete?.(), 3000);
    return () => {
      // Keep a reference until unmount to avoid aggressive GC in some browsers.
      void imgs;
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background:
          'radial-gradient(900px 500px at 30% 30%, rgba(var(--accent-rgb), 0.14), transparent 60%), radial-gradient(700px 450px at 70% 60%, rgba(var(--accent-rgb), 0.08), transparent 60%), #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: fading ? 0 : 1,
        transform: fading ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          background:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10) 0 2px, transparent 3px) 0 0/42px 42px, radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0 1px, transparent 2px) 0 0/56px 56px',
          filter: 'blur(0.2px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 800,
            color: 'var(--accent)',
            letterSpacing: '-0.02em',
            marginBottom: '2rem',
            textShadow: '0 0 40px var(--accent-glow)',
          }}
        >
          N
        </h1>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <span className="bounce-dot" />
          <span className="bounce-dot" />
          <span className="bounce-dot" />
        </div>
      </div>
    </div>
  );
}
