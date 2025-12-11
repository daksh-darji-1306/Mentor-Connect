import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import WordRotate from './ui/word-rotate';
import GridPattern from './ui/grid-pattern';
import heroImage from '../assets/hero-image.png';
import { cn } from '@/lib/utils';

const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
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
                    <div className="inline-flex items-center gap-2 bg-secondary/50 border border-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Trusted by 5,000+ Professionals
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                        Find Your <br />
                        <span className="text-primary inline-flex">
                            <WordRotate
                                words={["Perfect Mentor", "Ideal Guide", "Career Coach", "Future Growth"]}
                                duration={3000}
                                className="text-primary"
                            />
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                        Connect with industry experts for structured guidance, micro-courses, and career-changing advice. No awkward reach-outs, just growth.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:glow-primary">
                            Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8 text-base hover:bg-secondary/20 hover:text-secondary-foreground border-secondary/50">
                            Become a Mentor
                        </Button>
                    </div>

                    <div className="flex gap-6 pt-6 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" /> Verified Experts
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" /> Risk-Free Trial
                        </div>
                    </div>
                </div>

                <div className="relative group perspective-1000">
                    {/* Abstract background blobs */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.01] border border-border/50 bg-background/50 backdrop-blur-sm">
                        <img
                            src={heroImage}
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
