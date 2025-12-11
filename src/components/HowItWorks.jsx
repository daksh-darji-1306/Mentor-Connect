import React from 'react';
import { Search, Calendar, Video, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
    {
        icon: <Search className="h-8 w-8 text-primary" />,
        title: "1. Find Your Match",
        desc: "Browse our curated list of mentors or let our AI recommend the perfect expert based on your goals."
    },
    {
        icon: <Calendar className="h-8 w-8 text-primary" />,
        title: "2. Book a Session",
        desc: "Pick a time that works for you. Our timezone-aware calendar makes global scheduling effortless."
    },
    {
        icon: <Video className="h-8 w-8 text-primary" />,
        title: "3. Connect & Learn",
        desc: "Join your 1:1 video session, access structured micro-courses, and get personalized advice."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "4. Track Progress",
        desc: "Set goals, receive feedback, and track your growth milestones with our integrated dashboard."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
                        A simple, streamlined process to get you from where you are to where you want to be.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-soft hover:-translate-y-1"
                        >
                            <div className="mb-6 relative">
                                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-foreground">{step.title.split('. ')[1]}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
