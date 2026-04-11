'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'in-person';
  location?: string;
  notes?: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    mentorId: 'm1',
    mentorName: 'Sarah Chen',
    mentorRole: 'Senior Product Manager',
    mentorAvatar: 'SC',
    date: '2025-04-10',
    time: '2:00 PM',
    duration: 60,
    topic: 'Career Growth Strategy',
    status: 'scheduled',
    type: 'video',
    notes: 'Discuss next career move and skill development',
  },
  {
    id: '2',
    mentorId: 'm2',
    mentorName: 'John Smith',
    mentorRole: 'Engineering Lead',
    mentorAvatar: 'JS',
    date: '2025-04-15',
    time: '3:30 PM',
    duration: 45,
    topic: 'System Design Review',
    status: 'scheduled',
    type: 'video',
    notes: 'Review current architecture proposal',
  },
  {
    id: '3',
    mentorId: 'm1',
    mentorName: 'Sarah Chen',
    mentorRole: 'Senior Product Manager',
    mentorAvatar: 'SC',
    date: '2025-03-28',
    time: '1:00 PM',
    duration: 60,
    topic: 'Product Strategy Deep Dive',
    status: 'completed',
    type: 'video',
    notes: 'Learned valuable insights on market positioning',
  },
  {
    id: '4',
    mentorId: 'm3',
    mentorName: 'Emily Rodriguez',
    mentorRole: 'Design Director',
    mentorAvatar: 'ER',
    date: '2025-03-20',
    time: '10:00 AM',
    duration: 30,
    topic: 'UX Design Principles',
    status: 'completed',
    type: 'video',
    notes: 'Discussed design thinking methodology',
  },
];

export default function SessionsPage() {
  const [sessions] = useState<Session[]>(mockSessions);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredSessions = sessions.filter((session) => {
    const matchesFilter =
      filter === 'all' || session.status === filter;
    const matchesSearch =
      session.mentorName.toLowerCase().includes(search.toLowerCase()) ||
      session.topic.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scheduledSessions = filteredSessions.filter((s) => s.status === 'scheduled');
  const completedSessions = filteredSessions.filter((s) => s.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen relative"
    >
      <Sidebar />
      {/* Header */}
      <div className="ml-64 border-b border-[var(--dash-border)] bg-[var(--dash-card)] backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Book Session
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'scheduled', 'completed'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upcoming Sessions */}
        {scheduledSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {scheduledSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ borderColor: 'rgba(168, 137, 255, 0.5)' }}
                  className="group"
                >
                  <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Left: Session Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{session.topic}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              with {session.mentorName}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            {session.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            {session.duration} mins
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {session.type === 'video' && <Video className="w-4 h-4 text-primary" />}
                            {session.type === 'audio' && <User className="w-4 h-4 text-primary" />}
                            {session.type === 'in-person' && <MapPin className="w-4 h-4 text-primary" />}
                            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                          </div>
                        </div>

                        {session.notes && (
                          <p className="text-sm text-muted-foreground mt-4 p-3 bg-secondary/10 rounded-lg border border-border/30">
                            {session.notes}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        <Button variant="default" className="w-full">
                          Join Session
                        </Button>
                        <Button variant="outline" className="w-full">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Past Sessions */}
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Past Sessions</h2>
            <div className="space-y-3">
              {completedSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ borderColor: 'rgba(168, 137, 255, 0.3)' }}
                >
                  <Card className="p-4 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{session.topic}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.mentorName} •{' '}
                          {new Date(session.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Calendar className="w-16 h-16 text-primary/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-6">
              {search ? 'Try adjusting your search terms' : 'Book your first session with a mentor'}
            </p>
            <Button>Book a Session</Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
