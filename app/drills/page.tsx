'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { SeverityBadge } from '@/app/components/SeverityBadge';
import { API_ENDPOINTS } from '@/config/api';

export default function DrillReplay() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [incident, setIncident] = useState<any>(null);

  // Fetch first incident for drill
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.incidents}?skip=0&limit=1`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setIncident({
              ...data[0],
              title: data[0].message,
              eventCount: 1,
              events: [{
                id: data[0].id,
                timestamp: data[0].created_at,
                severity: data[0].severity,
                service: data[0].service,
                message: data[0].message,
              }],
            });
          }
        }
      } catch (error) {
        console.error('Error fetching incident:', error);
      }
    };

    fetchIncident();
  }, []);

  const duration = 100; // Total duration in seconds

  const score = {
    detectionTime: 85,
    responseClarity: 72,
    postmortemQuality: 90,
    overall: 82,
  };

  useEffect(() => {
    if (!isPlaying || progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (speed * 0.5);
        if (next >= 100) {
          setIsPlaying(false);
          setShowScore(true);
          return 100;
        }
        return next;
      });

      // Update current event based on progress
      if (incident?.events) {
        const eventIndex = Math.floor((progress / 100) * incident.events.length);
        setCurrentEventIndex(Math.min(eventIndex, incident.events.length - 1));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, progress, speed, incident]);

  const handleReset = () => {
    setProgress(0);
    setCurrentEventIndex(0);
    setIsPlaying(false);
    setShowScore(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (incident?.events) {
      const eventIndex = Math.floor((value / 100) * incident.events.length);
      setCurrentEventIndex(Math.min(eventIndex, incident.events.length - 1));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor((progress / 100) * duration);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--color-resolved)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  if (!incident) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <p className="text-lg mb-2" style={{ color: 'var(--color-text-secondary)' }}>No incidents available for drill</p>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Create some incidents first to practice with drills</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div 
        className="p-6"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Drill Replay</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Practice incident response with historical events
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Timeline & Events */}
            <div className="col-span-2 space-y-6">
              {/* Incident Info */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <h2 className="font-semibold mb-3">Incident: {incident.title}</h2>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={incident.severity} />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {incident.eventCount} events • {incident.service}
                  </span>
                </div>
              </div>

              {/* Playback Controls */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-3 rounded-lg transition-colors border"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderColor: 'var(--color-border-primary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                    }}
                  >
                    <RotateCcw size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    <FastForward size={16} style={{ color: 'var(--color-text-secondary)' }} />
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 border"
                      style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: 'var(--color-border-primary)',
                      }}
                    >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="2">2x</option>
                      <option value="4">4x</option>
                    </select>
                  </div>
                  <span className="text-sm font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Scrubber */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    accentColor: 'var(--color-accent)',
                  }}
                />
              </div>

              {/* Event Stream */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <h3 className="font-semibold mb-4">Event Stream</h3>
                {incident.events && incident.events.length > 0 ? (
                  <div className="space-y-3">
                    {incident.events.slice(0, currentEventIndex + 1).map((event: any, index: number) => (
                      <div
                        key={event.id}
                        className={`rounded-lg p-4 border ${
                          index === currentEventIndex
                            ? ''
                            : ''
                        }`}
                        style={{
                          backgroundColor: index === currentEventIndex 
                            ? 'rgba(37, 99, 235, 0.1)' 
                            : 'var(--color-bg-tertiary)',
                          borderColor: index === currentEventIndex
                            ? 'var(--color-accent)'
                            : 'var(--color-border-primary)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <SeverityBadge severity={event.severity} showIcon={false} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{event.service}</p>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{event.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No events available</p>
                )}
              </div>
            </div>

            {/* Context & Scoring */}
            <div className="space-y-6">
              {/* System State */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <h3 className="font-semibold mb-4">System State</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Active Services</p>
                    <div className="space-y-1">
                      <div
                        className="text-xs font-mono px-2 py-1.5 rounded border"
                        style={{
                          backgroundColor: 'var(--color-bg-tertiary)',
                          borderColor: 'var(--color-border-primary)',
                        }}
                      >
                        {incident.service}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Error Rate</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex-1 rounded-full h-2 overflow-hidden"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                      >
                        <div
                          className="h-full transition-all"
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: 'var(--color-error)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono">{Math.floor(progress)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score */}
              {showScore && (
                <div 
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  <h3 className="font-semibold mb-4">Performance Score</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Detection Time', value: score.detectionTime },
                      { label: 'Response Clarity', value: score.responseClarity },
                      { label: 'Postmortem Quality', value: score.postmortemQuality },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold">{item.value}%</span>
                        </div>
                        <div 
                          className="rounded-full h-2 overflow-hidden"
                          style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                        >
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${item.value}%`,
                              backgroundColor: getScoreColor(item.value),
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Overall Score</span>
                        <span className="text-2xl font-bold">{score.overall}%</span>
                      </div>
                      <div 
                        className="rounded-full h-3 overflow-hidden"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                      >
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${score.overall}%`,
                            backgroundColor: getScoreColor(score.overall),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {!showScore && (
                <div 
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: 'var(--color-info-bg)',
                    borderColor: 'var(--color-info-border)',
                  }}
                >
                  <h3 className="font-semibold mb-2">How it works</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    Watch events replay in real-time. Practice identifying patterns, root causes,
                    and response strategies. Your performance will be scored when the drill
                    completes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
