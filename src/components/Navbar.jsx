import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollSpy from '../hooks/useScrollSpy';
import { firePageTransition } from './PageTransition';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function MenuIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <motion.line
        x1="3" y1="6" x2="19" y2="6"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
      <motion.line
        x1="3" y1="11" x2="19" y2="11"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.line
        x1="3" y1="16" x2="19" y2="16"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export default function Navbar() {
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeId = useScrollSpy(sectionIds, 80);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const transitionInFlightRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      if (currentY > lastScrollY.current && currentY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (transitionInFlightRef.current) return;
    transitionInFlightRef.current = true;

    firePageTransition(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'auto' });
      }

      window.setTimeout(() => {
        transitionInFlightRef.current = false;
      }, 450);
    });
  };

  return (
    <>
      {/* Desktop nav */}
      <nav
        className="desktop-nav"
        style={{
          position: 'fixed',
          top: visible ? '1.5rem' : '-5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className={scrolled ? 'glass-strong' : 'glass'}
          style={{
            display: 'flex',
            gap: '0.25rem',
            padding: '0.4rem',
            borderRadius: '999px',
            transition: 'all 0.3s ease',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => scrollTo(item.id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--on-accent)' : 'var(--text-dim)',
                  boxShadow: isActive ? '0 0 20px var(--accent-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.color = 'var(--text)';
                    e.target.style.background = 'rgba(11,18,32,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.color = 'var(--text-dim)';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile nav button */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 110,
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          border: mobileOpen
            ? '1px solid rgba(56,189,248,0.55)'
            : '1px solid rgba(56,189,248,0.20)',
          background: 'rgba(4,10,28,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: mobileOpen ? '#38bdf8' : 'rgba(200,225,255,0.85)',
          transition: 'all 0.3s ease',
          boxShadow: mobileOpen
            ? '0 0 22px rgba(56,189,248,0.30), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 2px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <MenuIcon open={mobileOpen} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 105,
                background: 'rgba(2,6,20,0.70)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(280px, 75vw)',
                zIndex: 106,
                background: 'rgba(4,10,28,0.88)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderLeft: '1px solid rgba(56,189,248,0.14)',
                display: 'flex',
                flexDirection: 'column',
                padding: '5.5rem 1.5rem 2rem',
                gap: '0.35rem',
                boxShadow: '-8px 0 50px rgba(0,0,0,0.55), 0 0 0 0 transparent',
              }}
            >
              {/* Cyan top accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, #38bdf8, #818cf8, transparent)',
                  opacity: 0.7,
                }}
              />

              {/* Subtle scanlines inside drawer */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,160,255,0.015) 3px, rgba(0,160,255,0.015) 6px)',
                  zIndex: 0,
                }}
              />

              {NAV_ITEMS.map((item, i) => {
                const isActive = activeId === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.4, ease: 'easeOut' }}
                    onClick={() => scrollTo(item.id)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '0.85rem 1.2rem',
                      borderRadius: '14px',
                      border: isActive
                        ? '1px solid rgba(56,189,248,0.45)'
                        : '1px solid rgba(56,189,248,0.08)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.03em',
                      background: isActive
                        ? 'rgba(56,189,248,0.10)'
                        : 'rgba(255,255,255,0.025)',
                      color: isActive ? '#38bdf8' : 'rgba(200,225,255,0.75)',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive
                        ? '0 0 18px rgba(56,189,248,0.12), inset 0 1px 0 rgba(56,189,248,0.08)'
                        : 'none',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: isActive ? '#38bdf8' : 'rgba(150,180,220,0.4)',
                          opacity: isActive ? 1 : 0.5,
                          transition: 'all 0.3s ease',
                          boxShadow: isActive ? '0 0 8px rgba(56,189,248,0.7)' : 'none',
                          flexShrink: 0,
                        }}
                      />
                      {item.label}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
        @media (pointer: fine) {
          .mobile-nav-toggle {
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
}
