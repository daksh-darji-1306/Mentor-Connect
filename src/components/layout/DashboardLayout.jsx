import React, { useState } from 'react';
import TopNavigation from './TopNavigation';
import { Outlet } from 'react-router-dom';
import FeedbackModal from '../dashboard/FeedbackModal';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardLayout = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative">
            <TopNavigation />

            <main className="container mx-auto max-w-7xl p-6 md:p-8 pb-20 relative z-10">
                <Outlet />
            </main>

            {/* Subtle Texture for "Paper" feel instead of heavy colorful orbs */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-soft-light"></div>
        
            {/* Feedback Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Button 
                    onClick={() => setIsFeedbackOpen(true)}
                    className="rounded-full shadow-lg shadow-primary/20 gap-2 h-12 px-5 hover:scale-105 transition-transform"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="hidden sm:inline font-semibold">Leave Feedback</span>
                </Button>
            </div>

            <FeedbackModal 
                isOpen={isFeedbackOpen} 
                onClose={() => setIsFeedbackOpen(false)} 
            />
        </div>
    );
};

export default DashboardLayout;
