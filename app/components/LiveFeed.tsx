'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Pause, Play, Clock, AlertCircle, FilePlus } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { EventDrawer } from './EventDrawer';
import { DateTimePicker } from './DateTimePicker';
import { API_ENDPOINTS } from '@/config/api';

interface Event {
  id: string;
  source: string;
  title: string;
  stack_trace?: string;
  severity: string;
  metadata?: Record<string, any>;
  created_at: string;
}

type TimeRange = '15m' | '1h' | '6h' | '24h' | 'all' | 'custom';

const TIME_RANGE_MS: Record<Exclude<TimeRange, 'custom'>, number | null> = {
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  all: null,
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function LiveFeed() {
  const router = useRouter();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedForIncident, setSelectedForIncident] = useState<Set<string>>(new Set());
  const [autoScroll, setAutoScroll] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [customStart, setCustomStart] = useState<string>(() => toDatetimeLocal(oneHourAgo.toISOString()));
  const [customEnd, setCustomEnd] = useState<string>(() => toDatetimeLocal(now.toISOString()));
  const [loading, setLoading] = useState(true);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Fetch events from events API
  useEffect(() => {
    const fetchEvents = async () => {
      // Only fetch if feed is in resumed state
      if (!autoScroll) {
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.events, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          // Sort by created_at DESC
          const sortedEvents = data.sort((a: Event, b: Event) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, [autoScroll]);

  const filteredEvents = events.filter((event) => {
    if (severityFilter !== 'all' && event.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
    const eventTime = new Date(event.created_at).getTime();
    if (timeRange === 'custom') {
      const startMs = customStart ? new Date(customStart).getTime() : 0;
      const endMs = customEnd ? new Date(customEnd).getTime() : Date.now();
      if (eventTime < startMs || eventTime > endMs) return false;
    } else {
      const rangeMs = TIME_RANGE_MS[timeRange];
      if (rangeMs !== null) {
        const cutoff = Date.now() - rangeMs;
        if (eventTime < cutoff) return false;
      }
    }
    return true;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatRelativeTime = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Pause the feed when the user selects events for generating an incident
  useEffect(() => {
    if (selectedForIncident.size > 0) setAutoScroll(false);
  }, [selectedForIncident.size]);

  const toggleEventForIncident = (eventId: string, severity: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForIncident((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else {
        if (severity.toLowerCase() === 'info') return prev;
        next.add(eventId);
      }
      return next;
    });
    setGenerateError(null);
  };

  const handleGenerateIncident = async () => {
    if (selectedForIncident.size === 0) {
      setGenerateError('Please select one or more events in the table below.');
      return;
    }
    setGenerateError(null);
    setGenerating(true);
    try {
      const eventIds = Array.from(selectedForIncident).filter((id) => {
        const ev = events.find((e) => e.id === id);
        return ev && ev.severity.toLowerCase() !== 'info';
      });
      if (eventIds.length === 0) {
        setGenerateError('Please select one or more events (info severity cannot be selected).');
        setGenerating(false);
        return;
      }
      const response = await fetch(API_ENDPOINTS.generateIncident, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_ids: eventIds }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.message || 'Failed to create incident');
      }
      const data = await response.json();
      setSelectedForIncident(new Set());
      router.push(`/incidents/${data.id}`);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to create incident.');
    } finally {
      setGenerating(false);
    }
  };

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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Live Feed</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Real-time event stream • {filteredEvents.length} events
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
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
                <Clock size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="bg-transparent border-none outline-none text-sm cursor-pointer"
                  style={{
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <option value="15m">Last 15 min</option>
                  <option value="1h">Last 1 hour</option>
                  <option value="6h">Last 6 hours</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="all">All time</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              {/* Filter Dropdown */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
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
                <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm cursor-pointer"
                  style={{
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <option value="all">All Severities</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              {/* Pause/Resume Button */}
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className="flex items-center gap-2 px-4 py-[5px] rounded-lg border transition-colors"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: autoScroll ? 'var(--color-border-primary)' : 'var(--color-accent)',
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                }}
              >
                {autoScroll ? <Pause size={14} /> : <Play size={14} />}
                {autoScroll ? 'Pause' : 'Resume'}
              </button>
              {/* Generate Incident Button */}
              <button
                onClick={handleGenerateIncident}
                disabled={generating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                  color: 'black',
                }}
                onMouseEnter={(e) => {
                  if (!generating) e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                }}
              >
                <FilePlus size={14} />
                {generating ? 'Creating…' : 'Generate Incident'}
              </button>
            </div>
          </div>
          {generateError && (
            <div
              className="flex items-center gap-2 mt-3 px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--color-error-bg)',
                border: '1px solid var(--color-error-border)',
                color: 'var(--color-error)',
              }}
            >
              <AlertCircle size={16} className="shrink-0" />
              {generateError}
            </div>
          )}
          {selectedForIncident.size > 0 && (
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              {selectedForIncident.size} event{selectedForIncident.size !== 1 ? 's' : ''} selected for incident
            </p>
          )}
          {/* Custom start/end date-time row (shown when Custom range is selected) */}
          {timeRange === 'custom' && (
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border-primary)' }}>
              <DateTimePicker
                id="livefeed-start"
                label="From"
                value={customStart}
                onChange={setCustomStart}
              />
              <DateTimePicker
                id="livefeed-end"
                label="To"
                value={customEnd}
                onChange={setCustomEnd}
              />
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-2">
          {loading ? (
            <div 
              className="rounded-lg p-8 text-center border"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div 
              className="rounded-lg p-8 text-center border"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p style={{ color: 'var(--color-text-secondary)' }}>No events found</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const isSelected = selectedForIncident.has(event.id);
              const isSelectable = event.severity.toLowerCase() !== 'info';
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="rounded-lg p-4 cursor-pointer transition-all fade-in border"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-info-bg)' : 'var(--color-bg-secondary)',
                    borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border-primary)',
                    animationDelay: `${index * 50}ms`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                  }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      aria-disabled={!isSelectable}
                      disabled={!isSelectable}
                      onClick={(e) => toggleEventForIncident(event.id, event.severity, e)}
                      className="shrink-0 mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--color-bg-primary)',
                        borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border-primary)',
                        color: 'white',
                        opacity: isSelectable ? 1 : 0.5,
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs font-mono mt-0.5 w-20 shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                      {formatTime(event.created_at)}
                    </span>
                    <SeverityBadge severity={event.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{event.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {event.source}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          • {formatRelativeTime(event.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Event Drawer */}
      {selectedEvent && (
        <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
