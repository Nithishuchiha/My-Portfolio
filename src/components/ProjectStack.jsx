import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectStack({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!projects || projects.length === 0) return null;

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const current = projects[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      {/* 3D Card Container */}
      <div
        style={{
          perspective: '1200px',
          width: '100%',
          maxWidth: '420px',
          height: '480px',
          position: 'relative',
        }}
      >
        {/* Stacked cards behind */}
        {projects.length > 1 && (
          <>
            <div
              className="glass"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '20px',
                transform: 'translateZ(-40px) scale(0.92) translateY(8px)',
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            />
            {projects.length > 2 && (
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  transform: 'translateZ(-80px) scale(0.84) translateY(16px)',
                  opacity: 0.15,
                  pointerEvents: 'none',
                }}
              />
            )}
          </>
        )}

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{
              opacity: 1,
              rotateY: flipped ? 180 : 0,
              transition: { duration: 0.6, ease: 'easeInOut' },
            }}
            exit={{ opacity: 0, rotateY: 90, transition: { duration: 0.3 } }}
            onClick={() => setFlipped(!flipped)}
            style={{
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front */}
            <div
              className="glass-strong"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '20px',
                overflow: 'hidden',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '55%',
                  backgroundImage: `url(${current.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(11,18,32,0.55))',
                  }}
                />
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: 'var(--text)',
                  }}
                >
                  {current.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.6,
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {current.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {current.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: '0.25rem 0.7rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        background: 'rgba(var(--accent-rgb), 0.1)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(var(--accent-rgb), 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  opacity: 0.5,
                }}
              >
                Click to flip →
              </div>
            </div>

            {/* Back */}
            <div
              className="glass-strong"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '20px',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                gap: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  transition: 'color 0.3s ease',
                }}
              >
                {current.title}
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-dim)',
                  lineHeight: 1.8,
                }}
              >
                {current.description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', zIndex: 10 }}>
                <a
                  href={current.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    color: 'var(--on-accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 0 25px var(--accent-glow)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Live Demo
                </a>
                <a
                  href={current.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '999px',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--glass-border)';
                    e.target.style.color = 'var(--text)';
                  }}
                >
                  GitHub
                </a>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  opacity: 0.5,
                }}
              >
                ← Click to flip back
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.color = 'var(--text)';
          }}
        >
          ‹
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setFlipped(false); setCurrentIndex(i); }}
              style={{
                width: i === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: i === currentIndex ? 'var(--accent)' : 'rgba(11,18,32,0.18)',
                boxShadow: i === currentIndex ? '0 0 10px var(--accent-glow)' : 'none',
              }}
            />
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.color = 'var(--text)';
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
