'use client';

import { useState, useEffect } from 'react';
import { Filter, Pause, Play } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { EventDrawer } from './EventDrawer';
import { API_ENDPOINTS } from '@/config/api';

interface Event {
  id: string;
  timestamp: string;
  severity: string;
  service: string;
  message: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
  environment?: string;
}

export function LiveFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');

  // Fetch events from incidents API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.incidents}?skip=0&limit=100`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const incidents = await response.json();
          // Convert incidents to events
          const convertedEvents: Event[] = incidents.map((incident: any) => ({
            id: incident.id,
            timestamp: incident.created_at,
            severity: incident.severity,
            service: incident.service,
            message: incident.message,
            stackTrace: incident.stacktrace,
            metadata: incident.incident_metadata,
            environment: incident.environment,
          }));
          setEvents(convertedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((event) => {
    if (severityFilter !== 'all' && event.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
    if (environmentFilter !== 'all' && event.environment?.toLowerCase() !== environmentFilter.toLowerCase()) return false;
    return true;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                autoScroll ? '' : ''
              }`}
              style={{
                backgroundColor: autoScroll ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                borderColor: autoScroll ? 'var(--color-accent)' : 'var(--color-border-primary)',
                color: autoScroll ? 'white' : 'var(--color-text-primary)',
              }}
              onMouseEnter={(e) => {
                if (!autoScroll) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!autoScroll) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                }
              }}
            >
              {autoScroll ? <Pause size={16} /> : <Play size={16} />}
              {autoScroll ? 'Pause' : 'Resume'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <option value="all">All Severities</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            <select
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <option value="all">All Environments</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-2">
          {filteredEvents.length === 0 ? (
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
            filteredEvents.map((event, index) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="rounded-lg p-4 cursor-pointer transition-all fade-in border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  animationDelay: `${index * 50}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono mt-0.5 w-20" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formatTime(event.timestamp)}
                  </span>
                  <SeverityBadge severity={event.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {event.service}
                      </span>
                    </div>
                    <p className="text-sm truncate">{event.message}</p>
                  </div>
                </div>
              </div>
            ))
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
