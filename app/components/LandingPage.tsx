'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import logoSvg from '../../assets/icon-neon-black.svg';

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

export function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Two horizontal scrolling rows of grey labels (middle of screen, opposite directions) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes landing-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes landing-scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .landing-scroll-left {
          animation: landing-scroll-left 60s linear infinite;
        }
        .landing-scroll-right {
          animation: landing-scroll-right 60s linear infinite;
        }
      `}} />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-[1] pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div
            className="landing-scroll-left inline-flex gap-12 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {[...KEYWORDS, ...KEYWORDS].map((label, i) => (
              <span
                key={`row1-${i}`}
                className="text-2xl font-medium tracking-wide"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div
            className="landing-scroll-right inline-flex gap-12 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {[...KEYWORDS, ...KEYWORDS].map((label, i) => (
              <span
                key={`row2-${i}`}
                className="text-2xl font-medium tracking-wide"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

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
        <Image
          src={logoSvg}
          alt="Robbin"
          width={32}
          height={32}
          className="h-8 w-8 flex-shrink-0"
        />
        <button
          type="button"
          onClick={() => router.push('/live-feed')}
          className="px-4 py-2 rounded-lg font-medium text-[14px] transition-colors bg-[var(--color-accent)] text-[#0a0a0b] hover:bg-white hover:text-black"
        >
          Join Now
        </button>
      </header>

      {/* Main content: 7 layered "Robbin" titles, center-aligned */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '320px' }}>
          {/* Layer 3: 2 titles, white 15%, 120px (back) */}
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 60, color: 'rgba(255,255,255,0.15)', transform: 'translate(-50%, -50%) translate(0%, -180%)' }}
          >
            Robbin
          </h1>
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 60, color: 'rgba(255,255,255,0.15)', transform: 'translate(-50%, -50%) translate(0%, 180%)' }}
          >
            Robbin
          </h1>
          {/* Layer 2: 2 titles, white 25%, 140px */}
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 80, color: 'rgba(255,255,255,0.25)', transform: 'translate(-50%, -50%) translate(0%, -100%)' }}
          >
            Robbin
          </h1>
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 80, color: 'rgba(255,255,255,0.25)', transform: 'translate(-50%, -50%) translate(0%, 100%)' }}
          >
            Robbin
          </h1>
          {/* Layer 1: 2 titles, white 35%, 160px — above-left, below-right */}
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 100, color: 'rgba(255,255,255,0.35)', transform: 'translate(-50%, -50%) translate(0%, -50%)' }}
          >
            Robbin
          </h1>
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap pointer-events-none"
            style={{ fontSize: 100, color: 'rgba(255,255,255,0.35)', transform: 'translate(-50%, -50%) translate(0%, 50%)' }}
          >
            Robbin
          </h1>
          {/* Center: neon, 180px (front) */}
          <h1
            className="absolute left-1/2 top-1/2 font-medium italic tracking-tight whitespace-nowrap -translate-x-1/2 -translate-y-1/2"
            style={{ fontSize: 120, color: 'var(--color-accent)' }}
          >
            Robbin
          </h1>
        </div>
      </div>
    </div>
  );
}
