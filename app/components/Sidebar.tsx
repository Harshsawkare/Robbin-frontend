'use client';

import { Activity, FileText, Flame, Menu, ChevronLeft } from 'lucide-react';
// import { Settings as SettingsIcon } from 'lucide-react'; // Disabled for now
import { usePathname, useRouter } from 'next/navigation';

type View = 'feed' | 'incidents' | 'incident-detail' | 'postmortems'; // | 'settings'; // Disabled for now

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

      {/* Project Selector */}
      {/* {!collapsed && (
        <div className="px-4 py-3 border-b border-[grey]">
          <select 
            className="w-full px-3 py-2 bg-[--color-bg-tertiary] border border-[--color-border-primary] rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              borderColor: 'var(--color-border-primary)',
            }}
          >
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </div>
      )} */}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active ? '' : ''
              }`}
              style={{
                backgroundColor: active ? 'var(--color-bg-tertiary)' : 'transparent',
                color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
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
    </aside>
  );
}
