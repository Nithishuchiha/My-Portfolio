import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// PNG frame sequence exported from the original animated SVG.
// Files live under: public/hero/png/<prefix>-0.png … <prefix>-79.png
const PNG_PREFIX = '/hero/png/2c64e40b-9260-4237-a835-c0f89126b878-';
const TOTAL_FRAMES = 80; // 0 … 79
const frameUrl = (idx) => `${PNG_PREFIX}${idx}.png`;

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

  const playheadRef = useRef({ v: 0 });
  const preloadImgsRef = useRef([]);

  const [status, setStatus] = useState('loading');
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);

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
          const bw = imgEl.naturalWidth  || cw;
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
            .catch(() => {/* keep img fallback */})
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
          .catch(() => {})
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

  // ── 3. GSAP ScrollTrigger + panel entrance animation ──────────────────────
  useEffect(() => {
    if (status !== 'ready' || !introDone) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const panel = panelRef.current;
    if (!section || !pin) return;

    // Entrance animation for the content panel
    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, x: 60, filter: 'blur(12px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', delay: 0.15 }
      );
    }

    const endDistance = Math.min((TOTAL_FRAMES - READY_FRAME) * 40, 3600);

    const gsapCtx = gsap.context(() => {
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${endDistance}`,
            // Lower scrub = less interpolation lag → snappier frame response
            scrub: 0.12,
            pin,
            anticipatePin: 1,
            fastScrollEnd: true,
            onUpdate: (self) => {
              const span = (TOTAL_FRAMES - 1) - READY_FRAME;
              const idx = Math.round(READY_FRAME + self.progress * span);
              showFrame(idx);
            },
          },
        }
      );
    }, section);

    return () => gsapCtx.revert();
  }, [status, introDone]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="home"
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}
    >
      <div
        ref={pinRef}
        style={{
          minHeight: '100vh',
          width: '100vw',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
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
            // Promote to its own GPU compositor layer
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {/* ── Light-to-clear vignette so right panel stays readable ───── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'linear-gradient(to right, rgba(246,250,255,0.00) 35%, rgba(246,250,255,0.55) 70%, rgba(246,250,255,0.88) 100%)',
          }}
        />

        {/* ── Right-side glassmorphic content panel ───────────────────── */}
        {status === 'ready' && introDone && (
          <div
            ref={panelRef}
            data-hero-panel
            style={{
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
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.4rem' }}>
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

            {/* Hi greeting */}
            <p
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

            {/* Name */}
            <h1
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

            {/* Animated Role */}
            <div style={{ minHeight: '2rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <span
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
                {ROLES[roleIdx]}
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(to right, rgba(11,18,32,0.14), transparent)',
                marginBottom: '1.5rem',
              }}
            />

            {/* Scroll prompt */}
            <div
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
              Scroll to explore the animation
            </div>
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

        /* Mobile: stack panel at bottom center */
        @media (max-width: 700px) {
          #home [data-hero-panel] {
            margin-right: 0 !important;
            max-width: 100% !important;
            margin: 0 1rem 3rem !important;
            align-self: flex-end !important;
          }
        }
      `}</style>
    </section>
  );
}
