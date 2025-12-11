import React from 'react';
import {
    Users,
    BookOpen,
    FileText,
    Target,
    CreditCard,
    Award,
    Calendar,
} from 'lucide-react';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { cn } from '@/lib/utils';

const benefits = [
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: 'Precision AI Matching',
        description: 'Our proprietary algorithms analyze 50+ data points to connect you with the top 1% of mentors who align perfectly with your career trajectory.',
        className: "md:col-span-2",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
    {
        icon: <BookOpen className="h-8 w-8 text-secondary" />,
        title: 'Targeted Learning Paths',
        description: 'Bypass generic fluff. Unlock curated, outcome-driven learning modules designed to bridge your specific skill gaps.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent border border-secondary/10"></div>
    },
    {
        icon: <FileText className="h-8 w-8 text-accent" />,
        title: 'Intelligent Archives',
        description: 'Every insight, preserved. Revisit automatically generated, searchable transcripts and summaries instantly.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border border-accent/10"></div>
    },
    {
        icon: <Target className="h-8 w-8 text-primary" />,
        title: 'Milestone Tracking',
        description: 'Turn ambition into action. Define clear OKRs, sign digital agreements, and visualize your progress on a dynamic dashboard.',
        className: "md:col-span-2",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
    {
        icon: <CreditCard className="h-8 w-8 text-secondary" />,
        title: 'Clear Investment',
        description: 'Premium mentorship, simplified. Pay per session or choose value-packed bundles with zero hidden fees.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent border border-secondary/10"></div>
    },
    {
        icon: <Award className="h-8 w-8 text-accent" />,
        title: 'Verified Elite Network',
        description: 'Learn from the best. Every mentor is rigorously vetted, with verified credentials from top-tier tech companies.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 via-accent/5 to-transparent border border-accent/10"></div>
    },
    {
        icon: <Calendar className="h-8 w-8 text-primary" />,
        title: 'Seamless Global Sync',
        description: 'Coordinate across time zones effortlessly. Our smart calendar integrates directly with Google & Outlook.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
];

const Benefits = () => {
    return (
        <section id="features" className="py-24 bg-background relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                        Why Mentor Connect?
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        Everything you need to build meaningful professional relationships and achieve your career goals.
                    </p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto">
                    {benefits.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};

export default Benefits;
