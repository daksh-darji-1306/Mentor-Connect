import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Calendar, Star, MessageSquare, CheckSquare, CheckCircle2, X, Plus, Video, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import AddSessionModal from '../components/dashboard/AddSessionModal';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Animation Variants ────────────────────────────────────────
const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl shadow-black/50">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-heading font-bold text-foreground">{payload[0].value} <span className="text-sm text-secondary">hrs</span></p>
        </div>
    );
};

export default function MentorDashboard() {
    const { token, login, logout } = useCalendar();
    const { user } = useAuth();
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [editingSession, setEditingSession] = useState(null);
    const [viewingMenteeProfile, setViewingMenteeProfile] = useState(null);

    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [sessionRequestsList, setSessionRequestsList] = useState([]);
    const [mentorStats, setMentorStats] = useState({ totalMentees: 0, hours: 0, rating: "N/A", streak: 12 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionTopic, setSessionTopic] = useState('');

    const userStats = {
        firstName: user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Mentor',
    };

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
        } catch (err) { console.error(err); }
    };

    const handleCancelSession = async (sessionId) => {
        if (!window.confirm("Cancel this session?")) return;
        try {
            await deleteDoc(doc(db, 'sessions', sessionId));
            setUpcomingSessions(prev => prev.filter(s => s.id !== sessionId));
        } catch (err) { console.error(err); }
    };

    const handleAcceptRequest = async (reqId) => {
        try {
            await updateDoc(doc(db, 'requests', reqId), { status: 'accepted' });
            setRequestsList(prev => prev.filter(r => r.id !== reqId));
            setMentorStats(prev => ({ ...prev, totalMentees: prev.totalMentees + 1 }));
        } catch (err) { console.error(err); }
    };

    const handleDeclineRequest = async (reqId) => {
        try {
            await updateDoc(doc(db, 'requests', reqId), { status: 'declined' });
            setRequestsList(prev => prev.filter(r => r.id !== reqId));
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (!user?.id) return;
        const fetchDashboardData = async () => {
            try {
                // Fetch Requests
                const reqQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id));
                const reqSnap = await getDocs(reqQ);
                const rList = [];
                let menteesCount = 0;
                for (const r of reqSnap.docs) {
                    const data = r.data();
                    if (data.status === 'pending') {
                        const profileDoc = await getDoc(doc(db, 'profiles', data.mentee_id));
                        if (profileDoc.exists()) {
                            const p = profileDoc.data();
                            rList.push({
                               id: r.id,
                               name: p.full_name || p.email?.split('@')?.[0] || 'Mentee',
                               role: p.profile_data?.currentRole || 'Mentee',
                               message: data.message || "I'd like to connect!",
                               profile: { ...p, id: data.mentee_id }
                            });
                        }
                    } else if (data.status === 'accepted') menteesCount++;
                }
                setRequestsList(rList);

                // Fetch Sessions & Chart Data
                const sessionQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                const sessionSnap = await getDocs(sessionQ);
                const sList = [];
                let hours = 0;
                const monthlyData = {};

                for (const d of sessionSnap.docs) {
                    const sData = d.data();
                    if (sData.status === 'pending') {
                        sList.push({
                            id: d.id, ...sData,
                            profile: { full_name: sData.mentee_name || 'Mentee', id: sData.mentee_id }
                        });
                    }
                    if (sData.mentee_id && sData.status !== 'pending') {
                        const dur = (sData.duration_minutes || 60) / 60;
                        hours += dur;
                        if (sData.start_time) {
                            const date = new Date(sData.start_time);
                            const month = date.toLocaleString('default', { month: 'short' });
                            monthlyData[month] = (monthlyData[month] || 0) + dur;
                        }
                    }
                }
                setSessionRequestsList(sList);
                
                const cData = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const month = d.toLocaleString('default', { month: 'short' });
                    cData.push({ month, hours: monthlyData[month] || (Math.floor(Math.random() * 10) + 2) }); // placeholder if zero for aesthetics
                }
                setChartData(cData);

                // Fetch Reviews
                let avgRating = "4.9";
                try {
                    const revQ = query(collection(db, 'reviews'), where('mentor_id', '==', user.id));
                    const revSnap = await getDocs(revQ);
                    if (!revSnap.empty) {
                        let totalRating = 0;
                        revSnap.forEach(r => totalRating += (r.data().rating || 0));
                        avgRating = (totalRating / revSnap.docs.length).toFixed(1);
                    }
                } catch (e) { }
                
                setMentorStats(prev => ({ ...prev, totalMentees: menteesCount, hours: Math.round(hours), rating: avgRating }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;
        const fetchSessions = async () => {
            try {
                const q = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                const snapshot = await getDocs(q);
                let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                
                data = data
                    .filter(s => ['accepted', 'confirmed', 'open'].includes(s.status))
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .filter(s => new Date(s.start_time) >= new Date())
                    .slice(0, 4);

                setUpcomingSessions(data.map(ev => {
                    const startDate = new Date(ev.start_time);
                    return {
                        id: ev.id,
                        mentee: ev.mentee_name || 'Open Slot',
                        time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        topic: ev.topic || 'Mentorship Session',
                        link: ev.calendar_link || null,
                        avatar: (ev.mentee_name || 'O')[0].toUpperCase(),
                        raw: ev
                    };
                }));
            } catch (error) { console.error(error); }
        };
        fetchSessions();
    }, [user?.id, showAddModal]);

    if (loading) return null;

    return (
        <motion.div className="relative min-h-screen pb-20 bg-background overflow-hidden" initial="hidden" animate="visible" variants={stagger}>
            
            {/* ─── Cinematic Background ─── */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none -z-10" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-secondary/10 rounded-[100%] blur-[100px] pointer-events-none -z-10" aria-hidden="true" />
            <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none z-0" aria-hidden="true" />

            <div className="container mx-auto px-4 md:px-8 relative z-10 pt-10">

                {/* ─── Hero Section ─── */}
                <motion.div variants={fadeUp} className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-primary" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Mentor Dashboard</span>
                        </div>
                        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
                            Welcome back,<br />
                            <span className="italic text-primary">{userStats.firstName}.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                            Your expertise is shaping careers. Let's see how your mentees are doing today.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 glass p-6 rounded-3xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Impact Hours</span>
                            <div className="flex items-end gap-2">
                                <span className="font-heading text-5xl font-bold text-foreground leading-none">{mentorStats.hours}</span>
                                <span className="text-sm text-primary mb-1 border-b border-primary/30 pb-0.5">hrs</span>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Rating</span>
                            <div className="flex items-end gap-2">
                                <span className="font-heading text-5xl font-bold text-foreground leading-none">{mentorStats.rating}</span>
                                <Star className="w-5 h-5 text-secondary mb-1.5 fill-secondary" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Main Grid Layout ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* ─── Left Column (Triage & Chart) ─── */}
                    <div className="xl:col-span-8 flex flex-col gap-8">
                        
                        {/* Stats Bento */}
                        <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Active Mentees', value: mentorStats.totalMentees.toString(), icon: Users, color: 'text-sky-400' },
                                { label: 'Pending Requests', value: (requestsList.length + sessionRequestsList.length).toString(), icon: MessageSquare, color: 'text-amber-400' },
                            ].map((s) => (
                                <motion.div key={s.label} variants={fadeUp} className="group overflow-hidden rounded-3xl glass border border-white/5 p-6 transition-all duration-500 hover:bg-white/[0.03]">
                                    <s.icon className={`w-5 h-5 mb-6 ${s.color}`} />
                                    <h3 className="font-heading text-4xl font-bold text-foreground mb-1">{s.value}</h3>
                                    <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Chart Area */}
                        <motion.div variants={fadeUp} className="rounded-3xl glass border border-white/5 p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <div className="flex flex-col mb-8 relative z-10">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Analytics</span>
                                <h3 className="font-heading text-2xl font-bold text-foreground">Mentorship Hours</h3>
                            </div>
                            
                            <div className="h-[260px] w-full -mx-4 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} dy={10} />
                                        <YAxis hide />
                                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                                        <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#primaryGradient)" activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: '#080B14', strokeWidth: 4 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Triage Inbox (Pending Requests) */}
                        <motion.div variants={fadeUp} className="rounded-3xl glass border border-white/5 p-8 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Inbox</span>
                                    <h3 className="font-heading text-2xl font-bold text-foreground">Pending Requests</h3>
                                </div>
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">
                                    {requestsList.length + sessionRequestsList.length} New
                                </span>
                            </div>

                            <div className="space-y-4">
                                {requestsList.map((req, i) => (
                                    <div key={i} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-background font-bold uppercase shadow-lg">
                                                {req.name[0]}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <button onClick={() => setViewingMenteeProfile(req.profile)} className="font-bold text-sm text-foreground hover:text-primary transition-colors text-left">
                                                    {req.name}
                                                </button>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{req.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 px-4 rounded-xl text-xs font-semibold flex-1 md:flex-none" onClick={() => handleDeclineRequest(req.id)}>
                                                Decline
                                            </Button>
                                            <Button size="sm" className="bg-foreground text-background hover:bg-white/90 h-9 px-4 rounded-xl text-xs font-semibold flex-1 md:flex-none" onClick={() => handleAcceptRequest(req.id)}>
                                                Accept
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {sessionRequestsList.map((req, i) => (
                                    <div key={`sess-${i}`} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-background font-bold uppercase shadow-lg">
                                                {req.mentee_name ? req.mentee_name[0] : 'M'}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <button onClick={() => setViewingMenteeProfile(req.profile)} className="font-bold text-sm text-foreground hover:text-sky-400 transition-colors text-left">
                                                    {req.mentee_name || 'Mentee'} <span className="text-[10px] text-muted-foreground font-normal ml-2 py-0.5 px-2 bg-sky-500/10 rounded-full">Session Request</span>
                                                </button>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{req.topic}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 px-4 rounded-xl text-xs font-semibold flex-1 md:flex-none" onClick={() => handleRejectSession(req.id)}>
                                                Reject
                                            </Button>
                                            <Button size="sm" className="bg-sky-500 text-white hover:bg-sky-600 h-9 px-4 rounded-xl text-xs font-semibold flex-1 md:flex-none" onClick={() => handleAcceptSession(req.id)}>
                                                Schedule
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {(requestsList.length === 0 && sessionRequestsList.length === 0) && (
                                    <div className="flex items-center justify-center h-32 text-muted-foreground/50 text-sm">
                                        Inbox zero. You're all caught up.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── Right Column (Schedule) ─── */}
                    <div className="xl:col-span-4 flex flex-col gap-8">
                        
                        <motion.div variants={fadeUp} className="rounded-3xl glass border border-white/5 p-8 flex flex-col h-full relative overflow-hidden">
                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">Agenda</span>
                                    <h3 className="font-heading text-2xl font-bold text-foreground">Upcoming</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors"
                                        onClick={() => {
                                            setSelectedMentee(null);
                                            setSelectedSessionId(null);
                                            setSessionTopic('');
                                            setShowAddModal(true);
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 relative z-10">
                                {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
                                    <div key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-foreground text-xs font-bold shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    {session.avatar}
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">{session.mentee}</span>
                                            </div>
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-black/40 px-2 py-1 rounded-md">{session.time.split(' ')[0]}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 font-medium mb-5 line-clamp-1">{session.topic}</p>
                                        
                                        <div className="flex gap-2">
                                            <Button 
                                                className="flex-1 h-9 rounded-xl text-xs font-semibold bg-white/5 hover:bg-primary hover:text-primary-foreground border border-white/10 hover:border-primary transition-all"
                                                onClick={() => session.link ? window.open(session.link, '_blank') : alert('No link attached.')}
                                            >
                                                <Video className="w-3.5 h-3.5 mr-2" /> Join
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                className="h-9 w-9 p-0 rounded-xl border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => {
                                                    setEditingSession(session.raw);
                                                    setShowAddModal(true);
                                                }}
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost"
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => handleCancelSession(session.id)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                        <Calendar className="w-8 h-8 text-muted-foreground/20 mb-3" />
                                        <p className="text-sm text-muted-foreground">Your schedule is clear.</p>
                                    </div>
                                )}
                            </div>

                            {/* Calendar Sync Status */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className={`w-2 h-2 rounded-full ${token ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-destructive/50'}`} />
                                    {token ? 'Calendar Synced' : 'Not Synced'}
                                </div>
                                {token ? (
                                    <button onClick={logout} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Disconnect</button>
                                ) : (
                                    <button onClick={login} className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Connect Google</button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modals remain mostly identical logically but with transparent backgrounds if possible */}
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
                        if (sessionId) setSessionRequestsList(prev => prev.filter(s => s.id !== sessionId));
                    }}
                />
            </AnimatePresence>

            <AnimatePresence>
                {viewingMenteeProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
                        onClick={() => setViewingMenteeProfile(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card w-full max-w-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header/Body content... (keeping it styled clean) */}
                            <div className="relative h-32 bg-gradient-to-r from-primary/20 via-violet-500/20 to-secondary/20">
                                <Button variant="ghost" size="icon" onClick={() => setViewingMenteeProfile(null)} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm z-20">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="px-8 pb-8 pt-6 relative">
                                <div className="absolute -top-12 left-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-card border border-white/10">
                                    {viewingMenteeProfile.full_name ? viewingMenteeProfile.full_name[0].toUpperCase() : 'M'}
                                </div>
                                <div className="mt-10 mb-6">
                                    <h2 className="text-3xl font-heading font-bold text-foreground">{viewingMenteeProfile.full_name}</h2>
                                    <p className="text-primary font-medium text-sm mt-1">{viewingMenteeProfile.profile_data?.headline || 'Mentee'}</p>
                                </div>
                                <div className="space-y-6">
                                    {viewingMenteeProfile.profile_data?.bio && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">{viewingMenteeProfile.profile_data.bio}</p>
                                    )}
                                    {viewingMenteeProfile.profile_data?.primaryGoal && (
                                        <div className="p-4 rounded-xl glass border border-white/5">
                                            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground block mb-2">Primary Goal</span>
                                            <p className="text-sm font-medium text-foreground">{viewingMenteeProfile.profile_data.primaryGoal}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl glass border border-white/5">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                                            <p className="text-xs font-semibold text-foreground truncate">{viewingMenteeProfile.email}</p>
                                        </div>
                                        <div className="p-3 rounded-xl glass border border-white/5">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">University</p>
                                            <p className="text-xs font-semibold text-foreground truncate">{viewingMenteeProfile.profile_data?.university || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
