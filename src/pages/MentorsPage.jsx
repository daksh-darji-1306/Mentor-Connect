import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Star, X, Calendar as CalendarIcon, Clock, BookOpen, Check } from 'lucide-react';
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
                        id: profile.id,
                        name: profile.full_name || profile.email.split('@')[0],
                        role: profileData.currentRole || 'Mentor',
                        company: profileData.currentCompany || 'Independent',
                        rating: 5.0,
                        reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews for UI
                        specialties: profileData.expertise && profileData.expertise.length > 0 ? profileData.expertise : ['Mentorship', 'Career Advice'],
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

        if (user) {
            fetchMentors();
        }
    }, [user]);

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBookSession = async (e) => {
        e.preventDefault();
        if (!selectedMentor || !bookingTopic || !user) return;
        setIsBooking(true);

        try {
            
            await addDoc(collection(db, 'sessions'), {
                mentor_id: selectedMentor.id,
                mentor_name: selectedMentor.name,
                mentee_id: user.id,
                mentee_name: user.full_name || user.email.split('@')[0],
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

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                    {mentor.availability}
                                </span>
                                <Button size="sm" className="font-semibold" onClick={() => setSelectedMentor(mentor)}>
                                    Book Session
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

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
