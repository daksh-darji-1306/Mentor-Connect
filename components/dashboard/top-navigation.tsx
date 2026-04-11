'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, MessageSquare, Bell, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: Home },
    { label: 'Sessions', href: '/sessions', icon: Calendar },
    { label: 'Mentors', href: '/mentors', icon: Users },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(0,212,255,0.1)] bg-[rgba(10,14,39,0.8)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00d084]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-[var(--dashboard-text-primary)] hidden sm:inline">Mentor</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <div key={item.href} className="relative">
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`gap-2 text-sm transition-all ${
                        isActive
                          ? 'text-[#00d4ff]'
                          : 'text-[var(--dashboard-text-secondary)] hover:text-[var(--dashboard-text-primary)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#00d084]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[var(--dashboard-text-secondary)] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[var(--dashboard-text-secondary)] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
