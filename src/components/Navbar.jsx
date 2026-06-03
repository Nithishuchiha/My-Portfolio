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
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
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
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-strong-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text)',
          transition: 'all 0.3s ease',
          boxShadow: mobileOpen ? '0 0 20px var(--accent-glow)' : '0 2px 12px rgba(11,18,32,0.10)',
          borderColor: mobileOpen ? 'var(--accent)' : 'var(--glass-border)',
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
                background: 'rgba(11,18,32,0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
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
                background: 'var(--glass-strong-bg)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderLeft: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '5.5rem 1.5rem 2rem',
                gap: '0.35rem',
                boxShadow: '-8px 0 40px rgba(11,18,32,0.12)',
              }}
            >
              {/* Accent accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
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
                      padding: '0.85rem 1.2rem',
                      borderRadius: '14px',
                      border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.03em',
                      background: isActive ? 'rgba(var(--accent-rgb), 0.10)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text)',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 0 16px rgba(var(--accent-rgb), 0.12)' : 'none',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: isActive ? 'var(--accent)' : 'var(--text-dim)',
                          opacity: isActive ? 1 : 0.35,
                          transition: 'all 0.3s ease',
                          boxShadow: isActive ? '0 0 8px var(--accent-glow)' : 'none',
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
