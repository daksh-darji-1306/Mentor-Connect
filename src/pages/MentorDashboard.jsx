import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, StatCard, ChartSection } from '../components/dashboard/DashboardWidgets';
import { Users, Clock, Calendar, Star, MessageSquare, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MentorDashboard = () => {
    // Calendar Context & State
    const { token, login, logout, addEvent } = useCalendar();
    const { user } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionTime, setSessionTime] = useState('');
    const [sessionDuration, setSessionDuration] = useState('60');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSession = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const startDateTime = new Date(`${sessionDate}T${sessionTime}`);
            const endDateTime = new Date(startDateTime.getTime() + parseInt(sessionDuration) * 60000);
            
            let googleEventId = 'none';
            let calendarLink = '';

            if (token) {
                const event = {
                    summary: `Mentorship Session: ${sessionTopic}`,
                    description: 'Scheduled via Mentor-Connect.',
                    start: {
                        dateTime: startDateTime.toISOString(),
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    end: {
                        dateTime: endDateTime.toISOString(),
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    conferenceData: {
                        createRequest: {
                            requestId: `mentor-connect-${Date.now()}`,
                            conferenceSolutionKey: { type: 'hangoutsMeet' }
                        }
                    }
                };
                
                const newEvent = await addEvent(event);
                if (newEvent) {
                    googleEventId = newEvent.id || 'none';
                    calendarLink = newEvent.hangoutLink || newEvent.htmlLink || '';
                } else {
                    alert('Failed to add session to Google Calendar. Adding to Database only.');
                }
            }
            // If user is a demo user or missing, skip actual Supabase DB insert to avoid UUID/RLS crashes
            if (!user?.id || user.id.startsWith('demo-')) {
                alert(token && googleEventId !== 'none' 
                    ? 'Session added to Google Calendar! (Database Insert Simulated for Demo)' 
                    : 'Session added! (Database Insert Simulated for Demo)');
                
                setShowAddModal(false);
                setSessionTopic('');
                setSessionDate('');
                setSessionTime('');
                setIsSubmitting(false);
                
                // Optimistically update UI
                setUpcomingSessions(prev => [...prev, {
                     id: Date.now(),
                     mentee: 'Open Slot',
                     time: `${startDateTime.toLocaleDateString()} ${startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                     topic: sessionTopic
                }]);
                return;
            }
            
            // Insert to Supabase Database
            const { error: dbError } = await supabase.from('sessions').insert({
                google_event_id: googleEventId,
                mentor_id: user.id,
                mentor_name: user.fullName || 'Mentor',
                topic: sessionTopic,
                start_time: startDateTime.toISOString(),
                duration_minutes: parseInt(sessionDuration),
                calendar_link: calendarLink
            });

            if (dbError) {
                console.error("Supabase insert error:", dbError);
                // Give explicit fallback messages if DB wiped or token stale
                if (dbError.code === '23503') { 
                    alert('Error: Your user profile is missing from the database. Please sign out and sign up again.');
                } else if (dbError.code === '42501') {
                    alert('Permission Denied: Database wiped or stale token. Try signing out and back in.');
                } else {
                    alert(`Database Error: ${dbError.message}`);
                }
            } else {
                setShowAddModal(false);
                setSessionTopic('');
                setSessionDate('');
                setSessionTime('');

                alert(token && googleEventId !== 'none' ? 'Session added to Google Calendar & Database!' : 'Session added to Database!');
            }
        } catch(error) {
            alert('Error adding session');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mock Data
    const stats = [
        { title: "Total Mentees", value: "12", icon: Users, trend: 15 },
        { title: "Hours Mentored", value: "245h", icon: Clock, trend: 8 },
        { title: "Avg. Rating", value: "4.9", icon: Star, trend: 0 },
    ];

    const [upcomingSessions, setUpcomingSessions] = useState([]);

    useEffect(() => {
        if (!user?.id) return;
        const fetchSessions = async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('mentor_id', user.id)
                .order('start_time', { ascending: true })
                .limit(4);

            if (data) {
                setUpcomingSessions(
                    data.map((ev) => {
                        const startDate = new Date(ev.start_time);
                        return {
                            id: ev.id,
                            mentee: 'Open Slot', // It's a newly created session slot!
                            time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                            topic: ev.topic || 'Mentorship Session'
                        };
                    })
                );
            }
        };
        fetchSessions();
    }, [user?.id, showAddModal]); // Refetch when a new session is added (modal closes)

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
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowAddModal(true)}>
                                    Add Session
                                </Button>
                                {token ? (
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive" onClick={() => logout()}>
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="secondary" className="h-8 text-xs outline outline-1 outline-primary/50" onClick={() => login()}>
                                        Connect Google Calendar
                                    </Button>
                                )}
                            </div>
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
        {/* Add Session Modal */}
        <AnimatePresence>
            {showAddModal && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-card w-full max-w-md border border-border/50 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border/50">
                            <h3 className="font-bold text-lg text-foreground">Add New Session</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-full">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleAddSession} className="p-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Session Topic</label>
                                <Input required value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} placeholder="e.g. React Pattern Review" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
                                    <Input required type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">Time</label>
                                    <Input required type="time" value={sessionTime} onChange={e => setSessionTime(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Duration</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={sessionDuration} 
                                    onChange={e => setSessionDuration(e.target.value)}
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 Hour</option>
                                    <option value="90">1.5 Hours</option>
                                    <option value="120">2 Hours</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? 'Adding...' : (token ? 'Add to Calendar & Database' : 'Add Session')}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        </motion.div>
    );
};

export default MentorDashboard;
