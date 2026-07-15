import React, { useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs, where, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Calendar, Folder, CheckSquare, MessageSquare, Flame, ArrowRight,
  Sparkles, BookOpen, Target, TrendingUp, Zap, Clock, Video,
  ChevronRight, Star, Play, Award, BarChart3, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Animation Variants ────────────────────────────────────────
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ─── Dynamic Icons Map ─────────────────────────────────────────
const IconMap = { BookOpen, Target, Zap, TrendingUp, CheckSquare, Calendar, Folder, MessageSquare, Flame };


// ─── Heatmap Cell ──────────────────────────────────────────────
const HeatmapCell = ({ intensity }) => {
  const colors = [
    'bg-border/30',
    'bg-primary/20',
    'bg-primary/40',
    'bg-primary/60',
    'bg-primary/90',
  ];
  return (
    <div className={`w-3 h-3 rounded-[3px] ${colors[intensity]} transition-colors hover:ring-1 hover:ring-primary/50`} />
  );
};

// ─── Custom Tooltip ────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value}h</p>
    </div>
  );
};

const ProgressTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value}%</p>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function MenteeDashboard() {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [recentActivityList, setRecentActivityList] = useState([]);
  const [heatmapDataList, setHeatmapDataList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Dynamic user stats
  const userStats = {
    firstName: user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User',
    progress: 72,
    goal: 'Master Full Stack Development',
    streak: 15,
    totalSessions: upcomingSessions.length + recentActivityList.length,
    hoursLearned: 142,
    projectsDone: 8,
  };

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.2 }, { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 }, { day: 'Fri', hours: 2.9 }, { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 3.5 },
  ];
  const monthlyProgress = [
    { month: 'Sep', score: 45 }, { month: 'Oct', score: 52 }, { month: 'Nov', score: 58 },
    { month: 'Dec', score: 63 }, { month: 'Jan', score: 68 }, { month: 'Feb', score: 72 },
  ];

  React.useEffect(() => {
    if (!user?.id) return;
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch upcoming sessions
        const upcomingQ = query(collection(db, 'sessions'), where('booked_by', '==', user.id), orderBy('start_time', 'asc'), limit(3));
        const upcomingSnap = await getDocs(upcomingQ);
        const upcoming = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setUpcomingSessions(upcoming.map(ev => {
          const startDate = new Date(ev.start_time);
          return {
            id: ev.id,
            mentor: ev.mentor_name || 'Mentor',
            topic: ev.topic || 'Mentorship Session',
            time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            avatar: (ev.mentor_name || 'M')[0].toUpperCase(),
            gradient: 'from-indigo-500 to-violet-500',
            link: ev.calendar_link,
          };
        }));

        // 2. Fetch mentors (from accepted requests)
        const reqQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id), where('status', '==', 'accepted'));
        const reqSnap = await getDocs(reqQ);
        const mentorIds = new Set();
        reqSnap.forEach(d => mentorIds.add(d.data().mentor_id));
        upcoming.forEach(s => mentorIds.add(s.mentor_id));
        
        const mList = [];
        const colors = ['from-violet-500 to-fuchsia-500', 'from-sky-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-amber-500 to-orange-400'];
        let colorIdx = 0;
        for (const mid of mentorIds) {
           const pDoc = await getDoc(doc(db, 'profiles', mid));
           if (pDoc.exists()) {
               const p = pDoc.data();
               mList.push({
                   id: p.id,
                   name: p.full_name || p.email.split('@')[0],
                   role: p.profile_data?.currentRole || 'Mentor',
                   avatar: (p.full_name || p.email)[0].toUpperCase(),
                   online: true,
                   gradient: colors[colorIdx % colors.length]
               });
               colorIdx++;
           }
        }
        setMentorsList(mList);

        // Fetch pending requests
        const pendingQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id), where('status', '==', 'pending'));
        const pendingSnap = await getDocs(pendingQ);
        setPendingRequestsCount(pendingSnap.docs.length);

        // 3. Fetch Resources
        const resQ = query(collection(db, 'resources'), limit(4));
        const resSnap = await getDocs(resQ);
        setResourcesList(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // 4. Heatmap & Recent Activity (Using sessions as a proxy)
        const pastQ = query(collection(db, 'sessions'), where('booked_by', '==', user.id), orderBy('start_time', 'desc'), limit(5));
        const pastSnap = await getDocs(pastQ);
        const pastSessions = pastSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const weeks = [];
        for (let w = 0; w < 12; w++) {
          const days = [];
          for (let d = 0; d < 7; d++) {
            days.push(Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0); // Simulated real activity for unrecorded past days
          }
          weeks.push(days);
        }
        setHeatmapDataList(weeks);

        const recList = pastSessions.map((s, idx) => ({
             id: s.id, 
             title: `Booked: ${s.topic || 'Session'}`,
             mentor: s.mentor_name || 'Mentor',
             time: new Date(s.start_time).toLocaleDateString(),
             iconName: 'Calendar',
             color: 'text-violet-400'
        }));
        setRecentActivityList(recList.length > 0 ? recList : [{ id: '1', title: 'Welcome to Mentor Connect!', mentor: 'System', time: 'Today', iconName: 'Flame', color: 'text-amber-400' }]);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchDashboardData();
  }, [user?.id]);

  const totalHours = weeklyActivity.reduce((s, d) => s + d.hours, 0).toFixed(1);

  return (
    <motion.div className="relative pb-12" initial="hidden" animate="visible" variants={stagger}>
      
      {/* Global Grain Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none z-0 rounded-3xl" />

      {/* NEW BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* ======================================================== */}
        {/* MAIN FOCUS (Col Span 8) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* ══════════════════════ HERO SECTION ══════════════════════ */}
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl">
            {/* Gradient background orbs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-card/40 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl shadow-primary/20 rounded-3xl p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left */}
                <div className="space-y-4 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-primary">Welcome back</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
                  >
                    Hello, {userStats.firstName}
                    <span className="inline-block ml-2 animate-bounce">👋</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-base max-w-lg"
                  >
                    You're <span className="text-primary font-semibold">{userStats.progress}%</span> through
                    your journey to <span className="text-foreground font-medium">{userStats.goal}</span>
                  </motion.p>

                  {/* Progress bar */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="origin-left max-w-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-secondary/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${userStats.progress}%` }}
                          transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-primary via-violet-400 to-fuchsia-400"
                        />
                      </div>
                      <span className="text-sm font-bold text-primary tabular-nums">{userStats.progress}%</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right: Streak + quick stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 min-w-[100px]">
                    <Flame className="w-7 h-7 text-amber-500 fill-amber-500 mb-1" />
                    <span className="text-2xl font-bold text-foreground">{userStats.streak}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">day streak</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 min-w-[100px]">
                    <Award className="w-7 h-7 text-emerald-500 mb-1" />
                    <span className="text-2xl font-bold text-foreground">{userStats.totalSessions}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">sessions</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════ STATS GRID ══════════════════════ */}
          <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { 
                label: 'Next Session', 
                value: upcomingSessions.length > 0 ? upcomingSessions[0].time.split(' ')[0] : 'None', 
                desc: upcomingSessions.length > 0 ? `with ${upcomingSessions[0].mentor}` : 'Schedule one now', 
                icon: Calendar, accent: 'from-sky-500/15 to-blue-500/10', iconColor: 'text-sky-500', border: 'ring-1 ring-white/5', href: '/sessions' 
              },
              { 
                label: 'Mentors Connected', 
                value: mentorsList.length.toString(), 
                desc: 'Active mentorships', 
                icon: Target, accent: 'from-violet-500/15 to-purple-500/10', iconColor: 'text-violet-500', border: 'ring-1 ring-white/5', href: '/mentors' 
              },
              { 
                label: 'Pending Requests', 
                value: pendingRequestsCount.toString(), 
                desc: 'Awaiting approval', 
                icon: CheckSquare, accent: 'from-emerald-500/15 to-green-500/10', iconColor: 'text-emerald-500', border: 'ring-1 ring-white/5', href: '/sessions' 
              },
              { 
                label: 'Learning Resources', 
                value: resourcesList.length.toString(), 
                desc: 'Available materials', 
                icon: BookOpen, accent: 'from-rose-500/15 to-pink-500/10', iconColor: 'text-rose-500', border: 'ring-1 ring-white/5', href: '/resources' 
              },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <Link to={stat.href}>
                  <Card className={`group cursor-pointer ring-1 ring-white/5 border-none hover:ring-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br ${stat.accent} ${stat.border} !p-6 h-full flex flex-col justify-center`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-background/60 ${stat.iconColor}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* ══════════════════════ CHARTS ROW ══════════════════════ */}
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Weekly Activity Chart */}
            <motion.div variants={fadeUp} className="h-full">
              <Card className="!p-6 h-full ring-1 ring-white/5 border-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Weekly Activity</h3>
                    <p className="text-xs text-muted-foreground">{totalHours}h this week</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="h-[160px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyActivity}>
                      <defs>
                        <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis hide />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#weeklyGrad)" dot={false} activeDot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Progress Trend Chart */}
            <motion.div variants={fadeUp} className="h-full">
              <Card className="!p-6 h-full ring-1 ring-white/5 border-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Progress Trend</h3>
                    <p className="text-xs text-muted-foreground">Last 6 months</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="h-[160px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyProgress}>
                      <defs>
                        <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#4ade80" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis hide domain={[30, 100]} />
                      <Tooltip content={<ProgressTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={2.5} fill="url(#progressGrad)" dot={false} activeDot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* ══════════════════════ RECENT ACTIVITY ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
              <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/5 rounded-full px-4">View All</Button>
            </div>
            <div className="space-y-3">
              {recentActivityList.map((activity, i) => {
                const Icon = IconMap[activity.iconName] || CheckSquare;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <Card className="!p-5 group cursor-pointer border-none ring-1 ring-white/5 hover:ring-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-background/50 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl bg-card ring-1 ring-white/5 ${activity.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.mentor} · {activity.time}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ══════════════════════ LEARNING RESOURCES ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Learning Resources</h2>
              <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/5 rounded-full px-4">Browse All</Button>
            </div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={stagger} initial="hidden" animate="visible">
              {resourcesList.map((r) => {
                const Icon = IconMap[r.icon] || BookOpen;
                return (
                  <motion.div key={r.id} variants={fadeUp} className="h-full">
                    <Card className="!p-6 group cursor-pointer border-none ring-1 ring-white/5 hover:ring-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 h-full flex flex-col bg-background/40 backdrop-blur-md">
                      <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl p-2 mb-3" style={{ backgroundColor: `${r.color}18` }}>
                          <Icon className="w-full h-full" style={{ color: r.color }} />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{r.type}</p>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-muted-foreground">Progress</span>
                          <span className="text-[11px] font-bold tabular-nums" style={{ color: r.color }}>{r.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${r.progress}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: r.color }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        </div>


        {/* ======================================================== */}
        {/* SIDEBAR CONTEXT (Col Span 4) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* ══════════════════════ HEATMAP ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <Card className="!p-6 h-full ring-1 ring-white/5 border-none">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Activity Heatmap</h3>
                  <p className="text-xs text-muted-foreground">Last 12 weeks</p>
                </div>
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Activity className="w-4 h-4 text-violet-500" />
                </div>
              </div>
              <div className="flex gap-1 justify-center mt-2 overflow-hidden">
                {heatmapDataList.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((intensity, di) => (
                      <HeatmapCell key={`${wi}-${di}`} intensity={intensity} />
                    ))}
                  </div>
                ))}
              </div>
              {/* Heatmap legend */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[10px] text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map(i => <HeatmapCell key={i} intensity={i} />)}
                <span className="text-[10px] text-muted-foreground">More</span>
              </div>
            </Card>
          </motion.div>

          {/* ══════════════════════ UPCOMING SESSIONS ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <Card className="!p-6 border-none ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-sm">Upcoming Sessions</h3>
                <Link to="/sessions"><Button variant="ghost" size="sm" className="text-primary text-xs h-7 hover:bg-primary/5 rounded-full px-4">See All</Button></Link>
              </div>
              <div className="space-y-3">
                {upcomingSessions.map((s, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-secondary/10 ring-1 ring-white/5 hover:ring-primary/40 hover:bg-secondary/20 transition-all cursor-pointer group hover:shadow-xl hover:shadow-primary/10">
                    <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{s.topic}</p>
                      <p className="text-xs text-muted-foreground">{s.mentor} · {s.time}</p>
                    </div>
                    {s.link ? (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" className="h-8 w-fit text-xs text-primary hover:bg-primary/10 px-4 rounded-full font-semibold">
                          <Video className="w-3.5 h-3.5 mr-1" /> Join
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); alert('No meeting link is attached to this session yet.'); }} className="h-8 w-fit text-xs text-muted-foreground hover:bg-primary/10 px-4 rounded-full font-semibold">
                        <Video className="w-3.5 h-3.5 mr-1" /> Join
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ══════════════════════ SKILL PROGRESS ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <Card className="!p-6 border-none ring-1 ring-white/5">
              <h3 className="font-bold text-foreground text-sm mb-4">Skill Progress</h3>
              <div className="space-y-4">
                {[
                  { skill: 'React & Next.js', pct: 88, color: 'bg-sky-500' },
                  { skill: 'System Design', pct: 62, color: 'bg-violet-500' },
                  { skill: 'Node.js', pct: 75, color: 'bg-emerald-500' },
                  { skill: 'TypeScript', pct: 45, color: 'bg-amber-500' },
                ].map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground">{s.skill}</span>
                      <span className="text-xs font-bold text-muted-foreground tabular-nums">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${s.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ══════════════════════ YOUR MENTORS REFACTORED ══════════════════════ */}
          <motion.div variants={fadeUp} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Your Mentors</h2>
              <Link to="/mentors"><Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/5 rounded-full px-4">Browse All</Button></Link>
            </div>
            
            {/* Switched from overflow flex row to a tight grid system */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {mentorsList.map((mentor, i) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-full"
                >
                  <Card className="!p-5 group cursor-pointer border-none ring-1 ring-white/5 hover:ring-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-background/40 backdrop-blur-md flex flex-row items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {mentor.avatar}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${mentor.online ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-muted-foreground/30'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">{mentor.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{mentor.role}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Link to="/messages">
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] bg-primary/10 text-primary hover:bg-primary/20 font-medium rounded-full w-full">
                          Message
                        </Button>
                      </Link>
                      <Link to="/sessions">
                        <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] font-medium rounded-full border-none ring-1 ring-white/10 shadow-sm w-full">
                          Book
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
