'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Folder,
  CheckSquare,
  MessageSquare,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  progress: number;
  goal: string;
  streak: number;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  accent: string;
  description: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Mock user data
const mockUser: User = {
  id: '1',
  firstName: 'Alex',
  progress: 72,
  goal: 'Master Full Stack Development',
  streak: 15,
};

// Mock activity data
const recentActivity = [
  {
    id: '1',
    type: 'session_completed',
    mentor: 'Sarah Chen',
    title: 'Completed: Advanced React Patterns',
    time: '2 hours ago',
    icon: CheckSquare,
  },
  {
    id: '2',
    type: 'project_submitted',
    mentor: 'Mike Johnson',
    title: 'Submitted: E-commerce Platform',
    time: '1 day ago',
    icon: Folder,
  },
  {
    id: '3',
    type: 'message_received',
    mentor: 'Emily Rodriguez',
    title: 'New feedback on your portfolio',
    time: '2 days ago',
    icon: MessageSquare,
  },
  {
    id: '4',
    type: 'milestone_reached',
    mentor: 'System',
    title: 'Reached 100 days learning streak!',
    time: '5 days ago',
    icon: Flame,
  },
];

// Mock mentor data
const mentors = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Full Stack Engineer',
    avatar: '👩‍💻',
    online: true,
    expertise: 'React, Node.js',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    role: 'Product Designer',
    avatar: '👨‍🎨',
    online: true,
    expertise: 'UI/UX Design',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'DevOps Engineer',
    avatar: '👩‍💼',
    online: false,
    expertise: 'Cloud, Docker',
  },
  {
    id: '4',
    name: 'James Park',
    role: 'Data Scientist',
    avatar: '👨‍🔬',
    online: true,
    expertise: 'ML, Python',
  },
];

// Mock resources
const resources = [
  {
    id: '1',
    title: 'React Advanced Patterns',
    type: 'Course',
    icon: BookOpen,
    progress: 85,
    color: '#00d4ff',
  },
  {
    id: '2',
    title: 'System Design Mastery',
    type: 'Guide',
    icon: Target,
    progress: 45,
    color: '#ff006e',
  },
  {
    id: '3',
    title: 'Web Performance Optimization',
    type: 'Article',
    icon: Zap,
    progress: 100,
    color: '#00d084',
  },
  {
    id: '4',
    title: 'Scaling Applications',
    type: 'Video',
    icon: TrendingUp,
    progress: 60,
    color: '#ffa500',
  },
];

export default function MenteeDashboard() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Stat cards with enhanced colors
  const stats: StatCard[] = [
    {
      label: 'Next Session',
      value: 'Tomorrow',
      icon: <Calendar className="w-5 h-5" />,
      href: '/sessions',
      accent: '#00d4ff',
      description: 'with Sarah Chen',
    },
    {
      label: 'Active Projects',
      value: '3',
      icon: <Folder className="w-5 h-5" />,
      href: '/projects',
      accent: '#ff006e',
      description: 'in progress',
    },
    {
      label: 'Learning Streak',
      value: mockUser.streak,
      icon: <Flame className="w-5 h-5" />,
      href: '/stats',
      accent: '#ffa500',
      description: 'days consecutive',
    },
    {
      label: 'Unread Messages',
      value: '4',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/messages',
      accent: '#00d084',
      description: 'from mentors',
    },
  ];

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div
        variants={slideInVariants}
        className="mb-16 relative overflow-hidden"
      >
        <div className="glass rounded-2xl p-8 md:p-12 border border-[rgba(0,212,255,0.15)]">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#00d4ff] to-transparent opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#ff006e] to-transparent opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-[#00d4ff]" />
              <span className="text-sm font-medium text-[#00d4ff]">Welcome back</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-2 text-[var(--dashboard-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {`Hello, ${mockUser.firstName}.`}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-[var(--dashboard-text-secondary)] max-w-2xl"
            >
              You&apos;re {mockUser.progress}% through your journey to {mockUser.goal}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 origin-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockUser.progress}%` }}
                    transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00d084] rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-[#00d4ff]">{mockUser.progress}%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Link href={stat.href}>
              <Card className="glass rounded-xl p-6 border border-[rgba(0,212,255,0.1)] cursor-pointer group hover:border-[rgba(0,212,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg bg-[rgba(0,212,255,0.1)] group-hover:bg-[rgba(0,212,255,0.2)] transition-colors"
                    style={{
                      backgroundColor: `${stat.accent}15`,
                      borderColor: `${stat.accent}30`,
                    }}
                  >
                    <div style={{ color: stat.accent }}>{stat.icon}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--dashboard-muted)] group-hover:text-[#00d4ff] transform group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-sm font-medium text-[var(--dashboard-text-secondary)] mb-1">
                  {stat.label}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-bold text-[var(--dashboard-text-primary)]">
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-[var(--dashboard-muted)]">{stat.description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-bold text-[var(--dashboard-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Recent Activity
            </h2>
            <Link href="/activity">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
              >
                View All
              </Button>
            </Link>
          </div>

          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="glass rounded-lg p-4 border border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.2)] transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(0,212,255,0.1)] group-hover:bg-[rgba(0,212,255,0.15)] transition-colors mt-1">
                      <IconComponent className="w-4 h-4 text-[#00d4ff]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--dashboard-text-primary)] line-clamp-1 group-hover:text-[#00d4ff] transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-[var(--dashboard-muted)] mt-1">{activity.time}</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[var(--dashboard-muted)] opacity-0 group-hover:opacity-100 flex-shrink-0 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <h2
            className="text-2xl font-bold text-[var(--dashboard-text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Progress
          </h2>

          <Card className="glass rounded-xl p-6 border border-[rgba(0,212,255,0.1)] mb-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00d084] p-0.5"
              >
                <div className="w-full h-full rounded-full bg-[#111829] flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#00d4ff]">{mockUser.progress}%</span>
                </div>
              </motion.div>

              <h3 className="text-sm font-medium text-[var(--dashboard-text-secondary)] mb-1">
                Completion
              </h3>
              <p className="text-xs text-[var(--dashboard-muted)]">Overall progress</p>
            </div>
          </Card>

          <Card className="glass rounded-xl p-6 border border-[rgba(0,212,255,0.1)]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--dashboard-text-secondary)]">
                    Sessions Completed
                  </span>
                  <span className="text-sm font-bold text-[#00d4ff]">24</span>
                </div>
                <div className="w-full h-1.5 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#00d4ff]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--dashboard-text-secondary)]">
                    Projects Done
                  </span>
                  <span className="text-sm font-bold text-[#ff006e]">8</span>
                </div>
                <div className="w-full h-1.5 bg-[rgba(255,0,110,0.1)] rounded-full overflow-hidden">
                  <div className="w-3/5 h-full bg-[#ff006e]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--dashboard-text-secondary)]">
                    Learning Hours
                  </span>
                  <span className="text-sm font-bold text-[#ffa500]">142</span>
                </div>
                <div className="w-full h-1.5 bg-[rgba(255,165,0,0.1)] rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-[#ffa500]" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Mentors Strip */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-[var(--dashboard-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Mentors
          </h2>
          <Link href="/mentors">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
            >
              View All
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-48"
            >
              <Card className="glass rounded-lg p-4 border border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.2)] transition-all group cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{mentor.avatar}</div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: mentor.online ? '#00d084' : '#6b7280',
                    }}
                  />
                </div>

                <h3 className="font-bold text-[var(--dashboard-text-primary)] text-sm line-clamp-2 mb-1">
                  {mentor.name}
                </h3>
                <p className="text-xs text-[var(--dashboard-muted)] mb-3 flex-1">
                  {mentor.role}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs bg-[rgba(0,212,255,0.1)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.2)]"
                  >
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs border border-[rgba(0,212,255,0.1)]"
                  >
                    Book
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resources Section */}
      <motion.div variants={itemVariants} className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-[var(--dashboard-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Learning Resources
          </h2>
          <Link href="/resources">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
            >
              Browse All
            </Button>
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {resources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <motion.div key={resource.id} variants={itemVariants}>
                <Card className="glass rounded-lg p-4 border border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.2)] transition-all group cursor-pointer h-full flex flex-col">
                  <div className="mb-4">
                    <div
                      className="w-10 h-10 rounded-lg p-2 mb-3"
                      style={{
                        backgroundColor: `${resource.color}15`,
                      }}
                    >
                      <IconComponent
                        className="w-full h-full"
                        style={{ color: resource.color }}
                      />
                    </div>
                    <h3 className="font-medium text-[var(--dashboard-text-primary)] text-sm line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-[var(--dashboard-muted)] mt-1">
                      {resource.type}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[var(--dashboard-muted)]">
                        Progress
                      </span>
                      <span className="text-xs font-medium text-[var(--dashboard-text-secondary)]">
                        {resource.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resource.progress}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: resource.color }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
