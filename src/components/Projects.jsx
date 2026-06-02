import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { categories } from '../data/projects';
import projectData from '../data/projects';
import { asset } from '../lib/basepath';

// Lazy-load the overlay (kept from old implementation)
const CardOverlay = lazy(() =>
  import('./projects3d/CardOverlay').then((m) => ({ default: m.default }))
);

// ── Frame sequence config ────────────────────────────────────────────────────
const PROJECT_PREFIX = '/project/ezgif-frame-';
const TOTAL_FRAMES = 40;
const frameUrl = (idx) => {
  const n = String(idx + 1).padStart(3, '0');
  return asset(`${PROJECT_PREFIX}${n}.png`);
};

const supportsImageBitmap = typeof createImageBitmap === 'function';

// ── Category card data ───────────────────────────────────────────────────────
const CATEGORY_CARDS = categories.map((cat) => {
  const count = projectData.filter((p) => p.category === cat.key).length;
  const taglines = {
    webdev: 'Full-stack applications & dashboards',
    ai: 'Machine learning & intelligent systems',
    automation: 'Pipelines, scrapers & IoT',
    design: 'UI kits, branding & 3D visuals',
  };
  return {
    ...cat,
    tagline: taglines[cat.key] || '',
    count,
  };
});

const ORBIT_RADIUS = 320; // px from center

// ── SVG Icons (matching the coin texture icons) ──────────────────────────────
function CategoryIcon({ type, color, size = 38 }) {
  const s = size;
  const c = s / 2;

  if (type === 'webdev') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <path d={`M${c - 6} ${c + 8} L${c - 14} ${c} L${c - 6} ${c - 8}`} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${c + 6} ${c + 8} L${c + 14} ${c} L${c + 6} ${c - 8}`} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={c + 3} y1={c - 10} x2={c - 3} y2={c + 10} stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'ai') {
    const nodes = [
      [c, c - 10], [c - 10, c], [c + 10, c],
      [c - 6, c + 10], [c + 6, c + 10], [c, c + 2],
    ];
    const edges = [[0, 1], [0, 2], [1, 5], [2, 5], [1, 3], [2, 4], [5, 3], [5, 4]];
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="1.2" opacity="0.5" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={color} />
        ))}
      </svg>
    );
  }
  if (type === 'automation') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <path
          d={(() => {
            const R = 14, r = 9, teeth = 8;
            let d = '';
            for (let i = 0; i < teeth * 2; i++) {
              const angle = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
              const radius = i % 2 === 0 ? R : r + 2;
              const x = c + Math.cos(angle) * radius;
              const y = c + Math.sin(angle) * radius;
              d += `${i === 0 ? 'M' : 'L'}${x} ${y} `;
            }
            return d + 'Z';
          })()}
          fill={color}
          opacity="0.85"
        />
        <circle cx={c} cy={c} r="5" fill="rgba(11,18,32,0.7)" />
        <circle cx={c} cy={c} r="2.5" fill={color} />
      </svg>
    );
  }
  // design — pen nib
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <path d={`M${c} ${c - 14} L${c + 10} ${c} L${c} ${c + 14} L${c - 10} ${c} Z`} stroke={color} strokeWidth="2" />
      <line x1={c} y1={c - 14} x2={c} y2={c + 14} stroke={color} strokeWidth="1.5" />
      <circle cx={c} cy={c + 14} r="2.5" fill={color} />
      <path d={`M${c} ${c - 14} L${c - 10} ${c} L${c} ${c + 14} Z`} fill={color} opacity="0.18" />
    </svg>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Glassmorphism Category Card ──────────────────────────────────────────────
function OrbitCard({ card, style, onClick }) {
  const rgb = hexToRgb(card.color);

  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        width: '200px',
        height: '260px',
        borderRadius: '20px',
        background: 'rgba(11, 18, 32, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(${rgb}, 0.35)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 20px rgba(${rgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px 18px',
        cursor: 'pointer',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        userSelect: 'none',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(0,0,0,0.3), 0 0 36px rgba(${rgb}, 0.3), inset 0 1px 0 rgba(255,255,255,0.12)`;
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.6)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.25), 0 0 20px rgba(${rgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)`;
        e.currentTarget.style.borderColor = `rgba(${rgb}, 0.35)`;
      }}
    >
      {/* Icon glow circle */}
      <div style={{
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: `rgba(${rgb}, 0.12)`,
        border: `1px solid rgba(${rgb}, 0.3)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 18px rgba(${rgb}, 0.15)`,
      }}>
        <CategoryIcon type={card.icon} color={card.color} size={34} />
      </div>

      {/* Label */}
      <span style={{
        fontFamily: 'Outfit, Inter, sans-serif',
        fontSize: '1.1rem',
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.01em',
        textShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}>
        {card.label}
      </span>

      {/* Tagline */}
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.72rem',
        lineHeight: 1.5,
        color: 'rgba(255,255,255,0.6)',
        textShadow: '0 1px 6px rgba(0,0,0,0.3)',
      }}>
        {card.tagline}
      </span>

      {/* Project count pill */}
      <span style={{
        padding: '4px 14px',
        borderRadius: '999px',
        fontSize: '0.68rem',
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.08em',
        color: card.color,
        background: `rgba(${rgb}, 0.14)`,
        border: `1px solid rgba(${rgb}, 0.3)`,
        textShadow: `0 0 8px rgba(${rgb}, 0.3)`,
      }}>
        {card.count} PROJECT{card.count !== 1 ? 'S' : ''}
      </span>

      {/* Sheen overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ── Main Projects Component ──────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bitmapsRef = useRef([]);
  const imgsRef = useRef([]);
  const currentIdxRef = useRef(-1);
  const rafRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);  // true after frame animation finishes
  const [activeCategory, setActiveCategory] = useState(null);
  const [layoutMode, setLayoutMode] = useState('animating'); // 'animating' | 'unfolding' | 'flat'

  // ── Carousel state ──────────────────────────────────────────────────────
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);
  const angleRef = useRef(-90);  // AI card (index 1, at 90°) faces front: -90 + 90 = 0°
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const autoRotateRef = useRef(true);
  const animFrameRef = useRef(null);

  // Animatable values for each card.
  // detachRotOffset: snapshot of angleRef.current at the moment this card detaches.
  // Used every frame to counter-rotate the card so it always faces the viewer.
  const cardsAnimRef = useRef(
    CATEGORY_CARDS.map((_, i) => ({
      rotY: (i / CATEGORY_CARDS.length) * 360,
      x: 0,
      y: 0,
      z: ORBIT_RADIUS,
      scale: 1,
      opacity: 1,
      detachRotOffset: 0,   // populated at detach time
    }))
  );

  // Pre-computed, frozen flat-layout slot positions (one per card).
  // Set once before any detach begins; never updated during animation.
  const slotsRef = useRef([]);

  // Handle responsiveness in flat mode
  useEffect(() => {
    const handleResize = () => {
      if (layoutMode === 'flat') {
        const w = window.innerWidth;
        const spacing = w < 640 ? 110 : w < 1024 ? 160 : 230;
        const cardScale = w < 640 ? 0.75 : w < 1024 ? 0.85 : 1;
        // Recompute slots and push to both slotsRef and cardsAnimRef so the
        // rAF loop picks up the new positions without a React re-render.
        slotsRef.current = CATEGORY_CARDS.map((_, i) => (i - 1.5) * spacing);
        CATEGORY_CARDS.forEach((_, i) => {
          cardsAnimRef.current[i].x = slotsRef.current[i];
          cardsAnimRef.current[i].scale = cardScale;
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [layoutMode]);

  // ── Draw one frame onto the canvas ────────────────────────────────────
  const showFrame = useCallback((idx) => {
    idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
    if (idx === currentIdxRef.current) return;
    currentIdxRef.current = idx;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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

      const scale = Math.max(cw / bw, ch / bh);
      const dx = (cw - bw * scale) / 2;
      const dy = (ch - bh * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(src, dx, dy, bw * scale, bh * scale);

      rafRef.current = null;
    });
  }, []);

  // ── Preload all frames ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const doneArr = new Array(TOTAL_FRAMES).fill(false);
    let doneCount = 0;

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
  }, [showFrame]);

  // ── Auto-play frames on viewport entry ────────────────────────────────
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
      showFrame(0);
      tween = gsap.to(playhead, {
        v: TOTAL_FRAMES - 1,
        duration: 4,
        ease: 'none',
        onUpdate: () => showFrame(Math.round(playhead.v)),
        onComplete: () => {
          // Character has fully appeared — now reveal the cards
          setCardsReady(true);
        },
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) play(); },
      { threshold: 0.25 }
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [loaded, showFrame]);

  // ── Carousel rotation loop ────────────────────────────────────────────
  // Phase 1 — Full first rotation: all 4 cards orbit together (no detaching).
  // Phase 2 — Second rotation: cards detach in rapid succession (0.30 s stagger,
  //           left → right).  All detach tweens run CONCURRENTLY — the row
  //           assembles progressively rather than one card at a time.
  //
  // Counter-rotation strategy:
  //   At detach moment we snapshot angleRef into anim.detachRotOffset.
  //   Every frame the rAF loop applies:
  //     rotateY(detachRotOffset - angleRef.current)
  //   This cancels the container's continued rotation exactly, keeping the
  //   card facing the viewer without tweening rotY at all.

  // Track which cards have been detached from the orbit.
  const detachedRef = useRef(new Set());

  useEffect(() => {
    if (!cardsReady) return;

    let active = true;
    detachedRef.current = new Set();

    // ── Responsive spacing — computed ONCE, frozen for the whole animation ──
    const w = window.innerWidth;
    const spacing = w < 640 ? 110 : w < 1024 ? 160 : 230;
    const cardScale = w < 640 ? 0.75 : w < 1024 ? 0.85 : 1;

    // Freeze slot positions before any card moves.  These never change during
    // the animation — each card has a guaranteed, collision-free destination.
    slotsRef.current = CATEGORY_CARDS.map((_, i) => (i - 1.5) * spacing);

    // ── rAF render loop ──────────────────────────────────────────────
    const tick = () => {
      if (!active) return;

      // Spin the orbit container (affects only non-detached cards visually).
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      }

      CATEGORY_CARDS.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const anim = cardsAnimRef.current[i];

        let transform;
        if (detachedRef.current.has(i)) {
          // Counter-rotation: negate the container's rotateY so the card
          // always faces the viewer regardless of how far the carousel has spun.
          // Total effective rotation = angleRef.current + (-angleRef.current) = 0°.
          transform = `rotateY(${-angleRef.current}deg) translate3d(${anim.x}px,${anim.y}px,${anim.z}px) scale(${anim.scale}) translate(-50%,-50%)`;
        } else {
          // Still in orbit — standard carousel positioning.
          transform = `rotateY(${anim.rotY}deg) translate3d(0,0,${anim.z}px) scale(${anim.scale}) translate(-50%,-50%)`;
        }
        el.style.transform = transform;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    // ── GSAP master timeline ──────────────────────────────────────────
    const tl = gsap.timeline({
      onStart: () => setLayoutMode('animating'),
      onComplete: () => setLayoutMode('flat'),
    });

    // ── Phase 1: clean first rotation (0 – 5 s) ──────────────────────
    // angleRef: -90° → 270°  (+360°, one full revolution)
    const firstRotDuration = 5.0;
    tl.to(angleRef, {
      current: 270,
      duration: firstRotDuration,
      ease: 'power1.inOut',
    }, 0);

    // ── Phase 2: second rotation while row assembles (5 – 11 s) ──────
    // angleRef: 270° → 630°  (+360°, second full revolution)
    // Carousel decelerates to a stop as the last card settles.
    const secondRotDuration = 6.0;
    tl.to(angleRef, {
      current: 630,
      duration: secondRotDuration,
      ease: 'power2.inOut',
    }, firstRotDuration);

    // ── Concurrent staggered detach (left → right) ───────────────────
    // stagger = 0.30 s  → cards begin moving 0.30 s apart.
    // detachDuration = 1.1 s → each card's tween completes in 1.1 s.
    // Because stagger < detachDuration, tweens overlap: the row forms
    // as a flowing lineup, not a sequential queue.
    const stagger = 0.30;
    const detachDuration = 1.1;
    const firstDetachTime = firstRotDuration + 0.4; // 0.4 s buffer into Phase 2

    CATEGORY_CARDS.forEach((_, i) => {
      const anim = cardsAnimRef.current[i];
      const detachAt = firstDetachTime + i * stagger;

      // At detach start: mark as detached.
      tl.call(() => {
        detachedRef.current.add(i);
        if (i === 0) setLayoutMode('unfolding');
      }, null, detachAt);

      // Tween the card from orbit (z = ORBIT_RADIUS) to its pre-assigned flat slot.
      // rotY is NOT tweened — counter-rotation via detachRotOffset handles facing.
      // x targets the frozen slot position computed before animation started.
      tl.to(anim, {
        x: slotsRef.current[i],  // permanent pre-computed slot — never changes
        y: 0,
        z: 0,                    // exit the orbit depth ring
        scale: cardScale,
        duration: detachDuration,
        ease: 'back.out(1.1)',
      }, detachAt);
    });

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      tl.kill();
    };
  }, [cardsReady]);

  // ── Idle floating wave — keeps cards alive after they've settled ──────────
  // Once all four cards are flat, each card bobs gently up and down with a
  // left-to-right stagger, creating a flowing "breathing" wave across the row.
  // GSAP tweens anim.y; the rAF tick reads it every frame automatically.
  const idleTweensRef = useRef([]);

  useEffect(() => {
    if (layoutMode !== 'flat') return;

    // Kill any leftover idle tweens from a previous mount
    idleTweensRef.current.forEach((t) => t.kill());
    idleTweensRef.current = [];

    CATEGORY_CARDS.forEach((_, i) => {
      const anim = cardsAnimRef.current[i];
      const tween = gsap.to(anim, {
        y: -16,           // float 16px upward at peak
        duration: 1.9,           // half-cycle (yoyo doubles → 3.8 s full cycle)
        repeat: -1,            // forever
        yoyo: true,          // reverse automatically
        ease: 'sine.inOut',  // smooth sinusoidal motion
        delay: i * 0.18,      // 0.18 s stagger → wave ripples left → right
      });
      idleTweensRef.current.push(tween);
    });

    return () => {
      idleTweensRef.current.forEach((t) => t.kill());
      idleTweensRef.current = [];
    };
  }, [layoutMode]);

  // ── Drag handlers ─────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    if (layoutMode !== 'orbit') return;
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragVelocityRef.current = 0;
    e.preventDefault();
  }, [layoutMode]);

  const handlePointerMove = useCallback((e) => {
    if (layoutMode !== 'orbit' || !isDraggingRef.current) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = x - lastPointerXRef.current;
    lastPointerXRef.current = x;
    dragVelocityRef.current = dx * 0.5;
    angleRef.current += dragVelocityRef.current;
  }, [layoutMode]);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleCoinClick = useCallback((categoryKey) => {
    setActiveCategory(categoryKey);
  }, []);

  const handleClose = useCallback(() => {
    setActiveCategory(null);
  }, []);

  // ── Carousel card positions ───────────────────────────────────────────
  const cardCount = CATEGORY_CARDS.length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vw',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ── Canvas flipbook background ─────────────────────────────── */}
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

        {/* ── Loading skeleton ────────────────────────────────────────── */}
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
                  animation: `projectsPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* ── Radial vignette around the character ────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 55% 65% at 50% 50%, transparent 0%, rgba(11,18,32,0.35) 55%, rgba(11,18,32,0.72) 100%)',
          }}
        />

        {/* ── Bottom vignette ─────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to top, rgba(11,18,32,0.60), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── Top vignette ────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(to bottom, rgba(11,18,32,0.50), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* ── Content layer ──────────────────────────────────────────── */}
        {loaded && (
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '100vh',
              paddingTop: '3rem',
              paddingBottom: '3rem',
            }}
          >
            {/* ── Section heading — top-left corner ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 'clamp(2rem, 5vh, 4rem)',
                left: 'clamp(2rem, 7vw, 8rem)',
                textAlign: 'left',
                zIndex: 10,
              }}
            >
              {/* Eyebrow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1rem',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent-glow)',
                  borderRadius: '2px',
                }} />
                <span style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 0 12px var(--accent-glow)',
                }}>
                  Portfolio
                </span>
              </div>

              <h2 style={{
                fontFamily: 'Outfit, Inter, sans-serif',
                fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
                color: '#fff',
                textShadow: '0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(0,0,0,0.3)',
              }}>
                My <span style={{ color: 'var(--accent)', textShadow: '0 0 24px var(--accent-glow)' }}>Projects</span>
              </h2>
            </motion.div>

            {/* ── 3D Card Carousel — appears after character animation ── */}
            {cardsReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  perspective: '1200px',
                  perspectiveOrigin: '50% 50%',
                  width: '100%',
                  maxWidth: '1000px',
                  height: '340px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginTop: '1rem',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {/* Rotating ring */}
                <div
                  ref={carouselRef}
                  style={{
                    position: 'relative',
                    width: '1px',
                    height: '1px',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angleRef.current}deg)`,
                  }}
                >
                  {CATEGORY_CARDS.map((card, i) => {
                    const theta = (i / cardCount) * 360;
                    return (
                      <div
                        key={card.key}
                        ref={(el) => { cardRefs.current[i] = el; }}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: `rotateY(${theta}deg) translateZ(${ORBIT_RADIUS}px) translate(-50%, -50%)`,
                          transformStyle: 'preserve-3d',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <OrbitCard
                          card={card}
                          style={{ position: 'relative' }}
                          onClick={() => handleCoinClick(card.key)}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Hint text ──────────────────────────────────────────── */}
            {cardsReady && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  marginTop: '1.8rem',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                }}
              >
                {layoutMode === 'flat' ? 'Click a card to explore' : 'Drag to spin · Click a card to explore'}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* ── Card overlay portal ──────────────────────────────────────── */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {activeCategory && (
            <CardOverlay
              key={activeCategory}
              category={activeCategory}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </Suspense>

      <style>{`
        @keyframes projectsPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
      `}</style>
    </section>
  );
}
