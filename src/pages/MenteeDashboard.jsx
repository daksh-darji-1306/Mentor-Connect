import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, where, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Calendar, CheckSquare, MessageSquare, Flame, ArrowRight,
    BookOpen, Target, TrendingUp, Zap, Video,
    ChevronRight, Star, Activity, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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

const IconMap = { BookOpen, Target, Zap, TrendingUp, CheckSquare, Calendar, MessageSquare, Flame };

const HeatmapCell = ({ intensity }) => {
    const colors = [
        'bg-white/5 border border-white/5',
        'bg-secondary/20 border border-secondary/20 shadow-[0_0_8px_rgba(201,168,76,0.2)]',
        'bg-secondary/40 border border-secondary/40 shadow-[0_0_12px_rgba(201,168,76,0.3)]',
        'bg-secondary/70 border border-secondary/60 shadow-[0_0_16px_rgba(201,168,76,0.5)]',
        'bg-secondary border border-secondary shadow-[0_0_20px_rgba(201,168,76,0.8)]',
    ];
    return (
        <div className={`w-3.5 h-3.5 rounded-sm ${colors[intensity]} transition-all hover:scale-125 hover:z-10 cursor-crosshair`} />
    );
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

export default function MenteeDashboard() {
    const { user } = useAuth();
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [mentorsList, setMentorsList] = useState([]);
    const [recentActivityList, setRecentActivityList] = useState([]);
    const [heatmapDataList, setHeatmapDataList] = useState([]);
    const [resourcesList, setResourcesList] = useState([]);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

    const userStats = {
        firstName: user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
        progress: 72,
        goal: 'Master Full Stack Development',
        streak: 15,
        totalSessions: upcomingSessions.length + recentActivityList.length,
        hoursLearned: 142,
    };

    const weeklyActivity = [
        { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.2 }, { day: 'Wed', hours: 1.8 },
        { day: 'Thu', hours: 4.1 }, { day: 'Fri', hours: 2.9 }, { day: 'Sat', hours: 5.0 },
        { day: 'Sun', hours: 3.5 },
    ];

    React.useEffect(() => {
        if (!user?.id) return;
        const fetchDashboardData = async () => {
            try {
                const sessionsQ = query(collection(db, 'sessions'), where('mentee_id', '==', user.id));
                const sessionsSnap = await getDocs(sessionsQ);
                const allSessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                let upcoming = allSessions
                    .filter(s => new Date(s.start_time) >= new Date())
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .slice(0, 3);

                setUpcomingSessions(upcoming.map(ev => {
                    const startDate = new Date(ev.start_time);
                    return {
                        id: ev.id,
                        mentor: ev.mentor_name || 'Mentor',
                        topic: ev.topic || 'Mentorship Session',
                        time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        avatar: (ev.mentor_name || 'M')[0].toUpperCase(),
                        link: ev.calendar_link,
                    };
                }));

                const reqQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id));
                const reqSnap = await getDocs(reqQ);
                const mentorIds = new Set();
                let pCount = 0;
                reqSnap.forEach(d => {
                    const data = d.data();
                    if (data.status === 'accepted') mentorIds.add(data.mentor_id);
                    else if (data.status === 'pending') pCount++;
                });
                allSessions.forEach(s => {
                    if (s.mentor_id) mentorIds.add(s.mentor_id);
                });

                const mList = [];
                for (const mid of mentorIds) {
                    const pDoc = await getDoc(doc(db, 'profiles', mid));
                    if (pDoc.exists()) {
                        const p = pDoc.data();
                        mList.push({
                            id: mid,
                            name: p.full_name || p.email?.split('@')?.[0] || 'Mentor',
                            role: p.profile_data?.currentRole || 'Mentor',
                            avatar: (p.full_name || p.email || 'M')[0].toUpperCase(),
                            online: true,
                        });
                    }
                }
                setMentorsList(mList.slice(0, 4));
                setPendingRequestsCount(pCount);

                if (mentorIds.size > 0) {
                    const uniqueMentorIds = Array.from(mentorIds);
                    const resQ = query(collection(db, 'resources'), where('mentor_id', 'in', uniqueMentorIds.slice(0, 30)));
                    const resSnap = await getDocs(resQ);
                    setResourcesList(resSnap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, 2));
                }

                let pastSessions = allSessions
                    .filter(s => new Date(s.start_time) < new Date())
                    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
                    .slice(0, 4);

                const activityQ = query(collection(db, 'profiles', user.id, 'activity_logs'), where('user_id', '==', user.id));
                const activitySnap = await getDocs(activityQ);

                const activityCounts = {};
                activitySnap.forEach(doc => {
                    const data = doc.data();
                    if (data.timestamp) {
                        let date = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
                        if (!isNaN(date.getTime())) {
                            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            activityCounts[dateString] = (activityCounts[dateString] || 0) + 1;
                        }
                    }
                });

                const weeks = [];
                let currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - (12 * 7 - 1));

                for (let w = 0; w < 12; w++) {
                    const days = [];
                    for (let d = 0; d < 7; d++) {
                        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                        const count = activityCounts[dateString] || 0;
                        days.push(count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    weeks.push(days);
                }
                setHeatmapDataList(weeks);

                const recList = pastSessions.map(s => ({
                    id: s.id,
                    title: `Session: ${s.topic || 'Mentorship'}`,
                    mentor: s.mentor_name || 'Mentor',
                    time: new Date(s.start_time).toLocaleDateString(),
                    iconName: 'Calendar',
                }));
                setRecentActivityList(recList.length > 0 ? recList : [{ id: '1', title: 'Welcome to Mentor Connect!', mentor: 'System', time: 'Today', iconName: 'Flame' }]);

            } catch (err) {
                console.error("Dashboard error:", err);
            }
        };
        fetchDashboardData();
    }, [user?.id]);

    return (
        <motion.div className="relative min-h-screen pb-20 bg-background overflow-hidden" initial="hidden" animate="visible" variants={stagger}>

            {/* ─── Cinematic Background Elements ─── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-secondary/10 rounded-[100%] blur-[120px] pointer-events-none -z-10" aria-hidden="true" />
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none z-0" aria-hidden="true" />

            <div className="container mx-auto px-4 md:px-8 relative z-10 pt-10">

                {/* ─── Hero Section ─── */}
                <motion.div variants={fadeUp} className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-8 bg-secondary" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-secondary">Overview</span>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
                                Welcome back,<br />
                                <span className="italic text-secondary">{userStats.firstName}.</span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                                You are <strong className="text-foreground">{userStats.progress}%</strong> through your journey to mastering <strong className="text-foreground">{userStats.goal}</strong>.
                            </p>
                        </div>

                        {/* Minimalist Streak Card */}
                        <div className="flex items-center gap-6 glass p-6 rounded-3xl border-white/5 border">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Current Streak</span>
                                <div className="flex items-end gap-2">
                                    <span className="font-heading text-5xl font-bold text-foreground leading-none">{userStats.streak}</span>
                                    <span className="text-sm text-secondary font-medium mb-1 border-b border-secondary/30 pb-0.5">days</span>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Hours Logged</span>
                                <div className="flex items-end gap-2">
                                    <span className="font-heading text-5xl font-bold text-foreground leading-none">{userStats.hoursLearned}</span>
                                    <span className="text-sm text-muted-foreground mb-1">hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Grid Layout ─── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* ─── Left Column (Main Data) ─── */}
                    <div className="xl:col-span-8 flex flex-col gap-8">
                        
                        {/* Top Stats Bento */}
                        <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Next Session', value: upcomingSessions[0]?.time.split(' ')[0] || 'None', sub: 'Schedule one', icon: Calendar, link: '/sessions' },
                                { label: 'Active Mentors', value: mentorsList.length.toString(), sub: 'Connected', icon: Target, link: '/mentors' },
                                { label: 'Pending', value: pendingRequestsCount.toString(), sub: 'Requests', icon: CheckSquare, link: '/sessions' },
                                { label: 'Resources', value: resourcesList.length.toString(), sub: 'Available', icon: BookOpen, link: '/resources' },
                            ].map((s) => (
                                <motion.div key={s.label} variants={fadeUp}>
                                    <Link to={s.link} className="block h-full group relative overflow-hidden rounded-3xl glass border border-white/5 p-6 transition-all duration-500 hover:border-secondary/30 hover:bg-white/[0.03]">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500">
                                            <ArrowRight className="w-4 h-4 text-secondary" />
                                        </div>
                                        <s.icon className="w-5 h-5 text-muted-foreground mb-6 group-hover:text-secondary transition-colors duration-500" />
                                        <h3 className="font-heading text-3xl font-bold text-foreground mb-1">{s.value}</h3>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-foreground">{s.label}</span>
                                            <span className="text-xs text-muted-foreground">{s.sub}</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Chart Area */}
                        <motion.div variants={fadeUp} className="relative rounded-3xl glass border border-white/5 p-8 overflow-hidden group">
                            {/* Glow accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Velocity</span>
                                    <h3 className="font-heading text-2xl font-bold text-foreground">Weekly Activity</h3>
                                </div>
                            </div>
                            
                            <div className="h-[220px] w-full -mx-4 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={weeklyActivity}>
                                        <defs>
                                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, textAnchor: 'middle' }} dy={10} />
                                        <YAxis hide />
                                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <Area type="natural" dataKey="hours" stroke="#C9A84C" strokeWidth={3} fill="url(#goldGradient)" activeDot={{ r: 6, fill: '#C9A84C', stroke: '#080B14', strokeWidth: 4 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Activity List */}
                        <motion.div variants={fadeUp}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading text-xl font-bold text-foreground">Recent Log</h3>
                            </div>
                            <div className="space-y-3">
                                {recentActivityList.map((act, i) => (
                                    <div key={i} className="group flex items-center justify-between p-5 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-secondary/50 group-hover:bg-secondary group-hover:shadow-[0_0_8px_#C9A84C] transition-all" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{act.title}</p>
                                                <p className="text-xs text-muted-foreground">{act.mentor}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">{act.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── Right Column (Sidebar Widgets) ─── */}
                    <div className="xl:col-span-4 flex flex-col gap-8">
                        
                        {/* Heatmap Widget */}
                        <motion.div variants={fadeUp} className="rounded-3xl glass border border-white/5 p-8 relative overflow-hidden group">
                            <div className="flex flex-col mb-8">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Consistency</span>
                                <h3 className="font-heading text-2xl font-bold text-foreground">Activity Map</h3>
                            </div>
                            
                            <div className="flex justify-center gap-1.5 mb-6">
                                {heatmapDataList.map((week, wi) => (
                                    <div key={wi} className="flex flex-col gap-1.5">
                                        {week.map((intensity, di) => (
                                            <HeatmapCell key={`${wi}-${di}`} intensity={intensity} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Less</span>
                                <div className="flex gap-1.5">
                                    {[0, 1, 2, 3, 4].map(i => <HeatmapCell key={i} intensity={i} />)}
                                </div>
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">More</span>
                            </div>
                        </motion.div>

                        {/* Upcoming Sessions */}
                        <motion.div variants={fadeUp} className="rounded-3xl glass border border-white/5 p-8 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase text-secondary mb-1">Up Next</span>
                                    <h3 className="font-heading text-2xl font-bold text-foreground">Agenda</h3>
                                </div>
                                <Link to="/sessions">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-4 flex-1">
                                {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/30 transition-all duration-300 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-background text-xs font-bold shadow-md">
                                                    {session.avatar}
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">{session.mentor}</span>
                                            </div>
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">{session.time.split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground/90 font-medium mb-4 line-clamp-1">{session.topic}</p>
                                            <Button 
                                                className="w-full h-9 rounded-xl text-xs font-semibold bg-white/5 hover:bg-secondary text-foreground hover:text-secondary-foreground border border-white/10 hover:border-secondary transition-all"
                                                onClick={() => session.link ? window.open(session.link, '_blank') : alert('No link attached.')}
                                            >
                                                <Video className="w-3 h-3 mr-2" /> Join Call
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-center">
                                        <Calendar className="w-8 h-8 text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground">No upcoming sessions.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
