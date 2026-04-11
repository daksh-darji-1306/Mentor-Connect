'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  Bell,
  User,
  ChevronDown,
  TrendingUp,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export default function AnalyticsMenteeDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('last7days');

  const stats: StatCard[] = [
    {
      label: 'Next Session',
      value: 'Tomorrow, 2:00 PM',
      change: '+2 upcoming',
      isPositive: true,
    },
    {
      label: 'Active Projects',
      value: '3',
      change: '+1 this week',
      isPositive: true,
    },
    {
      label: 'Learning Hours',
      value: '24.5 hrs',
      change: '+3.2 hours',
      isPositive: true,
    },
    {
      label: 'Completion Rate',
      value: '87%',
      change: '+5%',
      isPositive: true,
    },
  ];

  const heatmapData = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 12 }, (_, hour) => ({
      hour: 9 + hour,
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
      value: Math.floor(Math.random() * 5),
    }))
  ).flat();

  const upcomingSessions = [
    {
      id: 1,
      mentorName: 'Sarah Chen',
      date: 'Tomorrow',
      time: '2:00 PM',
      duration: '1 hour',
      type: 'Video Call',
      topic: 'Career Planning',
    },
    {
      id: 2,
      mentorName: 'James Williams',
      date: 'Friday',
      time: '3:30 PM',
      duration: '1.5 hours',
      type: 'Video Call',
      topic: 'Technical Interview Prep',
    },
    {
      id: 3,
      mentorName: 'Maria Rodriguez',
      date: 'Next Mon',
      time: '11:00 AM',
      duration: '45 mins',
      type: 'Chat',
      topic: 'Portfolio Review',
    },
  ];

  const learningResources = [
    { id: 1, title: 'System Design Basics', category: 'Technical', progress: 75 },
    { id: 2, title: 'Communication Skills', category: 'Soft Skills', progress: 45 },
    { id: 3, title: 'Leadership Fundamentals', category: 'Management', progress: 60 },
    { id: 4, title: 'Product Thinking', category: 'Strategy', progress: 90 },
  ];

  return (
    <div className="w-full">
      {/* Header with Search and Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-[var(--dash-text-secondary)]">Welcome back! Here's your mentorship progress.</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-[var(--dash-card)] border border-[var(--dash-border)] rounded-lg text-white placeholder-[var(--dash-text-secondary)]"
            />
            <Button
              variant="outline"
              className="text-[var(--dash-text-secondary)] border-[var(--dash-border)] hover:text-white hover:border-[var(--dash-accent)]"
            >
              {selectedPeriod === 'last7days' ? 'Last 7 Days' : 'Custom'}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-[var(--dash-card)] border-[var(--dash-border)] p-6 hover:bg-[var(--dash-card-hover)] transition-all">
            <p className="text-[var(--dash-text-secondary)] text-sm font-medium mb-3">{stat.label}</p>
            <p className="text-2xl font-bold text-white mb-3">{stat.value}</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--dash-accent)]" />
              <span className="text-xs text-[var(--dash-accent)]">{stat.change}</span>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
      >
        {/* Sessions by Time Heatmap */}
        <Card className="lg:col-span-2 bg-[var(--dash-card)] border-[var(--dash-border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Sessions by Time</h2>
            <span className="text-xs text-[var(--dash-text-secondary)]">Last 7 days</span>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIdx) => (
                <div key={`day-${dayIdx}`} className="flex flex-col gap-1">
                  <div className="text-xs text-[var(--dash-text-secondary)] text-center w-12 mb-1">{day}</div>
                  {[...Array(12)].map((_, hourIdx) => {
                    const intensity = Math.floor(Math.random() * 5);
                    const colors = [
                      'bg-[#1a1a1a]',
                      'bg-[#ff6b35]/20',
                      'bg-[#ff6b35]/40',
                      'bg-[#ff6b35]/70',
                      'bg-[#ff6b35]',
                    ];
                    return (
                      <div
                        key={`hour-${dayIdx}-${hourIdx}`}
                        className={`w-12 h-6 rounded ${colors[intensity]} border border-[var(--dash-border)] hover:border-[var(--dash-accent)] transition-colors`}
                        title={`${9 + hourIdx}:00`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs">
            <span className="text-[var(--dash-text-secondary)]">More</span>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded ${
                    i === 0
                      ? 'bg-[#1a1a1a]'
                      : i === 1
                      ? 'bg-[#ff6b35]/20'
                      : i === 2
                      ? 'bg-[#ff6b35]/40'
                      : i === 3
                      ? 'bg-[#ff6b35]/70'
                      : 'bg-[#ff6b35]'
                  } border border-[var(--dash-border)]`}
                />
              ))}
            </div>
            <span className="text-[var(--dash-text-secondary)]">Less</span>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-[var(--dash-card)] border-[var(--dash-border)] p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Monthly Progress</h2>

          <div className="space-y-4">
            {learningResources.slice(0, 3).map((resource) => (
              <div key={resource.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white">{resource.title}</p>
                  <span className="text-xs text-[var(--dash-accent)] font-medium">{resource.progress}%</span>
                </div>
                <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--dash-accent)] transition-all duration-300"
                    style={{ width: `${resource.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-6 bg-[var(--dash-accent)] text-white hover:bg-[var(--dash-accent-light)]">
            View All Progress
          </Button>
        </Card>
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[var(--dash-card)] border-[var(--dash-border)] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Upcoming Sessions</h2>
            <Link href="/sessions" className="text-[var(--dash-accent)] text-sm hover:text-[var(--dash-accent-light)]">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-[var(--dash-border)] rounded-lg hover:border-[var(--dash-accent)] transition-all"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{session.mentorName}</p>
                  <p className="text-xs text-[var(--dash-text-secondary)] mt-1">{session.topic}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{session.time}</p>
                  <p className="text-xs text-[var(--dash-text-secondary)]">{session.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Learning Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[var(--dash-card)] border-[var(--dash-border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Learning Resources</h2>
            <Button variant="ghost" size="sm" className="text-[var(--dash-text-secondary)] hover:text-white">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningResources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 border border-[var(--dash-border)] rounded-lg hover:border-[var(--dash-accent)] hover:bg-[var(--dash-card-hover)] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">{resource.title}</p>
                    <p className="text-xs text-[var(--dash-text-secondary)] mt-1">{resource.category}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-[var(--dash-accent)]" />
                </div>
                <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--dash-accent)] transition-all duration-300"
                    style={{ width: `${resource.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
