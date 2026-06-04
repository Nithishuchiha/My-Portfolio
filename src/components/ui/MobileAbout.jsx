/**
 * MobileAbout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile-only About section matching the MobileHero "Cosmic Sky / Neon Noir"
 * design system exactly:
 *   – Deep navy + background.png backdrop
 *   – Electric cyan #38bdf8 accents
 *   – Glassmorphism skill category cards
 *   – Ambient orb glow + particle field
 *   – fadeSlideIn stagger animations
 *   – Section divider (line–diamond–line)
 *   – GitHub + LeetCode profile badge links
 *
 * VISIBILITY: Only shown on ≤700px via .mab-root media rule.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';

// ── Skills data (matches About.jsx) ─────────────────────────────────────────
const SKILLS = {
    Languages: ['Java', 'C++', 'JavaScript', 'SQL'],
    Frameworks: ['Spring Boot', 'React', 'Next.js', 'Node.js', 'Tailwind CSS'],
    Tools: ['Git', 'Figma', 'MySQL', 'Supabase'],
    'AI & Prompting': ['ChatGPT', 'Claude', 'Gemini', 'Prompt Engineering', 'Antigravity', 'OpenCode'],
};

// ── Skill category accent colours ────────────────────────────────────────────
const SKILL_COLORS = {
    Languages: '#38bdf8',
    Frameworks: '#818cf8',
    Tools: '#34d399',
    'AI & Prompting': '#f472b6',
};

export default function MobileAbout() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    return (
        <div className="mab-root" id="about" aria-label="About section">
            {/* ── Ambient orbs ──────────────────────────────────────────────── */}
            <div className="mab-orb mab-orb-1" aria-hidden="true" />
            <div className="mab-orb mab-orb-2" aria-hidden="true" />
            <div className="mab-orb mab-orb-3" aria-hidden="true" />

            {/* ── Particle field ────────────────────────────────────────────── */}
            {[...Array(10)].map((_, i) => (
                <div key={i} className={`mab-particle mab-p${i}`} aria-hidden="true" />
            ))}

            {/* ── Scanlines ────────────────────────────────────────────────── */}
            <div className="mab-scanlines" aria-hidden="true" />

            {/* ── Content ───────────────────────────────────────────────────── */}
            <div className={`mab-content ${mounted ? 'mab-content--in' : ''}`}>

                {/* Eyebrow badge */}
                <div className="mab-badge">
                    <span className="mab-badge-dot" />
                    About Me
                </div>

                {/* Section divider — top */}
                <div className="mab-rule" aria-hidden="true">
                    <div className="mab-rule-line" />
                    <div className="mab-rule-diamond" />
                    <div className="mab-rule-line" />
                </div>

                {/* Heading */}
                <div className="mab-heading-block">
                    <h2 className="mab-heading">Who I Am</h2>
                </div>

                {/* Bio */}
                <p className="mab-bio">
                    I'm a developer‑designer who loves figuring out how things work.
                    I get curious about the <strong>"why"</strong> behind every challenge,
                    dive deep into research, and craft clean, thoughtful digital experiences.
                    My super‑power?{' '}
                    <em>Turning tough problems into simple, elegant solutions.</em>
                </p>

                {/* ── Skills ───────────────────────────────────────────────── */}
                <div className="mab-skills">
                    {Object.entries(SKILLS).map(([cat, skills], ci) => (
                        <div key={cat} className="mab-skill-cat" style={{ animationDelay: `${0.4 + ci * 0.1}s` }}>
                            <p className="mab-skill-cat-label" style={{ color: SKILL_COLORS[cat] }}>
                                {cat}
                            </p>
                            <div className="mab-skill-tags">
                                {skills.map((sk, si) => (
                                    <span
                                        key={sk}
                                        className="mab-skill-tag"
                                        style={{ animationDelay: `${0.5 + ci * 0.1 + si * 0.04}s`, borderColor: `${SKILL_COLORS[cat]}40` }}
                                    >
                                        {sk}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section divider — mid */}
                <div className="mab-rule" aria-hidden="true" style={{ marginTop: '0.5rem', marginBottom: '1.4rem' }}>
                    <div className="mab-rule-line" />
                    <div className="mab-rule-diamond" />
                    <div className="mab-rule-line" />
                </div>

                {/* ── Profile badges ────────────────────────────────────────── */}
                <div className="mab-badges">
                    <a
                        href="https://github.com/Nithishuchiha"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mab-profile-btn mab-profile-btn--ghost"
                        aria-label="GitHub Profile"
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub Profile →
                    </a>
                    <a
                        href="https://leetcode.com/u/nithishperumal13062003/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mab-profile-btn mab-profile-btn--amber"
                        aria-label="LeetCode Profile"
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="#FBBF24">
                            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                        </svg>
                        LeetCode Profile →
                    </a>
                </div>

                {/* Scroll nudge */}
                <div className="mab-scroll-nudge" aria-hidden="true">
                    <div className="mab-scroll-track">
                        <div className="mab-scroll-thumb" />
                    </div>
                    <span>Scroll</span>
                </div>

            </div>

            {/* ── Styles ────────────────────────────────────────────────────── */}
            <style>{`
        /* ═══════════════════════════════════════════════════════════════
           MOBILE ABOUT — Cosmic Sky Design (mirrors MobileHero)
           #38bdf8 electric cyan · Outfit headings · Inter body
           Only active on ≤700px via media rule at bottom
        ═══════════════════════════════════════════════════════════════ */

        .mab-root {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow: hidden;
          background:
            linear-gradient(180deg,
              rgba(4,12,30,0.78) 0%,
              rgba(6,18,48,0.65) 40%,
              rgba(8,28,72,0.55) 70%,
              rgba(4,12,30,0.85) 100%
            ),
            url('/hero/background.png') center center / cover no-repeat;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
        }

        /* ── Scanlines ──────────────────────────────────────────────── */
        .mab-scanlines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 3px,
            rgba(0,160,255,0.015) 3px,
            rgba(0,160,255,0.015) 6px
          );
        }

        /* ── Ambient orbs ───────────────────────────────────────────── */
        .mab-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(65px);
          z-index: 0;
        }
        .mab-orb-1 {
          width: 280px; height: 280px;
          top: -80px; right: -60px;
          background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
          animation: mabOrbDrift1 11s ease-in-out infinite;
        }
        .mab-orb-2 {
          width: 240px; height: 240px;
          bottom: 60px; left: -60px;
          background: radial-gradient(circle, rgba(0,140,255,0.20) 0%, transparent 70%);
          animation: mabOrbDrift2 14s ease-in-out infinite;
        }
        .mab-orb-3 {
          width: 160px; height: 160px;
          top: 45%; left: 55%;
          transform: translate(-50%,-50%);
          background: radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%);
          animation: mabOrbDrift3 9s ease-in-out infinite;
        }
        @keyframes mabOrbDrift1 {
          0%,100% { transform: translate(0,0); }
          40%      { transform: translate(-16px, 24px); }
          70%      { transform: translate(10px, 12px); }
        }
        @keyframes mabOrbDrift2 {
          0%,100% { transform: translate(0,0); }
          35%      { transform: translate(20px,-16px); }
          65%      { transform: translate(-12px, 10px); }
        }
        @keyframes mabOrbDrift3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.3); }
        }

        /* ── Particles ──────────────────────────────────────────────── */
        .mab-particle {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #38bdf8;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: mabParticle 7s ease-in-out infinite;
        }
        .mab-p0  { top:5%;  left:10%; animation-delay:0s;    animation-duration:8s; }
        .mab-p1  { top:18%; left:82%; animation-delay:0.6s;  animation-duration:10s; background:#818cf8; }
        .mab-p2  { top:32%; left:5%;  animation-delay:1.1s;  animation-duration:9s; }
        .mab-p3  { top:48%; left:92%; animation-delay:1.7s;  animation-duration:7s;  background:#818cf8; }
        .mab-p4  { top:62%; left:22%; animation-delay:0.9s;  animation-duration:11s; }
        .mab-p5  { top:78%; left:72%; animation-delay:2.2s;  animation-duration:8s; }
        .mab-p6  { top:88%; left:42%; animation-delay:0.4s;  animation-duration:9s;  background:#818cf8; }
        .mab-p7  { top:22%; left:52%; animation-delay:1.9s;  animation-duration:10s; }
        .mab-p8  { top:55%; left:62%; animation-delay:0.7s;  animation-duration:7s;  background:#818cf8; }
        .mab-p9  { top:72%; left:8%;  animation-delay:2.6s;  animation-duration:12s; }
        @keyframes mabParticle {
          0%   { opacity:0; transform:translateY(0) scale(1); }
          20%  { opacity:0.85; }
          80%  { opacity:0.35; }
          100% { opacity:0; transform:translateY(-40px) scale(0.5); }
        }

        /* ── Content wrapper ────────────────────────────────────────── */
        .mab-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 5.5rem 1.25rem 4rem;
          width: 100%;
          max-width: min(480px, 100%);
          margin: 0 auto;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .mab-content--in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Eyebrow badge ──────────────────────────────────────────── */
        .mab-badge {
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
          margin-bottom: 1.2rem;
          animation: mabFadeIn 0.6s ease 0.1s both;
          backdrop-filter: blur(8px);
        }
        .mab-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: mabBlink 1.8s ease-in-out infinite;
        }
        @keyframes mabBlink {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }

        /* ── Section divider ────────────────────────────────────────── */
        .mab-rule {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 280px;
          margin-bottom: 1.2rem;
          animation: mabFadeIn 0.6s ease 0.2s both;
        }
        .mab-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(56,189,248,0.45), transparent);
        }
        .mab-rule-diamond {
          width: 7px; height: 7px;
          background: #38bdf8;
          transform: rotate(45deg);
          box-shadow: 0 0 8px #38bdf8;
          flex-shrink: 0;
        }

        /* ── Heading ────────────────────────────────────────────────── */
        .mab-heading-block {
          text-align: center;
          margin-bottom: 1rem;
          animation: mabFadeIn 0.65s ease 0.25s both;
        }
        .mab-heading {
          margin: 0;
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 11vw, 3.2rem);
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #fff;
          text-shadow:
            0 0 30px rgba(56,189,248,0.35),
            0 2px 14px rgba(0,80,200,0.4);
        }

        /* ── Bio paragraph ──────────────────────────────────────────── */
        .mab-bio {
          text-align: center;
          font-size: 0.88rem;
          line-height: 1.82;
          color: rgba(255,255,255,0.60);
          margin: 0 0 1.8rem;
          animation: mabFadeIn 0.65s ease 0.35s both;
        }
        .mab-bio strong {
          color: rgba(255,255,255,0.92);
          font-weight: 700;
        }
        .mab-bio em {
          color: #38bdf8;
          font-style: italic;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(56,189,248,0.4);
        }

        /* ── Skills ─────────────────────────────────────────────────── */
        .mab-skills {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 1.2rem;
        }
        .mab-skill-cat {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(56,189,248,0.12);
          border-radius: 16px;
          padding: 0.9rem 1rem;
          box-sizing: border-box;
          backdrop-filter: blur(8px);
          opacity: 0;
          animation: mabFadeIn 0.55s ease forwards;
        }
        .mab-skill-cat-label {
          margin: 0 0 0.55rem;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-shadow: 0 0 10px currentColor;
        }
        .mab-skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.38rem;
        }
        .mab-skill-tag {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.80);
          border: 1px solid rgba(56,189,248,0.18);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(6px);
          opacity: 0;
          animation: mabFadeIn 0.45s ease forwards;
        }

        /* ── Profile badge links ────────────────────────────────────── */
        .mab-badges {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
          animation: mabFadeIn 0.6s ease 0.9s both;
        }
        .mab-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.72rem 1.1rem;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          min-height: 48px;
          touch-action: manipulation;
          transition: all 0.22s ease;
          letter-spacing: 0.02em;
        }
        .mab-profile-btn--ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(56,189,248,0.25);
          backdrop-filter: blur(8px);
        }
        .mab-profile-btn--ghost:hover {
          border-color: rgba(56,189,248,0.55);
          color: #38bdf8;
          box-shadow: 0 0 20px rgba(56,189,248,0.18);
          transform: translateY(-2px);
        }
        .mab-profile-btn--amber {
          background: rgba(251,191,36,0.07);
          color: #FBBF24;
          border: 1px solid rgba(251,191,36,0.30);
          backdrop-filter: blur(8px);
        }
        .mab-profile-btn--amber:hover {
          border-color: rgba(251,191,36,0.60);
          box-shadow: 0 0 20px rgba(251,191,36,0.20);
          transform: translateY(-2px);
        }

        /* ── Scroll nudge ───────────────────────────────────────────── */
        .mab-scroll-nudge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.28);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: mabFadeIn 0.6s ease 1.1s both;
        }
        .mab-scroll-track {
          width: 1.5px;
          height: 28px;
          background: rgba(255,255,255,0.10);
          border-radius: 999px;
          position: relative;
          overflow: hidden;
        }
        .mab-scroll-thumb {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 12px;
          border-radius: 999px;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: mabScrollThumb 2s ease-in-out infinite;
        }
        @keyframes mabScrollThumb {
          0%   { top:0;  opacity:1; }
          80%  { top:calc(100% - 12px); opacity:0.8; }
          100% { top:0;  opacity:0; }
        }

        /* ── Shared fade-in ─────────────────────────────────────────── */
        @keyframes mabFadeIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Hide on desktop (≥701px) ───────────────────────────────── */
        @media (min-width: 701px) {
          .mab-root { display: none !important; }
        }

        /* ── Very small phones (≤360px) ─────────────────────────────── */
        @media (max-width: 360px) {
          .mab-content { padding: 5rem 1rem 3.5rem; }
          .mab-heading { font-size: clamp(2rem, 12vw, 2.6rem); }
          .mab-bio { font-size: 0.84rem; }
          .mab-badges { flex-direction: column; align-items: stretch; }
          .mab-profile-btn { justify-content: center; }
        }

        /* ── Large phones / phablets (481–700px) ────────────────────── */
        @media (min-width: 481px) and (max-width: 700px) {
          .mab-content { max-width: 480px; }
          .mab-heading { font-size: clamp(2.8rem, 9vw, 3.5rem); }
        }
      `}</style>
        </div>
    );
}
