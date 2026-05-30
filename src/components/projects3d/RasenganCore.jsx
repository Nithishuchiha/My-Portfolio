import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Rasengan-style swirling energy orb — placed behind the coin ring.
 * Built entirely from Three.js geometries (no extra deps needed).
 */
export default function RasenganCore() {
  const coreRef   = useRef();
  const ring1Ref  = useRef();
  const ring2Ref  = useRef();
  const ring3Ref  = useRef();
  const ring4Ref  = useRef();
  const ring5Ref  = useRef();
  const outerRef  = useRef();
  const spiralRef = useRef();

  useFrame((_, delta) => {
    // Core soft pulse
    if (coreRef.current) {
      const t = Date.now() * 0.001;
      coreRef.current.material.opacity = 0.55 + Math.sin(t * 2.1) * 0.12;
      const s = 1 + Math.sin(t * 1.8) * 0.04;
      coreRef.current.scale.setScalar(s);
    }
    // Outer glow breathe
    if (outerRef.current) {
      const t = Date.now() * 0.001;
      outerRef.current.material.opacity = 0.07 + Math.sin(t * 1.3) * 0.03;
    }
    // Rings spin at different axes & speeds for Rasengan swirl
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 1.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 1.1;
      ring2Ref.current.rotation.z += delta * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.9;
      ring3Ref.current.rotation.z -= delta * 0.7;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.x -= delta * 1.3;
      ring4Ref.current.rotation.y += delta * 0.5;
    }
    if (ring5Ref.current) {
      ring5Ref.current.rotation.z += delta * 0.6;
      ring5Ref.current.rotation.x += delta * 1.0;
    }
    // Outer spiral ring rotates slowly
    if (spiralRef.current) {
      spiralRef.current.rotation.z -= delta * 0.35;
      spiralRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    // Slightly behind the coins (z = -0.6) so coins render in front
    <group position={[0, 0, -0.6]}>

      {/* ── Outermost ambient glow — very large, very faint ── */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial
          color="#38c8ff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Mid glow sphere ── */}
      <mesh>
        <sphereGeometry args={[4.0, 32, 32]} />
        <meshBasicMaterial
          color="#70dfff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Inner glow layer ── */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color="#b0f0ff"
          transparent
          opacity={0.13}
          depthWrite={false}
        />
      </mesh>

      {/* ── Core bright white orb ── */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#c8f4ff"
          emissiveIntensity={3.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* ── Hard core centre (fully opaque white) ── */}
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* ── Swirling ring 1 — primary orbital, cyan ── */}
      <mesh ref={ring1Ref} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[2.2, 0.055, 8, 80]} />
        <meshStandardMaterial
          color="#38d8ff"
          emissive="#38d8ff"
          emissiveIntensity={2.2}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>

      {/* ── Swirling ring 2 — tilted, bright white ── */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0.6, 0]}>
        <torusGeometry args={[2.5, 0.04, 8, 80]} />
        <meshStandardMaterial
          color="#aaf0ff"
          emissive="#aaf0ff"
          emissiveIntensity={2.0}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* ── Swirling ring 3 — diagonal, thin, fast ── */}
      <mesh ref={ring3Ref} rotation={[0.9, 1.3, 0.5]}>
        <torusGeometry args={[2.8, 0.03, 8, 80]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.8}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* ── Swirling ring 4 — counter-rotate, teal ── */}
      <mesh ref={ring4Ref} rotation={[Math.PI / 3, 0.2, Math.PI / 5]}>
        <torusGeometry args={[1.8, 0.045, 8, 80]} />
        <meshStandardMaterial
          color="#20c8f0"
          emissive="#20c8f0"
          emissiveIntensity={2.4}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* ── Swirling ring 5 — inner tight ring ── */}
      <mesh ref={ring5Ref} rotation={[0.2, 0.7, Math.PI / 4]}>
        <torusGeometry args={[1.3, 0.06, 8, 64]} />
        <meshStandardMaterial
          color="#90e8ff"
          emissive="#90e8ff"
          emissiveIntensity={3.0}
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer slow-spinning halo (the arc you see in Rasengan) ── */}
      <mesh ref={spiralRef} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[3.6, 0.025, 6, 100]} />
        <meshStandardMaterial
          color="#60d4ff"
          emissive="#60d4ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* ── Point lights inside the orb for scene illumination ── */}
      <pointLight color="#60d8ff" intensity={18} distance={8} decay={2} />
      <pointLight color="#ffffff" intensity={8}  distance={3} decay={2} />
    </group>
  );
}
