import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen, Star, MoreHorizontal, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";

const MenteeDashboard = () => {
    // Mock Data
    const nextSession = {
        mentor: "Dr. Maria Khan",
        role: "Senior Data Scientist",
        time: "Tomorrow, 4:00 PM",
        topic: "Python Basics & Code Review"
    };

    const recommendedMentors = [
        { name: "Sarah Connor", role: "Product Manager @ Uber", tags: ["Product", "Agile"] },
        { name: "David Chen", role: "Tech Lead @ Airbnb", tags: ["System Design", "Go"] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* 1. Primary Focus Area */}
            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4">Up Next</h2>
                <Card className="border-l-4 border-l-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{nextSession.topic}</h3>
                            <p className="text-muted-foreground flex items-center gap-2">
                                with <span className="font-medium text-foreground">{nextSession.mentor}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-foreground">
                            {nextSession.time}
                        </div>
                        <Button className="w-full md:w-auto shadow-sm">
                            Join Session
                        </Button>
                    </div>
                </Card>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 2. Progress Section */}
                <section className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Current Goal</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
                    </div>
                    <Card>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-foreground text-lg">Frontend Mastery</h3>
                                <p className="text-sm text-muted-foreground">Become job-ready by Q3</p>
                            </div>
                            <div className="text-2xl font-bold text-primary">65%</div>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-primary w-[65%] rounded-full" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <span className="line-through text-muted-foreground">HTML/CSS Fundamentals</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <span className="line-through text-muted-foreground">JavaScript ES6+ Deep Dive</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <span>React Hooks & State Management</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground opacity-60">
                                <div className="w-5 h-5 rounded-full border-2 border-muted" />
                                <span>Redux & Context API</span>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* 3. Secondary Section (Mentors) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Recommended</h2>
                        <Button variant="link" size="sm" className="text-primary p-0">View All</Button>
                    </div>
                    <div className="space-y-3">
                        {recommendedMentors.map((m, i) => (
                            <Card key={i} className="p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-foreground truncate">{m.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {m.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 bg-secondary/50 rounded text-[10px] text-muted-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default MenteeDashboard;
