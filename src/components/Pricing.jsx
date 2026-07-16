import React from 'react';
import { Github, Heart, Shield, Code, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Pricing = () => {
    const highlights = [
        {
            icon: <Code className="w-6 h-6 text-primary" />,
            title: "100% Free & Open Source",
            description: "No hidden fees, subscriptions, or premium paywalls. Access all features of the platform from day one."
        },
        {
            icon: <Shield className="w-6 h-6 text-primary" />,
            title: "Self-Hostable",
            description: "Easily fork the repository, configure your own Firebase instances, and deploy to Vercel in minutes."
        },
        {
            icon: <Heart className="w-6 h-6 text-primary" />,
            title: "Community Driven",
            description: "Built for developers and students. Help us improve by contributing code or suggesting new features on GitHub."
        }
    ];

    return (
        <section id="opensource" className="py-24 bg-background relative overflow-hidden">
            {/* Background Gradient Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto bg-card/40 border border-border/50 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative">
                    
                    {/* Glowing highlight */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/20 border border-primary/30 text-primary px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Built for Everyone
                    </div>

                    <div className="text-center mb-12 mt-4">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                            We are Open Source
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Mentor Connect is built on transparency and collaboration. We believe high-quality career mentorship should be accessible to all.
                        </p>
                    </div>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {highlights.map((item, index) => (
                            <div key={index} className="flex flex-col p-6 rounded-2xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                                <div className="p-3 bg-secondary/50 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* GitHub Call to Action */}
                    <div className="text-center border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h4 className="font-bold text-foreground text-lg">Interested in the code?</h4>
                            <p className="text-muted-foreground text-sm mt-0.5">Check out the project repository, read docs, or raise an issue.</p>
                        </div>
                        <Button 
                            className="w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 gap-2 flex items-center justify-center"
                            onClick={() => window.open('https://github.com', '_blank')}
                        >
                            <Github className="w-5 h-5" /> View on GitHub
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Pricing;
