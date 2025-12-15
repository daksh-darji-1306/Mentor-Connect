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
        title: 'Stop Cold DMing',
        description: 'Skip the awkward LinkedIn messages that never get read. Get direct access to people who actually want to help.',
        className: "md:col-span-2",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
    {
        icon: <Award className="h-8 w-8 text-primary" />,
        title: 'No "Gurus"',
        description: 'We ban "life coaches" who have never worked a real job. Only verified industry operators.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: 'Real Context',
        description: 'No generic YouTube advice. Get answers specific to your code, your career, and your context.',
        className: "md:col-span-1",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
    {
        icon: <Target className="h-8 w-8 text-primary" />,
        title: 'Structured Growth',
        description: 'Turn "I want to get better" into "I will ship this by Friday". Actionable goals only.',
        className: "md:col-span-2",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10"></div>
    },
];

const Benefits = () => {
    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="mb-20 max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-6">
                        Why This Exists
                    </h2>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                        Most people get career advice from random posts, YouTube comments, or cold DMs that never get replies. <br className="hidden md:block" />
                        <span className="text-foreground font-medium">Mentor Connect exists to replace guesswork with real conversations and structured guidance.</span>
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
