'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Star,
  MessageSquare,
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Badge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/sidebar';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  rating: number;
  reviews: number;
  sessions: number;
  availability: 'available' | 'busy' | 'offline';
  bio: string;
  image?: string;
  initials: string;
  hourlyRate?: number;
}

const mockMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    role: 'Senior Product Manager',
    company: 'Google',
    expertise: ['Product Strategy', 'Career Growth', 'Metrics & Analytics'],
    rating: 4.9,
    reviews: 47,
    sessions: 120,
    availability: 'available',
    bio: 'Passionate about helping early-stage PMs navigate their careers and build impactful products.',
    initials: 'SC',
    hourlyRate: 150,
  },
  {
    id: 'm2',
    name: 'John Smith',
    role: 'Engineering Lead',
    company: 'Meta',
    expertise: ['System Design', 'Backend', 'Scaling'],
    rating: 4.8,
    reviews: 35,
    sessions: 89,
    availability: 'available',
    bio: 'Experienced in building systems that scale to millions of users. Love sharing knowledge!',
    initials: 'JS',
    hourlyRate: 175,
  },
  {
    id: 'm3',
    name: 'Emily Rodriguez',
    role: 'Design Director',
    company: 'Figma',
    expertise: ['UX Design', 'Design Systems', 'Team Leadership'],
    rating: 4.7,
    reviews: 28,
    sessions: 67,
    availability: 'busy',
    bio: 'Design systems enthusiast and advocate for user-centered design.',
    initials: 'ER',
    hourlyRate: 160,
  },
  {
    id: 'm4',
    name: 'Michael Zhang',
    role: 'Startup Founder & CTO',
    company: 'TechStudio AI',
    expertise: ['Startups', 'AI/ML', 'Product Development'],
    rating: 4.9,
    reviews: 52,
    sessions: 145,
    availability: 'available',
    bio: 'Built and scaled two successful startups. Now mentoring the next generation.',
    initials: 'MZ',
    hourlyRate: 200,
  },
  {
    id: 'm5',
    name: 'Lisa Johnson',
    role: 'Marketing Director',
    company: 'Stripe',
    expertise: ['Growth Marketing', 'Product Launch', 'Branding'],
    rating: 4.6,
    reviews: 24,
    sessions: 56,
    availability: 'offline',
    bio: 'Specializing in growth strategies for B2B and B2C products.',
    initials: 'LJ',
    hourlyRate: 140,
  },
  {
    id: 'm6',
    name: 'David Kumar',
    role: 'Data Science Lead',
    company: 'Airbnb',
    expertise: ['Data Analytics', 'ML Engineering', 'A/B Testing'],
    rating: 4.8,
    reviews: 31,
    sessions: 78,
    availability: 'available',
    bio: 'Passionate about using data to drive business decisions.',
    initials: 'DK',
    hourlyRate: 170,
  },
];

const expertiseOptions = [
  'Product Strategy',
  'System Design',
  'UX Design',
  'Startups',
  'Growth Marketing',
  'Data Analytics',
  'Career Growth',
];

export default function MentorsPage() {
  const [mentors] = useState<Mentor[]>(mockMentors);
  const [search, setSearch] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy'>('all');

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.role.toLowerCase().includes(search.toLowerCase()) ||
      mentor.company.toLowerCase().includes(search.toLowerCase());

    const matchesExpertise =
      selectedExpertise.length === 0 ||
      selectedExpertise.some((exp) => mentor.expertise.includes(exp));

    const matchesAvailability =
      availabilityFilter === 'all' || mentor.availability === availabilityFilter;

    return matchesSearch && matchesExpertise && matchesAvailability;
  });

  const toggleExpertise = (exp: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-500/10 text-green-500';
      case 'busy':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'offline':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
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
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Find a Mentor</h1>
          </div>

          {/* Search */}
          <div className="flex-1 relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, role, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold text-foreground mb-4">Filters</h3>

              {/* Expertise */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Expertise
                </label>
                <div className="space-y-2">
                  {expertiseOptions.map((exp) => (
                    <label key={exp} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedExpertise.includes(exp)}
                        onChange={() => toggleExpertise(exp)}
                        className="rounded"
                      />
                      <span className="text-sm text-muted-foreground">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Availability
                </label>
                <div className="space-y-2">
                  {(['all', 'available', 'busy'] as const).map((avail) => (
                    <label key={avail} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={availabilityFilter === avail}
                        onChange={() => setAvailabilityFilter(avail)}
                        className="rounded-full"
                      />
                      <span className="text-sm text-muted-foreground capitalize">{avail}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mentor Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            {filteredMentors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredMentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ borderColor: 'rgba(168, 137, 255, 0.5)' }}
                  >
                    <Card className="p-6 h-full hover:border-primary/50 transition-colors flex flex-col justify-between">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {mentor.initials}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.role}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
                            {mentor.availability === 'available' && '● Available'}
                            {mentor.availability === 'busy' && '● Busy'}
                            {mentor.availability === 'offline' && '● Offline'}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {mentor.company}
                        </p>

                        {/* Bio */}
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {mentor.bio}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-border/30">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary mb-1">
                            <Star className="w-4 h-4 fill-primary" />
                            <span className="font-bold">{mentor.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{mentor.reviews} reviews</p>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-foreground mb-1">{mentor.sessions}</div>
                          <p className="text-xs text-muted-foreground">Sessions</p>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-primary mb-1">${mentor.hourlyRate}/hr</div>
                          <p className="text-xs text-muted-foreground">Rate</p>
                        </div>
                      </div>

                      {/* Expertise Tags */}
                      <div className="my-4">
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((exp) => (
                            <span
                              key={exp}
                              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Session
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Users className="w-16 h-16 text-primary/30 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No mentors found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {
                  setSearch('');
                  setSelectedExpertise([]);
                  setAvailabilityFilter('all');
                }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
