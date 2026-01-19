import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import WordRotate from './ui/word-rotate';
import GridPattern from './ui/grid-pattern';
import heroImage from '../assets/hero-image.png';
import { cn } from '@/lib/utils';

const Hero = ({ onOpenWaitlist }) => {
    return (
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32">
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                    "opacity-40"
                )}
            />

            <div className="container relative z-10 mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-start text-left space-y-6">
                    <div className="inline-flex items-center gap-2 bg-secondary/30 border border-secondary/50 text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Trusted by 5,000+ Professionals
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground max-w-4xl">
                        Structured Career Mentorship <br className="hidden md:block" />
                        From Verified Industry Experts
                    </h1>

                    <div className="text-2xl md:text-3xl font-semibold text-muted-foreground">
                        <WordRotate
                            words={["No cold DMs", "No generic advice", "Just real guidance", "Career clarity, faster"]}
                            duration={2500}
                            className="text-primary"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button onClick={onOpenWaitlist} size="lg" className="rounded-full px-8 text-base shadow-sm hover:shadow-md transition-all">
                            Join Waitlist
                        </Button>
                        <a href="/#how-it-works">
                            <Button variant="ghost" size="lg" className="rounded-full px-8 text-base hover:bg-secondary/30">
                                How it works
                            </Button>
                        </a>
                    </div>

                    <div className="flex gap-8 pt-6 text-sm text-muted-foreground/80 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" /> Verified Experts
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" /> No Hidden Fees
                        </div>
                    </div>
                </div>

                <div className="relative group perspective-1000">
                    {/* Abstract background blobs */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.01] border border-border/50 bg-background/50 backdrop-blur-sm">
                        <img
                            src="/hero-image.png"
                            alt="Mentor and Mentee"
                            className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
