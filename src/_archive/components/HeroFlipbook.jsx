import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_FRAMES = Array.from({ length: 8 }, (_, i) => `/hero/hero-${i + 1}.png`);
// 4 key frames for mobile to reduce work.
const MOBILE_FRAMES = ['/hero/hero-1.png', '/hero/hero-3.png', '/hero/hero-5.png', '/hero/hero-8.png'];

const STAGES = [
  {
    id: 'intro',
    eyebrow: 'Hello, I am',
    title: 'Nithish',
    body: 'Developer. Designer. Creator.',
  },
  {
    id: 'ui',
    eyebrow: 'I build',
    title: 'Beautiful UI',
    body: 'Motion-forward interfaces that feel fast and intentional.',
  },
  {
    id: 'ship',
    eyebrow: 'I ship',
    title: 'Real Products',
    body: 'Clean code, practical decisions, and performance that holds up.',
  },
  {
    id: 'work',
    eyebrow: 'Scroll for',
    title: 'My Work',
    body: 'Projects, experiments, and a few things I am proud of.',
  },
];

export default function HeroFlipbook() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const imgRef = useRef(null);
  const stageRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const img = imgRef.current;
    if (!section || !pin || !img) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 767px)',
          desktop: '(min-width: 768px)',
        },
        (context) => {
          if (context.conditions?.reduceMotion) {
            img.src = DESKTOP_FRAMES[0];
            stageRefs.current.forEach((el, i) => {
              if (!el) return;
              el.style.opacity = i === 0 ? '1' : '0';
              el.style.filter = i === 0 ? 'blur(0px)' : 'blur(10px)';
              el.style.transform = i === 0 ? 'translateY(0px)' : 'translateY(10px)';
            });
            return () => {};
          }

          const frames = context.conditions?.mobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
          const endDistance = context.conditions?.mobile ? 1400 : 2200;

          // Flipbook: update image src based on scroll progress.
          let lastIndex = -1;
          const setFrameFromProgress = (p) => {
            const idx = Math.max(0, Math.min(frames.length - 1, Math.round(p * (frames.length - 1))));
            if (idx === lastIndex) return;
            lastIndex = idx;
            img.src = frames[idx];
          };

          // Stages: scrubbed dissolve-ish transitions (opacity + blur).
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${endDistance}`,
              scrub: true,
              pin: pin,
              anticipatePin: 1,
              onUpdate: (self) => setFrameFromProgress(self.progress),
            },
          });

          // Ensure first frame and first stage are visible.
          setFrameFromProgress(0);
          stageRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, {
              opacity: i === 0 ? 1 : 0,
              y: i === 0 ? 0 : 10,
              filter: i === 0 ? 'blur(0px)' : 'blur(10px)',
            });
          });

          const stageIn = (i, at) => {
            const el = stageRefs.current[i];
            if (!el) return;
            tl.to(
              el,
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.08,
              },
              at,
            );
          };
          const stageOut = (i, at) => {
            const el = stageRefs.current[i];
            if (!el) return;
            tl.to(
              el,
              {
                opacity: 0,
                y: -8,
                filter: 'blur(12px)',
                duration: 0.08,
              },
              at,
            );
          };

          // Spread 4 stages across the scroll.
          const stops = [0, 0.25, 0.5, 0.75, 1];
          for (let i = 0; i < 4; i++) {
            stageIn(i, stops[i] + 0.02);
            if (i > 0) stageOut(i - 1, stops[i] + 0.02);
          }
          // Keep last stage visible at end.
          stageIn(3, 0.76);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        ref={pinRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 4rem)',
          position: 'relative',
        }}
      >
        {/* Subtle background wash */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(900px 500px at 20% 30%, rgba(var(--accent-rgb), 0.10), transparent 60%), radial-gradient(800px 500px at 80% 60%, rgba(var(--accent-rgb), 0.06), transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        <div
          data-hero-grid
          style={{
            width: 'min(1100px, 100%)',
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 'clamp(1.25rem, 3vw, 3rem)',
            alignItems: 'center',
          }}
        >
          {/* Left: Flipbook frame */}
          <div
            className="glass-strong"
            style={{
              borderRadius: '28px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '4 / 3',
              minHeight: 'clamp(260px, 42vh, 520px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 120px rgba(0,0,0,0.65)',
            }}
          >
            <img
              ref={imgRef}
              src={DESKTOP_FRAMES[0]}
              alt="Hero visual"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: 'scale(1.02)',
                filter: 'saturate(1.05) contrast(1.02)',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.45) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Right: Scrubbed stage text */}
          <div style={{ position: 'relative', minHeight: '220px' }}>
            {STAGES.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: i === 0 ? 'auto' : 0,
                  opacity: i === 0 ? 1 : 0,
                  pointerEvents: i === 3 ? 'auto' : 'none',
                  willChange: 'opacity, transform, filter',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    color: 'var(--text-dim)',
                    marginBottom: '0.9rem',
                  }}
                >
                  {s.eyebrow}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    color: 'var(--accent)',
                    textShadow:
                      '0 0 60px var(--accent-glow), 0 0 120px rgba(var(--accent-rgb), 0.12)',
                    marginBottom: '0.9rem',
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-dim)',
                    fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                    lineHeight: 1.7,
                    maxWidth: '40ch',
                  }}
                >
                  {s.body}
                </div>

                {i === 3 && (
                  <div style={{ marginTop: '1.6rem' }}>
                    <a
                      href="#projects"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        display: 'inline-block',
                        padding: '0.85rem 2.5rem',
                        border: '1px solid var(--accent)',
                        borderRadius: '999px',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                        background: 'rgba(var(--accent-rgb), 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent)';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.05)';
                        e.currentTarget.style.color = 'var(--accent)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      View My Work
                    </a>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile-only layout fix */}
            <style>
              {`@media (max-width: 767px) {
                #home [data-hero-grid] { grid-template-columns: 1fr !important; }
              }`}
            </style>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '30px',
              background: 'linear-gradient(to bottom, var(--accent), transparent)',
              animation: 'heroScrollHint 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>
        {`@keyframes heroScrollHint { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(8px); opacity: 1; } }`}
      </style>
    </section>
  );
}
