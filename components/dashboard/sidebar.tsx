'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    label: 'Sessions',
    href: '/sessions',
    icon: Calendar,
  },
  {
    label: 'Mentors',
    href: '/mentors',
    icon: Users,
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
];

const bottomItems = [
  {
    label: 'Settings',
    href: '#',
    icon: Settings,
  },
  {
    label: 'Help Center',
    href: '#',
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[var(--dash-card)] border-r border-[var(--dash-border)] h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--dash-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--dash-accent)] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Metric Flow</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all ${
                  isActive
                    ? 'bg-[var(--dash-accent)] text-white hover:bg-[var(--dash-accent-light)]'
                    : 'text-[var(--dash-text-secondary)] hover:text-white hover:bg-[var(--dash-card-hover)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="p-4 border-t border-[var(--dash-border)] space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-[var(--dash-text-secondary)] hover:text-white hover:bg-[var(--dash-card-hover)]"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
