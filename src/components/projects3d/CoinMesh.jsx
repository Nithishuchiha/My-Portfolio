import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Generates a canvas texture with the category icon etched on a metallic coin face.
 */
function createCoinTexture(iconType, accentColor) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // ── Background: radial gradient for depth ────────────────────────────────
  const bg = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  bg.addColorStop(0, '#f0f4ff');
  bg.addColorStop(0.5, '#dce8f8');
  bg.addColorStop(1, '#b8cce8');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // ── Chrome sheen highlight ───────────────────────────────────────────────
  const sheen = ctx.createLinearGradient(0, 0, size * 0.6, size * 0.6);
  sheen.addColorStop(0, 'rgba(255,255,255,0.55)');
  sheen.addColorStop(0.4, 'rgba(255,255,255,0.12)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // ── Rim ring ─────────────────────────────────────────────────────────────
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 14;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ── Icon ─────────────────────────────────────────────────────────────────
  const cx = size / 2;
  const cy = size / 2;
  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (iconType === 'webdev') {
    // </ > brackets
    ctx.lineWidth = 18;
    ctx.strokeStyle = accentColor;
    // Left bracket <
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy);
    ctx.lineTo(cx - 160, cy - 70);
    ctx.lineTo(cx - 80, cy - 140);
    ctx.stroke();
    // Right bracket >
    ctx.beginPath();
    ctx.moveTo(cx + 80, cy);
    ctx.lineTo(cx + 160, cy - 70);
    ctx.lineTo(cx + 80, cy - 140);
    ctx.stroke();
    // Slash /
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 15);
    ctx.lineTo(cx + 30, cy - 195);
    ctx.stroke();
  } else if (iconType === 'ai') {
    // Brain / neural network dots + connections
    const nodes = [
      [cx, cy - 100],
      [cx - 90, cy - 20],
      [cx + 90, cy - 20],
      [cx - 60, cy + 80],
      [cx + 60, cy + 80],
      [cx, cy + 10],
    ];
    // Connections
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.5;
    const connections = [[0,1],[0,2],[1,5],[2,5],[1,3],[2,4],[5,3],[5,4],[3,4]];
    connections.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a][0], nodes[a][1]);
      ctx.lineTo(nodes[b][0], nodes[b][1]);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    // Nodes
    nodes.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
  } else if (iconType === 'automation') {
    // Gear / cog
    const R = 110, r = 65, teeth = 8;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? R : r + 20;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    // Inner circle cutout
    ctx.fillStyle = '#d8e8f5';
    ctx.beginPath();
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
    ctx.fill();
    // Center dot
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === 'design') {
    // Pen nib
    ctx.lineWidth = 14;
    // Nib body (diamond)
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx + 90, cy);
    ctx.lineTo(cx, cy + 130);
    ctx.lineTo(cx - 90, cy);
    ctx.closePath();
    ctx.strokeStyle = accentColor;
    ctx.stroke();
    // Center divider
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx, cy + 130);
    ctx.stroke();
    // Nib tip dot
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(cx, cy + 130, 16, 0, Math.PI * 2);
    ctx.fill();
    // Left fill half
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx - 90, cy);
    ctx.lineTo(cx, cy + 130);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── Category label (small) ───────────────────────────────────────────────
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  const labels = { webdev: 'WEB DEV', ai: 'AI', automation: 'AUTO', design: 'DESIGN' };
  ctx.fillText(labels[iconType] || '', cx, size - 30);
  ctx.globalAlpha = 1;

  return new THREE.CanvasTexture(canvas);
}

export default function CoinMesh({ iconType, accentColor, position, onClick, onHover, isHovered }) {
  const meshRef = useRef();
  const spinRef = useRef(0);
  // Store normalized radial direction for hover push
  const len = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2) || 1;
  const radialDir = [position[0] / len, position[1] / len, position[2] / len];

  const texture = useMemo(() => createCoinTexture(iconType, accentColor), [iconType, accentColor]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // ── Vertical tumble: spin around X-axis (face → edge → back → edge) ──
    spinRef.current += delta * 0.45;
    meshRef.current.rotation.x = spinRef.current;

    // ── Hover: scale up + radial outward push ──
    const targetScale = isHovered ? 1.25 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );

    // Push the inner mesh outward along its radial direction on hover
    const pushDist = isHovered ? 0.22 : 0;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, radialDir[0] * pushDist, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, radialDir[1] * pushDist, 0.1);
  });

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    onHover(true);
    document.body.style.cursor = 'pointer';
  }, [onHover]);

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    onHover(false);
    document.body.style.cursor = 'default';
  }, [onHover]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    // Outer group: positions the coin in the ring
    // rotation.z = 90° stands the coin upright so the face points outward (toward camera)
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Inner mesh: drives the vertical X-axis tumble + hover effects */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Coin disc geometry: radius=1, height=0.12, 64 segments */}
        <cylinderGeometry args={[1, 1, 0.12, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.88}
          roughness={0.13}
          envMapIntensity={1.4}
          emissive={isHovered ? new THREE.Color(accentColor) : new THREE.Color('#000000')}
          emissiveIntensity={isHovered ? 0.18 : 0}
        />
      </mesh>
    </group>
  );
}
