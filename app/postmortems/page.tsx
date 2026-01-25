'use client';

import { useState, Suspense } from 'react';
import { ArrowLeft, Copy, Download, RefreshCw, Edit3, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function PostmortemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incidentId = searchParams.get('incidentId');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock postmortem data - in real app, fetch from API
  const postmortem = {
    id: 'pm_1',
    incidentId: incidentId || 'unknown',
    generatedAt: new Date().toISOString(),
    content: {
      summary: 'No postmortem data available. Generate a postmortem from the incident detail page.',
      timeline: 'No timeline data available.',
      rootCause: 'No root cause analysis available.',
      impact: 'No impact assessment available.',
      whatWentWrong: 'No analysis available.',
      actionItems: [],
      prevention: 'No prevention measures documented.',
    },
  };

  const handleCopy = () => {
    const markdown = generateMarkdown();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postmortem-${incidentId}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdown = () => {
    return `# Incident Postmortem

**Generated**: ${new Date(postmortem.generatedAt).toLocaleString()}
**Incident ID**: ${incidentId}

---

## Summary

${postmortem.content.summary}

## Timeline

${postmortem.content.timeline}

## Root Cause

${postmortem.content.rootCause}

## Impact

${postmortem.content.impact}

## What Went Wrong

${postmortem.content.whatWentWrong}

## Action Items

${postmortem.content.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n') || 'No action items.'}

## Prevention

${postmortem.content.prevention}
`;
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
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push(incidentId ? `/incidents/${incidentId}` : '/incidents')}
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
            Back to Incident
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">AI-Generated Postmortem</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Generated {new Date(postmortem.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
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
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
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
                <Download size={16} />
                Export
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border"
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
                <Edit3 size={16} />
                {isEditing ? 'Preview' : 'Edit'}
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
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
                <RefreshCw size={16} />
                Regenerate
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
              <h2 className="text-xl font-semibold mb-3">Summary</h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {postmortem.content.summary}
              </p>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Timeline</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.content.timeline}
                </pre>
              </div>
            </section>

            {/* Root Cause */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Root Cause</h2>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {postmortem.content.rootCause}
              </p>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Impact</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.content.impact}
                </pre>
              </div>
            </section>

            {/* What Went Wrong */}
            <section>
              <h2 className="text-xl font-semibold mb-3">What Went Wrong</h2>
              <div className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                {postmortem.content.whatWentWrong}
              </div>
            </section>

            {/* Action Items */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Action Items</h2>
              {postmortem.content.actionItems.length > 0 ? (
                <div className="space-y-2">
                  {postmortem.content.actionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg p-4 border"
                      style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderColor: 'var(--color-border-primary)',
                      }}
                    >
                      <span 
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        {index + 1}
                      </span>
                      <p className="text-sm flex-1" style={{ color: 'var(--color-text-secondary)' }}>{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No action items available.</p>
              )}
            </section>

            {/* Prevention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Prevention</h2>
              <div 
                className="rounded-lg p-5 border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {postmortem.content.prevention}
                </pre>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}

export default function PostmortemView() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    }>
      <PostmortemContent />
    </Suspense>
  );
}
