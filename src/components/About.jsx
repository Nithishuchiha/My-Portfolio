import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Frame sequence config ────────────────────────────────────────────────────
const ABOUT_PREFIX = '/about/ezgif-frame-';
const TOTAL_FRAMES = 56; // 001 … 056
const frameUrl = (idx) => {
  // idx is 0-based; files are 001-based with 3-digit zero-padding
  const n = String(idx + 1).padStart(3, '0');
  return `${ABOUT_PREFIX}${n}.png`;
};

// ImageBitmap support detection (GPU-decoded frames)
const supportsImageBitmap = typeof createImageBitmap === 'function';

// Skills data
const SKILLS = {
  Languages:  ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL'],
  Frameworks: ['React', 'Next.js', 'Node.js', 'FastAPI', 'TensorFlow', 'Tailwind CSS'],
  Tools:      ['Git', 'Docker', 'AWS', 'Figma', 'PostgreSQL', 'Redis'],
};

export default function About() {
  const sectionRef   = useRef(null);
  const pinRef       = useRef(null);
  const canvasRef    = useRef(null);
  const bitmapsRef   = useRef([]);
  const imgsRef      = useRef([]);
  const currentIdxRef = useRef(-1);
  const rafRef       = useRef(null);

  const [loaded, setLoaded] = useState(false);

  // ── Draw one frame onto the canvas (rAF-batched) ──────────────────────────
  const showFrame = (idx) => {
    idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
    if (idx === currentIdxRef.current) return;
    currentIdxRef.current = idx;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sync canvas resolution to its CSS size once per rAF
      const w = canvas.offsetWidth  || window.innerWidth;
      const h = canvas.offsetHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }

      const bmp = bitmapsRef.current[idx];
      const src = bmp || imgsRef.current[idx];
      if (!src) return;

      const { width: cw, height: ch } = canvas;
      const bw = bmp ? bmp.width  : src.naturalWidth  || cw;
      const bh = bmp ? bmp.height : src.naturalHeight || ch;

      // cover-fit
      const scale = Math.max(cw / bw, ch / bh);
      const dx = (cw - bw * scale) / 2;
      const dy = (ch - bh * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(src, dx, dy, bw * scale, bh * scale);

      rafRef.current = null;
    });
  };

  // ── Preload all frames ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const doneArr = new Array(TOTAL_FRAMES).fill(false);
    let doneCount = 0;

    // Init canvas dimensions immediately
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const markDone = (i) => {
      if (doneArr[i]) return;
      doneArr[i] = true;
      doneCount += 1;
      if (doneCount === TOTAL_FRAMES && !cancelled) {
        setLoaded(true);
        showFrame(0);
      }
    };

    const loadOne = (i) => {
      const img = new Image();
      imgsRef.current[i] = img;
      img.onload = () => {
        if (cancelled) return;
        if (supportsImageBitmap) {
          createImageBitmap(img)
            .then((bmp) => { if (!cancelled) bitmapsRef.current[i] = bmp; })
            .catch(() => {})
            .finally(() => markDone(i));
        } else {
          markDone(i);
        }
      };
      img.onerror = () => { if (!cancelled) markDone(i); };
      img.src = frameUrl(i);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) loadOne(i);

    return () => {
      cancelled = true;
      imgsRef.current = [];
      bitmapsRef.current.forEach((b) => b?.close?.());
      bitmapsRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── ScrollTrigger pin + scrub once frames are ready ───────────────────────
  useEffect(() => {
    if (!loaded) return;

    const section = sectionRef.current;
    const pin     = pinRef.current;
    if (!section || !pin) return;

    // Scroll distance: ~40px per frame, capped
    const scrollDist = Math.min(TOTAL_FRAMES * 38, 3200);

    const ctx = gsap.context(() => {
      gsap.to({}, {
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     `+=${scrollDist}`,
          scrub:   0.12,
          pin,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (TOTAL_FRAMES - 1));
            showFrame(idx);
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)' }}
    >
      <div
        ref={pinRef}
        style={{
          position: 'relative',
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ── Canvas flipbook background ─────────────────────────────────── */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s ease',
            willChange: 'transform',
            transform: 'translateZ(0)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* ── Loading skeleton ───────────────────────────────────────────── */}
        {!loaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'var(--bg)',
              zIndex: 10,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 10px var(--accent-glow)',
                  animation: `aboutPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* ── Right-side fade vignette so left text stays readable ────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            // strong left gradient so text floats clearly; subtle right
            background:
              'linear-gradient(to right, rgba(11,18,32,0.68) 0%, rgba(11,18,32,0.42) 38%, rgba(11,18,32,0.08) 65%, transparent 100%)',
          }}
        />

        {/* ── Bottom vignette ─────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to top, rgba(11,18,32,0.50), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── Floating left content ──────────────────────────────────────── */}
        {loaded && (
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              marginLeft: 'clamp(2rem, 7vw, 8rem)',
              maxWidth: '460px',
              paddingTop: '2rem',
              paddingBottom: '2rem',
            }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.6rem' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent-glow)',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 0 12px var(--accent-glow)',
                }}
              >
                About Me
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
              style={{
                fontFamily: 'Outfit, Inter, sans-serif',
                fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: '0 0 1.4rem 0',
                color: '#fff',
                textShadow: '0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(0,0,0,0.3)',
              }}
            >
              Who I Am
            </motion.h2>

            {/* Bio paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.2 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.82)',
                margin: '0 0 2.4rem 0',
                textShadow: '0 2px 12px rgba(0,0,0,0.45)',
              }}
            >
              I'm a passionate developer and designer who loves building things
              that live on the internet. I specialize in creating exceptional
              digital experiences with clean code and thoughtful design. When I'm
              not coding, you'll find me exploring new technologies, contributing
              to open-source, or crafting pixel-perfect interfaces.
            </motion.p>

            {/* Thin rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                height: '1px',
                background: 'linear-gradient(to right, rgba(255,255,255,0.25), transparent)',
                transformOrigin: 'left',
                marginBottom: '2rem',
              }}
            />

            {/* Skills */}
            {Object.entries(SKILLS).map(([category, skills], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: 0.38 + catIdx * 0.1 }}
                style={{ marginBottom: '1.4rem' }}
              >
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.67rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    margin: '0 0 0.6rem 0',
                    textShadow: '0 0 10px var(--accent-glow)',
                  }}
                >
                  {category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 22,
                        delay: 0.45 + catIdx * 0.1 + i * 0.04,
                      }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: '0 0 18px var(--accent-glow)',
                        borderColor: 'var(--accent)',
                        color: '#fff',
                      }}
                      style={{
                        display: 'inline-block',
                        padding: '0.38rem 0.95rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif',
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        cursor: 'default',
                        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
                        textShadow: '0 1px 6px rgba(0,0,0,0.35)',
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes aboutPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
      `}</style>
    </section>
  );
}
