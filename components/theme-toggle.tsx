'use client';

import { Check, Monitor, Moon, Sun, SunMoon } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: Array<{
  value: ThemeOption;
  label: string;
  icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

function isThemeOption(theme: string | undefined): theme is ThemeOption {
  return theme === 'light' || theme === 'dark' || theme === 'system';
}

export function ThemeToggle({ compact = true, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const selectedTheme = isThemeOption(theme) ? theme : 'system';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            compact ? 'w-9' : 'w-full justify-start px-2.5',
            className,
          )}
          aria-label="Change color theme"
        >
          <span className="grid size-4 place-items-center" aria-hidden="true">
            <SunMoon size={16} />
          </span>
          {!compact && <span className="text-sm font-medium">Appearance</span>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-40 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-[0_12px_35px_rgba(20,20,19,0.14)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <DropdownMenu.Label className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Theme
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={selectedTheme} onValueChange={(value) => setTheme(value)}>
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                <Icon size={16} className="text-muted-foreground" />
                <span className="flex-1">{label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check size={15} className="text-primary" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
