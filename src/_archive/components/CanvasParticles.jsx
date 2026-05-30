import { useRef, useEffect, useCallback } from 'react';

/**
 * Lightweight canvas-based particle system.
 * Props:
 *   count        — number of particles (default 60)
 *   speed        — movement speed multiplier (default 1)
 *   color        — particle color (default reads --accent CSS var)
 *   links        — draw links between nearby particles (default false)
 *   linkDistance  — max distance to draw links (default 120)
 *   repulse      — repulse particles on hover (default false)
 *   repulseDistance — hover repulse radius (default 120)
 *   push         — push new particles on click (default false)
 *   direction    — movement direction: 'none' | 'top' | 'bottom' (default 'none')
 *   burst        — emit all particles from center initially (default false)
 *   className    — additional CSS class
 *   style        — additional inline styles
 */
export default function CanvasParticles({
  count = 60,
  speed = 1,
  color,
  links = false,
  linkDistance = 120,
  repulse = false,
  repulseDistance = 120,
  push = false,
  direction = 'none',
  burst = false,
  minSize = 1,
  maxSize = 3.5,
  minOpacity = 0.2,
  maxOpacity = 0.8,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const initedRef = useRef(false);

  const getAccentColor = useCallback(() => {
    if (color) return color;
    try {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#39FF14';
    } catch {
      return '#39FF14';
    }
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Create particles
    const createParticle = (x, y, vx, vy) => ({
      x: x ?? Math.random() * w(),
      y: y ?? Math.random() * h(),
      vx: vx ?? (Math.random() - 0.5) * 2 * speed,
      vy: vy ?? (direction === 'top' ? -(Math.random() * 1.5 + 0.3) * speed
        : direction === 'bottom' ? (Math.random() * 1.5 + 0.3) * speed
        : (Math.random() - 0.5) * 2 * speed),
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
    });

    if (!initedRef.current) {
      const cx = w() / 2;
      const cy = h() / 2;
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        if (burst) {
          const angle = Math.random() * Math.PI * 2;
          const spd = (Math.random() * 4 + 2) * speed;
          particlesRef.current.push(createParticle(cx, cy, Math.cos(angle) * spd, Math.sin(angle) * spd));
        } else {
          particlesRef.current.push(createParticle());
        }
      }
      initedRef.current = true;
    }

    // Mouse tracking
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onClick = (e) => {
      if (!push) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = (Math.random() * 2 + 1) * speed;
        particlesRef.current.push(createParticle(mx, my, Math.cos(angle) * spd, Math.sin(angle) * spd));
      }
    };

    if (repulse || push) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }
    if (push) {
      canvas.addEventListener('click', onClick);
    }

    // Animation loop
    const draw = () => {
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const accent = getAccentColor();

      // Update & draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Repulse
        if (repulse) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulseDistance && dist > 0) {
            const force = (repulseDistance - dist) / repulseDistance * 3;
            p.vx += (dx / dist) * force * 0.2;
            p.vy += (dy / dist) * force * 0.2;
          }
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce or wrap
        if (direction === 'none') {
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.x = Math.max(0, Math.min(width, p.x));
          p.y = Math.max(0, Math.min(height, p.y));
        } else {
          // Wrap for directional movement
          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
          if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        // Limit max particles
        if (particles.length > count * 2) {
          particles.splice(0, particles.length - count);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.opacity * 0.15;
        ctx.fill();
      }

      // Links
      if (links) {
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < linkDistance) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = accent;
              ctx.globalAlpha = (1 - dist / linkDistance) * 0.12;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      if (repulse || push) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
      if (push) canvas.removeEventListener('click', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count, speed, links, linkDistance, repulse, repulseDistance, push, direction, burst, minSize, maxSize, minOpacity, maxOpacity, getAccentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
    />
  );
}
