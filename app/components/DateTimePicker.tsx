'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const theme = {
  dropdown: {
    bg: 'var(--color-bg-secondary)',
    border: 'var(--color-border-primary)',
    shadow: '0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 12px -4px rgba(0,0,0,0.08)',
  },
  header: {
    bg: 'var(--color-bg-tertiary)',
    text: 'var(--color-text-primary)',
    textMuted: 'var(--color-text-secondary)',
    border: 'var(--color-border-primary)',
  },
  cell: {
    text: 'var(--color-text-primary)',
    muted: 'var(--color-text-tertiary)',
    hover: 'var(--color-bg-hover)',
    selected: 'var(--color-accent)',
    selectedText: 'black',
    todayBorder: 'var(--color-accent)',
  },
  trigger: {
    bg: 'var(--color-bg-tertiary)',
    border: 'var(--color-border-primary)',
    text: 'var(--color-text-primary)',
    textMuted: 'var(--color-text-secondary)',
  },
  input: {
    bg: 'var(--color-bg-primary)',
    border: 'var(--color-border-primary)',
    text: 'var(--color-text-primary)',
  },
};

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function parseDatetimeLocal(s: string): Date {
  if (!s) return new Date();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
}

export function DateTimePicker({ value, onChange, id, label }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDatetimeLocal(value));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = parseDatetimeLocal(value);

  useEffect(() => {
    if (!open) return;
    setViewDate(parseDatetimeLocal(value));
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  type Cell = { day: number; isCurrentMonth: boolean; date: Date };
  const cells: Cell[] = [];
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1;
    cells.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month - 1, day),
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
    });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  const handleDayClick = (cell: Cell) => {
    const d = new Date(selected);
    d.setFullYear(cell.date.getFullYear());
    d.setMonth(cell.date.getMonth());
    d.setDate(cell.date.getDate());
    onChange(toDatetimeLocal(d));
  };

  const handleTimeChange = (type: 'hour' | 'minute' | 'second', v: number) => {
    const d = new Date(selected);
    if (type === 'hour') d.setHours(v);
    if (type === 'minute') d.setMinutes(v);
    if (type === 'second') d.setSeconds(v);
    onChange(toDatetimeLocal(d));
  };

  const displayLabel = value
    ? parseDatetimeLocal(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(',', '')
    : 'Select date & time';

  return (
    <div className="relative inline-block">
      {label && (
        <label htmlFor={id} className="text-xs whitespace-nowrap block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm min-w-[200px] transition-colors"
        style={{
          backgroundColor: theme.trigger.bg,
          borderColor: theme.trigger.border,
          color: value ? theme.trigger.text : theme.trigger.textMuted,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.trigger.bg;
        }}
      >
        <Calendar size={16} style={{ color: 'var(--color-text-tertiary)' }} className="shrink-0" />
        <span className="truncate">{displayLabel}</span>
        <ChevronRight
          size={14}
          className="ml-auto shrink-0 transition-transform"
          style={{ color: 'var(--color-text-tertiary)', transform: open ? 'rotate(90deg)' : undefined }}
        />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-1 z-50 rounded-xl border overflow-hidden"
          style={{
            backgroundColor: theme.dropdown.bg,
            borderColor: theme.dropdown.border,
            boxShadow: theme.dropdown.shadow,
            minWidth: 280,
          }}
        >
          {/* Month header */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b"
            style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}
          >
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1 rounded-md transition-colors"
              style={{ color: theme.header.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.cell.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium" style={{ color: theme.header.text }}>
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1 rounded-md transition-colors"
              style={{ color: theme.header.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.cell.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0.5 px-2 pt-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs py-1"
                style={{ color: theme.header.textMuted }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 px-2 pb-2">
            {cells.map((cell, i) => {
              const isSelected =
                selected.getDate() === cell.day &&
                selected.getMonth() === cell.date.getMonth() &&
                selected.getFullYear() === cell.date.getFullYear();
              const today =
                cell.isCurrentMonth &&
                new Date().getDate() === cell.day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(cell)}
                  className="w-8 h-8 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: isSelected ? theme.cell.selected : 'transparent',
                    color: isSelected ? theme.cell.selectedText : cell.isCurrentMonth ? theme.cell.text : theme.cell.muted,
                    border: today && !isSelected ? `2px solid ${theme.cell.todayBorder}` : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = theme.cell.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Time */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-t"
            style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}
          >
            <span className="text-xs" style={{ color: theme.header.textMuted }}>Time</span>
            <select
              value={selected.getHours()}
              onChange={(e) => handleTimeChange('hour', Number(e.target.value))}
              className="rounded-md px-2 py-1 text-sm outline-none"
              style={{
                backgroundColor: theme.input.bg,
                border: `1px solid ${theme.input.border}`,
                color: theme.input.text,
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span style={{ color: theme.header.textMuted }}>:</span>
            <select
              value={selected.getMinutes()}
              onChange={(e) => handleTimeChange('minute', Number(e.target.value))}
              className="rounded-md px-2 py-1 text-sm outline-none"
              style={{
                backgroundColor: theme.input.bg,
                border: `1px solid ${theme.input.border}`,
                color: theme.input.text,
              }}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
            <select
              value={selected.getSeconds()}
              onChange={(e) => handleTimeChange('second', Number(e.target.value))}
              className="rounded-md px-2 py-1 text-sm outline-none"
              style={{
                backgroundColor: theme.input.bg,
                border: `1px solid ${theme.input.border}`,
                color: theme.input.text,
              }}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
