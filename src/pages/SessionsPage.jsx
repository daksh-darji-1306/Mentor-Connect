import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, MoreHorizontal, Bell, Link2 } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import AddSessionModal from '../components/dashboard/AddSessionModal';
import { db } from '../lib/firebase';
import { collectionGroup, getDocs, query, or, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const SessionsPage = () => {
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    React.useEffect(() => {
        if (!user) return;
        const fetchSessions = async () => {
            setIsLoading(true);
            try {
                    const q = query(
                        collectionGroup(db, 'sessions'),
                        or(
                            where('mentor_id', '==', user.id),
                            where('mentee_id', '==', user.id),
                            where('status', '==', 'open')
                        )
                    );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (data) {
                    // Map DB sessions to UI format, filtering out pending requests
                    const formatted = data
                      .filter(ev => ['accepted', 'confirmed', 'open'].includes(ev.status))
                      .map(ev => {
                        const startDate = new Date(ev.start_time);
                        const isMentor = user.id === ev.mentor_id;
                        const otherPerson = isMentor ? ev.mentee_name : ev.mentor_name;
                        
                        return {
                            id: ev.id,
                            otherPerson: otherPerson || (ev.status === 'open' ? 'Open Slot' : 'User'),
                            role: isMentor ? "Mentee" : "Mentor",
                            time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            day: startDate.getDate(),
                            month: startDate.getMonth(),
                            year: startDate.getFullYear(),
                            topic: ev.topic || "Mentorship Session",
                            link: ev.calendar_link,
                            status: ev.status || "confirmed",
                            color: "bg-primary"
                        };
                    }).filter(s => s.month === currentMonth.getMonth() && s.year === currentMonth.getFullYear());
                    setSessions(formatted);
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [currentMonth, user, refreshTrigger]);

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
                <div></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">

                {/* Main Calendar Section */}
                <Card className="flex-1 flex flex-col p-6 bg-card border-border/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-serif text-foreground">Calendar</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-secondary/30 rounded-lg p-1">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1))}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="px-4 flex items-center justify-center text-sm font-bold min-w-[100px]">
                                    {monthName} {year}
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1))}
                                >
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
                            const isMentor = user?.role === 'mentor';
                            return (
                                <div
                                    key={index}
                                    className={`bg-card relative p-2 min-h-[80px] flex flex-col gap-1 transition-colors ${!d.day ? 'bg-secondary/5' : 'hover:bg-secondary/10'} ${isMentor && d.day ? 'cursor-pointer hover:border-primary/30 border border-transparent' : ''}`}
                                    onClick={() => {
                                        if (isMentor && d.day) {
                                            const formattedDate = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
                                            setSelectedDate(formattedDate);
                                            setIsAddSessionOpen(true);
                                        }
                                    }}
                                >
                                    {d.day && (
                                        <span className={`text-sm font-medium ${d.day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                            {d.day}
                                        </span>
                                    )}

                                    {/* Event Blocks */}
                                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                                        {events.map(event => (
                                            <div key={event.id} className="bg-primary/90 text-primary-foreground p-1.5 rounded-md overflow-hidden text-[10px] items-start leading-tight shadow-sm cursor-pointer hover:bg-primary transition-colors">
                                                <div className="font-bold mb-0.5 truncate" title={event.topic}>{event.topic}</div>
                                                <div className="opacity-90 truncate">w/ {event.otherPerson}</div>
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
                        {isLoading && (
                            <div className="text-center text-sm text-muted-foreground p-4">Loading available sessions...</div>
                        )}
                        {sessions.length === 0 && !isLoading && (
                            <div className="text-center text-sm text-muted-foreground p-4">No sessions scheduled for this month.</div>
                        )}
                        {sessions.map(session => (
                            <div key={session.id} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm uppercase">
                                        {session.otherPerson.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-sm text-foreground truncate">{session.topic}</h4>
                                        <p className="text-xs font-medium text-foreground">with {session.otherPerson}</p>
                                        <p className="text-xs text-muted-foreground">Day {session.day} | {session.time}</p>
                                    </div>
                                </div>
                                {session.link ? (
                                    <Button 
                                        className="w-full font-bold shadow-md hover:shadow-lg transition-all" 
                                        size="sm"
                                        onClick={() => window.open(session.link, '_blank')}
                                    >
                                        View in Calendar
                                    </Button>
                                ) : (
                                    <Button 
                                        className="w-full font-bold shadow-md hover:shadow-lg transition-all" 
                                        size="sm"
                                        variant="outline"
                                        disabled
                                    >
                                        No Link Available
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AddSessionModal 
                isOpen={isAddSessionOpen} 
                onClose={() => setIsAddSessionOpen(false)} 
                initialDate={selectedDate} 
                onSessionAdded={() => setRefreshTrigger(prev => prev + 1)} 
            />
        </div>
    );
};

export default SessionsPage;
