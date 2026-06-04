/**
 * MobileProjects.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile-only Projects section matching the MobileHero "Cosmic Sky / Neon Noir"
 * design system:
 *   – Same deep navy + background.png backdrop
 *   – Electric cyan #38bdf8 accents + category-specific colours
 *   – Glassmorphism vertical card list (each card per category)
 *   – Ambient orbs + particle field
 *   – Tap → opens existing CardOverlay
 *   – fadeSlideIn stagger animations
 *
 * VISIBILITY: Only shown on ≤700px.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { lazy, Suspense, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/projects';
import projectData from '../../data/projects';

// Lazy-load the same CardOverlay used by the desktop version
const CardOverlay = lazy(() =>
    import('../projects3d/CardOverlay').then((m) => ({ default: m.default }))
);

// ── Enrich categories with project count & taglines ──────────────────────────
const TAGLINES = {
    webdev: 'Full-stack apps & dashboards',
    ai: 'Machine learning & intelligent systems',
    automation: 'Pipelines, scrapers & IoT',
    design: 'UI kits, branding & 3D visuals',
    learning: 'DSA, training & AI tools',
};

const CATEGORY_CARDS = categories.map((cat) => ({
    ...cat,
    tagline: TAGLINES[cat.key] || '',
    count: projectData.filter((p) => p.category === cat.key).length,
}));

// ── SVG category icons (same as Projects.jsx) ────────────────────────────────
function CategoryIcon({ type, color, size = 30 }) {
    const s = size;
    const c = s / 2;
    if (type === 'webdev') {
        return (
            <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
                <path d={`M${c - 5} ${c + 6} L${c - 11} ${c} L${c - 5} ${c - 6}`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`M${c + 5} ${c + 6} L${c + 11} ${c} L${c + 5} ${c - 6}`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={c + 2} y1={c - 7} x2={c - 2} y2={c + 7} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }
    if (type === 'ai') {
        const nodes = [[c, c - 8], [c - 7, c], [c + 7, c], [c - 4, c + 7], [c + 4, c + 7], [c, c + 1]];
        const edges = [[0, 1], [0, 2], [1, 5], [2, 5], [1, 3], [2, 4], [5, 3], [5, 4]];
        return (
            <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
                {edges.map(([a, b], i) => (
                    <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth="1" opacity="0.5" />
                ))}
                {nodes.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
                ))}
            </svg>
        );
    }
    if (type === 'automation') {
        return (
            <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
                <path
                    d={(() => {
                        const R = 11, r = 7, teeth = 7;
                        let d = '';
                        for (let i = 0; i < teeth * 2; i++) {
                            const angle = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
                            const radius = i % 2 === 0 ? R : r + 1.5;
                            const x = c + Math.cos(angle) * radius;
                            const y = c + Math.sin(angle) * radius;
                            d += `${i === 0 ? 'M' : 'L'}${x} ${y} `;
                        }
                        return d + 'Z';
                    })()}
                    fill={color} opacity="0.85"
                />
                <circle cx={c} cy={c} r="3.5" fill="rgba(11,18,32,0.7)" />
                <circle cx={c} cy={c} r="1.8" fill={color} />
            </svg>
        );
    }
    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
            <path d={`M${c} ${c - 10} L${c + 7} ${c} L${c} ${c + 10} L${c - 7} ${c} Z`} stroke={color} strokeWidth="1.5" />
            <line x1={c} y1={c - 10} x2={c} y2={c + 10} stroke={color} strokeWidth="1.2" />
            <circle cx={c} cy={c + 10} r="2" fill={color} />
            <path d={`M${c} ${c - 10} L${c - 7} ${c} L${c} ${c + 10} Z`} fill={color} opacity="0.18" />
        </svg>
    );
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

export default function MobileProjects() {
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCardClick = useCallback((key) => setActiveCategory(key), []);
    const handleClose = useCallback(() => setActiveCategory(null), []);

    return (
        <div className="mpr-root" id="projects" aria-label="Projects section">
            {/* ── Ambient orbs ─────────────────────────────────────────────── */}
            <div className="mpr-orb mpr-orb-1" aria-hidden="true" />
            <div className="mpr-orb mpr-orb-2" aria-hidden="true" />

            {/* ── Particles ────────────────────────────────────────────────── */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className={`mpr-particle mpr-pp${i}`} aria-hidden="true" />
            ))}

            {/* ── Scanlines ────────────────────────────────────────────────── */}
            <div className="mpr-scanlines" aria-hidden="true" />

            {/* ── Content ──────────────────────────────────────────────────── */}
            <div className="mpr-content">

                {/* Eyebrow badge */}
                <div className="mpr-badge">
                    <span className="mpr-badge-dot" />
                    Portfolio
                </div>

                {/* Heading */}
                <h2 className="mpr-heading">
                    My <span className="mpr-heading-accent">Projects</span>
                </h2>

                {/* Section divider */}
                <div className="mpr-rule" aria-hidden="true">
                    <div className="mpr-rule-line" />
                    <div className="mpr-rule-diamond" />
                    <div className="mpr-rule-line" />
                </div>

                {/* Hint */}
                <p className="mpr-hint">Tap a category to explore</p>

                {/* ── Category cards ─────────────────────────────────────── */}
                <div className="mpr-cards">
                    {CATEGORY_CARDS.map((card, i) => {
                        const rgb = hexToRgb(card.color);
                        return (
                            <motion.div
                                key={card.key}
                                className="mpr-card"
                                style={{
                                    borderColor: `rgba(${rgb}, 0.32)`,
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.28), 0 0 18px rgba(${rgb}, 0.12)`,
                                    animationDelay: `${0.3 + i * 0.1}s`,
                                }}
                                onClick={() => handleCardClick(card.key)}
                                whileTap={{ scale: 0.97 }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 12px 42px rgba(0,0,0,0.32), 0 0 30px rgba(${rgb}, 0.28)`;
                                    e.currentTarget.style.borderColor = `rgba(${rgb}, 0.6)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.28), 0 0 18px rgba(${rgb}, 0.12)`;
                                    e.currentTarget.style.borderColor = `rgba(${rgb}, 0.32)`;
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="mpr-card-icon"
                                    style={{
                                        background: `rgba(${rgb}, 0.10)`,
                                        border: `1px solid rgba(${rgb}, 0.25)`,
                                        boxShadow: `0 0 14px rgba(${rgb}, 0.12)`,
                                    }}
                                >
                                    <CategoryIcon type={card.icon} color={card.color} size={28} />
                                </div>

                                {/* Text */}
                                <div className="mpr-card-text">
                                    <span className="mpr-card-label">{card.label}</span>
                                    <span className="mpr-card-tagline">{card.tagline}</span>
                                </div>

                                {/* Count pill */}
                                <span
                                    className="mpr-card-count"
                                    style={{
                                        color: card.color,
                                        background: `rgba(${rgb}, 0.12)`,
                                        border: `1px solid rgba(${rgb}, 0.28)`,
                                        textShadow: `0 0 8px rgba(${rgb}, 0.3)`,
                                    }}
                                >
                                    {card.count}
                                </span>

                                {/* Chevron */}
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mpr-card-chevron">
                                    <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                {/* Sheen */}
                                <div className="mpr-card-sheen" aria-hidden="true" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Scroll nudge */}
                <div className="mpr-scroll-nudge" aria-hidden="true">
                    <div className="mpr-scroll-track">
                        <div className="mpr-scroll-thumb" />
                    </div>
                    <span>Scroll</span>
                </div>
            </div>

            {/* ── CardOverlay (same as desktop) ─────────────────────────────── */}
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

            {/* ── Styles ───────────────────────────────────────────────────── */}
            <style>{`
        /* ═══════════════════════════════════════════════════════════════
           MOBILE PROJECTS — Cosmic Sky Design (mirrors MobileHero)
        ═══════════════════════════════════════════════════════════════ */

        .mpr-root {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow: hidden;
          background:
            linear-gradient(180deg,
              rgba(4,12,30,0.80) 0%,
              rgba(6,18,48,0.67) 40%,
              rgba(8,28,72,0.58) 70%,
              rgba(4,12,30,0.85) 100%
            ),
            url('/hero/background.png') center center / cover no-repeat;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
        }

        .mpr-scanlines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            to bottom, transparent, transparent 3px,
            rgba(0,160,255,0.014) 3px, rgba(0,160,255,0.014) 6px
          );
        }

        .mpr-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(65px); z-index: 0;
        }
        .mpr-orb-1 {
          width: 260px; height: 260px; top: -60px; left: -50px;
          background: radial-gradient(circle, rgba(0,140,255,0.20) 0%, transparent 70%);
          animation: mprOrbA 12s ease-in-out infinite;
        }
        .mpr-orb-2 {
          width: 220px; height: 220px; bottom: 80px; right: -50px;
          background: radial-gradient(circle, rgba(56,189,248,0.16) 0%, transparent 70%);
          animation: mprOrbB 9s ease-in-out infinite;
        }
        @keyframes mprOrbA {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(14px, 20px); }
        }
        @keyframes mprOrbB {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(-12px,-16px); }
        }

        .mpr-particle {
          position: absolute; width: 3px; height: 3px;
          border-radius: 50%; background: #38bdf8;
          opacity: 0; pointer-events: none; z-index: 1;
          animation: mprParticle 8s ease-in-out infinite;
        }
        .mpr-pp0 { top:6%;  left:14%; animation-delay:0s;   animation-duration:9s; }
        .mpr-pp1 { top:20%; left:80%; animation-delay:0.7s; animation-duration:11s; background:#818cf8; }
        .mpr-pp2 { top:38%; left:6%;  animation-delay:1.2s; animation-duration:10s; }
        .mpr-pp3 { top:55%; left:88%; animation-delay:1.8s; animation-duration:8s;  background:#818cf8; }
        .mpr-pp4 { top:70%; left:24%; animation-delay:1s;   animation-duration:12s; }
        .mpr-pp5 { top:82%; left:68%; animation-delay:2.3s; animation-duration:9s; }
        .mpr-pp6 { top:92%; left:44%; animation-delay:0.5s; animation-duration:10s; background:#818cf8; }
        .mpr-pp7 { top:28%; left:54%; animation-delay:2s;   animation-duration:11s; }
        @keyframes mprParticle {
          0%   { opacity:0; transform:translateY(0) scale(1); }
          20%  { opacity:0.8; }
          80%  { opacity:0.3; }
          100% { opacity:0; transform:translateY(-38px) scale(0.5); }
        }

        /* ── Content ────────────────────────────────────────────────── */
        .mpr-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          padding: 5.5rem 1.25rem 4rem;
          width: 100%; max-width: min(480px, 100%);
          margin: 0 auto; box-sizing: border-box;
        }

        .mpr-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 999px;
          border: 1px solid rgba(56,189,248,0.4);
          background: rgba(56,189,248,0.10);
          color: #38bdf8; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 1.1rem; backdrop-filter: blur(8px);
          animation: mprFadeIn 0.6s ease 0.1s both;
        }
        .mpr-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #38bdf8; box-shadow: 0 0 8px #38bdf8;
          animation: mprBlink 1.8s ease-in-out infinite;
        }
        @keyframes mprBlink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

        .mpr-heading {
          margin: 0 0 0.8rem;
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 11vw, 3.2rem);
          line-height: 1.0; letter-spacing: -0.03em;
          color: #fff;
          text-shadow: 0 0 30px rgba(56,189,248,0.35), 0 2px 14px rgba(0,80,200,0.4);
          text-align: center;
          animation: mprFadeIn 0.65s ease 0.2s both;
        }
        .mpr-heading-accent {
          color: #38bdf8;
          text-shadow: 0 0 24px rgba(56,189,248,0.6);
        }

        .mpr-rule {
          display: flex; align-items: center; gap: 8px;
          width: 100%; max-width: 260px; margin-bottom: 0.8rem;
          animation: mprFadeIn 0.6s ease 0.3s both;
        }
        .mpr-rule-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(56,189,248,0.45), transparent);
        }
        .mpr-rule-diamond {
          width: 7px; height: 7px; background: #38bdf8;
          transform: rotate(45deg); box-shadow: 0 0 8px #38bdf8; flex-shrink: 0;
        }

        .mpr-hint {
          font-size: 0.68rem; color: rgba(255,255,255,0.35);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin: 0 0 1.4rem;
          animation: mprFadeIn 0.6s ease 0.4s both;
        }

        /* ── Category cards ─────────────────────────────────────────── */
        .mpr-cards {
          width: 100%;
          display: flex; flex-direction: column; gap: 0.85rem;
          margin-bottom: 2rem;
        }
        .mpr-card {
          position: relative;
          padding: 1.1rem 1.2rem;
          border-radius: 18px;
          background: rgba(11,18,32,0.55);
          backdrop-filter: blur(14px);
          WebkitBackdropFilter: blur(14px);
          border: 1px solid transparent;
          cursor: pointer;
          display: flex; align-items: center; gap: 0.9rem;
          transition: box-shadow 0.28s ease, border-color 0.28s ease;
          touch-action: manipulation;
          overflow: hidden;
          opacity: 0;
          animation: mprFadeIn 0.55s ease forwards;
        }
        .mpr-card-icon {
          width: 46px; height: 46px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .mpr-card-text {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; gap: 3px;
        }
        .mpr-card-label {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 1rem; font-weight: 800;
          color: #fff; letter-spacing: -0.01em;
        }
        .mpr-card-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem; line-height: 1.4;
          color: rgba(255,255,255,0.48);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .mpr-card-count {
          padding: 3px 10px; border-radius: 999px;
          font-size: 0.62rem; font-weight: 800;
          font-family: 'Inter', sans-serif; letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .mpr-card-chevron { flex-shrink: 0; opacity: 0.5; }
        .mpr-card-sheen {
          position: absolute; inset: 0; border-radius: 18px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%);
          pointer-events: none;
        }

        /* ── Scroll nudge ───────────────────────────────────────────── */
        .mpr-scroll-nudge {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; color: rgba(255,255,255,0.28);
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          animation: mprFadeIn 0.6s ease 0.9s both;
        }
        .mpr-scroll-track {
          width: 1.5px; height: 28px;
          background: rgba(255,255,255,0.10); border-radius: 999px;
          position: relative; overflow: hidden;
        }
        .mpr-scroll-thumb {
          position: absolute; top:0; left:0; right:0; height:12px;
          border-radius: 999px; background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: mprScrollThumb 2s ease-in-out infinite;
        }
        @keyframes mprScrollThumb {
          0%   { top:0; opacity:1; }
          80%  { top:calc(100% - 12px); opacity:0.8; }
          100% { top:0; opacity:0; }
        }

        @keyframes mprFadeIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Hide on desktop */
        @media (min-width: 701px) {
          .mpr-root { display: none !important; }
        }

        /* ≤360px */
        @media (max-width: 360px) {
          .mpr-content { padding: 5rem 1rem 3.5rem; }
          .mpr-heading { font-size: clamp(2rem, 12vw, 2.6rem); }
          .mpr-card { padding: 0.9rem 1rem; }
        }

        /* 481–700px */
        @media (min-width: 481px) and (max-width: 700px) {
          .mpr-content { max-width: 480px; }
        }
      `}</style>
        </div>
    );
}
