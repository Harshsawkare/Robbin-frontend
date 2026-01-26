'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';
import { SeverityBadge } from '@/app/components/SeverityBadge';
import { Clock } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
}

async function fetchIncidents(): Promise<Incident[]> {
  try {
    const response = await fetch(API_ENDPOINTS.incidents, {
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

type FilterType = 'all' | 'open' | 'resolved';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIncidentIds, setNewIncidentIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  const previousIncidentIdsRef = useRef<Set<string>>(new Set());

  // Initial fetch and polling
  useEffect(() => {
    // Initial fetch
    fetchIncidents().then((data) => {
      setIncidents(data);
      setLoading(false);
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

  // Filter incidents based on selected filter
  const filteredIncidents = sortedIncidents.filter((incident) => {
    if (filter === 'all') return true;
    if (filter === 'resolved') {
      return incident.status.toLowerCase() === 'resolved';
    }
    if (filter === 'open') {
      return incident.status.toLowerCase() !== 'resolved';
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-primary)' }} className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Incidents</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Grouped failures and patterns • {filteredIncidents.length} {filter !== 'all' ? `${filter}` : 'total'}
              </p>
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: filter === 'all' ? 'var(--color-primary)' : 'transparent',
                  color: filter === 'all' ? 'white' : 'var(--color-text-primary)',
                  border: filter === 'all' ? 'none' : '1px solid var(--color-border-primary)',
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter('open')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'open'
                    ? 'text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: filter === 'open' ? 'var(--color-primary)' : 'transparent',
                  color: filter === 'open' ? 'white' : 'var(--color-text-primary)',
                  border: filter === 'open' ? 'none' : '1px solid var(--color-border-primary)',
                }}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'resolved'
                    ? 'text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: filter === 'resolved' ? 'var(--color-primary)' : 'transparent',
                  color: filter === 'resolved' ? 'white' : 'var(--color-text-primary)',
                  border: filter === 'resolved' ? 'none' : '1px solid var(--color-border-primary)',
                }}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }} className="rounded-xl p-8 text-center">
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading incidents...</p>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }} className="rounded-xl p-8 text-center">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {filter === 'all' ? 'No incidents yet' : `No ${filter} incidents`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredIncidents.map((incident) => {
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
                          {incident.title || 'Untitled Incident'}
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
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Created Time */}
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <Clock size={12} />
                      <span>Created {formatRelativeTime(incident.created_at)}</span>
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
