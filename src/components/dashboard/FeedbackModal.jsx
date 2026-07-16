import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const FeedbackModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !feedback.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'testimonials'), {
                user_id: user.id,
                name: user.full_name || user.email?.split('@')?.[0] || 'User',
                role: user.role === 'mentor' ? (user.profile_data?.currentRole || 'Mentor') : 'Mentee',
                body: feedback.trim(),
                rating: rating,
                img: `https://avatar.vercel.sh/${user.id}`, // Generic avatar based on ID
                created_at: new Date().toISOString(),
                status: 'approved' // Auto-approve for demo purposes, could be 'pending' in prod
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFeedback('');
                setRating(5);
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-card w-full max-w-md border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/20">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">Leave a Review</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    {success ? (
                        <div className="p-8 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                                <Star className="w-8 h-8 fill-green-500" />
                            </div>
                            <h3 className="text-xl font-bold">Thank You!</h3>
                            <p className="text-sm text-muted-foreground">Your feedback has been submitted successfully and might be featured on our landing page.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">How would you rate your experience?</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted/50'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Share your thoughts
                                </label>
                                <textarea
                                    required
                                    placeholder="How has Mentor Connect helped you in your career journey?"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px] resize-none"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting || !feedback.trim()}>
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FeedbackModal;
