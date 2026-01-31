'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  FileText,
  Flame,
  Menu,
  ChevronLeft,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react';
// import { Settings as SettingsIcon } from 'lucide-react'; // Disabled for now
import { usePathname, useRouter } from 'next/navigation';

type View = 'feed' | 'incidents' | 'incident-detail' | 'postmortems'; // | 'settings'; // Disabled for now

type App = {
  id: string;
  name: string;
  environment: string;
};

const DEFAULT_APPS: App[] = [
  { id: 'prod', name: 'Previously-on', environment: 'Production' },
  { id: 'staging', name: 'Previously-on', environment: 'Staging' },
  { id: 'prod', name: 'Arth', environment: 'Production' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [apps, setApps] = useState<App[]>(DEFAULT_APPS);
  const [currentAppId, setCurrentAppId] = useState<string | null>(
    DEFAULT_APPS[0]?.id ?? null
  );
  const currentApp = apps.find((app) => app.id === currentAppId) ?? null;

  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [newAppName, setNewAppName] = useState('');
  const [newAppEnvironment, setNewAppEnvironment] = useState('Production');

  const navItems = [
    { id: 'feed' as View, label: 'Live Feed', icon: Activity, path: '/' },
    { id: 'incidents' as View, label: 'Incidents', icon: Flame, path: '/incidents' },
    { id: 'postmortems' as View, label: 'Postmortems', icon: FileText, path: '/postmortems' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSwitchApp = (appId: string) => {
    setCurrentAppId(appId);
  };

  const handleCreateApp = (name: string, environment: string) => {
    const id =
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      `app-${Date.now().toString(36)}`;
    const newApp: App = {
      id,
      name: name.trim(),
      environment: environment.trim() || 'Environment',
    };

    setApps((prev) => [...prev, newApp]);
    setCurrentAppId(newApp.id);
  };

  const handleCreateAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    handleCreateApp(newAppName, newAppEnvironment);
    setIsCreateAppOpen(false);
    setNewAppName('');
    setNewAppEnvironment('Production');
  };

  useEffect(() => {
    if (!isAppMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsAppMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAppMenuOpen(false);
        setIsCreateAppOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isAppMenuOpen]);

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-[--color-bg-secondary] border-r border-[--color-border-primary] flex flex-col transition-all duration-200 flex-shrink-0`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border-primary)',
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[grey]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-[--color-accent] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div> */}
            <span className="font-semibold text-lg">Robbin</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-[--color-bg-hover] rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* App Selector (Primary CTA) */}
      {!collapsed && (
        <div className="px-4 py-3 border-b-[0.5px] border-[grey] relative">
          <button
            onClick={() => setIsAppMenuOpen((open) => !open)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[--color-bg-tertiary] hover:bg-[--color-bg-hover] border-[0.5px] border-[grey] rounded-lg transition-colors group"
          >
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-sm font-medium text-[--color-text-primary] truncate w-full text-left">
                {currentApp?.name || 'Select App'}
              </span>
              <span className="text-xs text-[--color-text-secondary]">
                {currentApp?.environment || 'Environment'}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-[--color-text-secondary] transition-transform ${
                isAppMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isAppMenuOpen && (
            <div
              ref={menuRef}
              className="absolute left-4 right-4 top-[calc(100%+4px)] border-[0.5px] border-[grey] rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
              style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      handleSwitchApp(app.id);
                      setIsAppMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-[--color-bg-hover] text-left transition-colors"
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span
                        className={`text-sm ${
                          app.id === currentAppId
                            ? 'font-medium text-[--color-text-primary]'
                            : 'text-[--color-text-secondary]'
                        }`}
                      >
                        {app.name}
                      </span>
                      <span className="text-xs text-[--color-text-tertiary]">
                        {app.environment}
                      </span>
                    </div>
                    {app.id === currentAppId && (
                      <Check size={14} className="text-[--color-accent]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t-[0.5px] border-[grey] p-1">
                <button
                  onClick={() => {
                    setIsCreateAppOpen(true);
                    setIsAppMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-bg-hover] rounded-md transition-colors"
                >
                  <Plus size={14} />
                  Create New App
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: active ? 'var(--color-bg-tertiary)' : 'transparent',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Settings - Disabled for now */}
      {/* <div className="p-3 border-t border-[--color-border-primary]">
        <button
          onClick={() => handleNavigation('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors`}
          style={{
            backgroundColor: isActive('/settings') ? 'var(--color-bg-tertiary)' : 'transparent',
            color: isActive('/settings') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/settings')) {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('/settings')) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
          title={collapsed ? 'Settings' : undefined}
        >
          <SettingsIcon size={20} />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>
      </div> */}

      {/* Create App Dialog */}
      {isCreateAppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div 
            className="w-full max-w-md rounded-xl border-[0.5px] border-[grey] shadow-xl"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-[0.5px] border-[grey]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[--color-accent] flex items-center justify-center text-xs font-semibold text-white">
                  App
                </div>
                <div>
                  <h2 className="text-sm font-medium text-[--color-text-primary]">
                    Create New App
                  </h2>
                  <p className="text-xs text-[--color-text-secondary]">
                    Set up a new application to stream and analyze logs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateAppOpen(false)}
                className="text-[--color-text-tertiary] hover:text-[--color-text-primary] text-xs"
              >
                Esc
              </button>
            </div>
            <form onSubmit={handleCreateAppSubmit} className="px-5 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[--color-text-secondary]">
                  App Name
                </label>
                <input
                  autoFocus
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. Payments Service"
                  className="w-full rounded-md border-[0.5px] border-[grey] bg-[--color-bg-tertiary] px-3 py-2 text-sm text-[--color-text-primary] outline-none focus:ring-2 focus:ring-[--color-accent]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[--color-text-secondary]">
                  Environment
                </label>
                <select
                  value={newAppEnvironment}
                  onChange={(e) => setNewAppEnvironment(e.target.value)}
                  className="w-full rounded-md border-[0.5px] border-[grey] bg-[--color-bg-tertiary] px-3 py-2 text-sm text-[--color-text-primary] outline-none focus:ring-2 focus:ring-[--color-accent]"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="Sandbox">Sandbox</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateAppOpen(false)}
                  className="text-xs text-[--color-text-tertiary] hover:text-[--color-text-secondary]"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewAppName('');
                      setNewAppEnvironment('Production');
                    }}
                    className="px-3 py-1.5 text-xs rounded-md border-[0.5px] border-[grey] text-[--color-text-secondary] hover:bg-[--color-bg-hover]"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs rounded-md bg-[--color-accent] text-white font-medium hover:opacity-90 disabled:opacity-50"
                    disabled={!newAppName.trim()}
                  >
                    Create App
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
