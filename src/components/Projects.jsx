import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/projects';

// Lazy-load the heavy R3F canvas so it doesn't block initial page paint
const ProjectsCanvas = lazy(() =>
  import('./projects3d/ProjectsCanvas').then((m) => ({ default: m.default }))
);
const CardOverlay = lazy(() =>
  import('./projects3d/CardOverlay').then((m) => ({ default: m.default }))
);

// Coin legend labels shown below the canvas
function CoinLegend({ onCategoryClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.key}
          id={`coin-legend-${cat.key}`}
          onClick={() => onCategoryClick(cat.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 18px',
            borderRadius: '999px',
            border: `1px solid rgba(${hexToRgb(cat.color)}, 0.3)`,
            background: `rgba(${hexToRgb(cat.color)}, 0.07)`,
            color: cat.color,
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `rgba(${hexToRgb(cat.color)}, 0.16)`;
            e.currentTarget.style.boxShadow = `0 0 18px rgba(${hexToRgb(cat.color)}, 0.2)`;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `rgba(${hexToRgb(cat.color)}, 0.07)`;
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <CoinDot color={cat.color} />
          {cat.label}
        </button>
      ))}
    </motion.div>
  );
}

function CoinDot({ color }) {
  return (
    <span style={{
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      flexShrink: 0,
    }} />
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// Canvas loading skeleton
function CanvasSkeleton() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}>
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
              animation: `coinPulse 1.2s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
      <span style={{
        color: 'var(--text-dim)',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading 3D scene…
      </span>
    </div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCoinClick = (category) => {
    setActiveCategory(category);
  };

  const handleClose = () => {
    setActiveCategory(null);
  };

  return (
    <section id="projects" className="section" style={{ overflow: 'visible' }}>
      {/* ── Section heading ─────────────────────────────────────────────── */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: '0.6rem',
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}
      >
        My <span className="gradient-text">Projects</span>
      </motion.h2>


      {/* ── 3D Coin canvas — transparent, no background card ───────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        style={{
          width: '100%',
          height: 'clamp(380px, 50vh, 540px)',
          position: 'relative',
          marginTop: '2rem',
        }}
      >
        {/* R3F Canvas — alpha:true so site background shows through */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Suspense fallback={<CanvasSkeleton />}>
            <ProjectsCanvas onCoinClick={handleCoinClick} />
          </Suspense>
        </div>
      </motion.div>


      {/* ── Card overlay portal ──────────────────────────────────────────── */}
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
        @keyframes coinPulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.5); opacity: 1;   }
        }
      `}</style>
    </section>
  );
}
