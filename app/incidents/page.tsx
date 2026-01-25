'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';
import { SeverityBadge } from '@/app/components/SeverityBadge';
import { Clock, Activity } from 'lucide-react';

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

async function fetchIncidents(): Promise<Incident[]> {
  try {
    const url = `${API_ENDPOINTS.incidents}?skip=0&limit=100`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch incidents');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return [];
  }
}

function formatRelativeTime(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [newIncidentIds, setNewIncidentIds] = useState<Set<string>>(new Set());
  const previousIncidentIdsRef = useRef<Set<string>>(new Set());

  // Initial fetch and polling
  useEffect(() => {
    // Initial fetch
    fetchIncidents().then((data) => {
      setIncidents(data);
      previousIncidentIdsRef.current = new Set(data.map((inc) => inc.id));
    });

    // Poll every 30 seconds
    const interval = setInterval(() => {
      // Save scroll position before update
      const scrollTop = window.scrollY;

      fetchIncidents().then((data) => {
        // Detect new incidents
        const currentIds = new Set(data.map((inc) => inc.id));
        const previousIds = previousIncidentIdsRef.current;
        const newIds = new Set<string>();

        data.forEach((incident) => {
          if (!previousIds.has(incident.id)) {
            newIds.add(incident.id);
          }
        });

        // Update state
        setIncidents(data);
        previousIncidentIdsRef.current = currentIds;

        // Highlight new incidents
        if (newIds.size > 0) {
          setNewIncidentIds(newIds);
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setNewIncidentIds((prev) => {
              const updated = new Set(prev);
              newIds.forEach((id) => updated.delete(id));
              return updated;
            });
          }, 3000);
        }

        // Restore scroll position after DOM update
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollTop);
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sort incidents: by created_at (newest first)
  const sortedIncidents = [...incidents].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-primary)' }} className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Incidents</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Grouped failures and patterns • {sortedIncidents.length} total
          </p>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {sortedIncidents.length === 0 ? (
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }} className="rounded-xl p-8 text-center">
              <p style={{ color: 'var(--color-text-secondary)' }}>No incidents found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedIncidents.map((incident) => {
                const isNew = newIncidentIds.has(incident.id);
                return (
                  <Link
                    key={incident.id}
                    href={`/incidents/${incident.id}`}
                    className={`block rounded-xl p-5 cursor-pointer transition-all group incident-card ${
                      isNew ? 'fade-in' : ''
                    }`}
                    style={{
                      backgroundColor: isNew ? 'var(--color-warning-bg)' : 'var(--color-bg-secondary)',
                      border: `1px solid ${isNew ? 'var(--color-warning-border)' : 'var(--color-border-primary)'}`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold mb-2 transition-colors group-hover:opacity-80"
                          style={{ 
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {incident.message || 'Untitled Incident'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={incident.severity} showIcon={false} />
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-medium border"
                            style={{
                              backgroundColor: 'var(--color-info-bg)',
                              color: 'var(--color-info)',
                              borderColor: 'var(--color-info-border)',
                            }}
                          >
                            {incident.environment}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="mb-4">
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Service:</span>
                      <p className="text-sm font-mono mt-0.5" style={{ color: 'var(--color-text-primary)' }}>{incident.service}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <Activity size={12} />
                          Event Count
                        </div>
                        <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>1</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <Clock size={12} />
                          Created
                        </div>
                        <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {formatRelativeTime(incident.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      <span>First seen {formatRelativeTime(incident.created_at)}</span>
                      <span>•</span>
                      <span>Last seen {formatRelativeTime(incident.created_at)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
