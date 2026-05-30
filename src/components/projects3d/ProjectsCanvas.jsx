import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import CoinRing from './CoinRing';
import RasenganCore from './RasenganCore';

function Lights() {
  return (
    <>
      {/* Ambient: softer now — Rasengan point lights illuminate coins */}
      <ambientLight intensity={1.1} color="#d0e8ff" />

      {/* Key light — upper left, warm */}
      <pointLight position={[-5, 6, 4]} intensity={60} color="#ffffff" decay={2} />

      {/* Fill light — opposite side, cool blue */}
      <pointLight position={[6, -3, 5]} intensity={35} color="#c0d8ff" decay={2} />

      {/* Rim accent — behind coins, slight warm tint */}
      <pointLight position={[0, 0, -6]} intensity={25} color="#ffe8c0" decay={2} />

      {/* Top bounce */}
      <directionalLight position={[0, 8, 2]} intensity={0.8} color="#f0f4ff" />
    </>
  );
}

export default function ProjectsCanvas({ onCoinClick }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      {/* Dead-center front view — diamond is perfectly symmetric, all 4 coins fully visible */}
      <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={46} />
      <Lights />
      <Suspense fallback={null}>
        <Environment preset="city" />
        {/* Rasengan energy orb sits behind the coin ring */}
        <RasenganCore />
        <CoinRing onCoinClick={onCoinClick} />
      </Suspense>
    </Canvas>
  );
}
