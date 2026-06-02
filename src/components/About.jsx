import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

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
  Languages: ['Java', 'C++', 'JavaScript', 'SQL'],
  Frameworks: ['Spring Boot', 'React', 'Next.js', 'Node.js', 'Tailwind CSS'],
  Tools: ['Git', 'Figma', 'MySQL', 'Supabase'],
  'AI & Prompting': ['ChatGPT', 'Claude', 'Gemini', 'Prompt Engineering', 'Antigravity', 'OpenCode'],
};

export default function About() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bitmapsRef = useRef([]);
  const imgsRef = useRef([]);
  const currentIdxRef = useRef(-1);
  const rafRef = useRef(null);

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
      const w = canvas.offsetWidth || window.innerWidth;
      const h = canvas.offsetHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const bmp = bitmapsRef.current[idx];
      const src = bmp || imgsRef.current[idx];
      if (!src) return;

      const { width: cw, height: ch } = canvas;
      const bw = bmp ? bmp.width : src.naturalWidth || cw;
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
      canvas.width = window.innerWidth;
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
            .catch(() => { })
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

  // ── Auto-play all frames like a video when section enters viewport ───────
  useEffect(() => {
    if (!loaded) return;

    const section = sectionRef.current;
    if (!section) return;

    let played = false;
    let tween = null;
    const playhead = { v: 0 };

    const play = () => {
      if (played) return;
      played = true;

      // Play from frame 0 → last frame over 5 s, then hold on the final frame
      showFrame(0);
      tween = gsap.to(playhead, {
        v: TOTAL_FRAMES - 1,
        duration: 5,
        ease: 'none',      // linear = real video feel
        onUpdate: () => showFrame(Math.round(playhead.v)),
        // No onComplete rewind — final frame stays frozen
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); },
      { threshold: 0.25 }   // fire when 25 % of the section is visible
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [loaded]);


  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)' }}
    >
      <div
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
              I’m a developer‑designer who loves figuring out how things work. I get curious about the “why” behind every challenge, dive deep into research, and craft clean, thoughtful digital experiences. My super‑power? Turning tough problems into simple, elegant solutions. When I’m not coding, I usually do writing, reading, and having great conversations with people around me.
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

            {/* Profile badges row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1.4rem' }}
            >
              {/* GitHub Badge */}
              <motion.a
                href="https://github.com/Nithishuchiha"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 14px rgba(255,255,255,0.06)',
                  transition: 'box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.13)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 0 14px rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub Profile →
              </motion.a>

              {/* LeetCode Badge */}
              <motion.a
                href="https://leetcode.com/u/nithishperumal13062003/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '999px',
                  background: 'rgba(255,185,0,0.10)',
                  border: '1px solid rgba(255,185,0,0.35)',
                  color: '#FFB800',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 14px rgba(255,185,0,0.12)',
                  transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(255,185,0,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255,185,0,0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 0 14px rgba(255,185,0,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255,185,0,0.35)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB800">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
                LeetCode Profile →
              </motion.a>
            </motion.div>
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
