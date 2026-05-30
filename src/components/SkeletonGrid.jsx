export default function SkeletonGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '1rem 0',
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass animate-shimmer"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Image placeholder */}
          <div
            style={{
              height: '180px',
              background: 'var(--surface-2)',
            }}
          />
          {/* Content placeholder */}
          <div style={{ padding: '1.25rem' }}>
            <div
              style={{
                height: '14px',
                width: '60%',
                background: 'var(--surface-3)',
                borderRadius: '8px',
                marginBottom: '0.75rem',
              }}
            />
            <div
              style={{
                height: '10px',
                width: '100%',
                background: 'var(--surface-2)',
                borderRadius: '6px',
                marginBottom: '0.5rem',
              }}
            />
            <div
              style={{
                height: '10px',
                width: '80%',
                background: 'var(--surface-2)',
                borderRadius: '6px',
                marginBottom: '1rem',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  style={{
                    height: '22px',
                    width: '55px',
                    background: 'var(--surface-3)',
                    borderRadius: '999px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
