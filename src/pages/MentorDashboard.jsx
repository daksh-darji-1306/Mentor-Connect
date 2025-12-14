import React, { useState } from 'react';
import {
    StatCard,
    ProfileCard,
    ChartSection,
    ActivityTimeline,
    ResourcesList
} from '../components/dashboard/DashboardWidgets';
import { Users, Clock, Calendar, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MentorDashboard = () => {
    // Mock Data
    const user = {
        name: "Dr. Maria Khan",
        role: "Senior Data Scientist, Google",
        tags: ["Python", "Machine Learning", "Data Analysis", "Leadership"],
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    };

    const chartData = [
        { name: 'Jan', value: 40 },
        { name: 'Feb', value: 30 },
        { name: 'Mar', value: 55 },
        { name: 'Apr', value: 45 },
        { name: 'May', value: 65 },
        { name: 'Jun', value: 85 },
        { name: 'Jul', value: 75 },
    ];

    const stats = [
        { title: "Active Mentees", value: "12", icon: Users, trend: 15 },
        { title: "Total Hours", value: "245h", icon: Clock, trend: 8 },
        { title: "Upcoming Sessions", value: "4", icon: Calendar, trend: 0 },
        { title: "Response Rate", value: "98%", icon: MessageCircle, trend: 2 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
            {/* Row 1: Profile & Stats */}
            <div className="lg:col-span-2 space-y-6">
                <ProfileCard user={user} />

                {/* Stats Grid - Mobile: 2x2, Desktop: 4x1 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>

                {/* Main Chart */}
                <ChartSection data={chartData} />
            </div>

            {/* Row 1: Right Column (Timeline & Resources) */}
            <div className="lg:col-span-1 space-y-6">

                {/* Quick Actions (Mini) */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-dashboard-accent rounded-xl text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-dashboard-accentHover hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-2">
                        <Calendar size={20} />
                        Schedule
                    </button>
                    <button className="p-4 bg-dashboard-card border border-white/5 rounded-xl text-white font-bold hover:bg-white/5 hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-2">
                        <Zap size={20} className="text-yellow-400" />
                        Quick Meet
                    </button>
                </div>

                <ActivityTimeline />

                <ResourcesList />
            </div>
        </motion.div>
    );
};

export default MentorDashboard;
