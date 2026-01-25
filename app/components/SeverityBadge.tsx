'use client';

import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

type Severity = 'error' | 'warning' | 'info' | 'critical';

interface SeverityBadgeProps {
  severity: Severity | string;
  showIcon?: boolean;
}

export function SeverityBadge({ severity, showIcon = true }: SeverityBadgeProps) {
  const normalizedSeverity = severity.toLowerCase() as Severity;
  
  const config = {
    error: {
      bg: 'var(--color-error-bg)',
      border: 'var(--color-error-border)',
      text: 'var(--color-error)',
      icon: AlertCircle,
      label: 'Error',
    },
    critical: {
      bg: 'var(--color-error-bg)',
      border: 'var(--color-error-border)',
      text: 'var(--color-error)',
      icon: AlertCircle,
      label: 'Critical',
    },
    warning: {
      bg: 'var(--color-warning-bg)',
      border: 'var(--color-warning-border)',
      text: 'var(--color-warning)',
      icon: AlertTriangle,
      label: 'Warning',
    },
    info: {
      bg: 'var(--color-info-bg)',
      border: 'var(--color-info-border)',
      text: 'var(--color-info)',
      icon: Info,
      label: 'Info',
    },
  };

  const severityKey = normalizedSeverity === 'critical' ? 'critical' : 
                     normalizedSeverity === 'error' ? 'error' :
                     normalizedSeverity === 'warning' ? 'warning' : 'info';
  
  const { bg, border, text, icon: Icon, label } = config[severityKey];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: text,
        border: '1px solid',
      }}
    >
      {showIcon && <Icon size={12} />}
      {label}
    </span>
  );
}
