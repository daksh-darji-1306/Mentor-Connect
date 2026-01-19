import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, MessageSquare, Folder, Clock, Flame, Loader2 } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MenteeDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            streak: 0,
            progress: 0,
            goal: "Set a goal",
            nextMilestone: "No milestones yet",
            milestoneDue: "--"
        },
        nextSession: null,
        activeProjectsCount: 0,
        currentProjectName: "No Active Projects",
        tasksCount: 0,
        tasksOverdue: 0,
        messagesCount: 0,
        latestMessageSender: "No messages"
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // 1. Fetch Profile Stats
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('streak, progress, goal, next_milestone, milestone_due')
                    .eq('id', user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                    console.error("Error fetching profile:", profileError);
                }

                // 2. Fetch Next Session
                const { data: sessions, error: sessionError } = await supabase
                    .from('sessions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('status', 'scheduled')
                    .gte('session_date', new Date().toISOString())
                    .order('session_date', { ascending: true })
                    .limit(1);

                // 3. Fetch Active Projects
                const { data: projects, count: projectsCount, error: projectError } = await supabase
                    .from('projects')
                    .select('name', { count: 'exact' })
                    .eq('user_id', user.id)
                    .eq('status', 'active');

                // 4. Fetch Tasks
                const { count: tasksCount } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'pending');

                const { count: overdueCount } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'overdue');

                // 5. Fetch Unread Messages
                const { count: messagesCount, data: messages } = await supabase
                    .from('messages')
                    .select('sender_name')
                    .eq('user_id', user.id)
                    .eq('is_read', false)
                    .order('created_at', { ascending: false })
                    .limit(1);

                setDashboardData({
                    stats: profile || { streak: 0, progress: 0, goal: "Set a goal", nextMilestone: "None", milestoneDue: "--" },
                    nextSession: sessions?.[0] || null,
                    activeProjectsCount: projectsCount || 0,
                    currentProjectName: projects?.[0]?.name || "No Active Project",
                    tasksCount: tasksCount || 0,
                    tasksOverdue: overdueCount || 0,
                    messagesCount: messagesCount || 0,
                    latestMessageSender: messages?.[0]?.sender_name || "No new messages"
                });

            } catch (error) {
                console.error("Unexpected error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const { stats, nextSession, activeProjectsCount, currentProjectName, tasksCount, tasksOverdue, messagesCount, latestMessageSender } = dashboardData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* 1. Welcome Section */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Student'}! 👋</h1>
                        <p className="text-muted-foreground">
                            You're <span className="font-semibold text-primary">{stats.progress || 0}%</span> towards your goal: {stats.goal || "Not set"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full font-medium">
                        <Flame size={20} className="fill-orange-500" />
                        {stats.streak || 0} day streak!
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">{stats.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${stats.progress || 0}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Next Milestone: <span className="font-medium text-foreground">{stats.nextMilestone || "None"}</span> (Due: {stats.milestoneDue || "--"})
                    </p>
                </div>
            </div>

            {/* 2. Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Next Session */}
                <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <Calendar size={20} />
                        </div>
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                            {nextSession ? "Upcoming" : "No Sessions"}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Session</h3>
                        {nextSession ? (
                            <>
                                <p className="font-bold text-foreground">
                                    {new Date(nextSession.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(nextSession.session_date).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">with {nextSession.mentor_name}</p>
                            </>
                        ) : (
                            <p className="font-bold text-foreground text-sm">No sessions scheduled</p>
                        )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">Book Session</Button>
                </Card>

                {/* Active Projects */}
                <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <Folder size={20} />
                        </div>
                        <span className="text-xs font-bold text-foreground">{activeProjectsCount} Active</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Project</h3>
                        <p className="font-bold text-foreground truncate">{currentProjectName}</p>
                        <p className="text-xs text-yellow-500 mt-1">In Progress</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">View Projects</Button>
                </Card>

                {/* Pending Tasks */}
                <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <CheckSquare size={20} />
                        </div>
                        <span className={`text-xs font-bold ${tasksOverdue > 0 ? "text-destructive" : "text-green-500"}`}>
                            {tasksOverdue > 0 ? `${tasksOverdue} Overdue` : "On Track"}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Tasks</h3>
                        <p className="font-bold text-foreground">{tasksCount} To Do</p>
                        <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">View Tasks</Button>
                </Card>

                {/* Messages */}
                <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg">
                            <MessageSquare size={20} />
                        </div>
                        <span className="text-xs font-bold text-primary">{messagesCount} New</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Messages</h3>
                        <p className="font-bold text-foreground truncate">{latestMessageSender}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">Check your inbox</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">Open Chat</Button>
                </Card>
            </div>

            {/* 3. Upcoming Section (Placeholder for now as complex list logic is separate) */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <div className="p-8 text-center border border-border/40 rounded-xl bg-card/50 text-muted-foreground">
                        <p>No recent activity loaded.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Schedule</h2>
                    <Card className="p-6 text-center text-muted-foreground">
                        <Calendar className="mx-auto mb-2 opacity-50" />
                        <p>No upcoming schedule loaded.</p>
                        <Button variant="link" className="mt-2">View Full Schedule</Button>
                    </Card>
                </div>
            </section>
        </motion.div>
    );
};

export default MenteeDashboard;
