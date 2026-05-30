import { useNavigate } from 'react-router-dom';
import CanvasParticles from './CanvasParticles';

export default function Ghost404() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <CanvasParticles
          count={30}
          speed={0.4}
          color="#ffffff"
          direction="top"
          minOpacity={0.05}
          maxOpacity={0.2}
          minSize={1}
          maxSize={3}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Glitch 404 */}
        <h1
          className="glitch-text"
          data-text="404"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            fontWeight: 900,
            color: 'var(--text)',
            lineHeight: 1,
            marginBottom: '1rem',
            userSelect: 'none',
          }}
        >
          404
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.2rem',
            color: 'var(--text-dim)',
            marginBottom: '0.5rem',
            letterSpacing: '0.1em',
          }}
        >
          Page Not Found
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-dim)',
            opacity: 0.6,
            marginBottom: '2.5rem',
          }}
        >
          The ghost ate this page. Spooky.
        </p>

        <button
          id="return-home"
          onClick={() => navigate('/')}
          style={{
            padding: '0.85rem 2.5rem',
            borderRadius: '999px',
            border: '1px solid var(--accent)',
            background: 'transparent',
            color: 'var(--accent)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent)';
            e.target.style.color = '#000';
            e.target.style.boxShadow = '0 0 30px var(--accent-glow)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--accent)';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ← Return Home
        </button>
      </div>
    </div>
  );
}
