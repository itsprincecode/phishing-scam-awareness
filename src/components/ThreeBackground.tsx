import React, { useEffect, useRef } from 'react';

// =========================================================================
// THREEUI BACKGROUND — PASTE YOUR CODE HERE
// =========================================================================
//
// # Integrate <LaserCollection /> from ThreeUI using its exact source
// Component: LaserCollection
// Variant: Matrix Junction (matrix-field)
// Runtime: Raw WebGL
// Source revision: SHA-256 70cc015d5175
//
// Reference brief:
// The preserved pointer-reactive three-way matrix junction.
//
// ## Configured usage pattern:
// ```tsx
// import { LaserCollection } from "@designcodeio/threeui";
// import "@designcodeio/threeui/style.css";
//
// export function Scene() {
//   return (
//     <div className="shader-frame pointer-events-none fixed inset-0 z-0">
//       <LaserCollection
//         speed={1.00}
//         size={1.00}
//         length={1.00}
//         density={1.00}
//         opacity={0.45}
//         hue={195}
//         saturation={0.85}
//         brightness={0.80}
//       />
//     </div>
//   );
// }
// ```
//
// Registered source files reference:
// - src/shaders/laser/LaserCollection.tsx
// - src/shaders/laser/LaserVariants.tsx
// - src/shaders/laser/laserShaders.ts
// - src/shaders/neuform-isolated/NeuformBatchEffects.tsx
// - src/shaders/neuform-isolated/sources/matrix-field.html
// - src/shaders/threeui.css
//
// When ready to integrate the raw ThreeUI WebGL package, paste your component
// or replace the rendered canvas inside the container below.
// =========================================================================

interface ThreeBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'hero';
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive reaction
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Responsive resize handler with devicePixelRatio support
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Cyber Defense Matrix particle simulation
    const densityDivisor = intensity === 'hero' ? 14000 : intensity === 'subtle' ? 22000 : 16000;
    const count = Math.min(Math.max(Math.floor((width * height) / densityDivisor), 40), 90);

    interface NodePoint {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      hue: number;
      pulseOffset: number;
      hasRing: boolean;
      ringPhase: number;
    }

    interface Packet {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }

    const nodes: NodePoint[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        size: Math.random() * 1.5 + 1.2,
        baseAlpha: Math.random() * 0.25 + 0.22,
        hue: Math.random() > 0.3 ? 190 : 170, // Cyan or Teal
        pulseOffset: Math.random() * Math.PI * 2,
        hasRing: i % 5 === 0, // Soft pulsing radar ring
        ringPhase: Math.random() * Math.PI * 2,
      });
    }

    // Active cyber packets traveling between connected nodes
    const packets: Packet[] = [];
    const maxPackets = 8;

    let time = 0;
    let scanY = 0;

    const render = () => {
      time += 0.015;
      scanY = (scanY + 0.8) % (height + 200);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Softened High-Tech Cyber Grid
      const gridSize = 72;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.035)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Soft radar sweep scan line
      if (scanY < height) {
        const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY);
        scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        scanGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.02)');
        scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0.06)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 60, width, 60);

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.lineWidth = 0.8;
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      // 3. Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move nodes smoothly
        node.x += node.vx;
        node.y += node.vy;

        // Wrap edges smoothly
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;

        // Mouse interaction: gentle pull & soft connection
        if (mouse.active) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 160) {
            const mFactor = (1 - mdist / 160) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${mFactor * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        const currentAlpha = node.baseAlpha * (0.8 + 0.2 * Math.sin(time + node.pulseOffset));

        // Connect nearby nodes with soft subtle cyber beams
        const maxDist = 145;
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${node.hue === 190 ? '6, 182, 212' : '20, 184, 166'}, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Randomly spawn gentle data packet between connected nodes
            if (packets.length < maxPackets && Math.random() < 0.002) {
              packets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.012 + Math.random() * 0.015,
              });
            }
          }
        }

        // Draw soft pulsing radar rings for security anchors
        if (node.hasRing) {
          const ringRadius = node.size * 2.8 + Math.sin(time * 1.5 + node.ringPhase) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(ringRadius, node.size + 1), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${currentAlpha * 0.22})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Draw node soft glowing center
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.45)';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Update & Draw Data Packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        const nodeA = nodes[pkt.fromIndex];
        const nodeB = nodes[pkt.toIndex];

        if (!nodeA || !nodeB || pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const px = nodeA.x + (nodeB.x - nodeA.x) * pkt.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div
      id="threeui-background-container"
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      {/* Softened High-Tech Cyber Matrix Canvas with reduced opacity */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-45 transition-opacity duration-700"
      />
      {/* Soft atmospheric gradient mask to softly blend canvas with deep canvas background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14]/40 via-transparent to-[#050B14]/70 pointer-events-none" />
    </div>
  );
};
