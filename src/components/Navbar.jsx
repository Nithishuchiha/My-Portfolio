import { useMemo, useState, useEffect, useRef } from 'react';
import useScrollSpy from '../hooks/useScrollSpy';
import { firePageTransition } from './PageTransition';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeId = useScrollSpy(sectionIds, 80);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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

  const scrollTo = (id) => {
    if (transitionInFlightRef.current) return;
    transitionInFlightRef.current = true;

    firePageTransition(() => {
      const el = document.getElementById(id);
      if (el) {
        // Jump instantly while the wipe covers the screen.
        // Account for fixed navbar so headings don't land under it.
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'auto' });
      }

      // Allow another click shortly after the wipe starts clearing.
      window.setTimeout(() => {
        transitionInFlightRef.current = false;
      }, 450);
    });
  };

  return (
    <nav
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
  );
}
