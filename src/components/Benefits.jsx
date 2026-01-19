import React from 'react';
import { LinkCard } from './ui/link-card';

// Content for MentorConnect
const benefitsData = [
    {
        title: 'Stop Cold DMing',
        description: "Skip the awkward LinkedIn messages that never get read. Get direct access to people who actually want to help and are paid to prioritize you.",
        details: "Cold messaging is a numbers game with a 1% success rate. At MentorConnect, every mentor has opted in to help. You save weeks of waiting and get guaranteed responses within 24 hours.",
        imageUrl: '/benefits/stop-cold-dming.png',
        href: '#mentors',
    },
    {
        title: 'No "Gurus"',
        description: 'We ban "life coaches" who have never worked a real job. Only verified industry operators from companies like Google, Amazon, and top startups.',
        details: "We verify employment history for every mentor. You won't find theoretical advice here—only practical insights from engineers who have actually scaled systems, led teams, and shipped production code.",
        imageUrl: '/benefits/no-gurus.png',
        href: '#verification',
    },
    {
        title: 'Real Context',
        description: 'No generic YouTube advice. Get answers specific to your code, your career, and your context. It\'s like having a senior dev on your team.',
        details: "Tutorials assume a perfect world. Your project has technical debt, specific constraints, and unique bugs. Our mentors look at *your* specific situation to provide unblockers that generic guides can't match.",
        imageUrl: '/benefits/real-context.png',
        href: '#mentorship',
    },
    {
        title: 'Structured Growth',
        description: 'Turn "I want to get better" into "I will ship this by Friday". Actionable goals, milestones, and accountability tracking.',
        details: "Ambition without a plan is just a dream. We help you break down big career goals into weekly, shippable tasks. Track your velocity, see your progress, and get nudged when you fall behind.",
        imageUrl: '/benefits/structured-growth.png',
        href: '#roadmap',
    },
];

const Benefits = () => {
    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="mb-20 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-6">
                        Why This Exists
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Most people get career advice from random posts or cold DMs.
                        <br className="hidden md:block" />
                        <span className="text-foreground font-medium">We replace guesswork with real conversations.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {benefitsData.map((card) => (
                        <LinkCard
                            key={card.title}
                            title={card.title}
                            description={card.description}
                            details={card.details}
                            imageUrl={card.imageUrl}
                            href={card.href}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
