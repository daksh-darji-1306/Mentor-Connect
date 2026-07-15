import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Link as LinkIcon, Plus, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '../components/dashboard/DashboardWidgets';
import AddResourceModal from '../components/resources/AddResourceModal';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ResourcesPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchResources = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            if (user.role === 'mentor') {
                // Mentor sees their own resources
                const q = query(
                    collection(db, 'resources'),
                    where('mentor_id', '==', user.id)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by created_at desc manually if index is missing
                data.sort((a, b) => (b.created_at?.toMillis?.() || 0) - (a.created_at?.toMillis?.() || 0));
                setResources(data);
            } else {
                // Mentee sees resources from their connected mentors
                const mentorIds = new Set();

                // 1. Check requests collection
                const reqQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id), where('status', '==', 'accepted'));
                const reqSnap = await getDocs(reqQ);
                reqSnap.forEach(d => mentorIds.add(d.data().mentor_id));

                // 2. Check sessions collection (mentees might be connected via accepted sessions)
                const sessQ = query(collection(db, 'sessions'), where('mentee_id', '==', user.id), where('status', '==', 'accepted'));
                const sessSnap = await getDocs(sessQ);
                sessSnap.forEach(d => mentorIds.add(d.data().mentor_id));
                
                // Fallback for older sessions that used 'booked_by' instead of 'mentee_id'
                const legacySessQ = query(collection(db, 'sessions'), where('booked_by', '==', user.id), where('status', '==', 'accepted'));
                const legacySessSnap = await getDocs(legacySessQ);
                legacySessSnap.forEach(d => mentorIds.add(d.data().mentor_id));

                const uniqueMentorIds = Array.from(mentorIds);

                if (uniqueMentorIds.length > 0) {
                    const q = query(
                        collection(db, 'resources'),
                        where('mentor_id', 'in', uniqueMentorIds.slice(0, 30)) // Firestore 'in' max 30
                    );
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    data.sort((a, b) => (b.created_at?.toMillis?.() || 0) - (a.created_at?.toMillis?.() || 0));
                    setResources(data);
                } else {
                    setResources([]);
                }
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [user?.id, user?.role]);

    const filteredResources = resources.filter(r => 
        (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (r.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type) {
            case 'Video': return <Video className="w-5 h-5 text-rose-500" />;
            case 'Article': return <FileText className="w-5 h-5 text-sky-500" />;
            case 'Course': return <BookOpen className="w-5 h-5 text-violet-500" />;
            default: return <LinkIcon className="w-5 h-5 text-emerald-500" />;
        }
    };

    return (
        <motion.div className="max-w-7xl mx-auto space-y-8" initial="hidden" animate="visible" variants={stagger}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Learning Resources</h1>
                    <p className="text-muted-foreground mt-1">
                        {user?.role === 'mentor' 
                            ? 'Manage and share materials with your connected mentees.' 
                            : 'Explore materials shared by your connected mentors.'}
                    </p>
                </div>
                
                {user?.role === 'mentor' && (
                    <Button onClick={() => setShowAddModal(true)} className="w-full md:w-auto bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Share Resource
                    </Button>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredResources.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed ring-0 border border-border/50 bg-background/50">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 text-muted-foreground">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No resources found</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        {searchQuery 
                            ? `No resources match your search "${searchQuery}".` 
                            : user?.role === 'mentor'
                                ? "You haven't shared any resources yet. Click 'Share Resource' to add one."
                                : "Your mentors haven't shared any resources yet."}
                    </p>
                </Card>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                >
                    {filteredResources.map((resource) => (
                        <motion.div key={resource.id} variants={fadeUp} className="h-full">
                            <Card className="h-full flex flex-col p-5 group cursor-pointer border-none ring-1 ring-white/5 hover:ring-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10 bg-card/60 backdrop-blur-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2.5 rounded-xl bg-background border border-border/50 shadow-sm">
                                        {getIcon(resource.type)}
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                                        {resource.category || 'General'}
                                    </span>
                                </div>
                                
                                <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {resource.title}
                                </h3>
                                
                                {resource.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">
                                        {resource.description}
                                    </p>
                                )}
                                
                                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold">
                                            {resource.mentor_name?.[0]?.toUpperCase() || 'M'}
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {user?.role === 'mentor' ? 'Shared by you' : resource.mentor_name}
                                        </span>
                                    </div>
                                    
                                    <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs font-semibold text-primary flex items-center hover:underline"
                                    >
                                        View <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <AddResourceModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)}
                onResourceAdded={fetchResources}
            />
        </motion.div>
    );
}
