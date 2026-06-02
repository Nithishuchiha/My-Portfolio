import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projectData, { categories } from '../../data/projects';

// Card gradient backgrounds — one per category
const CARD_GRADIENTS = {
  webdev:     ['linear-gradient(135deg,#0f2027,#203a43,#2c5364)', 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', 'linear-gradient(135deg,#0d1b2a,#1b4332,#081c15)'],
  learning:   ['linear-gradient(135deg,#0a0a2e,#1a1a4e,#2d2d7e)', 'linear-gradient(135deg,#020024,#090979,#00d4ff)', 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'],
  automation: ['linear-gradient(135deg,#2c1810,#4a1c0c,#8b3a00)', 'linear-gradient(135deg,#1a0a00,#3d1c00,#7a3800)', 'linear-gradient(135deg,#16030a,#3b0015,#6b002a)'],
  design:     ['linear-gradient(135deg,#1a0030,#2e0060,#4b0082)', 'linear-gradient(135deg,#0d0030,#1a0058,#33007f)', 'linear-gradient(135deg,#200040,#3a0070,#5c0099)'],
};

const CARD_W = 320;
const CARD_H = 460;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function TechPill({ label, color }) {
  return (
    <span style={{
      padding: '3px 11px',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      background: `rgba(${hexToRgb(color)}, 0.13)`,
      border: `1px solid rgba(${hexToRgb(color)}, 0.32)`,
      color: color,
      fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

// Fan position config for a given signed index (0=front, ±1=adjacent, ±2=far)
function getFanProps(signedIdx) {
  const depth = Math.abs(signedIdx);
  const MAX_VISIBLE = 2;
  const visible = depth <= MAX_VISIBLE;

  return {
    x: signedIdx * 150,              // px offset left/right
    rotateY: signedIdx * 16,         // deg tilt
    z: -depth * 80,                  // px depth recession
    scale: Math.pow(0.86, depth),
    opacity: visible ? Math.pow(0.78, depth) : 0,
    zIndex: visible ? 50 - depth * 10 : -1,
    pointerEvents: visible ? 'auto' : 'none',
  };
}

function ProjectCard({ project, catColor, gradient, signedIdx, isActive, onClick }) {
  const props = getFanProps(signedIdx);

  return (
    <motion.div
      onClick={!isActive ? onClick : undefined}
      animate={{
        x: props.x,
        rotateY: props.rotateY,
        z: props.z,
        scale: props.scale,
        opacity: props.opacity,
      }}
      initial={false}
      transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.9 }}
      whileHover={!isActive && Math.abs(signedIdx) > 0 ? { scale: props.scale * 1.05 } : {}}
      style={{
        position: 'absolute',
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        borderRadius: '22px',
        overflow: 'hidden',
        cursor: isActive ? 'default' : 'pointer',
        zIndex: props.zIndex,
        pointerEvents: props.pointerEvents,
        boxShadow: isActive
          ? `0 28px 70px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15), 0 0 36px rgba(${hexToRgb(catColor)},0.18)`
          : `0 8px 32px rgba(0,0,0,0.18)`,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* ── Gradient image area ──────────────────────────────────────── */}
      <div style={{
        width: '100%',
        height: '185px',
        background: gradient,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Sheen */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
        }} />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '3px 12px',
          borderRadius: '999px',
          background: `rgba(${hexToRgb(catColor)}, 0.22)`,
          border: `1px solid rgba(${hexToRgb(catColor)}, 0.45)`,
          color: catColor,
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(8px)',
        }}>
          {project.category === 'webdev' ? 'WEB DEV' : project.category.toUpperCase()}
        </div>
        {/* Project number */}
        <div style={{
          position: 'absolute', bottom: '14px', right: '14px',
          fontFamily: 'Outfit, Inter, sans-serif',
          fontSize: '2.4rem',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.08)',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {String(project.id).padStart(2, '0')}
        </div>
      </div>

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div style={{
        padding: '18px 20px 20px',
        background: 'rgba(255,255,255,0.97)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: `${CARD_H - 185}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <h3 style={{
          margin: 0,
          fontFamily: 'Outfit, Inter, sans-serif',
          fontWeight: 800,
          fontSize: '1.08rem',
          color: '#0B1220',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          flexShrink: 0,
        }}>
          {project.title}
        </h3>

        <p style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.76rem',
          color: '#42536B',
          lineHeight: 1.55,
          flexShrink: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexShrink: 0 }}>
          {project.tech.map((t) => (
            <TechPill key={t} label={t} color={catColor} />
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 14px',
              borderRadius: '9px',
              border: `1px solid rgba(${hexToRgb(catColor)}, 0.28)`,
              background: `rgba(${hexToRgb(catColor)}, 0.06)`,
              color: catColor,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            GitHub
          </a>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '7px 14px',
              borderRadius: '9px',
              background: catColor,
              color: '#0B1220',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardOverlay({ category, onClose }) {
  const catMeta   = categories.find((c) => c.key === category);
  const catColor  = catMeta?.color || '#39FF14';
  const projects  = projectData.filter((p) => p.category === category);
  const gradients = CARD_GRADIENTS[category] || CARD_GRADIENTS.webdev;

  const [activeIdx, setActiveIdx] = useState(0);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCardClick = useCallback((idx) => {
    if (idx !== activeIdx) setActiveIdx(idx);
  }, [activeIdx]);

  // Compute signed index for each card relative to active
  const getSignedIdx = (idx) => {
    const total = projects.length;
    const rel = ((idx - activeIdx) % total + total) % total;
    return rel > total / 2 ? rel - total : rel;
  };

  return (
    <AnimatePresence>
      {/* ── Backdrop ───────────────────────────────────────────────── */}
      <motion.div
        key="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(246,250,255,0.90)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
        }}
      />

      {/* ── Content (separate layer so it doesn't close on card click) ── */}
      <motion.div
        key="overlay-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',   // let backdrop clicks fall through
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            marginBottom: '6px',
          }}>
            <span style={{ width: '22px', height: '2px', background: catColor, borderRadius: '2px', boxShadow: `0 0 6px ${catColor}` }} />
            <span style={{
              fontSize: '0.68rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: catColor, fontFamily: 'Inter, sans-serif', fontWeight: 600,
            }}>
              {catMeta?.label} Projects
            </span>
            <span style={{ width: '22px', height: '2px', background: catColor, borderRadius: '2px', boxShadow: `0 0 6px ${catColor}` }} />
          </div>
          <h2 style={{
            fontFamily: 'Outfit, Inter, sans-serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 900, margin: 0, color: '#0B1220', letterSpacing: '-0.03em',
          }}>
            {projects.length} Project{projects.length !== 1 ? 's' : ''}
          </h2>
        </motion.div>

        {/* ── Fan card stage ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            // Width accommodates front card + 2 side cards on each side
            width: `${CARD_W + 4 * 150}px`,
            maxWidth: '96vw',
            height: `${CARD_H}px`,
            // Shared perspective for all cards in the fan
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
            // Center children via flex
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          {projects.map((project, idx) => {
            const signedIdx = getSignedIdx(idx);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                catColor={catColor}
                gradient={gradients[idx % gradients.length]}
                signedIdx={signedIdx}
                isActive={idx === activeIdx}
                onClick={() => handleCardClick(idx)}
              />
            );
          })}
        </motion.div>

        {/* ── Dot navigation ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', gap: '8px', marginTop: '2rem', pointerEvents: 'auto',
          }}
        >
          {projects.map((_, idx) => (
            <button
              key={idx}
              id={`card-dot-${idx}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`View project ${idx + 1}`}
              style={{
                width: idx === activeIdx ? '26px' : '9px',
                height: '9px',
                borderRadius: '999px',
                border: 'none',
                background: idx === activeIdx ? catColor : 'rgba(11,18,32,0.18)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: idx === activeIdx ? `0 0 10px ${catColor}` : 'none',
                padding: 0,
              }}
            />
          ))}
        </motion.div>

        {/* ── Hint ──────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.68rem',
            color: 'rgba(11,18,32,0.35)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          Click side cards to browse · Esc or backdrop to close
        </motion.p>

        {/* ── Close button ──────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, type: 'spring', stiffness: 320, damping: 22 }}
          onClick={onClose}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Close overlay"
          style={{
            position: 'absolute',
            top: '1.6rem',
            right: '1.75rem',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '1px solid rgba(11,18,32,0.13)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B1220',
            fontSize: '1rem',
            boxShadow: '0 4px 18px rgba(11,18,32,0.1)',
            pointerEvents: 'auto',
          }}
        >
          ✕
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
