'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const KEYWORDS = [
  'AI-Powered Monitoring',
  'Incident Intelligence',
  'Stack Trace Analysis',
  'Root Cause Detection',
  'Real-Time Alerts',
  'Log Aggregation',
  'DevOps Automation',
  'Error Tracking',
  'System Reliability',
  'Observability',
  'Smart Debugging',
  'Backend Insights',
  'Production Monitoring',
  'Event Correlation',
  'Performance Diagnostics',
];

const DIRECTIONS = 8;
const SPAWN_INTERVAL_MS = 300;
const MAX_LIFETIME_MS = 8000;

interface Particle {
  id: number;
  text: string;
  angle: number;
  birthTime: number;
}

function getAccentColor(): string {
  if (typeof document === 'undefined') return '#D3FF5B';
  const el = document.createElement('div');
  el.style.color = 'var(--color-accent)';
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color || '#D3FF5B';
}

export function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        sizeRef.current = { width, height };
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastSpawnTime = 0;
    let spawnCount = 0;
    const particles: Particle[] = [];
    let accentColor = getAccentColor();

    const render = (timestamp: number) => {
      const { width, height } = sizeRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY) * 1.2;

      ctx.clearRect(0, 0, width, height);

      if (timestamp - lastSpawnTime > SPAWN_INTERVAL_MS) {
        const dirIndex = spawnCount % DIRECTIONS;
        const angle = -Math.PI / 2 + dirIndex * (Math.PI / 4);
        const keywordIndex = spawnCount % KEYWORDS.length;
        particles.push({
          id: spawnCount,
          text: KEYWORDS[keywordIndex],
          angle,
          birthTime: timestamp,
        });
        spawnCount++;
        lastSpawnTime = timestamp;
      }

      const activeParticles: Particle[] = [];
      for (const p of particles) {
        const age = timestamp - p.birthTime;
        if (age >= MAX_LIFETIME_MS) continue;

        activeParticles.push(p);
        const progress = age / MAX_LIFETIME_MS;
        const ease = Math.pow(progress, 2.5);
        const currentRadius = ease * maxDist;

        let alpha = 0;
        const maxAlpha = 0.28;
        if (progress < 0.1) {
          alpha = (progress / 0.1) * maxAlpha;
        } else if (progress > 0.8) {
          alpha = (1 - (progress - 0.8) / 0.2) * maxAlpha;
        } else {
          alpha = maxAlpha;
        }

        if (alpha > 0.01) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = accentColor;
          const fontSize = 12 + ease * 60;
          ctx.font = `500 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const x = centerX + Math.cos(p.angle) * currentRadius;
          const y = centerY + Math.sin(p.angle) * currentRadius;
          ctx.fillText(p.text, x, y);
        }
      }

      particles.length = 0;
      particles.push(...activeParticles);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Canvas: words spawn from center and move outward in 8 directions */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full z-0 pointer-events-none"
        style={{ background: 'transparent' }}
        aria-hidden
      />

      {/* Gradient circle: black at center, transparent at edges; above animation, behind text and buttons */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[5]"
        style={{
          width: 'min(480px, 90vmin)',
          height: 'min(480px, 90vmin)',
          background: 'radial-gradient(circle, #000 0%, #000 30%, transparent 70%, transparent 100%)',
        }}
        aria-hidden
      />

      {/* App bar */}
      <header
        className="relative z-10 flex-shrink-0 flex items-center justify-between h-14 px-4 md:px-6 border-0"
        style={{ backgroundColor: 'transparent' }}
      >
        <span
          className="font-semibold text-[20px]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Robbin
        </span>
        <button
          type="button"
          onClick={() => router.push('/live-feed')}
          className="px-4 py-2 rounded-lg font-medium text-[14px] transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#0a0a0b',
          }}
        >
          Join Now
        </button>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center px-6">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Robbin
          </h1>
          <p
            className="text-base md:text-lg max-w-md mb-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            AI-powered incident analysis & post-mortem generator
          </p>
        </div>
      </div>
    </div>
  );
}
