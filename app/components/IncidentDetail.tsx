'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SeverityBadge } from './SeverityBadge';
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

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
  summary?: string;
  events: Event[];
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
  const [generatingPostmortem, setGeneratingPostmortem] = useState(false);

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

  const handleGeneratePostmortem = async () => {
    setGeneratingPostmortem(true);
    try {
      const response = await fetch(API_ENDPOINTS.generatePostmortem(incidentId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to postmortem detail page
        router.push(`/postmortems/${data.id}`);
      } else {
        console.error('Failed to generate postmortem');
        alert('Failed to generate postmortem. Please try again.');
      }
    } catch (error) {
      console.error('Error generating postmortem:', error);
      alert('Error generating postmortem. Please try again.');
    } finally {
      setGeneratingPostmortem(false);
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
              <h1 className="text-2xl font-semibold mb-3">{incident.title || 'Untitled Incident'}</h1>
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
                  {incident.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGeneratePostmortem}
                disabled={generatingPostmortem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  if (!generatingPostmortem) {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                }}
              >
                <FileText size={14} />
                {generatingPostmortem ? 'Generating...' : 'Generate Postmortem'}
              </button>
              {incident.status.toLowerCase() !== 'resolved' && (
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border"
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
                  <CheckCircle size={14} />
                  Mark Resolved
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          {incident.summary && (
            <div className="mb-4">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{incident.summary}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Event Count</p>
              <p className="text-xl font-semibold">{incident.events?.length || 0}</p>
            </div>
            <div 
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Created</p>
              <p className="text-sm">{new Date(incident.created_at).toLocaleString()}</p>
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
                <h2 className="font-semibold mb-4">Related Events</h2>
                <div className="space-y-3">
                  {incident.events && incident.events.length > 0 ? (
                    incident.events.map((event) => (
                      <div
                        key={event.id}
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
                                {formatTimestamp(event.created_at)}
                              </span>
                              <SeverityBadge severity={event.severity} showIcon={false} />
                              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                {event.source}
                              </span>
                            </div>
                            <p className="text-sm">{event.title}</p>
                          </div>
                        </button>

                        {expandedEvents.has(event.id) && event.stack_trace && (
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
                              {event.stack_trace}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No events available</p>
                  )}
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

          </div>
        </div>
      </div>
    </div>
  );
}
