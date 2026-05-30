import { useState, useCallback } from 'react';
import LoadingScreen from './LoadingScreen';
import HeroFlipbook from './HeroFlipbook';

export default function Hero() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      {!loading && <HeroFlipbook />}
    </>
  );
}
