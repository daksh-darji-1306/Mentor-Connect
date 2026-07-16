import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Star, X, Calendar as CalendarIcon, Clock, BookOpen, Check, Mail, Linkedin, Github, MapPin, Building, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logActivity } from '../utils/activityLogger';
import { Card } from '../components/dashboard/DashboardWidgets';
import { Button } from "@/components/ui/button";
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MentorsPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [mentors, setMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Booking Modal State
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [viewingMentorProfile, setViewingMentorProfile] = useState(null);
    const [connectionStatuses, setConnectionStatuses] = useState({});
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingTopic, setBookingTopic] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const q = query(collection(db, 'profiles'), where('role', '==', 'mentor'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => {
                    const profile = doc.data();
                    const profileData = profile.profile_data || {};
                    // Generate a consistent color based on char code to look nice
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500', 'bg-indigo-500'];
                    const colorIndex = profile.full_name ? profile.full_name.charCodeAt(0) % colors.length : 0;
                    
                    return {
                        id: doc.id,
                        name: profile.full_name || profile.email?.split('@')?.[0] || 'Mentor',
                        email: profile.email || '',
                        role: profileData.currentRole || 'Mentor',
                        company: profileData.currentCompany || 'Independent',
                        rating: 5.0,
                        reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews for UI
                        specialties: profileData.specializations && profileData.specializations.length > 0 ? profileData.specializations : ['Mentorship', 'Career Advice'],
                        bio: profileData.bio || '',
                        location: profileData.location || 'N/A',
                        linkedin: profileData.linkedin || '',
                        github: profileData.github || '',
                        mentoringStyle: profileData.mentoringStyle || '',
                        availability: "Available",
                        color: colors[colorIndex]
                    };
                });
                // Exclude the current user if they are a mentor themselves
                setMentors(data.filter(m => m.id !== user?.id));
            } catch (error) {
                console.error("Error fetching mentors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchRequests = async () => {
            if (!user?.id) return;
            try {
                const reqQ = query(collection(db, 'requests'), where('mentee_id', '==', user.id));
                const reqSnap = await getDocs(reqQ);
                const reqs = {};
                reqSnap.forEach(d => {
                    const data = d.data();
                    reqs[data.mentor_id] = data.status;
                });
                setConnectionStatuses(reqs);
            } catch (err) {
                console.error("Error fetching requests:", err);
            }
        };
 
        if (user) {
            fetchMentors();
            fetchRequests();
        }
    }, [user]);

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConnect = async (mentorId, mentorName) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'requests'), {
                mentee_id: user.id,
                mentee_name: user.full_name || user.email?.split('@')?.[0] || 'Mentee',
                mentor_id: mentorId,
                mentor_name: mentorName,
                status: 'pending',
                created_at: new Date().toISOString(),
                message: `Hi ${mentorName}, I would love to connect with you for mentorship!`
            });
            setConnectionStatuses(prev => ({ ...prev, [mentorId]: 'pending' }));
        } catch (error) {
            console.error("Error sending connection request:", error);
        }
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        if (!selectedMentor || !bookingTopic || !user) return;
        setIsBooking(true);
 
        try {
            
            await addDoc(collection(db, 'sessions'), {
                mentor_id: selectedMentor.id,
                mentor_name: selectedMentor.name,
                mentee_id: user.id,
                mentee_name: user.full_name || user.email?.split('@')?.[0] || 'Mentee',
                topic: bookingTopic,
                status: 'pending',
                created_at: new Date().toISOString()
            });
 
            await logActivity(user.id, 'session_booked');
 
            setBookingSuccess(true);
            setTimeout(() => {
                setSelectedMentor(null);
                setBookingSuccess(false);
                setBookingTopic('');
            }, 2000);
 
        } catch (error) {
            console.error("Error booking session:", error);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Find your Mentor</h1>
                    <p className="text-muted-foreground mt-1">Connect with industry experts who've been there.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or company..."
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

            {/* Filter Tags (Mobile/Desktop) */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {['All', 'Engineering', 'Product', 'Design', 'Data Science', 'Marketing'].map((tag, i) => (
                    <button
                        key={tag}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Mentors Grid */}
            {isLoading ? (
                <div className="py-20 text-center text-muted-foreground">Loading mentors...</div>
            ) : filteredMentors.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">No mentors found. Invite some mentors to join!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentors.map((mentor) => (
                        <Card key={mentor.id} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-full ${mentor.color} flex items-center justify-center text-white text-lg font-bold uppercase`}>
                                            {mentor.name.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                            <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-background"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{mentor.name}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            <span>{mentor.role} at {mentor.company}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-1.5 text-sm mb-3">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-foreground">{mentor.rating}</span>
                                    <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {mentor.specialties.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-secondary/40 rounded-md text-xs text-secondary-foreground font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto gap-2">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-xs text-primary font-semibold hover:bg-primary/5"
                                    onClick={() => setViewingMentorProfile(mentor)}
                                >
                                    View Profile
                                </Button>
                                {connectionStatuses[mentor.id] === 'accepted' ? (
                                    <Button size="sm" className="font-semibold text-xs" onClick={() => setSelectedMentor(mentor)}>
                                        Book Session
                                    </Button>
                                ) : connectionStatuses[mentor.id] === 'pending' ? (
                                    <Button size="sm" variant="outline" disabled className="text-xs font-semibold">
                                        Pending
                                    </Button>
                                ) : (
                                    <Button size="sm" className="font-semibold text-xs bg-primary text-primary-foreground shadow-sm shadow-primary/10" onClick={() => handleConnect(mentor.id, mentor.name)}>
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Mentor Profile Modal */}
            <AnimatePresence>
                {viewingMentorProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setViewingMentorProfile(null)}
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
                                    onClick={() => setViewingMentorProfile(null)}
                                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm z-20"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center p-1 shadow-lg">
                                        <div className={`w-full h-full rounded-full ${viewingMentorProfile.color} flex items-center justify-center text-white font-bold text-3xl uppercase`}>
                                            {viewingMentorProfile.name.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 pb-6 pt-16 relative flex-1 overflow-y-auto">
                                <div className="flex flex-col items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">{viewingMentorProfile.name}</h2>
                                    <p className="text-primary font-medium flex items-center gap-2 mt-1">
                                        {viewingMentorProfile.role} at {viewingMentorProfile.company}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-foreground">{viewingMentorProfile.rating}</span>
                                        <span>({viewingMentorProfile.reviews} reviews)</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {viewingMentorProfile.bio && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                                            <p className="text-sm text-foreground leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/50">
                                                {viewingMentorProfile.bio}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Specialties</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingMentorProfile.specialties.map((spec, i) => (
                                                <span key={i} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {viewingMentorProfile.mentoringStyle && (
                                        <div>
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mentoring Style</h3>
                                            <p className="text-sm text-foreground italic leading-relaxed bg-secondary/10 p-3 rounded-xl border border-border/30">
                                                "{viewingMentorProfile.mentoringStyle}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Mail className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Email</p>
                                                <p className="text-sm font-semibold truncate">{viewingMentorProfile.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><MapPin className="w-4 h-4" /></div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Location</p>
                                                <p className="text-sm font-semibold truncate">{viewingMentorProfile.location}</p>
                                            </div>
                                        </div>
                                        {viewingMentorProfile.linkedin && (
                                            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Linkedin className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground font-medium">LinkedIn</p>
                                                    <a href={viewingMentorProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">Profile</a>
                                                </div>
                                            </div>
                                        )}
                                        {viewingMentorProfile.github && (
                                            <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-lg text-primary shadow-sm"><Github className="w-4 h-4" /></div>
                                                <div className="min-w-0">
                                                    <p className="text-xs text-muted-foreground font-medium">GitHub</p>
                                                    <a href={viewingMentorProfile.github} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">GitHub</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border/50 bg-secondary/10 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setViewingMentorProfile(null)}>Close</Button>
                                {connectionStatuses[viewingMentorProfile.id] === 'accepted' ? (
                                    <Button 
                                        className="gap-2"
                                        onClick={() => {
                                            setSelectedMentor(viewingMentorProfile);
                                            setViewingMentorProfile(null);
                                        }}
                                    >
                                        Book Session
                                    </Button>
                                ) : connectionStatuses[viewingMentorProfile.id] === 'pending' ? (
                                    <Button disabled variant="outline">
                                        Request Pending
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => {
                                            handleConnect(viewingMentorProfile.id, viewingMentorProfile.name);
                                            setViewingMentorProfile(null);
                                        }}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Modal Overlay */}
            {selectedMentor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                            <h2 className="text-xl font-bold">Book a Session</h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedMentor(null)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        {bookingSuccess ? (
                            <div className="p-8 text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                    <Check className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Session Request Sent!</h3>
                                    <p className="text-sm text-muted-foreground">Your session request has been sent to {selectedMentor.name} for approval.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleBookSession} className="p-6 flex flex-col gap-5">
                                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                                    <div className={`w-10 h-10 rounded-full ${selectedMentor.color} flex items-center justify-center text-white font-bold uppercase`}>
                                        {selectedMentor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{selectedMentor.name}</div>
                                        <div className="text-xs text-muted-foreground">{selectedMentor.role}</div>
                                    </div>
                                </div>



                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-primary" /> Topic / Goal
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="E.g. Resume Review, Career Advice, Mock Interview"
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        value={bookingTopic}
                                        onChange={(e) => setBookingTopic(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full mt-2" disabled={isBooking}>
                                {isBooking ? 'Sending Request...' : 'Send Session Request'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorsPage;
