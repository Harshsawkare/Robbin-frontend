'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Code } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';

interface Event {
  id: string;
  source: string;
  title: string;
  stack_trace?: string;
  severity: string;
  metadata?: Record<string, any>;
  created_at: string;
}

interface EventDrawerProps {
  event: Event;
  onClose: () => void;
}

export function EventDrawer({ event, onClose }: EventDrawerProps) {
  const [showStackTrace, setShowStackTrace] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      />

      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-[600px] z-50 overflow-auto"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderLeft: '1px solid var(--color-border-primary)',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 p-6 flex items-start justify-between"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border-primary)',
          }}
        >
          <div>
            <h2 className="text-lg font-semibold mb-2">Event Details</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {formatTimestamp(event.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Severity
            </label>
            <SeverityBadge severity={event.severity} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Title
            </label>
            <p 
              className="text-sm px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              {event.title}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Source
            </label>
            <p 
              className="text-sm font-mono px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            >
              {event.source}
            </p>
          </div>

          {/* Stack Trace */}
          {event.stack_trace && (
            <div>
              <button
                onClick={() => setShowStackTrace(!showStackTrace)}
                className="flex items-center gap-2 text-sm font-medium mb-2 transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
              >
                {showStackTrace ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                Stack Trace
              </button>
              {showStackTrace && (
                <pre 
                  className="text-xs font-mono rounded-lg p-4 overflow-x-auto border"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  {event.stack_trace}
                </pre>
              )}
            </div>
          )}

          {/* Metadata */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Metadata
              </label>
              <div 
                className="rounded-lg overflow-hidden border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                {Object.entries(event.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center border-b last:border-b-0"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                  >
                    <span 
                      className="text-xs font-medium px-3 py-2 w-1/3"
                      style={{
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {key}
                    </span>
                    <span className="text-xs font-mono px-3 py-2 flex-1">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Toggle */}
          <div>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border"
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
              <Code size={16} />
              {showRawJson ? 'Hide' : 'Show'} Raw JSON
            </button>
            {showRawJson && (
              <pre 
                className="mt-3 text-xs font-mono rounded-lg p-4 overflow-x-auto border"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                {JSON.stringify(event, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
