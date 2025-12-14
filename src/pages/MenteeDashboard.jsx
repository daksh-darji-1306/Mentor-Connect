import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, BookOpen, Clock, Calendar, Star } from 'lucide-react';
import { GlassCard } from '../components/dashboard/DashboardWidgets';

const MenteeDashboard = () => {
    // Mock Data for Mentee
    const upcomingSessions = [
        { id: 1, mentor: "Dr. Maria Khan", topic: "Python Basics", time: "Today, 4:00 PM" },
        { id: 2, mentor: "James Smith", topic: "React Hooks", time: "Tomorrow, 10:00 AM" }
    ];

    const recommendedMentors = [
        { name: "Sarah Connor", role: "Product Manager @ Uber", tags: ["Product", "Agile"] },
        { name: "David Chen", role: "Tech Lead @ Airbnb", tags: ["System Design", "Go"] },
        { name: "Emily Blunt", role: "UX Designer @ Apple", tags: ["Figma", "User Research"] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {/* Welcome Section */}
            <div className="md:col-span-3">
                <GlassCard className="bg-gradient-to-r from-dashboard-accent/20 to-purple-600/10 border-dashboard-accent/20">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Mentee! 👋</h1>
                    <p className="text-dashboard-textMuted max-w-2xl">
                        Ready to accelerate your career? You have 2 upcoming sessions and 5 new mentor matches.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <button className="px-6 py-3 bg-white text-dashboard-bg font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                            <Compass size={18} /> Find Mentors
                        </button>
                        <button className="px-6 py-3 bg-dashboard-card border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                            View Plan
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* Upcoming Sessions */}
            <div className="md:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-dashboard-accent" size={20} /> Upcoming Sessions
                </h3>
                <div className="grid gap-4">
                    {upcomingSessions.map(session => (
                        <GlassCard key={session.id} className="flex items-center justify-between p-4 hover:border-dashboard-accent/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-dashboard-accent/20 flex items-center justify-center text-dashboard-accent font-bold">
                                    {session.mentor.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{session.topic}</h4>
                                    <p className="text-sm text-dashboard-textMuted">with {session.mentor}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-bold text-white">{session.time}</span>
                                <button className="text-xs text-dashboard-accent hover:underline">Join Meeting</button>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Learning Path Preview */}
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-8">
                    <BookOpen className="text-pink-500" size={20} /> Your Learning Path
                </h3>
                <GlassCard className="p-0 overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white">Frontend Mastery</h4>
                            <span className="text-xs text-dashboard-textMuted">65% Complete</span>
                        </div>
                        <div className="w-full bg-dashboard-bg h-2 rounded-full mb-4 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-dashboard-accent to-pink-500 w-[65%]"></div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {['HTML/CSS', 'JavaScript', 'React Basics', 'Hooks', 'Redux', 'Project'].map((step, i) => (
                                <div key={i} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${i < 4 ? 'bg-dashboard-accent/20 text-dashboard-accent' : 'bg-dashboard-bg text-dashboard-textMuted'}`}>
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Recommended Mentors */}
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="text-yellow-400" size={20} /> Top Mentors
                </h3>
                {recommendedMentors.map((m, i) => (
                    <GlassCard key={i} className="p-4 hover:translate-x-1 transition-transform cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{m.name}</h4>
                                <p className="text-xs text-dashboard-textMuted mb-2">{m.role}</p>
                                <div className="flex flex-wrap gap-1">
                                    {m.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-dashboard-bg rounded-md text-dashboard-textMuted">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

        </motion.div>
    );
};

export default MenteeDashboard;
