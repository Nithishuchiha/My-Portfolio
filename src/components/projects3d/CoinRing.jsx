import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CoinMesh from './CoinMesh';
import { categories } from '../../data/projects';

const ORBIT_RADIUS = 3.2;
const AUTO_ROTATE_SPEED = 0.20; // radians per second

export default function CoinRing({ onCoinClick }) {
  const ringRef = useRef();
  // Start at PI/4 so the 4 coins open in true ◆ diamond orientation:
  // top (90°), right (0°), bottom (270°), left (180°)
  const ringAngleRef = useRef(Math.PI / 4);
  const isDraggingRef = useRef(false);
  const lastPointerYRef = useRef(0); // ← track Y now (vertical drag)
  const dragVelocityRef = useRef(0);
  const hoveredRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // ── Auto-rotate + drag inertia ──────────────────────────────────────────
  useFrame((_, delta) => {
    if (!ringRef.current) return;

    if (!isDraggingRef.current) {
      dragVelocityRef.current *= 0.92;
      const isAutoRotating = hoveredRef.current === null && Math.abs(dragVelocityRef.current) < 0.002;
      if (isAutoRotating) {
        ringAngleRef.current += delta * AUTO_ROTATE_SPEED;
      } else {
        ringAngleRef.current += dragVelocityRef.current;
      }
    }

    // ← Z-axis rotation = vertical Ferris-wheel spin
    ringRef.current.rotation.z = ringAngleRef.current;
  });

  // ── Pointer drag handlers — vertical drag drives Z rotation ─────────────
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    lastPointerYRef.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragVelocityRef.current = 0;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dy = y - lastPointerYRef.current;
    lastPointerYRef.current = y;
    // Invert so dragging down spins the ring downward naturally
    dragVelocityRef.current = -dy * 0.01;
    ringAngleRef.current += dragVelocityRef.current;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <>
      {/* Invisible drag plane — captures pointer events over the full canvas */}
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ring group — NO tilt so all 4 coins sit at z=0 and are always visible */}
      <group ref={ringRef}>
        {categories.map((cat, i) => {
          // Angles: i=0 → 0°(right), i=1 → 90°(top), i=2 → 180°(left), i=3 → 270°(bottom)
          // Diamond ◆ shape: with PI/4 start offset → top, right, bottom, left
          const theta = (i / categories.length) * Math.PI * 2;

          // XY plane orbit — all coins at z=0, all always face the camera equally
          const x = Math.cos(theta) * ORBIT_RADIUS;
          const y = Math.sin(theta) * ORBIT_RADIUS;

          return (
            <CoinMesh
              key={cat.key}
              iconType={cat.icon}
              accentColor={cat.color}
              position={[x, y, 0]}
              isHovered={hoveredIdx === i}
              onHover={(active) => {
                hoveredRef.current = active ? i : null;
                setHoveredIdx(active ? i : null);
              }}
              onClick={() => {
                onCoinClick(cat.key);
              }}
            />
          );
        })}
      </group>
    </>
  );
}
