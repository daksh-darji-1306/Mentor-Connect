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
    const [viewingMenteeProfile, setViewingMenteeProfile] = useState(null);

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
                           name: p.full_name || p.email?.split('@')?.[0] || 'Mentee',
                           role: p.profile_data?.currentRole || 'Mentee',
                           message: data.message || "Hi, I'd like to connect!",
                           profile: {
                               ...p,
                               email: p.email || '',
                               full_name: p.full_name || p.email?.split('@')[0] || 'Mentee',
                               id: data.mentee_id
                           }
                        });
                    }
                }
                setRequestsList(rList);

                // Fetch pending session requests
                const sessReqQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id), where('status', '==', 'pending'));
                const sessReqSnap = await getDocs(sessReqQ);
                const sList = [];
                for (const d of sessReqSnap.docs) {
                    const sData = d.data();
                    const profileDoc = await getDoc(doc(db, 'profiles', sData.mentee_id));
                    const p = profileDoc.exists() ? profileDoc.data() : {};
                    sList.push({
                        id: d.id,
                        ...sData,
                        profile: {
                            ...p,
                            email: p.email || '',
                            full_name: p.full_name || sData.mentee_name || 'Mentee',
                            id: sData.mentee_id
                        }
                    });
                }
                setSessionRequestsList(sList);

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
                                        <button 
                                            onClick={() => setViewingMenteeProfile(req.profile)}
                                            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold uppercase hover:bg-primary/20 transition-colors"
                                        >
                                            {req.name ? req.name[0].toUpperCase() : 'M'}
                                        </button>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">
                                                <button onClick={() => setViewingMenteeProfile(req.profile)} className="hover:underline text-left">
                                                    {req.name}
                                                </button>
                                                <span className="text-xs font-normal text-muted-foreground">• {req.role}</span>
                                            </h4>
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
                                        <button 
                                            onClick={() => setViewingMenteeProfile(req.profile)}
                                            className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold hover:bg-primary/30 transition-colors"
                                        >
                                            {req.mentee_name ? req.mentee_name[0].toUpperCase() : 'M'}
                                        </button>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">
                                                <button onClick={() => setViewingMenteeProfile(req.profile)} className="hover:underline text-left">
                                                    {req.mentee_name || 'Mentee'}
                                                </button>
                                                <span className="text-xs font-normal text-muted-foreground">• Session Request</span>
                                            </h4>
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

            {/* Mentee Profile Modal */}
            <AnimatePresence>
                {viewingMenteeProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setViewingMenteeProfile(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-lg border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="relative h-24 bg-gradient-to-r from-primary/20 via-violet-500/20 to-secondary/20 rounded-t-2xl">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewingMenteeProfile(null)}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm z-20"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-primary-foreground font-bold text-3xl">
                                            {viewingMenteeProfile.full_name ? viewingMenteeProfile.full_name.charAt(0).toUpperCase() : 'M'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6 pt-16 relative flex-1 overflow-y-auto">
                                <div className="flex flex-col items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">{viewingMenteeProfile.full_name || 'Mentee'}</h2>
                                    <p className="text-primary font-medium flex items-center gap-2 mt-1">
                                        {viewingMenteeProfile.profile_data?.headline || 'Mentee'}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {viewingMenteeProfile.profile_data?.bio && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                                            <p className="text-sm text-foreground leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/50">
                                                {viewingMenteeProfile.profile_data.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Skills / Interests */}
                                    {((viewingMenteeProfile.profile_data?.languages && viewingMenteeProfile.profile_data.languages.length > 0) || 
                                      (viewingMenteeProfile.profile_data?.frameworks && viewingMenteeProfile.profile_data.frameworks.length > 0) || 
                                      (viewingMenteeProfile.profile_data?.tools && viewingMenteeProfile.profile_data.tools.length > 0)) && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills & Technologies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {viewingMenteeProfile.profile_data.languages?.map((lang, i) => (
                                                    <span key={`lang-${i}`} className="px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md text-xs font-medium">
                                                        {lang}
                                                    </span>
                                                ))}
                                                {viewingMenteeProfile.profile_data.frameworks?.map((fw, i) => (
                                                    <span key={`fw-${i}`} className="px-2.5 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-md text-xs font-medium">
                                                        {fw}
                                                    </span>
                                                ))}
                                                {viewingMenteeProfile.profile_data.tools?.map((t, i) => (
                                                    <span key={`t-${i}`} className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md text-xs font-medium">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {viewingMenteeProfile.profile_data?.primaryGoal && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Primary Goal</h3>
                                            <p className="text-sm text-foreground leading-relaxed bg-secondary/10 p-3 rounded-xl border border-border/30">
                                                {viewingMenteeProfile.profile_data.primaryGoal}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Users className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Email</p>
                                                <p className="text-sm font-semibold truncate">{viewingMenteeProfile.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Building className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">University</p>
                                                <p className="text-sm font-semibold truncate">{viewingMenteeProfile.profile_data?.university || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Clock className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Year of Study</p>
                                                <p className="text-sm font-semibold truncate">{viewingMenteeProfile.profile_data?.yearOfStudy || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Star className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Weekly Commitment</p>
                                                <p className="text-sm font-semibold truncate">{viewingMenteeProfile.profile_data?.weeklyCommitment || 'N/A'} hours</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border/50 bg-secondary/10 flex justify-end">
                                <Button variant="outline" onClick={() => setViewingMenteeProfile(null)}>Close</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MentorDashboard;
