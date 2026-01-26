'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';
import { Clock } from 'lucide-react';

interface Postmortem {
  id: string;
  incident_title?: string;
  created_at: string;
}

async function fetchPostmortems(): Promise<Postmortem[]> {
  try {
    const response = await fetch(API_ENDPOINTS.postmortems, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch postmortems');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching postmortems:', error);
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

export default function PostmortemsPage() {
  const [postmortems, setPostmortems] = useState<Postmortem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostmortems().then((data) => {
      setPostmortems(data);
      setLoading(false);
    });
  }, []);

  // Sort by created_at DESC
  const sortedPostmortems = [...postmortems].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border-primary)' }} className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Postmortems</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Incident analysis and learnings • {sortedPostmortems.length} total
          </p>
        </div>
      </div>

      {/* Postmortems List */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {loading ? (
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }} className="rounded-xl p-8 text-center">
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading postmortems...</p>
            </div>
          ) : sortedPostmortems.length === 0 ? (
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }} className="rounded-xl p-8 text-center">
              <p style={{ color: 'var(--color-text-secondary)' }}>No postmortems generated</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedPostmortems.map((postmortem) => (
                <Link
                  key={postmortem.id}
                  href={`/postmortems/${postmortem.id}`}
                  className="block rounded-xl p-5 cursor-pointer transition-all group border"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                  }}
                >
                  <h3 
                    className="font-semibold mb-2 transition-colors group-hover:opacity-80"
                    style={{ 
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {postmortem.incident_title || 'Untitled Postmortem'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Clock size={12} />
                    <span>Created {formatRelativeTime(postmortem.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
