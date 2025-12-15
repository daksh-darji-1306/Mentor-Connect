import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, MoreHorizontal, Bell } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const SessionsPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Mock Data
    const sessions = [
        {
            id: 1,
            mentor: "Dr. Maria Khan",
            role: "Senior Data Scientist",
            time: "8:00 PM",
            day: 4,
            topic: "Booked: Mentorship with Dr. Khan",
            status: "confirmed",
            color: "bg-amber-400"
        },
        {
            id: 2,
            mentor: "James Smith",
            role: "Backend Lead",
            time: "3:00 PM",
            day: 10,
            topic: "Booked: System Design",
            status: "confirmed",
            color: "bg-amber-400"
        },
        {
            id: 3,
            mentor: "James Smith",
            role: "Backend Lead",
            time: "5:00 PM",
            day: 17,
            topic: "Booked: Code Review",
            status: "confirmed",
            color: "bg-amber-400"
        },
        {
            id: 4,
            mentor: "Sarah Connor",
            role: "Product Manager",
            time: "3:00 PM",
            day: 22,
            topic: "Booked: Roadmap Planning",
            status: "confirmed",
            color: "bg-amber-400"
        },
        {
            id: 5,
            mentor: "David Chen",
            role: "Staff Engineer",
            time: "3:00 PM",
            day: 29,
            topic: "Booked: Go Lang Deep Dive",
            status: "confirmed",
            color: "bg-amber-400"
        }
    ];

    // Calendar Header
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    // Calendar Grid Logic
    const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();

    // Fill previous month days
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: null });
    }
    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i });
    }

    const getEventsForDay = (day) => sessions.filter(s => s.day === day);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    {/* Breadcrumb-ish title if needed, otherwise simplified */}
                </div>
                {/* Search/User area could go here if global nav didn't handle it */}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">

                {/* Main Calendar Section */}
                <Card className="flex-1 flex flex-col p-6 bg-card border-border/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-serif text-foreground">Calendar</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-secondary/30 rounded-lg p-1">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="px-4 flex items-center justify-center text-sm font-bold min-w-[100px]">
                                    Today
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Weekday Header */}
                    <div className="grid grid-cols-7 gap-px mb-2 text-center border-b border-border/30 pb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-sm font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 grid-rows-5 gap-px bg-border/20 flex-1 rounded-lg overflow-hidden border border-border/20">
                        {days.map((d, index) => {
                            const events = d.day ? getEventsForDay(d.day) : [];
                            return (
                                <div
                                    key={index}
                                    className={`bg-card relative p-2 min-h-[80px] flex flex-col gap-1 transition-colors hover:bg-secondary/10 ${!d.day ? 'bg-secondary/5' : ''}`}
                                >
                                    {d.day && (
                                        <span className={`text-sm font-medium ${d.day === 4 ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {d.day}
                                        </span>
                                    )}

                                    {/* Event Blocks */}
                                    <div className="flex flex-col gap-1 mt-1 overflow-y-auto custom-scrollbar">
                                        {events.map(event => (
                                            <div key={event.id} className="bg-primary/90 text-primary-foreground p-1.5 rounded text-[10px] items-start leading-tight shadow-sm cursor-pointer hover:bg-primary transition-colors">
                                                <div className="font-bold mb-0.5">Booked</div>
                                                <div className="opacity-90 truncate">Mentorship with {event.mentor.split(' ')[0]}</div>
                                                <div className="mt-0.5 opacity-75">{event.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Right Sidebar: Upcoming Sessions */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-serif text-foreground">Upcoming Sessions</h3>
                        <span className="text-xs text-muted-foreground">Active Mentorships</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {sessions.map(session => (
                            <div key={session.id} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                                        {session.mentor.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-foreground">{session.mentor}</h4>
                                        <p className="text-xs text-muted-foreground">Dec 12, 2023 | {session.time}</p>
                                    </div>
                                </div>
                                <Button className="w-full font-bold shadow-md hover:shadow-lg transition-all" size="sm">
                                    Join Now
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionsPage;
