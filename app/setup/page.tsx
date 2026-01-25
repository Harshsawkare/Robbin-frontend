'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectSetup() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [environment, setEnvironment] = useState('production');
  const [copied, setCopied] = useState(false);
  const apiKey = 'rb_live_4f8a9b2c1d3e5f6g7h8i9j0k1l2m3n4o';

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `// Install Robbin SDK
npm install @robbin/node

// Initialize in your app
import { Robbin } from '@robbin/node';

const robbin = new Robbin({
  apiKey: '${apiKey}',
  environment: '${environment}'
});

// Send an event
try {
  // Your code here
} catch (error) {
  robbin.captureError(error, {
    context: {
      user: req.user?.id,
      endpoint: req.path
    }
  });
}`;

  return (
    <div className="max-w-3xl mx-auto p-12" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome to Robbin</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Let's set up your first project and start capturing events.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Name */}
        <div 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="my-awesome-app"
            className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 border"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              borderColor: 'var(--color-border-primary)',
            }}
          />
        </div>

        {/* Environment */}
        <div 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-3">Environment</label>
          <div className="flex gap-3">
            {['production', 'staging', 'development'].map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  environment === env ? '' : ''
                }`}
                style={{
                  backgroundColor: environment === env ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                  borderColor: environment === env ? 'var(--color-accent)' : 'var(--color-border-primary)',
                  color: environment === env ? 'white' : 'var(--color-text-primary)',
                }}
                onMouseEnter={(e) => {
                  if (environment !== env) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (environment !== env) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                  }
                }}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-2">API Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              readOnly
              className="flex-1 px-4 py-2.5 rounded-lg font-mono text-sm border"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderColor: 'var(--color-border-primary)',
              }}
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Keep this key secure. You can regenerate it anytime in Settings.
          </p>
        </div>

        {/* Code Snippet */}
        <div 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-3">Quick Start</label>
          <pre 
            className="rounded-lg p-4 overflow-x-auto text-xs border"
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-primary)',
            }}
          >
            <code>{codeSnippet}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            disabled={!projectName}
            className="px-6 py-3 rounded-lg font-medium transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-accent)' }}
            onMouseEnter={(e) => {
              if (projectName) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (projectName) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              }
            }}
          >
            Create Project
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-lg font-medium transition-colors border"
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
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
