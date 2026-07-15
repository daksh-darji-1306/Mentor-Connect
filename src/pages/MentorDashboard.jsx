import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, StatCard, ChartSection } from '../components/dashboard/DashboardWidgets';
import { Users, Clock, Calendar, Star, MessageSquare, ArrowUpRight, CheckCircle2, X, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddSessionModal from '../components/dashboard/AddSessionModal';

const MentorDashboard = () => {
    // Calendar Context & State
    const { token, login, logout } = useCalendar();
    const { user } = useAuth();
    // 1. Header
    const [showAddModal, setShowAddModal] = useState(false);
    // For when accepting a pending request or scheduling specifically for a mentee
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [editingSession, setEditingSession] = useState(null);

    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [sessionRequestsList, setSessionRequestsList] = useState([]);
    const [mentorStats, setMentorStats] = useState({ totalMentees: 0, hours: 0, rating: "N/A" });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sessionTopic, setSessionTopic] = useState('');

    const handleAcceptSession = (sessionId) => {
        const sessionToAccept = sessionRequestsList.find(s => s.id === sessionId);
        if (sessionToAccept) {
            setSelectedSessionId(sessionId);
            setSelectedMentee({ id: sessionToAccept.mentee_id, full_name: sessionToAccept.mentee_name });
            setSessionTopic(sessionToAccept.topic || '');
            setShowAddModal(true);
        }
    };

    const handleRejectSession = async (sessionId) => {
        try {
            await deleteDoc(doc(db, 'sessions', sessionId));
            setSessionRequestsList(prev => prev.filter(s => s.id !== sessionId));
        } catch (err) { console.error("Error rejecting session:", err); }
    };

    const handleCancelSession = async (sessionId) => {
        if (!window.confirm("Are you sure you want to cancel this session?")) return;
        try {
            await deleteDoc(doc(db, 'sessions', sessionId));
            setUpcomingSessions(prev => prev.filter(s => s.id !== sessionId));
        } catch (err) { console.error("Error cancelling session:", err); }
    };

    const handleAcceptRequest = async (reqId) => {
        try {
            await updateDoc(doc(db, 'requests', reqId), { status: 'accepted' });
            setRequestsList(prev => prev.filter(r => r.id !== reqId));
            setMentorStats(prev => ({ ...prev, totalMentees: prev.totalMentees + 1 }));
        } catch (err) { console.error("Error accepting request:", err); }
    };

    const handleDeclineRequest = async (reqId) => {
        try {
            await updateDoc(doc(db, 'requests', reqId), { status: 'declined' });
            setRequestsList(prev => prev.filter(r => r.id !== reqId));
        } catch (err) { console.error("Error declining request:", err); }
    };

    useEffect(() => {
        if (!user?.id) return;
        const fetchDashboardData = async () => {
            try {
                // Fetch pending requests
                const reqQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'pending'));
                const reqSnap = await getDocs(reqQ);
                const rList = [];
                for (const r of reqSnap.docs) {
                    const data = r.data();
                    const profileDoc = await getDoc(doc(db, 'profiles', data.mentee_id));
                    if (profileDoc.exists()) {
                        const p = profileDoc.data();
                        rList.push({
                           id: r.id,
                           name: p.full_name || p.email.split('@')[0],
                           role: p.profile_data?.currentRole || 'Mentee',
                           message: data.message || "Hi, I'd like to connect!"
                        });
                    }
                }
                setRequestsList(rList);

                // Fetch pending session requests
                const sessReqQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id), where('status', '==', 'pending'));
                const sessReqSnap = await getDocs(sessReqQ);
                setSessionRequestsList(sessReqSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                // Fetch stats (accepted requests + sessions)
                const accQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'accepted'));
                const accSnap = await getDocs(accQ);
                
                const sessionQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                const sessionSnap = await getDocs(sessionQ);
                
                let hours = 0;
                let menteesCount = accSnap.docs.length;
                const monthlyData = {};
                
                sessionSnap.docs.forEach(d => {
                    const s = d.data();
                    if (s.mentee_id && s.status !== 'pending') {
                        const dur = (s.duration_minutes || 60) / 60;
                        hours += dur;
                        
                        if (s.start_time) {
                            const date = new Date(s.start_time);
                            const month = date.toLocaleString('default', { month: 'short' });
                            monthlyData[month] = (monthlyData[month] || 0) + dur;
                        }
                    }
                });

                const cData = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const month = d.toLocaleString('default', { month: 'short' });
                    cData.push({ name: month, value: monthlyData[month] || 0 });
                }
                setChartData(cData);

                let avgRating = "N/A";
                try {
                    const revQ = query(collection(db, 'reviews'), where('mentor_id', '==', user.id));
                    const revSnap = await getDocs(revQ);
                    if (!revSnap.empty) {
                        let totalRating = 0;
                        revSnap.forEach(r => totalRating += (r.data().rating || 0));
                        avgRating = (totalRating / revSnap.docs.length).toFixed(1);
                    }
                } catch {
                    console.log("No reviews yet");
                }
                
                setMentorStats({ totalMentees: menteesCount, hours: Math.round(hours), rating: avgRating });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    const stats = [
        { title: "Total Mentees", value: mentorStats.totalMentees.toString(), icon: Users, trend: 15 },
        { title: "Hours Mentored", value: mentorStats.hours.toString() + "h", icon: Clock, trend: 8 },
        { title: "Avg. Rating", value: mentorStats.rating.toString(), icon: Star, trend: 0 },
    ];

    useEffect(() => {
        if (!user?.id) return;
        const fetchSessions = async () => {
            try {
                const q = query(
                    collection(db, 'sessions'),
                    where('mentor_id', '==', user.id)
                );
                const snapshot = await getDocs(q);
                let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                
                // Filter and sort in memory to avoid requiring a composite index in Firestore
                data = data
                    .filter(s => ['accepted', 'confirmed', 'open'].includes(s.status))
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .filter(s => new Date(s.start_time) >= new Date()) // only future sessions
                    .slice(0, 4);

                setUpcomingSessions(
                    data.map((ev) => {
                        const startDate = new Date(ev.start_time);
                        return {
                            id: ev.id,
                            mentee: ev.mentee_name || 'Open Slot',
                            time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                            topic: ev.topic || 'Mentorship Session',
                            link: ev.calendar_link || null,
                            raw: ev
                        };
                    })
                );
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };
        fetchSessions();
    }, [user?.id, showAddModal]); // Refetch when a new session is added (modal closes)


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* 1. Header & Stats */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here's your mentorship overview.</p>
                    </div>
                    <Button onClick={() => {
                        setSelectedMentee(null);
                        setSelectedSessionId(null);
                        setSessionTopic('');
                        setShowAddModal(true);
                    }} variant="outline" size="sm" className="h-9">
                        <Calendar className="w-4 h-4 mr-2" /> Add Session Slot
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
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
                                {token ? (
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive" onClick={() => logout()}>
                                        Disconnect Google Calendar
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
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="text-sm font-medium text-foreground">{session.time}</div>
                                        <div className="flex items-center gap-2">
                                            {session.link ? (
                                                <Button
                                                    size="sm"
                                                    className="h-7 text-xs px-2"
                                                    onClick={() => window.open(session.link, '_blank', 'noopener,noreferrer')}
                                                >
                                                    Start Meeting
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-muted-foreground mr-2 mt-1">No Link</span>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs px-2 text-blue-500 border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-600"
                                                onClick={() => {
                                                    setEditingSession(session.raw);
                                                    setShowAddModal(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-7 text-xs px-2"
                                                onClick={() => handleCancelSession(session.id)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {upcomingSessions.length === 0 && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming sessions. Add one to get started!</p>
                            )}
                        </div>
                    </Card>

                    {/* Pending Requests */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" /> New Requests
                            </h3>
                            <span className="text-xs text-muted-foreground">Recent requests</span>
                        </div>
                        <div className="space-y-4">
                            {requestsList.map((req, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b last:border-0 border-border/50 pb-4 last:pb-0">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{req.name} <span className="text-xs font-normal text-muted-foreground">• {req.role}</span></h4>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{req.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button size="sm" variant="outline" className="flex-1 md:flex-none hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeclineRequest(req.id)}>Decline</Button>
                                        <Button size="sm" className="flex-1 md:flex-none" onClick={() => handleAcceptRequest(req.id)}>Accept</Button>
                                    </div>
                                </div>
                            ))}

                            {sessionRequestsList.map((req, i) => {
                                return (
                                <div key={`sess-${i}`} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b last:border-0 border-border/50 pb-4 last:pb-0">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold">
                                            {req.mentee_name ? req.mentee_name[0].toUpperCase() : 'M'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{req.mentee_name || 'Mentee'} <span className="text-xs font-normal text-muted-foreground">• Session Request</span></h4>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{req.topic} | Needs Scheduling</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button size="sm" variant="outline" className="flex-1 md:flex-none hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRejectSession(req.id)}>Reject</Button>
                                        <Button size="sm" className="flex-1 md:flex-none" onClick={() => handleAcceptSession(req.id)}>Accept</Button>
                                    </div>
                                </div>
                                );
                            })}
                            
                            {(requestsList.length === 0 && sessionRequestsList.length === 0) && (
                                <p className="text-sm text-muted-foreground py-4 text-center">No pending requests right now.</p>
                            )}
                        </div>
                    </Card>
                </section>

                {/* 3. Sidebar Stats/Chart */}
                <section className="space-y-6">
                    <ChartSection data={chartData} />
                </section>
            </div>

            {/* Add Session Modal */}
            <AnimatePresence>
                <AddSessionModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedSessionId(null);
                        setSelectedMentee(null);
                        setEditingSession(null);
                    }}
                    selectedSessionId={selectedSessionId}
                    selectedMentee={selectedMentee}
                    initialTopic={sessionTopic}
                    editingSession={editingSession}
                    onSessionAdded={(sessionId) => {
                        if (sessionId) {
                            setSessionRequestsList(prev => prev.filter(s => s.id !== sessionId));
                        }
                    }}
                />
            </AnimatePresence>
        </motion.div>
    );
};

export default MentorDashboard;
