import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/basepath';
import MobileFooter from './ui/MobileFooter';


const CONTACT = {
  email: 'nithishperumalofficial@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nithish-perumal/',
  github: 'https://github.com/Nithishuchiha',
  resumePath: '/resume.pdf',
  get resumeUrl() { return asset(this.resumePath) },
  phoneDisplay: '+91 95667 43095',
  // Leave null until you decide to publish a real number.
  // Example: 'tel:+919876543210'
  phoneTel: 'tel:+919566743095',
};


async function copyText(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function Footer() {
  const sectionRef = useRef(null);
  const curtainRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Detect mobile (≤700px) ───────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);


  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleCopyPhone = async () => {
    const ok = await copyText(CONTACT.phoneDisplay);
    setToast(ok ? 'Copied phone number' : 'Copy failed');
  };

  return (
    <>
      {/* ── Mobile: dedicated cosmic sky layout ──────────────────────────── */}
      {isMobile && <MobileFooter />}

      {/* ── Desktop: original glass-card footer ────────────────────────── */}
      <section
        id="contact"
        ref={sectionRef}
        className="contact-section"
        style={{
          display: isMobile ? 'none' : 'flex',
          position: 'relative',
          minHeight: '60vh',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '4rem 2rem',
          borderTop: '1px solid var(--hairline)',
        }}
      >
      {/* ── Image background ────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* The background image itself */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${asset('/about/ezgif-frame-003.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            filter: 'saturate(1.15) contrast(1.05) brightness(0.92)',
          }}
        />

        {/* Soft vignette so the glass card pops */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(246,250,255,0.10) 0%, rgba(246,250,255,0.55) 65%, rgba(246,250,255,0.80) 100%)',
          }}
        />

        {/* Accent colour tint from above */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(1000px 500px at 50% 0%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%)',
          }}
        />
      </div>
      {/* Footer content */}
      <div
        className="glass-strong"
        style={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center',
          maxWidth: '760px',
          width: '100%',
          borderRadius: '24px',
          padding: 'clamp(1.6rem, 4vw, 2.6rem)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.45), 0 22px 70px rgba(7,129,245,0.18), 0 18px 50px rgba(11,18,32,0.12)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Let's <span className="gradient-text">Connect</span>
        </h2>

        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          I'm always open to new opportunities, collaborations, and interesting conversations.
          Feel free to reach out!
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <a
            href={`mailto:${CONTACT.email}`}
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.78rem 1.35rem',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              boxShadow: '0 0 22px var(--accent-glow)',
              borderColor: 'rgba(var(--accent-rgb), 0.35)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'brightness(1.02)';
              e.currentTarget.style.boxShadow = '0 0 28px var(--accent-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.boxShadow = '0 0 22px var(--accent-glow)';
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>✉</span>
            Email
          </a>

          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.78rem 1.25rem',
              borderRadius: '999px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>◆</span>
            LinkedIn
          </a>

          <a
            href={CONTACT.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.78rem 1.25rem',
              borderRadius: '999px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>⬇</span>
            Resume
          </a>

          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.78rem 1.25rem',
              borderRadius: '999px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>⌘</span>
            GitHub
          </a>

          <div
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.4rem 0.65rem 0.4rem 1.05rem',
              borderRadius: '999px',
              color: 'var(--text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              userSelect: 'none',
            }}
            title={CONTACT.phoneTel ? 'Call' : 'Phone number not published yet'}
            aria-label="Phone number"
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem', opacity: CONTACT.phoneTel ? 1 : 0.6 }}>☎</span>
            <span style={{ opacity: CONTACT.phoneTel ? 1 : 0.72 }}>{CONTACT.phoneDisplay}</span>

            {/* Call action (disabled until phoneTel is set) */}
            {CONTACT.phoneTel ? (
              <a
                href={CONTACT.phoneTel}
                style={{
                  marginLeft: '0.25rem',
                  padding: '0.38rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(11,18,32,0.12)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.55)',
                }}
              >
                Call
              </a>
            ) : (
              <span
                aria-hidden="true"
                style={{
                  marginLeft: '0.25rem',
                  padding: '0.38rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(11,18,32,0.10)',
                  color: 'rgba(11,18,32,0.45)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.45)',
                }}
              >
                Call
              </span>
            )}

            {/* Copy action (enabled even for placeholder as requested) */}
            <button
              type="button"
              onClick={handleCopyPhone}
              style={{
                marginLeft: '0.15rem',
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                border: '1px solid rgba(11,18,32,0.12)',
                background: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 0 18px var(--accent-glow)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(11,18,32,0.12)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              aria-label="Copy phone number"
              title="Copy"
            >
              ⧉
            </button>
          </div>
        </div>

        {/* Toast */}
        <div
          aria-live="polite"
          style={{
            minHeight: '1.2rem',
            marginTop: '-1.75rem',
            marginBottom: '1.75rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: toast ? 'rgba(11,18,32,0.55)' : 'transparent',
            transition: 'color 0.2s ease',
          }}
        >
          {toast || ' '}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
            margin: '0 auto 1.5rem',
            transition: 'background 0.3s ease',
          }}
        />

        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.8rem',
            opacity: 0.6,
          }}
        >
          Built with ❤️ and way too much coffee
        </p>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.7rem',
            opacity: 0.4,
            marginTop: '0.5rem',
          }}
        >
          © {new Date().getFullYear()} Nithish. All rights reserved.
        </p>
      </div>

      <style>{`
        /* ── Mobile: up to 700px ──────────────────────────────────────────── */
        @media (max-width: 700px) {
          .contact-section {
            padding: 2.5rem 1rem !important;
            align-items: stretch !important;
          }

          /* Glass card: full width, smaller radius */
          .contact-section .glass-strong {
            max-width: 100% !important;
            border-radius: 20px !important;
            padding: 2rem 1.25rem !important;
          }

          /* CTA buttons: 2-column grid */
          .contact-section .glass-strong > div:first-of-type > div:first-of-type {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
            margin-bottom: 2rem !important;
          }
          .contact-section .glass-strong > div:first-of-type > div:first-of-type a,
          .contact-section .glass-strong > div:first-of-type > div:first-of-type div {
            justify-content: center !important;
            border-radius: 14px !important;
            padding: 0.75rem 0.75rem !important;
            font-size: 0.8rem !important;
          }

          /* Phone number row: stack on narrow screens */
          .contact-section [style*="phoneTel"],
          .contact-section [aria-label=\"Phone number\"] {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }

          /* Heading */
          .contact-section h2 {
            font-size: clamp(1.6rem, 9vw, 2.2rem) !important;
          }
        }

        /* ── Very small phones ≤360px ─────────────────────────────────────── */
        @media (max-width: 360px) {
          .contact-section .glass-strong {
            padding: 1.5rem 1rem !important;
          }
          .contact-section .glass-strong > div:first-of-type > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
    </>
  );
}
