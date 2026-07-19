import React from 'react';
import { cn } from '@/lib/utils';

const benefitsData = [
    {
        tag: 'Skip the queue',
        title: 'Stop Cold DMing',
        description: "Skip the awkward LinkedIn messages that never get read. Get direct access to people who actually want to help and are paid to prioritize you.",
        detail: "Every mentor on Mentor Connect has opted in to help. You get guaranteed responses within 24 hours — not weeks.",
        accentColor: 'text-secondary border-secondary/20 bg-secondary/5',
    },
    {
        tag: 'Verified experts',
        title: 'No "Gurus"',
        description: 'Only verified industry operators from companies like Google, Amazon, and top startups. No life coaches who have never held a real job.',
        detail: "We verify employment history for every mentor. Practical insights only — from engineers who've shipped production code and led real teams.",
        accentColor: 'text-primary border-primary/20 bg-primary/5',
    },
    {
        tag: 'Context-aware',
        title: 'Real Context',
        description: "No generic YouTube advice. Get answers specific to your code, your career, and your exact situation. Like having a senior dev on call.",
        detail: "Your mentor looks at *your* specific situation. Not a tutorial, not a template — a conversation calibrated to your reality.",
        accentColor: 'text-secondary border-secondary/20 bg-secondary/5',
    },
    {
        tag: 'Accountability',
        title: 'Structured Growth',
        description: 'Turn "I want to get better" into "I will ship this by Friday". Actionable goals, milestones, and accountability tracking built in.',
        detail: "Ambition without a plan is just a dream. Weekly tasks, velocity tracking, and gentle nudges when you fall behind.",
        accentColor: 'text-primary border-primary/20 bg-primary/5',
    },
];

const Benefits = () => {
    return (
        <section id="features" className="py-28 relative overflow-hidden">

            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="mb-20 max-w-2xl mx-auto text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
                        Why It Exists
                    </p>
                    <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
                        Built for people who{' '}
                        <span className="italic text-secondary">actually ship.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Most career advice is random posts or cold DMs.
                        We replace guesswork with real, accountable conversations.
                    </p>
                </div>

                {/* Benefits grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
                    {benefitsData.map((card, i) => (
                        <div
                            key={card.title}
                            className="group relative flex flex-col p-8 rounded-2xl glass border border-white/5 hover:border-secondary/20 transition-all duration-300 cursor-default"
                        >
                            {/* Large background number */}
                            <span
                                className="absolute top-4 right-6 font-heading text-7xl font-bold text-foreground/4 select-none leading-none"
                                aria-hidden="true"
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>

                            {/* Tag chip */}
                            <span className={cn(
                                'self-start text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border mb-5',
                                card.accentColor
                            )}>
                                {card.tag}
                            </span>

                            <h3 className="font-heading text-2xl font-semibold text-foreground mb-3 relative z-10">
                                {card.title}
                            </h3>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 relative z-10 flex-1">
                                {card.description}
                            </p>

                            {/* Detail on hover */}
                            <p className="text-xs text-muted-foreground/60 leading-relaxed border-t border-white/5 pt-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                                {card.detail}
                            </p>

                            {/* Gold bottom accent */}
                            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
