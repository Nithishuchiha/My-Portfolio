import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useScramble from '../hooks/useScramble';
import { asset } from '../lib/basepath';
import HeroParticles from './HeroParticles';
import HeroStats from './HeroStats';
import MobileHero from './ui/MobileHero';


// PNG frame sequence exported from the original animated SVG.
// Files live under: public/hero/png/<prefix>-0.png … <prefix>-79.png
const PNG_PREFIX = '/hero/png/2c64e40b-9260-4237-a835-c0f89126b878-';
const frameUrl = (idx) => asset(`${PNG_PREFIX}${idx}.png`);
const TOTAL_FRAMES = 80; // 0 … 79

// Use OffscreenCanvas / ImageBitmap when available for GPU-accelerated decode
const supportsImageBitmap = typeof createImageBitmap === 'function';

// During initial load, quickly preview up to this frame.
const PREVIEW_TARGET_FRAME = 24;

// Once loading is complete, start the hero at this frame.
const READY_FRAME = 19;

const ROLES = ['Full Stack Developer', 'UI/UX Designer', 'Creative Coder'];

export default function HeroCanvas() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);      // replaces <img> for zero-reflow drawing
  const bitmapsRef = useRef([]);       // ImageBitmap cache (GPU-decoded)
  const currentIdxRef = useRef(-1);
  const rafRef = useRef(null);         // pending rAF handle
  const panelRef = useRef(null);
  const photoRef = useRef(null);       // mobile hero photo element

  const playheadRef = useRef({ v: 0 });
  const preloadImgsRef = useRef([]);

  const [status, setStatus] = useState('loading');
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // ── Detect mobile layout ───────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scramble the role label whenever it becomes visible
  const scrambledRole = useScramble(ROLES[roleIdx], roleVisible);

  // ── Show exactly one PNG frame via canvas (zero DOM reflow) ───────────────
  const showFrame = (idx) => {
    idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
    if (idx === currentIdxRef.current) return;
    currentIdxRef.current = idx;

    // Batch into a single rAF so rapid scroll ticks don't queue multiple draws
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bmp = bitmapsRef.current[idx];
      if (bmp) {
        // Resize canvas lazily to match container
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
          canvas.width = canvas.offsetWidth || window.innerWidth;
          canvas.height = canvas.offsetHeight || window.innerHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // cover-fit the bitmap
        const { width: cw, height: ch } = canvas;
        const { width: bw, height: bh } = bmp;
        const scale = Math.max(cw / bw, ch / bh);
        const dx = (cw - bw * scale) / 2;
        const dy = (ch - bh * scale) / 2;
        ctx.drawImage(bmp, dx, dy, bw * scale, bh * scale);
      } else {
        // Fallback: draw from the cached <img> element
        const imgEl = preloadImgsRef.current[idx];
        if (imgEl && imgEl.complete) {
          const { width: cw, height: ch } = canvas;
          canvas.width = canvas.offsetWidth || window.innerWidth;
          canvas.height = canvas.offsetHeight || window.innerHeight;
          const bw = imgEl.naturalWidth || cw;
          const bh = imgEl.naturalHeight || ch;
          const scale = Math.max(cw / bw, ch / bh);
          const dx = (cw - bw * scale) / 2;
          const dy = (ch - bh * scale) / 2;
          ctx.drawImage(imgEl, dx, dy, bw * scale, bh * scale);
        }
      }
      rafRef.current = null;
    });
  };

  // ── 1. Cycle role text ─────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'ready') return;
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setRoleVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, [status]);

  // ── 2. Load frame 0, preview-fast-forward while loading, then settle ──────
  useEffect(() => {
    let cancelled = false;
    let previewTween = null;

    const loaded = new Array(TOTAL_FRAMES).fill(false);
    let loadedCount = 0;

    // Init canvas size
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const markLoaded = (i) => {
      if (loaded[i]) return;
      loaded[i] = true;
      loadedCount += 1;
      if (loadedCount !== TOTAL_FRAMES) return;
      if (cancelled) return;

      // Fully loaded: reveal UI at frame 19 and enable scroll.
      setStatus('ready');

      if (previewTween) previewTween.kill();
      previewTween = null;

      playheadRef.current.v = READY_FRAME;
      showFrame(READY_FRAME);
      setIntroDone(true);
    };

    // Helper: load an image and optionally decode to ImageBitmap
    const loadFrame = (i, onDone) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        if (supportsImageBitmap) {
          createImageBitmap(img)
            .then((bmp) => {
              if (!cancelled) bitmapsRef.current[i] = bmp;
            })
            .catch(() => {/* keep img fallback */ })
            .finally(() => onDone(i));
        } else {
          onDone(i);
        }
      };
      img.onerror = () => { if (!cancelled) onDone(i); };
      img.src = frameUrl(i);
      return img;
    };

    // Load frame 0 first (critical path).
    const first = new Image();
    first.onload = () => {
      if (cancelled) return;
      setFirstFrameLoaded(true);

      // Seed bitmap for frame 0 then show it
      const showAndMark0 = () => {
        playheadRef.current.v = 0;
        showFrame(0);
        markLoaded(0);

        // Fast-forward preview while the rest of frames load.
        if (previewTween) previewTween.kill();
        previewTween = gsap.to(playheadRef.current, {
          v: PREVIEW_TARGET_FRAME,
          duration: 0.75,
          ease: 'none',
          repeat: -1,
          yoyo: true,
          onUpdate: () => showFrame(Math.round(playheadRef.current.v)),
        });

        // Preload remaining frames in background
        const imgs = [first];
        for (let i = 1; i < TOTAL_FRAMES; i += 1) {
          imgs.push(loadFrame(i, markLoaded));
        }
        preloadImgsRef.current = imgs;
      };

      if (supportsImageBitmap) {
        createImageBitmap(first)
          .then((bmp) => { if (!cancelled) bitmapsRef.current[0] = bmp; })
          .catch(() => { })
          .finally(showAndMark0);
      } else {
        showAndMark0();
      }
    };
    first.onerror = (err) => {
      console.error('PNG first-frame load failed:', err);
      if (!cancelled) setStatus('error');
    };
    first.src = frameUrl(0);

    return () => {
      cancelled = true;
      preloadImgsRef.current = [];
      bitmapsRef.current.forEach((bmp) => bmp?.close?.());
      bitmapsRef.current = [];
      if (previewTween) previewTween.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── 3. Cinematic showcase — desktop: wheel/key, mobile: IntersectionObserver ─
  useEffect(() => {
    if (status !== 'ready' || !introDone) return;

    const section = sectionRef.current;
    const panel = panelRef.current;
    if (!section) return;

    // ── Entrance animation for the content panel ───────────────────────────
    if (panel) {
      if (isMobile) {
        // Mobile: slide up from below with spring ease, then stagger children
        gsap.fromTo(
          panel,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 0.85, ease: 'back.out(1.3)', delay: 0.5,
          }
        );
        // Stagger children
        const children = panel.querySelectorAll('[data-hero-child]');
        if (children.length > 0) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.07, delay: 0.7 }
          );
        }

        // Photo entrance: scale up from 1.08 + fade in
        const photo = photoRef.current;
        if (photo) {
          gsap.fromTo(
            photo,
            { opacity: 0, scale: 1.1, y: -10 },
            { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 }
          );
        }
      } else {
        // Desktop: slide in from right
        gsap.fromTo(
          panel,
          { opacity: 0, x: 60, filter: 'blur(12px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', delay: 0.15 }
        );
      }
    }

    let played = false;
    let animating = false;
    let showcaseTween = null;

    const progressFill = section.querySelector('[data-hero-progress-fill]');
    const scrollHint = section.querySelector('[data-hero-scroll-hint]');
    const continueNudge = section.querySelector('[data-hero-continue]');

    const heroIsAtTop = () => Math.abs(section.getBoundingClientRect().top) < 8;

    const playShowcase = () => {
      if (played) return;
      played = true;
      animating = true;

      if (scrollHint) {
        gsap.to(scrollHint, { opacity: 0, y: -8, duration: 0.4, ease: 'power2.in' });
      }

      showcaseTween = gsap.to(playheadRef.current, {
        v: TOTAL_FRAMES - 1,
        duration: 3.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          showFrame(Math.round(playheadRef.current.v));
          if (progressFill) {
            const span = (TOTAL_FRAMES - 1) - READY_FRAME;
            const pct = Math.min(((playheadRef.current.v - READY_FRAME) / span) * 100, 100);
            progressFill.style.width = `${pct}%`;
          }
        },
        onComplete: () => {
          animating = false;
          if (progressFill?.parentElement) {
            gsap.to(progressFill.parentElement, { opacity: 0, duration: 0.6, delay: 0.4 });
          }
          if (continueNudge) {
            gsap.fromTo(
              continueNudge,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 }
            );
          }
        },
      });
    };

    let cleanup = () => { };

    if (isMobile) {
      // ── Mobile: auto-play via IntersectionObserver ─────────────────────
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !played) {
              playShowcase();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(section);
      cleanup = () => { showcaseTween?.kill(); observer.disconnect(); };
    } else {
      // ── Desktop: wheel / touch / keyboard ─────────────────────────────
      const onWheel = (e) => {
        if (!heroIsAtTop()) return;
        if (played && !animating) return;
        e.preventDefault();
        if (!played && e.deltaY > 0) playShowcase();
      };

      let touchStartY = 0;
      const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
      const onTouchMove = (e) => {
        if (!heroIsAtTop()) return;
        if (played && !animating) return;
        const swipingDown = touchStartY - e.touches[0].clientY > 4;
        e.preventDefault();
        if (!played && swipingDown) playShowcase();
      };

      const onKey = (e) => {
        if (!heroIsAtTop()) return;
        if (played && !animating) return;
        if (e.code === 'Space' || e.code === 'ArrowDown') {
          e.preventDefault();
          if (!played) playShowcase();
        }
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('keydown', onKey);

      cleanup = () => {
        showcaseTween?.kill();
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('keydown', onKey);
      };
    }

    return cleanup;
  }, [status, introDone, isMobile]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="home"
      ref={sectionRef}
      style={{ position: 'relative', minHeight: isMobile ? 'unset' : '100vh', background: isMobile ? 'transparent' : 'var(--bg)', overflow: isMobile ? 'visible' : 'hidden' }}
    >
      <div
        ref={pinRef}
        style={{
          minHeight: '100dvh',
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: isMobile ? 'stretch' : 'flex-end',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: isMobile ? 'visible' : 'unset',
        }}
      >
        {/* Ensure hero flipbook fully owns its background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg)',
            zIndex: -1,
          }}
        />

        {/* ── Loading overlay ───────────────────────────────────────────── */}
        {status === 'loading' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              background: 'linear-gradient(180deg, rgba(246,250,255,0.55), rgba(234,244,255,0.65))',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px var(--accent-glow)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                color: 'rgba(11,18,32,0.55)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'Inter,sans-serif',
              }}
            >
              Loading cinematic sequence…
            </span>
          </div>
        )}

        {status === 'error' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,80,80,0.8)',
              fontFamily: 'Inter,sans-serif',
              fontSize: '0.9rem',
            }}
          >
            Failed to load cinematic sequence.
          </div>
        )}

        {status === 'ready' && !introDone && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(246,250,255,0.45), rgba(234,244,255,0.58))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 19,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Full-screen PNG flipbook via canvas (GPU-composited) ─────── */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: firstFrameLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: 0,
            userSelect: 'none',
            pointerEvents: 'none',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* ── Vignette — adapts direction for mobile ───────────────────── */}
        <div
          aria-hidden="true"
          className="hero-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: isMobile
              ? 'linear-gradient(to bottom, rgba(246,250,255,0.00) 10%, rgba(246,250,255,0.15) 45%, rgba(246,250,255,0.30) 100%)'
              : 'linear-gradient(to right, rgba(246,250,255,0.00) 35%, rgba(246,250,255,0.55) 70%, rgba(246,250,255,0.88) 100%)',
          }}
        />

        {/* ── Floating decorative particles (desktop only) ─────────────── */}
        {!isMobile && <HeroParticles />}


        {/* ── Mobile full-screen hero — rendered as its own layer ────────── */}
        {isMobile && status === 'ready' && introDone && (
          <MobileHero />
        )}

        {/* ── Content panel — desktop: right float only ─────────────────── */}
        {!isMobile && status === 'ready' && introDone && (
          <div
            ref={panelRef}
            data-hero-panel
            style={{
              // ── Desktop styles ─────────────────────────────────────────
              position: 'relative',
              zIndex: 5,
              marginRight: 'clamp(2rem, 6vw, 7rem)',
              maxWidth: '420px',
              width: '100%',
              padding: 'clamp(2rem, 3.5vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(11,18,32,0.12)',
              borderRadius: '24px',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.35), 0 24px 70px rgba(7,129,245,0.18), 0 20px 50px rgba(11,18,32,0.14)',
            }}
          >
            <>
                {/* ── Desktop content ─────────────────────────────────────── */}
                <div data-hero-child style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.4rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '28px',
                      height: '2px',
                      background: 'var(--accent, #39FF14)',
                      boxShadow: '0 0 8px var(--accent, #39FF14)',
                      borderRadius: '2px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'var(--accent, #39FF14)',
                      fontFamily: 'Inter,sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Portfolio
                  </span>
                </div>

                <p
                  data-hero-child
                  style={{
                    margin: '0 0 0.25rem 0',
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                    color: 'rgba(11,18,32,0.60)',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                  }}
                >
                  Hi, I'm
                </p>

                <h1
                  data-hero-child
                  style={{
                    margin: '0 0 0.75rem 0',
                    fontFamily: 'Outfit, Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(2.8rem, 5vw, 4rem)',
                    lineHeight: 1.0,
                    letterSpacing: '-0.03em',
                    color: 'var(--text)',
                    textShadow: '0 18px 50px rgba(7,129,245,0.14)',
                  }}
                >
                  Nithish
                </h1>

                <div style={{ minHeight: '2rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
                  <span
                    data-hero-child
                    style={{
                      display: 'inline-block',
                      fontFamily: 'Outfit, Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      letterSpacing: '-0.01em',
                      background: 'linear-gradient(135deg, var(--text) 25%, var(--accent, #39FF14) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      opacity: roleVisible ? 1 : 0,
                      transform: roleVisible ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                  >
                    {scrambledRole}
                  </span>
                </div>

                <div
                  data-hero-child
                  style={{
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(11,18,32,0.14), transparent)',
                    marginBottom: '1.2rem',
                  }}
                />

                {/* Desktop stats */}
                <div data-hero-child style={{ marginBottom: '1.2rem' }}>
                  <HeroStats />
                </div>

                {/* Desktop scroll prompt */}
                <div
                  data-hero-scroll-hint
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(11,18,32,0.55)',
                    fontFamily: 'Inter,sans-serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  <div
                    style={{
                      width: '1.5px',
                      height: '32px',
                      background: 'linear-gradient(to bottom, var(--accent, #39FF14), transparent)',
                      animation: 'scrollHint 1.8s ease-in-out infinite',
                      flexShrink: 0,
                    }}
                  />
                  Let's discuss about our requirement
                </div>

                {/* Desktop continue nudge */}
                <div
                  data-hero-continue
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '0.8rem',
                    color: 'rgba(11,18,32,0.55)',
                    fontFamily: 'Inter,sans-serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ animation: 'bounceDown 1.5s ease-in-out infinite' }}
                  >
                    <path
                      d="M8 3v10M4 9l4 4 4-4"
                      stroke="var(--accent,#39FF14)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Continue scrolling
                </div>
            </>
          </div>
        )}

        {/* ── Cinematic progress bar (bottom edge of section) ──────────── */}
        {status === 'ready' && introDone && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(11,18,32,0.08)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              data-hero-progress-fill
              style={{
                height: '100%',
                width: '0%',
                background:
                  'linear-gradient(to right, var(--accent,#39FF14), rgba(var(--accent-rgb,57,255,20),0.55))',
                boxShadow: '0 0 14px var(--accent-glow, rgba(57,255,20,0.45))',
                borderRadius: '0 2px 2px 0',
                transition: 'width 0.06s linear',
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { transform:scale(1);   opacity:0.4; }
          50%      { transform:scale(1.5); opacity:1;   }
        }
        @keyframes scrollHint {
          0%,100% { opacity:.4; transform:translateY(0); }
          50%      { opacity:1;  transform:translateY(8px); }
        }
        @keyframes bounceDown {
          0%,100% { transform:translateY(0);   opacity:0.7; }
          50%      { transform:translateY(4px); opacity:1;   }
        }
        @keyframes photoFloat {
          0%,100% { transform:scale(1.00) translateY(0px); }
          50%      { transform:scale(1.03) translateY(-6px); }
        }
        @keyframes shimmerSweep {
          0%   { transform:translateX(-120%); opacity:1; }
          100% { transform:translateX(120%);  opacity:0; }
        }
        @keyframes orbDrift {
          0%,100% { transform:translate(0,0); }
          40%      { transform:translate(8px,-12px); }
          70%      { transform:translate(-6px,8px); }
        }

        /* On mobile: hide canvas + vignette — MobileHero owns the full screen */
        @media (max-width: 700px) {
          #home canvas { display: none !important; }
          #home .hero-vignette { display: none !important; }
          [data-hero-panel] { display: none !important; }
        }

      `}</style>
    </section>
  );
}
