import useAccentColor from '../hooks/useAccentColor';

export default function AccentSwitcher() {
  const [accent, setAccent] = useAccentColor();

  return (
    <div
      className="accent-switcher"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 90,
      }}
    >
      <div
        className="glass-strong"
        style={{
          display: 'flex',
          borderRadius: '999px',
          padding: '3px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sliding pill indicator */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: accent === 'green' ? '3px' : 'calc(50% + 0px)',
            width: 'calc(50% - 3px)',
            height: 'calc(100% - 6px)',
            borderRadius: '999px',
            background: accent === 'green' ? '#39FF14' : '#A855F7',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 20px ${accent === 'green' ? 'rgba(57, 255, 20, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`,
          }}
        />

        <button
          id="accent-green"
          onClick={() => setAccent('green')}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '0.45rem 0.9rem',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            background: 'transparent',
            color: accent === 'green' ? 'var(--on-accent)' : 'var(--text-dim)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'color 0.3s ease',
          }}
        >
          Green
        </button>

        <button
          id="accent-purple"
          onClick={() => setAccent('purple')}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '0.45rem 0.9rem',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            background: 'transparent',
            color: accent === 'purple' ? 'var(--on-accent)' : 'var(--text-dim)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'color 0.3s ease',
          }}
        >
          Purple
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .accent-switcher {
            bottom: 5rem !important;
            right: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
