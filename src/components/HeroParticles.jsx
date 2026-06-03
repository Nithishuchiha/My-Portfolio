import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';

const COUNT = 10;

const particles = Array.from({ length: COUNT }, (_, i) => {
  const angle = (i / COUNT) * Math.PI * 2;
  const radius = 20 + Math.random() * 35;
  return {
    id: i,
    size: 2.5 + (i % 4) * 1.5,
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
    dx: (Math.random() - 0.5) * 50,
    dy: (Math.random() - 0.5) * 50,
    dur: 14 + Math.random() * 18,
    delay: Math.random() * 4,
    opacity: 0.12 + (i % 5) * 0.05,
  };
});

function HeroParticles() {
  const refs = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tweens = refs.current.map((el, i) => {
      if (!el) return null;
      const p = particles[i];
      return gsap.to(el, {
        x: `+=${p.dx}`,
        y: `+=${p.dy}`,
        opacity: p.opacity * 0.3,
        scale: 0.5,
        duration: p.dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: p.delay,
      });
    });

    return () => tweens.forEach(t => t?.kill());
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={el => { refs.current[i] = el; }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent-glow)',
            opacity: p.opacity,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
        />
      ))}
    </div>
  );
}

export default memo(HeroParticles);
