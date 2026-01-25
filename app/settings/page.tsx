'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Trash2 } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('rb_live_4f8a9b2c1d3e5f6g7h8i9j0k1l2m3n4o');
  const [copied, setCopied] = useState(false);
  const [dataRetention, setDataRetention] = useState('30');
  const [slackWebhook, setSlackWebhook] = useState('');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `rb_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div 
        className="p-6"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border-primary)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Manage your project configuration and integrations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* API Keys */}
        <section 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <h2 className="font-semibold mb-4">API Keys</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Production API Key</label>
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
                  onClick={handleCopyKey}
                  className="px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 border"
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
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  className="px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-white"
                  style={{ backgroundColor: 'var(--color-error)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                This key grants full access to your project. Regenerating will invalidate the old
                key immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Environment Configuration */}
        <section 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <h2 className="font-semibold mb-4">Environment Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Active Environments</label>
              <div className="space-y-2">
                {['production', 'staging', 'development'].map((env) => (
                  <div
                    key={env}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      borderColor: 'var(--color-border-primary)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <span className="text-sm font-mono">{env}</span>
                    </div>
                    <button 
                      className="transition-colors"
                      style={{ color: 'var(--color-text-tertiary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-error)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
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
                Add Environment
              </button>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <h2 className="font-semibold mb-4">Data Retention</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Retention Period</label>
              <select
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Events older than this will be automatically deleted. Postmortems are retained
                indefinitely.
              </p>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          <h2 className="font-semibold mb-4">Integrations</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Slack Webhook URL</label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 border"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary)',
                  borderColor: 'var(--color-border-primary)',
                }}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Receive incident notifications in your Slack workspace
              </p>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
              <div 
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              >
                <div>
                  <p className="text-sm font-medium mb-1">PagerDuty</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    Create incidents automatically
                  </p>
                </div>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }}
                >
                  Configure
                </button>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div>
                <p className="text-sm font-medium mb-1">GitHub</p>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  Create issues from incidents
                </p>
              </div>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
              >
                Configure
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section 
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            borderColor: 'var(--color-error-border)',
          }}
        >
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-error)' }}>Danger Zone</h2>
          <div className="space-y-3">
            <button 
              className="w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--color-error)',
                color: 'var(--color-error)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Trash2 size={16} />
              Delete All Events
            </button>
            <button 
              className="w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: 'var(--color-error)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Trash2 size={16} />
              Delete Project
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
