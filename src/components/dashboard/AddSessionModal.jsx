import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useCalendar } from '../../context/CalendarContext';
import { useAuth } from '../../context/AuthContext';

const AddSessionModal = ({ 
    isOpen, 
    onClose, 
    selectedSessionId, 
    selectedMentee,
    initialTopic = '',
    initialDate = '',
    onSessionAdded,
    editingSession = null
}) => {
    const { user } = useAuth();
    const { token, addEvent } = useCalendar();
    
    const [sessionTopic, setSessionTopic] = useState(initialTopic);
    const [sessionDate, setSessionDate] = useState('');
    const [sessionTime, setSessionTime] = useState('');
    const [sessionDuration, setSessionDuration] = useState('60');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editingSession) {
                setSessionTopic(editingSession.topic || '');
                if (editingSession.start_time) {
                    const d = new Date(editingSession.start_time);
                    setSessionDate(d.toISOString().split('T')[0]);
                    setSessionTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                } else {
                    setSessionDate('');
                    setSessionTime('');
                }
                setSessionDuration(editingSession.duration_minutes?.toString() || '60');
            } else {
                setSessionTopic(initialTopic);
                setSessionDate(initialDate);
                setSessionTime('');
                setSessionDuration('60');
            }
            setIsSubmitting(false);
        }
    }, [isOpen, initialTopic, editingSession]);

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

            if (editingSession) {
                // Update an already existing session
                await updateDoc(doc(db, 'profiles', user.id, 'sessions', editingSession.id), {
                    topic: sessionTopic,
                    start_time: startDateTime.toISOString(),
                    duration_minutes: parseInt(sessionDuration)
                });
                alert('Session updated successfully in Database! Note: Google Calendar event (if any) must be updated manually for now.');
            } else if (selectedSessionId) {
                // We are updating an existing pending session request
                await updateDoc(doc(db, 'profiles', user.id, 'sessions', selectedSessionId), {
                    google_event_id: googleEventId,
                    start_time: startDateTime.toISOString(),
                    duration_minutes: parseInt(sessionDuration),
                    calendar_link: calendarLink,
                    status: 'accepted'
                });
                alert(token && googleEventId !== 'none' ? 'Session Accepted & Added to Google Calendar!' : 'Session Accepted & Added to Database!');
            } else {
                // Insert brand new session to Firestore Database
                try {
                    await addDoc(collection(db, 'profiles', user.id, 'sessions'), {
                        google_event_id: googleEventId,
                        mentor_id: user.id,
                        mentor_name: user.full_name || user.fullName || 'Mentor',
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

            if (onSessionAdded) onSessionAdded(selectedSessionId);
            onClose();
        } catch (error) {
            alert('Error adding session');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
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
                        {editingSession ? 'Edit Session' : (selectedSessionId ? 'Schedule Requested Session' : (selectedMentee ? `Schedule with ${selectedMentee.full_name}` : 'Add New Session'))}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
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
                            {isSubmitting ? 'Saving...' : (editingSession ? 'Save Changes' : (token ? 'Add to Calendar & Database' : 'Add Session'))}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddSessionModal;
