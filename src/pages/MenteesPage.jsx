import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, Calendar, ArrowUpRight, MessageSquare, Briefcase, X, Mail, BookOpen, Clock, MapPin, Building } from 'lucide-react';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MenteesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mentees, setMentees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMentee, setSelectedMentee] = useState(null);

    useEffect(() => {
        const fetchMenteesArr = async () => {
            if (!user?.id) return;
            try {
                // 1. Fetch sessions this mentor has where someone has booked
                const sessionQ = query(collection(db, 'sessions'), where('mentor_id', '==', user.id));
                const sessionSnap = await getDocs(sessionQ);

                // 2. Fetch accepted requests
                const requestQ = query(collection(db, 'requests'), where('mentor_id', '==', user.id), where('status', '==', 'accepted'));
                const requestSnap = await getDocs(requestQ);

                const menteeIds = new Set();
                const sessionCounts = {};
                
                sessionSnap.forEach(d => {
                    const data = d.data();
                    if (data.mentee_id) {
                        menteeIds.add(data.mentee_id);
                        sessionCounts[data.mentee_id] = (sessionCounts[data.mentee_id] || 0) + 1;
                    }
                });

                requestSnap.forEach(d => {
                    const data = d.data();
                    if (data.mentee_id) menteeIds.add(data.mentee_id);
                });

                // Fetch profiles
                const menteeMap = new Map();
                for (const mId of menteeIds) {
                    const pDoc = await getDoc(doc(db, 'profiles', mId));
                    if (pDoc.exists()) {
                        menteeMap.set(mId, {
                            ...pDoc.data(),
                            id: mId,
                            total_sessions: sessionCounts[mId] || 0,
                            last_interaction: sessionCounts[mId] ? 'Session' : 'Request'
                        });
                    }
                }

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
            ) : filteredMentees.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-secondary/10 rounded-3xl border border-dashed border-border mt-8">
                    <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="font-bold text-lg text-foreground">No matching mentees</h3>
                    <p className="text-muted-foreground max-w-xs mt-1">We couldn't find any of your mentees matching "{searchTerm}".</p>
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

                                <div className="space-y-5 flex-1 pt-4">
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
                                    <Button onClick={() => setSelectedMentee(mentee)} size="sm" variant="ghost" className="h-9 text-xs text-primary hover:bg-primary/5 px-4 font-semibold">
                                        View Profile
                                    </Button>
                                    <Button onClick={() => navigate('/messages')} size="sm" className="h-9 px-4 gap-2 shadow-sm font-semibold">
                                        Message <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedMentee && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setSelectedMentee(null)}
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
                                    onClick={() => setSelectedMentee(null)}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm z-20"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-primary-foreground font-bold text-3xl">
                                            {selectedMentee.full_name?.charAt(0) || 'M'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6 pt-16 relative flex-1 overflow-y-auto">
                                <div className="flex flex-col items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">{selectedMentee.full_name}</h2>
                                    <p className="text-primary font-medium flex items-center gap-2 mt-1">
                                        {selectedMentee.profile_data?.headline || 'Mentee'}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {selectedMentee.profile_data?.bio && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                                            <p className="text-sm text-foreground leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/50">
                                                {selectedMentee.profile_data.bio}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Mail className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Email</p>
                                                <p className="text-sm font-semibold truncate max-w-[120px]">{selectedMentee.email}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Building className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Company/School</p>
                                                <p className="text-sm font-semibold truncate max-w-[120px]">{selectedMentee.profile_data?.company || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><MapPin className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Location</p>
                                                <p className="text-sm font-semibold truncate max-w-[120px]">{selectedMentee.profile_data?.location || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Calendar className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Total Sessions</p>
                                                <p className="text-sm font-semibold">{selectedMentee.total_sessions || 0}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><MessageSquare className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Last Interaction</p>
                                                <p className="text-sm font-semibold">{selectedMentee.last_interaction}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="p-4 border-t border-border/50 bg-secondary/10 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelectedMentee(null)}>Close</Button>
                                <Button onClick={() => navigate('/messages')} className="gap-2">
                                    Message <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenteesPage;
