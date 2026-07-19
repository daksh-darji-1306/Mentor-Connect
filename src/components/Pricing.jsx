import React from 'react';
import { Github, Heart, Shield, Code, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = [
    {
        icon: <Code aria-hidden="true" className="w-5 h-5 text-secondary" />,
        title: "100% Free & Open Source",
        description: "No hidden fees, subscriptions, or premium paywalls. All features are available from day one, forever.",
        tag: "MIT License",
    },
    {
        icon: <Shield aria-hidden="true" className="w-5 h-5 text-secondary" />,
        title: "Self-Hostable",
        description: "Fork the repo, plug in your own Firebase project, and deploy to Vercel in under five minutes.",
        tag: "Own Your Data",
    },
    {
        icon: <Heart aria-hidden="true" className="w-5 h-5 text-secondary" />,
        title: "Community Driven",
        description: "Built by developers, for developers. Contribute features, report issues, or fork for your own use.",
        tag: "GitHub",
    },
];

const Pricing = () => {
    return (
        <section id="opensource" className="py-28 relative overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 mb-6">
                            <span className="text-xs font-semibold tracking-widest text-secondary uppercase">
                                Built for Everyone
                            </span>
                        </div>
                        <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
                            Open source,{' '}
                            <span className="italic text-secondary">by design.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                            We believe high-quality mentorship should be accessible to everyone.
                            No gatekeeping, no pricing tiers — just the platform.
                        </p>
                    </div>

                    {/* Bento grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {highlights.map((item, index) => (
                            <div
                                key={index}
                                className="group flex flex-col p-7 rounded-2xl glass border border-white/5 hover:border-secondary/20 transition-all duration-300 cursor-default"
                            >
                                {/* Tag chip */}
                                <span className="self-start text-[10px] font-semibold tracking-widest uppercase text-secondary/70 border border-secondary/20 bg-secondary/5 px-2.5 py-1 rounded-full mb-5">
                                    {item.tag}
                                </span>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/15 transition-colors duration-200">
                                    {item.icon}
                                </div>

                                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* GitHub CTA card */}
                    <div className="glass border border-secondary/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-heading text-xl font-semibold text-foreground mb-1.5">
                                Star us on GitHub
                            </h4>
                            <p className="text-muted-foreground text-sm">
                                Read the code, raise issues, or contribute your own features.
                            </p>
                        </div>
                        <Button
                            className={cn(
                                'shrink-0 rounded-xl px-7 h-11 text-sm font-semibold gap-2',
                                'bg-secondary text-secondary-foreground',
                                'hover:bg-secondary/90 hover:shadow-gold transition-all duration-300',
                                'focus:ring-2 focus:ring-secondary focus:outline-none'
                            )}
                            onClick={() => window.open('https://github.com/daksh-darji-1306/Mentor-Connect', '_blank')}
                        >
                            <Github aria-hidden="true" className="w-4 h-4" />
                            View on GitHub
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;
