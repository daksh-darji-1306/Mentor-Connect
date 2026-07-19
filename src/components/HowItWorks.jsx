import React from 'react';
import { Search, TrendingUp, Video } from 'lucide-react';

const steps = [
    {
        icon: <Search aria-hidden="true" className="h-5 w-5 text-secondary" />,
        number: '01',
        title: 'Define your direction',
        desc: 'Tell us your career goals. No lengthy forms — just what matters. We handle the rest.',
    },
    {
        icon: <TrendingUp aria-hidden="true" className="h-5 w-5 text-secondary" />,
        number: '02',
        title: 'Match with an expert',
        desc: 'Get paired with a verified senior professional in your exact field. No guesswork.',
    },
    {
        icon: <Video aria-hidden="true" className="h-5 w-5 text-secondary" />,
        number: '03',
        title: 'Get structured guidance',
        desc: 'Weekly sessions, real feedback, measurable milestones. Progress you can actually see.',
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-28 relative overflow-hidden">
            {/* Soft background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent pointer-events-none" aria-hidden="true" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">

                {/* Section header */}
                <div className="text-center mb-20">
                    <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
                        The Process
                    </p>
                    <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
                        Three steps to{' '}
                        <span className="italic text-secondary">clarity.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                        No complexity. No noise. Just a direct path from where you are to where you want to be.
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                    {/* Connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-10 left-[calc(16.667%+2rem)] right-[calc(16.667%+2rem)] h-px">
                        <div className="w-full h-full bg-gradient-to-r from-secondary/20 via-secondary/60 to-secondary/20" aria-hidden="true" />
                    </div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col p-8 rounded-2xl glass border border-white/5 hover:border-secondary/20 transition-all duration-300 cursor-default"
                        >
                            {/* Big editorial number */}
                            <p className="font-heading text-7xl font-bold text-foreground/5 absolute top-4 right-6 leading-none select-none" aria-hidden="true">
                                {step.number}
                            </p>

                            {/* Icon circle */}
                            <div className="relative z-10 w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/15 transition-colors duration-200">
                                {step.icon}
                            </div>

                            <h3 className="font-heading text-xl font-semibold text-foreground mb-3 relative z-10">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                                {step.desc}
                            </p>

                            {/* Gold bottom accent on hover */}
                            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
