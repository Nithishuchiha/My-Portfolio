import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const stats = [
  { label: 'Years Experience', value: 3, suffix: '+' },
  { label: 'Projects Built', value: 11, suffix: '+' },
  { label: 'Technologies', value: 20, suffix: '+' },
];

export default function HeroStats() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const proxy = { v: 0 };
    gsap.to(proxy, {
      v: 1,
      duration: 2,
      ease: 'power3.out',
      delay: 0.8,
      onUpdate: () => {
        setCounts(stats.map(s => Math.round(s.value * proxy.v)));
      },
    });
  }, []);

  return (
    <div
      data-hero-child
      style={{
        display: 'flex',
        gap: 'clamp(1.2rem, 5vw, 2rem)',
        flexWrap: 'wrap',
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontFamily: 'Outfit, Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
              lineHeight: 1,
              color: 'var(--accent)',
              textShadow: '0 0 14px var(--accent-glow)',
            }}
          >
            {counts[i]}{s.suffix}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.6rem',
              color: 'rgba(11,18,32,0.48)',
              letterSpacing: '0.04em',
              fontWeight: 500,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
