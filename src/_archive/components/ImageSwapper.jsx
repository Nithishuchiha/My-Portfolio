import { useState, useEffect, useRef } from 'react';

const IMAGES = [
  '/hero/hero-1.png',
  '/hero/hero-2.png',
  '/hero/hero-3.png',
  '/hero/hero-4.png',
];

const INTERVAL = 4000;

export default function ImageSwapper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % IMAGES.length;
          setNextIndex((next + 1) % IMAGES.length);
          return next;
        });
        setTransitioning(false);
      }, 1000);
    }, INTERVAL);

    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Current image */}
      <div
        key={`current-${currentIndex}`}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${IMAGES[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: `kenBurns ${INTERVAL}ms ease-out forwards`,
          transition: 'opacity 1s ease, filter 1s ease',
          opacity: transitioning ? 0 : 1,
          filter: transitioning ? 'blur(10px)' : 'blur(0px)',
        }}
      />

      {/* Next image (underneath, visible during transition) */}
      <div
        key={`next-${nextIndex}`}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${IMAGES[nextIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: transitioning ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)',
          zIndex: 1,
        }}
      />
    </div>
  );
}
