import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import WordRotate from './ui/word-rotate';
import GridPattern from './ui/grid-pattern';
import { cn } from '@/lib/utils';

const Hero = ({ onOpenWaitlist }) => {
    const stats = [
        { value: '2,400+', label: 'Active Mentors' },
        { value: '94%', label: 'Goal Achievement' },
        { value: '4.9★', label: 'Avg. Rating' },
    ];

    return (
        <section className="relative overflow-hidden min-h-[92vh] flex items-center py-20 md:py-0">

            {/* Deep background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" aria-hidden="true" />

            {/* Glowing orbs */}
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[140px] pointer-events-none" aria-hidden="true" />

            {/* Grid pattern */}
            <GridPattern
                width={50}
                height={50}
                x={-1}
                y={-1}
                strokeDasharray="1 3"
                className={cn(
                    "[mask-image:radial-gradient(800px_circle_at_40%_50%,white,transparent)]",
                    "opacity-20 stroke-foreground/10"
                )}
            />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
                        <span className="text-xs font-semibold tracking-widest text-secondary uppercase">
                            Now in Open Beta
                        </span>
                    </div>

                    {/* Main headline — Playfair Display for drama */}
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-foreground mb-6">
                        Career mentorship,{' '}
                        <br className="hidden md:block" />
                        <span className="italic text-secondary relative">
                            done right.
                            {/* Underline accent */}
                            <svg className="absolute -bottom-2 left-0 w-full h-2 text-secondary/40" viewBox="0 0 300 8" fill="none" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M0 6 Q150 0 300 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    {/* Rotating subtext */}
                    <div className="text-xl md:text-2xl font-medium text-muted-foreground mb-4 h-8">
                        <WordRotate
                            words={["No cold DMs.", "No generic advice.", "Just real guidance.", "Career clarity, faster."]}
                            duration={2800}
                            className="text-foreground/70"
                        />
                    </div>

                    {/* Supporting copy */}
                    <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
                        Get paired with verified senior professionals who've walked the path you're on.
                        Structured, accountable, and built for real progress.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className={cn(
                                    'rounded-xl px-8 h-12 text-base font-semibold',
                                    'bg-secondary text-secondary-foreground',
                                    'hover:bg-secondary/90 hover:shadow-gold transition-all duration-300',
                                    'focus:ring-2 focus:ring-secondary focus:outline-none'
                                )}
                            >
                                Find Your Mentor
                                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <a href="/#how-it-works">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="rounded-xl px-8 h-12 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200"
                            >
                                See how it works
                            </Button>
                        </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-16 text-sm text-muted-foreground">
                        {[
                            'Verified industry experts only',
                            'No hidden fees, ever',
                            'Cancel sessions anytime',
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-2">
                                <CheckCircle aria-hidden="true" className="h-4 w-4 text-secondary shrink-0" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stat pills */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="glass rounded-2xl px-6 py-4 border border-white/5 text-center min-w-[120px]"
                            >
                                <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
