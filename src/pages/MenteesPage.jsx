import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, Calendar, ArrowUpRight, MessageSquare, Briefcase } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MenteesPage = () => {
    const { user } = useAuth();
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMenteesArr = async () => {
            if (!user?.id) return;
            try {
                // 1. Fetch sessions this mentor has where someone has booked
                const { data: sessionData } = await supabase
                    .from('sessions')
                    .select('booked_by, profiles!booked_by(*)')
                    .eq('mentor_id', user.id)
                    .not('booked_by', 'is', null);

                // 2. Fetch accepted requests
                const { data: requestData } = await supabase
                    .from('requests')
                    .select('mentee_id, profiles!mentee_id(*)')
                    .eq('mentor_id', user.id)
                    .eq('status', 'accepted');

                // Combine and deduplicate
                const menteeMap = new Map();

                sessionData?.forEach(s => {
                    if (s.profiles) {
                        menteeMap.set(s.booked_by, {
                            ...s.profiles,
                            total_sessions: (menteeMap.get(s.booked_by)?.total_sessions || 0) + 1,
                            last_interaction: 'Session'
                        });
                    }
                });

                requestData?.forEach(r => {
                    if (r.profiles) {
                        const existing = menteeMap.get(r.mentee_id) || {};
                        menteeMap.set(r.mentee_id, {
                            ...r.profiles,
                            ...existing,
                            total_sessions: existing.total_sessions || 0,
                            last_interaction: existing.last_interaction || 'Request'
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
        fetchMenteesArr();
    }, [user?.id]);

    const filteredMentees = mentees.filter(m => 
        m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Mentees</h1>
                    <p className="text-muted-foreground mt-1">Manage and track the progress of your active mentees.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search mentees..."
                            className="w-full bg-background border border-border/60 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2 hidden md:flex">
                        <Filter className="w-4 h-4" /> Filters
                    </Button>
                </div>
            </div>

            {mentees.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/10 rounded-3xl border border-dashed border-border mt-8">
                    <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="font-bold text-lg text-foreground">No Mentees Yet</h3>
                    <p className="text-muted-foreground max-w-xs mt-1">Once users book sessions or you accept requests, they will appear here to track their progress.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredMentees.map((mentee) => {
                        const progress = Math.floor(Math.random() * 60) + 30; // Mocked progress
                        return (
                            <Card key={mentee.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center text-primary font-bold text-xl ring-1 ring-primary/20 shadow-sm transition-transform group-hover:scale-105">
                                            {mentee.full_name?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                                                {mentee.full_name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">{mentee.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 flex-1">
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-muted-foreground font-medium">Learning Progress</span>
                                            <span className="text-primary font-bold">{progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-primary rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Sessions</span>
                                            </div>
                                            <div className="text-sm font-bold text-foreground">{mentee.total_sessions || 0} Total</div>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/40">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <MessageSquare className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Last Interaction</span>
                                            </div>
                                            <div className="text-sm font-bold text-foreground">{mentee.last_interaction}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-border/40 mt-6">
                                    <Button size="sm" variant="ghost" className="h-9 text-xs text-primary hover:bg-primary/5 px-4 font-semibold">
                                        View Profile
                                    </Button>
                                    <Button size="sm" className="h-9 px-4 gap-2 shadow-sm font-semibold">
                                        Message <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MenteesPage;
