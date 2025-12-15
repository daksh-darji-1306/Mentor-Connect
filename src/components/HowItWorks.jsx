import React from 'react';
import { Search, Calendar, Video, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

const steps = [
    {
        icon: <Search className="h-8 w-8 text-primary" />,
        title: "Choose your direction",
        desc: "Tell us what you want to achieve. No long forms. Just your goals."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Match with experts",
        desc: "Get paired with a senior operator in your field. Verified credentials only."
    },
    {
        icon: <Video className="h-8 w-8 text-primary" />,
        title: "Get structured guidance",
        desc: "Weekly syncs, actionable goals, and real feedback. No fluff."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto">
                        Dead simple. No fluff.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-2"
                        >
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border text-foreground font-mono flex items-center justify-center text-sm shadow-sm group-hover:border-primary transition-colors duration-500">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
