'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectSetup() {
  const router = useRouter();
  const [appName, setAppName] = useState('');
  const [environment, setEnvironment] = useState('production');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseAppId, setFirebaseAppId] = useState('');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState('');
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState('');
  const [firebaseMessagingSenderId, setFirebaseMessagingSenderId] = useState('');
  const [llmApiKey, setLlmApiKey] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-12" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome to Robbin</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Let's set up your first project and start capturing events.
        </p>
      </div>

      <div className="space-y-6">
        {/* App name */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-2">App name <span style={{ color: 'var(--color-accent)' }}>*</span></label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="my-awesome-app"
            required
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
          <label className="block text-sm font-medium mb-3">Environment <span style={{ color: 'var(--color-accent)' }}>*</span></label>
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
                  color: environment === env ? 'black' : 'var(--color-text-primary)',
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

        {/* Firebase Firestore config */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-1">Database</label>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            From Firebase Console → Project settings → Your apps. Required for Firestore.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Project ID <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={firebaseProjectId}
                onChange={(e) => setFirebaseProjectId(e.target.value)}
                placeholder="my-project-id"
                required
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                API Key <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={firebaseApiKey}
                onChange={(e) => setFirebaseApiKey(e.target.value)}
                placeholder="AIza..."
                required
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                App ID <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={firebaseAppId}
                onChange={(e) => setFirebaseAppId(e.target.value)}
                placeholder="1:123456789:web:abc..."
                required
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Auth Domain (optional)
              </label>
              <input
                type="text"
                value={firebaseAuthDomain}
                onChange={(e) => setFirebaseAuthDomain(e.target.value)}
                placeholder="my-project.firebaseapp.com"
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Storage Bucket (optional)
              </label>
              <input
                type="text"
                value={firebaseStorageBucket}
                onChange={(e) => setFirebaseStorageBucket(e.target.value)}
                placeholder="my-project.appspot.com"
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Messaging Sender ID (optional)
              </label>
              <input
                type="text"
                value={firebaseMessagingSenderId}
                onChange={(e) => setFirebaseMessagingSenderId(e.target.value)}
                placeholder="123456789012"
                className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* LLM API Key */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <label className="block text-sm font-medium mb-2">LLM API Key <span style={{ color: 'var(--color-accent)' }}>*</span></label>
          <input
            type="password"
            value={llmApiKey}
            onChange={(e) => setLlmApiKey(e.target.value)}
            placeholder="sk-..."
            required
            className="w-full px-4 py-2.5 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 border"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              borderColor: 'var(--color-border-primary)',
            }}
          />
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Used for AI-generated content (e.g. postmortems). Keep this key secure.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            disabled={!appName || !firebaseProjectId || !firebaseApiKey || !firebaseAppId || !llmApiKey}
            className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}
            onMouseEnter={(e) => {
              if (appName && firebaseProjectId && firebaseApiKey && firebaseAppId && llmApiKey) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
            }}
          >
            Save & continue
          </button>
        </div>
      </div>
    </div>
  );
}
