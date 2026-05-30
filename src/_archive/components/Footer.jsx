import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com', icon: '⌘' },
  { label: 'LinkedIn', url: 'https://linkedin.com', icon: '◆' },
  { label: 'Twitter', url: 'https://twitter.com', icon: '✦' },
  { label: 'Email', url: 'mailto:hello@example.com', icon: '✉' },
];

export default function Footer() {
  const sectionRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const curtain = curtainRef.current;
    if (!section || !curtain) return;

    const ctx = gsap.context(() => {
      gsap.to(curtain, {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '4rem 2rem',
      }}
    >
      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Footer content */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          textAlign: 'center',
          maxWidth: '600px',
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

        {/* Social links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.3rem',
                borderRadius: '999px',
                textDecoration: 'none',
                color: 'var(--text)',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
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
              <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--accent), transparent)',
            margin: '0 auto 1.5rem',
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
    </section>
  );
}
