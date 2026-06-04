/**
 * MobileFooter.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile-only Contact/Footer section matching the MobileHero "Cosmic Sky"
 * design system:
 *   – Same deep navy + background.png backdrop
 *   – Electric cyan #38bdf8 primary CTA (email), ghost CTAs (rest)
 *   – Ambient orbs + particle field
 *   – Glassmorphism phone pill + copy / call actions
 *   – fadeSlideIn stagger animations
 *   – Scroll nudge at bottom
 *
 * VISIBILITY: Only shown on ≤700px.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import { asset } from '../../lib/basepath';

const CONTACT = {
    email: 'nithishperumalofficial@gmail.com',
    linkedin: 'https://www.linkedin.com/in/nithish-perumal/',
    github: 'https://github.com/Nithishuchiha',
    get resumeUrl() { return asset('/resume.pdf'); },
    phoneDisplay: '+91 95667 43095',
    phoneTel: 'tel:+919566743095',
};

async function copyText(text) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch { /* fall through */ }
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
    } catch { return false; }
}

export default function MobileFooter() {
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1600);
        return () => clearTimeout(t);
    }, [toast]);

    const handleCopyPhone = async () => {
        const ok = await copyText(CONTACT.phoneDisplay);
        setToast(ok ? 'Copied ✓' : 'Copy failed');
    };

    const CTAS = [
        {
            label: 'Email',
            href: `mailto:${CONTACT.email}`,
            icon: '✉',
            primary: true,
        },
        {
            label: 'LinkedIn',
            href: CONTACT.linkedin,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            ),
            primary: false,
        },
        {
            label: 'GitHub',
            href: CONTACT.github,
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
            ),
            primary: false,
        },
        {
            label: 'Resume',
            href: CONTACT.resumeUrl,
            icon: '⬇',
            primary: false,
            newTab: true,
        },
    ];

    return (
        <div className="mft-root" id="contact-mobile" aria-label="Contact section">
            {/* ── Ambient orbs ─────────────────────────────────────────────── */}
            <div className="mft-orb mft-orb-1" aria-hidden="true" />
            <div className="mft-orb mft-orb-2" aria-hidden="true" />

            {/* ── Particles ────────────────────────────────────────────────── */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className={`mft-particle mft-p${i}`} aria-hidden="true" />
            ))}

            {/* ── Scanlines ────────────────────────────────────────────────── */}
            <div className="mft-scanlines" aria-hidden="true" />

            {/* ── Content ──────────────────────────────────────────────────── */}
            <div className={`mft-content ${mounted ? 'mft-content--in' : ''}`}>

                {/* Eyebrow badge */}
                <div className="mft-badge">
                    <span className="mft-badge-dot" />
                    Contact
                </div>

                {/* Section divider */}
                <div className="mft-rule" aria-hidden="true">
                    <div className="mft-rule-line" />
                    <div className="mft-rule-diamond" />
                    <div className="mft-rule-line" />
                </div>

                {/* Heading */}
                <h2 className="mft-heading">
                    Let's <span className="mft-heading-accent">Connect</span>
                </h2>

                {/* Sub */}
                <p className="mft-sub">
                    Always open to new opportunities, collaborations, and interesting conversations.
                </p>

                {/* ── CTA grid ───────────────────────────────────────────── */}
                <div className="mft-cta-grid">
                    {CTAS.map((cta, i) => (
                        <a
                            key={cta.label}
                            href={cta.href}
                            target={cta.newTab || cta.href.startsWith('http') ? '_blank' : undefined}
                            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={`mft-cta ${cta.primary ? 'mft-cta--primary' : 'mft-cta--ghost'}`}
                            aria-label={cta.label}
                            style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                        >
                            <span className="mft-cta-icon" aria-hidden="true">{cta.icon}</span>
                            {cta.label}
                        </a>
                    ))}
                </div>

                {/* ── Phone pill ─────────────────────────────────────────── */}
                <div className="mft-phone-pill">
                    <span className="mft-phone-icon" aria-hidden="true">☎</span>
                    <span className="mft-phone-number">{CONTACT.phoneDisplay}</span>
                    <div className="mft-phone-actions">
                        {CONTACT.phoneTel && (
                            <a
                                href={CONTACT.phoneTel}
                                className="mft-phone-btn"
                                aria-label="Call"
                            >
                                Call
                            </a>
                        )}
                        <button
                            type="button"
                            className="mft-phone-btn mft-phone-btn--copy"
                            onClick={handleCopyPhone}
                            aria-label="Copy phone number"
                            title="Copy"
                        >
                            ⧉
                        </button>
                    </div>
                </div>

                {/* Toast */}
                <div className="mft-toast" aria-live="polite" data-visible={!!toast}>
                    {toast}
                </div>

                {/* Section divider — bottom */}
                <div className="mft-rule" aria-hidden="true" style={{ marginTop: '0.5rem', marginBottom: '1.4rem' }}>
                    <div className="mft-rule-line" />
                    <div className="mft-rule-diamond" />
                    <div className="mft-rule-line" />
                </div>

                {/* Credits */}
                <p className="mft-credits">Built with ❤️ and way too much coffee</p>
                <p className="mft-copy">© {new Date().getFullYear()} Nithish. All rights reserved.</p>

                {/* Scroll nudge */}
                <div className="mft-scroll-nudge" aria-hidden="true">
                    <div className="mft-scroll-track">
                        <div className="mft-scroll-thumb" />
                    </div>
                    <span>End</span>
                </div>
            </div>

            {/* ── Styles ───────────────────────────────────────────────────── */}
            <style>{`
        /* ═══════════════════════════════════════════════════════════════
           MOBILE FOOTER — Cosmic Sky Design (mirrors MobileHero)
        ═══════════════════════════════════════════════════════════════ */

        .mft-root {
          position: relative; width: 100%; min-height: 100dvh;
          overflow: hidden;
          background:
            linear-gradient(180deg,
              rgba(4,12,30,0.82) 0%,
              rgba(6,18,48,0.70) 40%,
              rgba(8,28,72,0.60) 70%,
              rgba(4,12,30,0.88) 100%
            ),
            url('/hero/background.png') center center / cover no-repeat;
          display: flex; align-items: flex-start; justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
        }

        .mft-scanlines {
          position:absolute; inset:0; z-index:1; pointer-events:none;
          background: repeating-linear-gradient(
            to bottom, transparent, transparent 3px,
            rgba(0,160,255,0.014) 3px, rgba(0,160,255,0.014) 6px
          );
        }

        .mft-orb {
          position:absolute; border-radius:50%;
          pointer-events:none; filter:blur(65px); z-index:0;
        }
        .mft-orb-1 {
          width:260px; height:260px; top:-60px; right:-50px;
          background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
          animation: mftOrbA 11s ease-in-out infinite;
        }
        .mft-orb-2 {
          width:220px; height:220px; bottom:50px; left:-50px;
          background: radial-gradient(circle, rgba(0,140,255,0.18) 0%, transparent 70%);
          animation: mftOrbB 14s ease-in-out infinite;
        }
        @keyframes mftOrbA {
          0%,100%{transform:translate(0,0);}
          50%    {transform:translate(-14px, 20px);}
        }
        @keyframes mftOrbB {
          0%,100%{transform:translate(0,0);}
          50%    {transform:translate(12px,-16px);}
        }

        .mft-particle {
          position:absolute; width:3px; height:3px;
          border-radius:50%; background:#38bdf8;
          opacity:0; pointer-events:none; z-index:1;
          animation: mftParticle 8s ease-in-out infinite;
        }
        .mft-p0{top:5%;  left:12%; animation-delay:0s;   animation-duration:9s;}
        .mft-p1{top:22%; left:78%; animation-delay:0.8s; animation-duration:11s; background:#818cf8;}
        .mft-p2{top:40%; left:6%;  animation-delay:1.3s; animation-duration:10s;}
        .mft-p3{top:58%; left:86%; animation-delay:1.9s; animation-duration:8s;  background:#818cf8;}
        .mft-p4{top:72%; left:26%; animation-delay:1.1s; animation-duration:12s;}
        .mft-p5{top:84%; left:66%; animation-delay:2.4s; animation-duration:9s;}
        .mft-p6{top:91%; left:44%; animation-delay:0.6s; animation-duration:10s; background:#818cf8;}
        .mft-p7{top:30%; left:56%; animation-delay:2.1s; animation-duration:11s;}
        @keyframes mftParticle {
          0%  {opacity:0; transform:translateY(0) scale(1);}
          20% {opacity:0.8;}
          80% {opacity:0.3;}
          100%{opacity:0; transform:translateY(-38px) scale(0.5);}
        }

        /* ── Content ────────────────────────────────────────────────── */
        .mft-content {
          position:relative; z-index:10;
          display:flex; flex-direction:column; align-items:center;
          padding:5.5rem 1.25rem 4rem;
          width:100%; max-width:min(480px, 100%);
          margin:0 auto; box-sizing:border-box;
          opacity:0; transform:translateY(20px);
          transition:opacity 0.65s ease, transform 0.65s ease;
        }
        .mft-content--in { opacity:1; transform:translateY(0); }

        .mft-badge {
          display:inline-flex; align-items:center; gap:7px;
          padding:5px 14px; border-radius:999px;
          border:1px solid rgba(56,189,248,0.4);
          background:rgba(56,189,248,0.10);
          color:#38bdf8; font-size:0.68rem; font-weight:700;
          letter-spacing:0.14em; text-transform:uppercase;
          margin-bottom:1.2rem; backdrop-filter:blur(8px);
          animation:mftFadeIn 0.6s ease 0.1s both;
        }
        .mft-badge-dot {
          width:7px; height:7px; border-radius:50%;
          background:#38bdf8; box-shadow:0 0 8px #38bdf8;
          animation:mftBlink 1.8s ease-in-out infinite;
        }
        @keyframes mftBlink{0%,100%{opacity:1;}50%{opacity:0.3;}}

        .mft-rule {
          display:flex; align-items:center; gap:8px;
          width:100%; max-width:260px; margin-bottom:1rem;
          animation:mftFadeIn 0.6s ease 0.2s both;
        }
        .mft-rule-line {
          flex:1; height:1px;
          background:linear-gradient(to right, transparent, rgba(56,189,248,0.45), transparent);
        }
        .mft-rule-diamond {
          width:7px; height:7px; background:#38bdf8;
          transform:rotate(45deg); box-shadow:0 0 8px #38bdf8; flex-shrink:0;
        }

        .mft-heading {
          margin:0 0 0.8rem;
          font-family:'Outfit','Inter',sans-serif;
          font-weight:900;
          font-size:clamp(2.4rem, 11vw, 3.2rem);
          line-height:1.0; letter-spacing:-0.03em;
          color:#fff; text-align:center;
          text-shadow:0 0 30px rgba(56,189,248,0.35), 0 2px 14px rgba(0,80,200,0.4);
          animation:mftFadeIn 0.65s ease 0.25s both;
        }
        .mft-heading-accent {
          color:#38bdf8;
          text-shadow:0 0 24px rgba(56,189,248,0.6);
        }

        .mft-sub {
          text-align:center; font-size:0.84rem; line-height:1.78;
          color:rgba(255,255,255,0.52); margin:0 0 1.8rem;
          animation:mftFadeIn 0.65s ease 0.35s both;
        }

        /* ── CTA grid — 2×2 ─────────────────────────────────────────── */
        .mft-cta-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:0.65rem; width:100%; margin-bottom:1.2rem;
        }
        .mft-cta {
          display:flex; align-items:center; justify-content:center;
          gap:0.5rem; padding:0.82rem 0.75rem;
          border-radius:14px; text-decoration:none;
          font-size:0.82rem; font-weight:700; letter-spacing:0.04em;
          min-height:48px; touch-action:manipulation;
          transition:transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          opacity:0;
          animation:mftFadeIn 0.55s ease forwards;
          position:relative; overflow:hidden;
        }
        .mft-cta::before {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.08); opacity:0;
          transition:opacity 0.18s ease;
        }
        .mft-cta:active{transform:scale(0.96);}
        .mft-cta:active::before{opacity:1;}

        .mft-cta--primary {
          background:linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          color:#fff;
          box-shadow:0 0 24px rgba(14,165,233,0.4), 0 4px 18px rgba(37,99,235,0.3);
          border:1px solid rgba(56,189,248,0.5);
        }
        .mft-cta--primary:hover {
          transform:translateY(-2px);
          box-shadow:0 0 36px rgba(14,165,233,0.6), 0 8px 28px rgba(37,99,235,0.4);
        }
        .mft-cta--ghost {
          background:rgba(255,255,255,0.06);
          color:rgba(255,255,255,0.85);
          border:1px solid rgba(56,189,248,0.22);
          backdrop-filter:blur(8px);
        }
        .mft-cta--ghost:hover {
          border-color:rgba(56,189,248,0.55); color:#38bdf8;
          box-shadow:0 0 20px rgba(56,189,248,0.18); transform:translateY(-2px);
        }
        .mft-cta-icon{font-size:1rem;}

        /* ── Phone pill ─────────────────────────────────────────────── */
        .mft-phone-pill {
          display:flex; align-items:center; gap:0.55rem;
          padding:0.55rem 0.7rem 0.55rem 1rem;
          border-radius:999px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(56,189,248,0.18);
          backdrop-filter:blur(10px);
          font-size:0.82rem; font-weight:600;
          color:rgba(255,255,255,0.78);
          margin-bottom:0.6rem; flex-wrap:wrap;
          justify-content:center;
          animation:mftFadeIn 0.6s ease 0.75s both;
          min-height:48px;
        }
        .mft-phone-icon{font-size:1rem; flex-shrink:0;}
        .mft-phone-number{flex-shrink:0;}
        .mft-phone-actions{display:flex; gap:0.3rem; flex-shrink:0;}
        .mft-phone-btn {
          padding:0.35rem 0.65rem; border-radius:999px;
          background:rgba(255,255,255,0.10);
          border:1px solid rgba(56,189,248,0.18);
          color:rgba(255,255,255,0.75); font-size:0.72rem;
          font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
          text-decoration:none; cursor:pointer;
          transition:all 0.22s ease; min-height:36px;
          display:flex; align-items:center; font-family:inherit;
        }
        .mft-phone-btn--copy{padding:0.35rem 0.55rem;}
        .mft-phone-btn:hover {
          border-color:rgba(56,189,248,0.5);
          box-shadow:0 0 16px rgba(56,189,248,0.2);
        }

        /* ── Toast ──────────────────────────────────────────────────── */
        .mft-toast {
          min-height:1.1rem; font-size:0.68rem;
          letter-spacing:0.14em; text-transform:uppercase;
          color:rgba(56,189,248,0.0);
          transition:color 0.25s ease; margin-bottom:0.4rem;
        }
        .mft-toast[data-visible="true"]{color:#38bdf8;}

        /* ── Credits ────────────────────────────────────────────────── */
        .mft-credits {
          color:rgba(255,255,255,0.40); font-size:0.78rem;
          margin:0 0 0.3rem; text-align:center;
          animation:mftFadeIn 0.6s ease 0.95s both;
        }
        .mft-copy {
          color:rgba(255,255,255,0.25); font-size:0.7rem;
          margin:0 0 1.8rem; text-align:center;
          animation:mftFadeIn 0.6s ease 1s both;
        }

        /* ── Scroll nudge ───────────────────────────────────────────── */
        .mft-scroll-nudge {
          display:flex; flex-direction:column; align-items:center;
          gap:6px; color:rgba(255,255,255,0.28);
          font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase;
          animation:mftFadeIn 0.6s ease 1.1s both;
        }
        .mft-scroll-track {
          width:1.5px; height:28px;
          background:rgba(255,255,255,0.10); border-radius:999px;
          position:relative; overflow:hidden;
        }
        .mft-scroll-thumb {
          position:absolute; top:0; left:0; right:0; height:12px;
          border-radius:999px; background:#38bdf8; box-shadow:0 0 8px #38bdf8;
          animation:mftScrollThumb 2s ease-in-out infinite;
        }
        @keyframes mftScrollThumb {
          0%  {top:0; opacity:1;}
          80% {top:calc(100% - 12px); opacity:0.8;}
          100%{top:0; opacity:0;}
        }

        @keyframes mftFadeIn {
          from{opacity:0; transform:translateY(14px);}
          to  {opacity:1; transform:translateY(0);}
        }

        /* Hide on desktop */
        @media (min-width:701px) {
          .mft-root{display:none !important;}
        }

        /* ≤360px */
        @media (max-width:360px) {
          .mft-content{padding:5rem 1rem 3.5rem;}
          .mft-heading{font-size:clamp(2rem,12vw,2.6rem);}
          .mft-cta-grid{grid-template-columns:1fr;}
          .mft-phone-pill{flex-direction:column; text-align:center;}
        }

        /* 481–700px */
        @media (min-width:481px) and (max-width:700px) {
          .mft-content{max-width:480px;}
        }
      `}</style>
        </div>
    );
}
