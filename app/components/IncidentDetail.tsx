'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SeverityBadge } from './SeverityBadge';
import { API_ENDPOINTS } from '@/config/api';

interface Incident {
  id: string;
  service: string;
  environment: string;
  severity: string;
  message: string;
  stacktrace: string;
  incident_metadata: Record<string, any>;
  created_at: string;
}

interface IncidentDetailProps {
  incidentId: string;
}

export function IncidentDetail({ incidentId }: IncidentDetailProps) {
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch incident details
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.incidentById(incidentId), {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setIncident(data);
        }
      } catch (error) {
        console.error('Error fetching incident:', error);
      } finally {
        setLoading(false);
      }
    };

    if (incidentId) {
      fetchIncident();
    }
  }, [incidentId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Incident not found</p>
      </div>
    );
  }

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  const formatDuration = () => {
    // For now, just show relative time
    const seconds = Math.floor((Date.now() - new Date(incident.created_at).getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Create a single event from the incident
  const event = {
    id: incident.id,
    timestamp: incident.created_at,
    severity: incident.severity,
    service: incident.service,
    message: incident.message,
    stackTrace: incident.stacktrace,
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
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/incidents')}
            className="flex items-center gap-2 text-sm mb-4 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <ArrowLeft size={16} />
            Back to Incidents
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold mb-3">{incident.message || 'Untitled Incident'}</h1>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-medium border"
                  style={{
                    backgroundColor: 'var(--color-info-bg)',
                    color: 'var(--color-info)',
                    borderColor: 'var(--color-info-border)',
                  }}
                >
                  ongoing
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/postmortems?incidentId=${incidentId}`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors"
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
                <FileText size={16} />
                Generate Postmortem
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border"
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
                <CheckCircle size={16} />
                Mark Resolved
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Event Count</p>
              <p className="text-xl font-semibold">1</p>
            </div>
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Duration</p>
              <p className="text-xl font-semibold">{formatDuration()}</p>
            </div>
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Service</p>
              <p className="text-sm font-mono">{incident.service}</p>
            </div>
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>First Seen</p>
              <p className="text-sm">{new Date(incident.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Event Timeline */}
            <div className="col-span-2 space-y-6">
              <div>
                <h2 className="font-semibold mb-4">Event Timeline</h2>
                <div className="space-y-3">
                  <div
                    className="rounded-lg overflow-hidden border"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border-primary)',
                    }}
                  >
                    <button
                      onClick={() => toggleEventExpansion(event.id)}
                      className="w-full p-4 flex items-start gap-3 transition-colors text-left border-0"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {expandedEvents.has(event.id) ? (
                        <ChevronDown size={20} style={{ color: 'var(--color-text-secondary)' }} className="mt-0.5" />
                      ) : (
                        <ChevronRight size={20} style={{ color: 'var(--color-text-secondary)' }} className="mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                            {formatTimestamp(event.timestamp)}
                          </span>
                          <SeverityBadge severity={event.severity} showIcon={false} />
                        </div>
                        <p className="text-sm">{event.message}</p>
                      </div>
                    </button>

                    {expandedEvents.has(event.id) && event.stackTrace && (
                      <div 
                        className="px-4 pb-4 pt-4 border-t"
                        style={{
                          backgroundColor: 'var(--color-bg-primary)',
                          borderTopColor: 'var(--color-border-primary)',
                        }}
                      >
                        <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Stack Trace
                        </p>
                        <pre 
                          className="text-xs font-mono rounded p-3 overflow-x-auto border"
                          style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderColor: 'var(--color-border-primary)',
                          }}
                        >
                          {event.stackTrace}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h2 className="font-semibold mb-3">Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add investigation notes..."
                  className="w-full h-32 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 text-sm border"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                />
              </div>
            </div>

            {/* Context Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold mb-3">Context</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Affected Services
                    </p>
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
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      Environment
                    </p>
                    <div className="space-y-1">
                      <div
                        className="text-xs font-mono px-2 py-1.5 rounded border"
                        style={{
                          backgroundColor: 'var(--color-bg-tertiary)',
                          borderColor: 'var(--color-border-primary)',
                        }}
                      >
                        {incident.environment}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
