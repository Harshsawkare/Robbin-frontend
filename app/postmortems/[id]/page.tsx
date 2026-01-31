'use client';

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Copy, Download, Check } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

interface Postmortem {
  id: string;
  summary: string;
  timeline: string;
  impact: string;
  root_cause: string;
  action_items: string[];
  prevention: string;
  created_at: string;
}

function PostmortemDetailContent() {
  const router = useRouter();
  const params = useParams();
  const postmortemId = params.id as string;
  const [postmortem, setPostmortem] = useState<Postmortem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPostmortem = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.postmortemById(postmortemId), {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          // Normalize action_items to always be an array
          const normalizedData = {
            ...data,
            action_items: Array.isArray(data.action_items) 
              ? data.action_items 
              : typeof data.action_items === 'string' && data.action_items.trim()
                ? data.action_items.split('\n').filter((item: string) => item.trim())
                : []
          };
          setPostmortem(normalizedData);
        }
      } catch (error) {
        console.error('Error fetching postmortem:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postmortemId) {
      fetchPostmortem();
    }
  }, [postmortemId]);

  const handleCopy = () => {
    if (!postmortem) return;
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!postmortem) return;
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postmortem-${postmortemId}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdown = () => {
    if (!postmortem) return '';
    return `# Incident Postmortem

**Generated**: ${new Date(postmortem.created_at).toLocaleString()}
**Postmortem ID**: ${postmortemId}

---

## Summary

${postmortem.summary}

## Timeline

${postmortem.timeline}

## Root Cause

${postmortem.root_cause}

## Impact

${postmortem.impact}

## Action Items

${Array.isArray(postmortem.action_items) && postmortem.action_items.length > 0
  ? postmortem.action_items.map((item, i) => `${i + 1}. ${item}`).join('\n')
  : 'No action items.'}

## Prevention

${postmortem.prevention}
`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!postmortem) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Postmortem not found</p>
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
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/postmortems')}
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
            Back to Postmortems
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Postmortem</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Created {new Date(postmortem.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
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
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
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
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-4xl mx-auto p-12">
          <article className="space-y-8">
            {/* Summary */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Summary</h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {postmortem.summary}
              </p>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Timeline</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.timeline}
                </pre>
              </div>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Impact</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.impact}
                </pre>
              </div>
            </section>

            {/* Root Cause */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Root Cause</h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {postmortem.root_cause}
              </p>
            </section>

            {/* Action Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Action Items</h2>
              {Array.isArray(postmortem.action_items) && postmortem.action_items.length > 0 ? (
                <div className="space-y-2">
                  {postmortem.action_items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4 border"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderColor: 'var(--color-border-primary)',
                      }}
                    >
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No action items available.</p>
              )}
            </section>

            {/* Prevention */}
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent)' }}>Prevention</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.prevention}
                </pre>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}

export default function PostmortemDetailPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    }>
      <PostmortemDetailContent />
    </Suspense>
  );
}
