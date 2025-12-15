import React from 'react';
import { motion } from 'framer-motion';
import { Card, StatCard, ChartSection } from '../components/dashboard/DashboardWidgets';
import { Users, Clock, Calendar, Star, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MentorDashboard = () => {
    // Mock Data
    const stats = [
        { title: "Total Mentees", value: "12", icon: Users, trend: 15 },
        { title: "Hours Mentored", value: "245h", icon: Clock, trend: 8 },
        { title: "Avg. Rating", value: "4.9", icon: Star, trend: 0 },
    ];

    const upcomingSessions = [
        { mentee: "Alex Johnson", time: "Today, 3:00 PM", topic: "React Pattern Review" },
        { mentee: "Sam Smith", time: "Tomorrow, 11:00 AM", topic: "Career Guidance" },
    ];

    const requests = [
        { name: "Jordan Lee", role: "Junior Dev", message: "Looking for guidance in System Design..." },
        { name: "Casey West", role: "Student", message: "Help pivoting from Marketing to UX..." },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* 1. Header & Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Overview</p>
                </div>
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Main Focus: Action Center */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Action Center</h2>
                    </div>

                    {/* Upcoming Sessions */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> Upcoming Sessions
                            </h3>
                            <Button variant="outline" size="sm" className="h-8 text-xs">Sync Calendar</Button>
                        </div>
                        <div className="space-y-3">
                            {upcomingSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/40">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                            {session.mentee.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{session.mentee}</h4>
                                            <p className="text-xs text-muted-foreground">{session.topic}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-foreground">{session.time}</div>
                                        <button className="text-xs text-primary hover:underline">Start Meeting</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Pending Requests */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" /> New Requests
                            </h3>
                            <span className="text-xs text-muted-foreground">2 pending</span>
                        </div>
                        <div className="space-y-4">
                            {requests.map((req, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b last:border-0 border-border/50 pb-4 last:pb-0">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{req.name} <span className="text-xs font-normal text-muted-foreground">• {req.role}</span></h4>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{req.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button size="sm" variant="outline" className="flex-1 md:flex-none">Decline</Button>
                                        <Button size="sm" className="flex-1 md:flex-none">Accept</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* 3. Sidebar Stats/Chart */}
                <section className="space-y-6">
                    <ChartSection data={[
                        { name: 'Jan', value: 30 }, { name: 'Feb', value: 45 },
                        { name: 'Mar', value: 60 }, { name: 'Apr', value: 40 },
                        { name: 'May', value: 75 }, { name: 'Jun', value: 85 }
                    ]} />

                    <Card className="bg-gradient-to-br from-primary/90 to-violet-600 text-primary-foreground border-none">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold opacity-90">Earnings</h3>
                                <p className="text-sm opacity-70">This Month</p>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-4xl font-bold mb-2">$1,250</div>
                        <div className="flex items-center gap-2 text-sm opacity-80">
                            <CheckCircle2 className="w-4 h-4" /> Payout scheduled for 1st
                        </div>
                    </Card>
                </section>
            </div>
        </motion.div>
    );
};

export default MentorDashboard;
