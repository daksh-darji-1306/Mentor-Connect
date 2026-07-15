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
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MentorDashboard = () => {
    // Calendar Context & State
    const navigate = useNavigate();
    const { token, login, logout, addEvent } = useCalendar();
    const { user } = useAuth();
    {/* 1. Header */ }
    const [showAddModal, setShowAddModal] = useState(false);
    const [sessionTopic, setSessionTopic] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionTime, setSessionTime] = useState('');
    const [sessionDuration, setSessionDuration] = useState('60');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // For when accepting a pending request or scheduling specifically for a mentee
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [selectedMentee, setSelectedMentee] = useState(null);

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

            if (selectedSessionId) {
                // We are updating an existing pending session request
                await updateDoc(doc(db, 'sessions', selectedSessionId), {
                    google_event_id: googleEventId,
                    start_time: startDateTime.toISOString(),
                    duration_minutes: parseInt(sessionDuration),
                    calendar_link: calendarLink,
                    status: 'accepted'
                });
                setSessionRequestsList(prev => prev.filter(s => s.id !== selectedSessionId));
                alert(token && googleEventId !== 'none' ? 'Session Accepted & Added to Google Calendar!' : 'Session Accepted & Added to Database!');
            } else {
                // Insert brand new session to Firestore Database
                try {
                    await addDoc(collection(db, 'sessions'), {
                        google_event_id: googleEventId,
                        mentor_id: user.id,
                        mentor_name: user.fullName || 'Mentor',
                        mentee_id: selectedMentee?.id || null,
                        mentee_name: selectedMentee?.full_name || null,
                        topic: sessionTopic,
                        start_time: startDateTime.toISOString(),
                        duration_minutes: parseInt(sessionDuration),
                        calendar_link: calendarLink,
                        status: selectedMentee ? 'accepted' : 'open'
                    });
                    alert(token && googleEventId !== 'none' ? 'Session added to Google Calendar & Database!' : 'Session added to Database!');
                } catch (dbError) {
                    console.error("Firestore insert error:", dbError);
                    alert(`Database Error: ${dbError.message}`);
                }
            }

            setShowAddModal(false);
            setSessionTopic('');
            setSessionDate('');
            setSessionTime('');
            setSelectedSessionId(null);
            setSelectedMentee(null);
        } catch (error) {
            alert('Error adding session');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [sessionRequestsList, setSessionRequestsList] = useState([]);
    const [mentorStats, setMentorStats] = useState({ totalMentees: 0, hours: 0, rating: 4.9 });

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
                
                sessionSnap.docs.forEach(d => {
                    const s = d.data();
                    if (s.mentee_id) {
                        hours += (s.duration_minutes || 60) / 60;
                        menteesCount++; // simplistic mentees count
                    }
                });
                
                setMentorStats({ totalMentees: menteesCount, hours: Math.round(hours), rating: 4.9 });
            } catch (err) {
                console.error(err);
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
                    where('mentor_id', '==', user.id),
                    where('status', 'in', ['accepted', 'confirmed']),
                    orderBy('start_time', 'asc'),
                    limit(4)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                setUpcomingSessions(
                    data.map((ev) => {
                        const startDate = new Date(ev.start_time);
                        return {
                            id: ev.id,
                            mentee: 'Open Slot', // It's a newly created session slot!
                            time: `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                            topic: ev.topic || 'Mentorship Session',
                            link: ev.calendar_link || null,
                        };
                    })
                );
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };
        fetchSessions();
    }, [user?.id, showAddModal]); // Refetch when a new session is added (modal closes)

    

    const MenteesTab = () => {
        const [mentees, setMentees] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchMentees = async () => {
                if (!user?.id) return;
                try {
                    // Fetch sessions this mentor has
                    const sessionsQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                    const sessionSnap = await getDocs(sessionsQ);
                    const sessionData = sessionSnap.docs.map(d => d.data()).filter(s => s.mentee_id);

                    // Fetch accepted requests
                    const requestsQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'accepted'));
                    const requestSnap = await getDocs(requestsQ);
                    const requestData = requestSnap.docs.map(d => d.data());

                    // Combine and deduplicate IDs to fetch profiles
                    const menteeIds = new Set([
                        ...sessionData.map(s => s.mentee_id),
                        ...requestData.map(r => r.mentee_id)
                    ]);
                    
                    const menteeMap = new Map();
                    
                    for (const mId of menteeIds) {
                        const profileSnap = await getDoc(doc(db, 'profiles', mId));
                        if (profileSnap.exists()) {
                            menteeMap.set(mId, { id: mId, ...profileSnap.data() });
                        }
                    }

                    sessionData.forEach(s => {
                        const profile = menteeMap.get(s.mentee_id);
                        if (profile) {
                            menteeMap.set(s.mentee_id, {
                                ...profile,
                                source: 'session',
                                total_sessions: (profile.total_sessions || 0) + 1
                            });
                        }
                    });

                    requestData.forEach(r => {
                        const profile = menteeMap.get(r.mentee_id);
                        if (profile) {
                            menteeMap.set(r.mentee_id, {
                                ...profile,
                                source: 'request'
                            });
                        }
                    });

                    setMentees(Array.from(menteeMap.values()));
                } catch (err) {
                    console.error("Error fetching mentees:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMentees();
        }, []);

        if (loading) return <div className="p-8 text-center text-muted-foreground">Loading mentees...</div>;
        if (mentees.length === 0) return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/10 rounded-3xl border border-dashed border-border">
                <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-bold text-lg text-foreground">No Mentees Yet</h3>
                <p className="text-muted-foreground max-w-xs mt-1">Once users book sessions or you accept requests, they will appear here to track their progress.</p>
            </div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {mentees.map((mentee) => {
                    // Mocked progress for now as per plan
                    const progress = Math.floor(Math.random() * 60) + 30;
                    return (
                        <Card key={mentee.id} className="group hover:border-primary/50 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-primary font-bold text-xl ring-1 ring-primary/20">
                                    {mentee.full_name?.charAt(0) || 'M'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                        {mentee.full_name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{mentee.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-xs text-foreground font-medium">
                                            {mentee.total_sessions || 1} Sessions
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="h-8 text-xs text-primary hover:bg-primary/5 px-2" onClick={() => {
                                            setSelectedMentee(mentee);
                                            setSelectedSessionId(null);
                                            setSessionTopic('');
                                            setShowAddModal(true);
                                        }}>
                                            Schedule
                                        </Button>
                                        <Button onClick={() => navigate('/messages')} size="sm" variant="ghost" className="h-8 text-xs text-primary hover:bg-primary/5 px-2">
                                            Message <ArrowUpRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

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
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-foreground">{session.time}</div>
                                        {session.link ? (
                                            <button
                                                className="text-xs text-primary hover:underline font-semibold"
                                                onClick={() => window.open(session.link, '_blank', 'noopener,noreferrer')}
                                            >
                                                Start Meeting
                                            </button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No Link</span>
                                        )}
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
                                        <Button size="sm" variant="outline" className="flex-1 md:flex-none">Decline</Button>
                                        <Button size="sm" className="flex-1 md:flex-none">Accept</Button>
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
                    <ChartSection data={[
                        { name: 'Jan', value: 30 }, { name: 'Feb', value: 45 },
                        { name: 'Mar', value: 60 }, { name: 'Apr', value: 40 },
                        { name: 'May', value: 75 }, { name: 'Jun', value: 85 }
                    ]} />

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
                                <h3 className="font-bold text-lg text-foreground">
                                    {selectedSessionId ? 'Schedule Requested Session' : (selectedMentee ? `Schedule with ${selectedMentee.full_name}` : 'Add New Session')}
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedSessionId(null);
                                    setSelectedMentee(null);
                                }} className="h-8 w-8 rounded-full">
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
