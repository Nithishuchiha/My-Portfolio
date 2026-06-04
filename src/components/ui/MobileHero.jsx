/**
 * MobileHero.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A completely redesigned mobile hero section for Nithish's portfolio.
 *
 * DESIGN DIRECTION: "Neon Noir Terminal"
 *   – Deep matte-black bg with subtle scanline texture
 *   – Electric-green / cyan split accent (matches existing --accent)
 *   – Floating avatar inside a rotating holographic hexagonal ring
 *   – Typewriter role cycling with a blinking cursor
 *   – Animated stat cards in a horizontal pill row
 *   – Magnetic CTA buttons with ripple glow
 *   – Grid-line perspective floor for depth
 *   – Everything is CSS-only animation (no GSAP dependency inside this file)
 *
 * USAGE:
 *   Replace the mobile branch inside HeroCanvas.jsx with:
 *
 *   import MobileHero from './MobileHero';
 *
 *   Then inside the render, wrap the existing mobile panel:
 *
 *   {isMobile && status === 'ready' && introDone && (
 *     <MobileHero />
 *   )}
 *
 *   Or drop <MobileHero /> directly into App.jsx above HeroCanvas and use
 *   CSS media queries to swap visibility:
 *
 *   .hero-desktop { display: block }
 *   .hero-mobile  { display: none  }
 *   @media (max-width: 700px) {
 *     .hero-desktop { display: none  }
 *     .hero-mobile  { display: block }
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { asset } from '../../lib/basepath';

// ── Data ─────────────────────────────────────────────────────────────────────
const ROLES = [
  'Full Stack Developer',
  'UI/UX Designer',
  'Creative Coder',
  'Competitive Programmer',
];

const STATS = [
  { value: '2+', label: 'Years' },
  { value: '11+', label: 'Projects' },
  { value: '20+', label: 'Skills' },
];

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/Nithishuchiha',
    label: 'GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/nithish-perumal/',
    label: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'mailto:nithishperumalofficial@gmail.com',
    label: 'Email',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(texts, typingSpeed = 80, pauseMs = 1800, eraseSpeed = 45) {
  const [display, setDisplay] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'pause' | 'erasing'
  const timerRef = useRef(null);

  useEffect(() => {
    const text = texts[roleIdx];

    const clear = () => clearTimeout(timerRef.current);

    if (phase === 'typing') {
      if (display.length < text.length) {
        timerRef.current = setTimeout(() => {
          setDisplay(text.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        timerRef.current = setTimeout(() => setPhase('pause'), pauseMs);
      }
    } else if (phase === 'pause') {
      timerRef.current = setTimeout(() => setPhase('erasing'), 200);
    } else if (phase === 'erasing') {
      if (display.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplay(display.slice(0, -1));
        }, eraseSpeed);
      } else {
        setRoleIdx((i) => (i + 1) % texts.length);
        setPhase('typing');
      }
    }

    return clear;
  }, [display, phase, roleIdx, texts, typingSpeed, pauseMs, eraseSpeed]);

  return display;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MobileHero() {
  const role = useTypewriter(ROLES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger the entrance
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mh-root" aria-label="Hero section">
      {/* ── Scanline overlay ─────────────────────────────────────────────── */}
      <div className="mh-scanlines" aria-hidden="true" />

      {/* ── Perspective grid floor ───────────────────────────────────────── */}
      <div className="mh-grid" aria-hidden="true" />

      {/* ── Ambient glow orbs ────────────────────────────────────────────── */}
      <div className="mh-orb mh-orb-1" aria-hidden="true" />
      <div className="mh-orb mh-orb-2" aria-hidden="true" />
      <div className="mh-orb mh-orb-3" aria-hidden="true" />

      {/* ── Particle dots ────────────────────────────────────────────────── */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`mh-particle mh-p${i}`} aria-hidden="true" />
      ))}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className={`mh-content ${mounted ? 'mh-content--in' : ''}`}>

        {/* ── Status badge ─────────────────────────────────────────────── */}
        <div className="mh-badge">
          <span className="mh-badge-dot" />
          Available for work
        </div>

        {/* ── Avatar ring ──────────────────────────────────────────────── */}
        <div className="mh-avatar-wrap">
          {/* Rotating hex ring layers */}
          <div className="mh-hex-ring mh-hex-ring--outer" aria-hidden="true" />
          <div className="mh-hex-ring mh-hex-ring--mid" aria-hidden="true" />
          <div className="mh-hex-ring mh-hex-ring--inner" aria-hidden="true" />

          {/* Orbit dots */}
          <div className="mh-orbit" aria-hidden="true">
            <div className="mh-orbit-dot" />
          </div>
          <div className="mh-orbit mh-orbit--rev" aria-hidden="true">
            <div className="mh-orbit-dot mh-orbit-dot--cyan" />
          </div>

          {/* Photo */}
          <div className="mh-photo-frame">
            <img
              src={asset('/hero/Mobile_layot_image.png')}
              alt="Nithish — Full Stack Developer"
              className="mh-photo"
            />
            {/* Photo shimmer sweep */}
            <div className="mh-photo-sheen" aria-hidden="true" />
          </div>

          {/* Corner brackets */}
          <div className="mh-bracket mh-bracket--tl" aria-hidden="true" />
          <div className="mh-bracket mh-bracket--tr" aria-hidden="true" />
          <div className="mh-bracket mh-bracket--bl" aria-hidden="true" />
          <div className="mh-bracket mh-bracket--br" aria-hidden="true" />
        </div>

        {/* ── Name block ───────────────────────────────────────────────── */}
        <div className="mh-name-block">
          <p className="mh-greeting">Hi, I'm</p>
          <h1 className="mh-name">
            {'Nithish'.split('').map((ch, i) => (
              <span key={i} className="mh-name-char" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
                {ch}
              </span>
            ))}
          </h1>
        </div>

        {/* ── Typewriter role ──────────────────────────────────────────── */}
        <div className="mh-role-wrap">
          <span className="mh-role-prefix">›</span>
          <span className="mh-role-text">{role}</span>
          <span className="mh-cursor" aria-hidden="true">_</span>
        </div>

        {/* ── Accent rule ──────────────────────────────────────────────── */}
        <div className="mh-rule" aria-hidden="true">
          <div className="mh-rule-line" />
          <div className="mh-rule-diamond" />
          <div className="mh-rule-line" />
        </div>

        {/* ── Tagline ──────────────────────────────────────────────────── */}
        <p className="mh-tagline">
          I don't just write code —{' '}
          <strong>I obsess over every detail</strong>{' '}
          that makes someone stop and think{' '}
          <em>'wow.'</em>
        </p>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <div className="mh-stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="mh-stat" style={{ animationDelay: `${0.8 + i * 0.12}s` }}>
              <span className="mh-stat-value">{s.value}</span>
              <span className="mh-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── CTA buttons ──────────────────────────────────────────────── */}
        <div className="mh-ctas">
          <a href="#projects" className="mh-cta mh-cta--primary">
            <span>View Work</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="mh-cta mh-cta--ghost">
            <span>Contact Me</span>
          </a>
        </div>

        {/* ── Social links ─────────────────────────────────────────────── */}
        <div className="mh-socials">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="mh-social-btn"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* ── Scroll nudge ─────────────────────────────────────────────── */}
        <div className="mh-scroll-nudge" aria-hidden="true">
          <div className="mh-scroll-track">
            <div className="mh-scroll-thumb" />
          </div>
          <span>Scroll</span>
        </div>
      </div>

      {/* ── All styles ───────────────────────────────────────────────────── */}
      <style>{`
        /* ═══════════════════════════════════════════════════════════════
           MOBILE HERO — Cosmic Sky Redesign
           Palette: Deep navy → sky blue, electric cyan accent
           Matches: Mobile_layot_image.png (cosmic night-sky character)
                    background.png (sky backdrop)
        ═══════════════════════════════════════════════════════════════ */

        /* ── Root ────────────────────────────────────────────────────────── */
        .mh-root {
          /* In-flow block — fills the HeroCanvas pin container on mobile */
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow: hidden;
          background:
            linear-gradient(180deg,
              rgba(4,12,30,0.72) 0%,
              rgba(6,18,48,0.60) 40%,
              rgba(8,28,72,0.50) 70%,
              rgba(4,12,30,0.80) 100%
            ),
            url('/hero/background.png') center center / cover no-repeat;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
        }

        /* ── Scanlines — subtle blue tint ────────────────────────────────── */
        .mh-scanlines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 3px,
            rgba(0,160,255,0.018) 3px,
            rgba(0,160,255,0.018) 6px
          );
        }

        /* ── Perspective grid — cyan version ─────────────────────────────── */
        .mh-grid {
          position: absolute;
          bottom: 0;
          left: -20%;
          right: -20%;
          height: 38%;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(0,180,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,255,0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          transform: perspective(500px) rotateX(62deg);
          transform-origin: bottom center;
          mask-image: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%);
        }

        /* ── Ambient orbs ────────────────────────────────────────────────── */
        .mh-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
          z-index: 0;
        }
        .mh-orb-1 {
          width: 300px; height: 300px;
          top: -100px; left: -80px;
          background: radial-gradient(circle, rgba(0,140,255,0.22) 0%, transparent 70%);
          animation: orbDrift1 10s ease-in-out infinite;
        }
        .mh-orb-2 {
          width: 260px; height: 260px;
          bottom: 40px; right: -70px;
          background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
          animation: orbDrift2 13s ease-in-out infinite;
        }
        .mh-orb-3 {
          width: 180px; height: 180px;
          top: 48%; left: 50%;
          transform: translate(-50%,-50%);
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          animation: orbDrift3 8s ease-in-out infinite;
        }

        @keyframes orbDrift1 {
          0%,100% { transform: translate(0,0); }
          40%      { transform: translate(18px, 28px); }
          70%      { transform: translate(-12px, 14px); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate(0,0); }
          35%      { transform: translate(-22px,-18px); }
          65%      { transform: translate(14px,-10px); }
        }
        @keyframes orbDrift3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.35); }
        }

        /* ── Particles — electric cyan ───────────────────────────────────── */
        .mh-particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #38bdf8;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: particleFly 6s ease-in-out infinite;
        }
        .mh-p0  { top:8%;  left:12%;  animation-delay:0s;    animation-duration:7s; }
        .mh-p1  { top:15%; left:80%;  animation-delay:0.5s;  animation-duration:9s;  background:#818cf8; }
        .mh-p2  { top:30%; left:6%;   animation-delay:1s;    animation-duration:8s; }
        .mh-p3  { top:45%; left:90%;  animation-delay:1.5s;  animation-duration:6s;  background:#818cf8; }
        .mh-p4  { top:60%; left:20%;  animation-delay:0.8s;  animation-duration:10s; }
        .mh-p5  { top:75%; left:75%;  animation-delay:2s;    animation-duration:7s; }
        .mh-p6  { top:85%; left:40%;  animation-delay:0.3s;  animation-duration:8s;  background:#818cf8; }
        .mh-p7  { top:20%; left:50%;  animation-delay:1.8s;  animation-duration:9s; }
        .mh-p8  { top:55%; left:60%;  animation-delay:0.6s;  animation-duration:6s;  background:#818cf8; }
        .mh-p9  { top:70%; left:8%;   animation-delay:2.5s;  animation-duration:11s; }
        .mh-p10 { top:5%;  left:65%;  animation-delay:1.2s;  animation-duration:8s; }
        .mh-p11 { top:90%; left:55%;  animation-delay:0.9s;  animation-duration:7s;  background:#818cf8; }

        @keyframes particleFly {
          0%   { opacity:0; transform:translateY(0) scale(1); }
          20%  { opacity:0.9; }
          80%  { opacity:0.4; }
          100% { opacity:0; transform:translateY(-45px) scale(0.5); }
        }

        /* ── Content container ───────────────────────────────────────────── */
        .mh-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 1.25rem 4.5rem;
          width: 100%;
          max-width: min(480px, 100%);
          margin: 0 auto;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .mh-content--in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Status badge ────────────────────────────────────────────────── */
        .mh-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(56,189,248,0.4);
          background: rgba(56,189,248,0.10);
          color: #38bdf8;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 1.6rem;
          animation: fadeSlideIn 0.6s ease 0.1s both;
          backdrop-filter: blur(8px);
        }
        .mh-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }

        /* ── Avatar wrap — full-width hero image card ────────────────────── */
        .mh-avatar-wrap {
          position: relative;
          width: 100%;
          max-width: 340px;
          /* aspect ratio preserves the wide illustration */
          aspect-ratio: 16 / 10;
          margin-bottom: 1.8rem;
          animation: fadeSlideIn 0.7s ease 0.2s both;
          flex-shrink: 0;
          border-radius: 20px;
        }

        /* Hex ring layers — repurposed as card glow border rings */
        .mh-hex-ring {
          position: absolute;
          border-radius: 24px;
          border: 1.5px solid;
          pointer-events: none;
        }
        .mh-hex-ring--outer {
          inset: -14px;
          border-color: rgba(56,189,248,0.18);
          animation: hexPulse 4s ease-in-out infinite;
        }
        .mh-hex-ring--mid {
          inset: -7px;
          border-color: rgba(99,102,241,0.22);
          animation: hexPulse 6s ease-in-out infinite reverse;
        }
        .mh-hex-ring--inner {
          inset: -2px;
          border-color: rgba(56,189,248,0.45);
          border-radius: 22px;
        }
        @keyframes hexPulse {
          0%,100% { opacity:0.6; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.01); }
        }

        /* Orbit dots — repositioned as corner sparkles */
        .mh-orbit {
          position: absolute;
          top: -14px; right: -14px;
          width: 28px; height: 28px;
          pointer-events: none;
        }
        .mh-orbit--rev {
          top: auto; right: auto;
          bottom: -14px; left: -14px;
        }
        .mh-orbit-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 12px #38bdf8, 0 0 24px rgba(56,189,248,0.5);
          animation: sparkle 2.4s ease-in-out infinite;
          margin: auto;
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .mh-orbit-dot--cyan {
          background: #818cf8;
          box-shadow: 0 0 12px #818cf8, 0 0 24px rgba(129,140,248,0.5);
          animation-delay: 1.2s;
        }
        @keyframes sparkle {
          0%,100% { opacity:0.5; transform:translate(-50%,-50%) scale(0.9); }
          50%      { opacity:1;   transform:translate(-50%,-50%) scale(1.2); }
        }

        /* Photo frame — rounded card, not circle */
        .mh-photo-frame {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid rgba(56,189,248,0.35);
          box-shadow:
            0 0 0 1px rgba(56,189,248,0.08),
            0 8px 32px rgba(0,80,200,0.35),
            0 0 60px rgba(56,189,248,0.12),
            inset 0 0 24px rgba(0,0,0,0.25);
        }
        .mh-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 20%;
          animation: photoFloat 6s ease-in-out infinite;
        }
        @keyframes photoFloat {
          0%,100% { transform: scale(1.00) translateY(0); }
          50%      { transform: scale(1.03) translateY(-4px); }
        }
        .mh-photo-sheen {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.10) 0%,
            rgba(56,189,248,0.06) 40%,
            transparent 65%
          );
          pointer-events: none;
          animation: sheenSweep 4s ease-in-out infinite;
        }
        @keyframes sheenSweep {
          0%,100% { opacity:0.8; }
          50%      { opacity:0.25; }
        }

        /* Corner brackets — match new card shape */
        .mh-bracket {
          position: absolute;
          width: 16px; height: 16px;
          border-color: #38bdf8;
          border-style: solid;
          pointer-events: none;
          opacity: 0.75;
          z-index: 2;
        }
        .mh-bracket--tl { top:-6px;    left:-6px;    border-width: 2px 0 0 2px; border-radius: 3px 0 0 0; }
        .mh-bracket--tr { top:-6px;    right:-6px;   border-width: 2px 2px 0 0; border-radius: 0 3px 0 0; }
        .mh-bracket--bl { bottom:-6px; left:-6px;    border-width: 0 0 2px 2px; border-radius: 0 0 0 3px; }
        .mh-bracket--br { bottom:-6px; right:-6px;   border-width: 0 2px 2px 0; border-radius: 0 0 3px 0; }

        /* ── Name block ──────────────────────────────────────────────────── */
        .mh-name-block {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .mh-greeting {
          margin: 0 0 0.2rem;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          animation: fadeSlideIn 0.6s ease 0.3s both;
        }
        .mh-name {
          margin: 0;
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 13vw, 3.8rem);
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #fff;
          text-shadow:
            0 0 30px rgba(56,189,248,0.35),
            0 2px 12px rgba(0,80,200,0.4);
          display: flex;
          justify-content: center;
          gap: 1px;
          overflow: visible;
        }
        .mh-name-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px) rotateX(60deg);
          animation: charDrop 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes charDrop {
          to { opacity:1; transform:translateY(0) rotateX(0deg); }
        }

        /* ── Role typewriter ─────────────────────────────────────────────── */
        .mh-role-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.2rem;
          min-height: 1.6rem;
          animation: fadeSlideIn 0.6s ease 0.9s both;
        }
        .mh-role-prefix {
          color: #38bdf8;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1;
          text-shadow: 0 0 8px #38bdf8;
        }
        .mh-role-text {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.04em;
        }
        .mh-cursor {
          color: #38bdf8;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1;
          text-shadow: 0 0 8px #38bdf8;
          animation: cursorBlink 0.9s step-end infinite;
        }
        @keyframes cursorBlink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }

        /* ── Accent rule ─────────────────────────────────────────────────── */
        .mh-rule {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 280px;
          margin-bottom: 1rem;
          animation: fadeSlideIn 0.6s ease 1s both;
        }
        .mh-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(56,189,248,0.45), transparent);
        }
        .mh-rule-diamond {
          width: 7px; height: 7px;
          background: #38bdf8;
          transform: rotate(45deg);
          box-shadow: 0 0 8px #38bdf8;
          flex-shrink: 0;
        }

        /* ── Tagline ─────────────────────────────────────────────────────── */
        .mh-tagline {
          text-align: center;
          font-size: 0.82rem;
          line-height: 1.78;
          color: rgba(255,255,255,0.55);
          margin: 0 0 1.6rem;
          max-width: 100%;
          animation: fadeSlideIn 0.6s ease 1.1s both;
        }
        .mh-tagline strong {
          color: rgba(255,255,255,0.92);
          font-weight: 600;
        }
        .mh-tagline em {
          color: #38bdf8;
          font-style: italic;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(56,189,248,0.45);
        }

        /* ── Stats ───────────────────────────────────────────────────────── */
        .mh-stats {
          display: flex;
          gap: 0;
          margin-bottom: 1.8rem;
          border: 1px solid rgba(56,189,248,0.18);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(56,189,248,0.05);
          backdrop-filter: blur(10px);
          animation: fadeSlideIn 0.6s ease 1.2s both;
          width: 100%;
          max-width: 100%;
        }
        .mh-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.85rem 0.4rem;
          border-right: 1px solid rgba(56,189,248,0.12);
          opacity: 0;
          animation: fadeSlideIn 0.5s ease forwards;
        }
        .mh-stat:last-child { border-right: none; }
        .mh-stat-value {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 1.4rem;
          font-weight: 900;
          color: #38bdf8;
          line-height: 1;
          text-shadow: 0 0 16px rgba(56,189,248,0.5);
          letter-spacing: -0.03em;
        }
        .mh-stat-label {
          font-size: 0.6rem;
          font-weight: 600;
          color: rgba(255,255,255,0.42);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 3px;
        }

        /* ── CTAs — sky-blue palette ─────────────────────────────────────── */
        .mh-ctas {
          display: flex;
          gap: 0.7rem;
          width: 100%;
          margin-bottom: 1.3rem;
          animation: fadeSlideIn 0.6s ease 1.35s both;
        }
        .mh-cta {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0.82rem 0.75rem;
          border-radius: 14px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
          overflow: hidden;
          min-height: 48px;
          touch-action: manipulation;
        }
        .mh-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .mh-cta:active { transform: scale(0.96); }
        .mh-cta:active::before { opacity: 1; }

        /* Primary: solid electric blue */
        .mh-cta--primary {
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          color: #fff;
          box-shadow:
            0 0 24px rgba(14,165,233,0.4),
            0 4px 18px rgba(37,99,235,0.3);
          border: 1px solid rgba(56,189,248,0.5);
        }
        .mh-cta--primary:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 36px rgba(14,165,233,0.6),
            0 8px 28px rgba(37,99,235,0.4);
        }

        /* Ghost: glassmorphism with cyan border */
        .mh-cta--ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(56,189,248,0.25);
          backdrop-filter: blur(8px);
        }
        .mh-cta--ghost:hover {
          border-color: rgba(56,189,248,0.55);
          color: #38bdf8;
          box-shadow: 0 0 20px rgba(56,189,248,0.18);
          transform: translateY(-2px);
        }

        /* ── Socials ─────────────────────────────────────────────────────── */
        .mh-socials {
          display: flex;
          gap: 0.65rem;
          margin-bottom: 1.8rem;
          animation: fadeSlideIn 0.6s ease 1.5s both;
        }
        .mh-social-btn {
          width: 46px; height: 46px;
          border-radius: 13px;
          border: 1px solid rgba(56,189,248,0.2);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.22s ease;
          touch-action: manipulation;
        }
        .mh-social-btn:hover {
          border-color: rgba(56,189,248,0.5);
          color: #38bdf8;
          background: rgba(56,189,248,0.10);
          box-shadow: 0 0 16px rgba(56,189,248,0.2);
          transform: translateY(-2px);
        }

        /* ── Scroll nudge ────────────────────────────────────────────────── */
        .mh-scroll-nudge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.28);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: fadeSlideIn 0.6s ease 1.7s both;
        }
        .mh-scroll-track {
          width: 1.5px;
          height: 28px;
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
          position: relative;
          overflow: hidden;
        }
        .mh-scroll-thumb {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 12px;
          border-radius: 999px;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: scrollThumb 2s ease-in-out infinite;
        }
        @keyframes scrollThumb {
          0%   { top:0;  opacity:1; }
          80%  { top:calc(100% - 12px); opacity:0.8; }
          100% { top:0;  opacity:0; }
        }

        /* ── Shared fade-in ──────────────────────────────────────────────── */
        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Hide on desktop (≥701px) ────────────────────────────────────── */
        @media (min-width: 701px) {
          .mh-root { display: none; }
        }

        /* ── Very small phones (≤360px) ─────────────────────────────────── */
        @media (max-width: 360px) {
          .mh-avatar-wrap { max-width: 100%; aspect-ratio: 4 / 3; }
          .mh-name { font-size: clamp(2.4rem, 12vw, 3rem); }
          .mh-content { padding: 2.5rem 1rem 4rem; }
          .mh-cta { padding: 0.75rem 0.5rem; font-size: 0.78rem; }
        }

        /* ── Mid-range phones (361px – 480px) ───────────────────────────── */
        @media (min-width: 361px) and (max-width: 480px) {
          .mh-avatar-wrap { max-width: 360px; }
        }

        /* ── Large-screen phones / phablets (481px – 700px) ─────────────── */
        @media (min-width: 481px) and (max-width: 700px) {
          .mh-content { max-width: 480px; }
          .mh-avatar-wrap { max-width: 420px; }
          .mh-name { font-size: clamp(3rem, 10vw, 4rem); }
        }
      `}</style>
    </div>
  );
}