import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const MAX_POINTS = 25;

    const getAccentColor = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent').trim() || '#39FF14';
    };

    const draw = () => {
      const { x, y } = mouseRef.current;
      const points = pointsRef.current;

      points.push({ x, y, life: 1 });
      if (points.length > MAX_POINTS) points.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.length < 2) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const accent = getAccentColor();

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const alpha = (i / points.length) * 0.7;
        const width = (i / points.length) * 4;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = width + 8;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
