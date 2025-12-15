import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Pricing = () => {
    const plans = [
        {
            name: "Community",
            price: "Free",
            description: "Good for browsing and occasional questions.",
            features: [
                "Access to public Q&A",
                "1 Group session / month",
                "Community Discord access",
                "Basic profile"
            ],
            cta: "Join for Free",
            highlight: false
        },
        {
            name: "Mentorship",
            price: "$199",
            period: "/month",
            description: "The standard for serious career growth.",
            features: [
                "2x 1:1 Video Calls / month",
                "Unlimited Chat Support",
                "Resume & Portfolio Review",
                "Custom Growth Plan"
            ],
            cta: "Start 7-Day Trial",
            highlight: true
        },
        {
            name: "Career Shift",
            price: "$499",
            period: "/month",
            description: "Intensive support for switching roles or landing a new job.",
            features: [
                "Weekly 1:1 Video Calls",
                "Mock Interviews",
                "Direct Intro to Hiring Managers",
                "Salary Negotiation Support"
            ],
            cta: "Apply Now",
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-background relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">Transparent Pricing</h2>
                    <p className="text-lg text-muted-foreground">No implementation fees. No long-term contracts. Just growth.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                                relative flex flex-col p-8 rounded-2xl border transition-all duration-300
                                ${plan.highlight
                                    ? 'bg-card/50 backdrop-blur-md border-primary/50 shadow-glow-primary z-10 scale-100 md:scale-105'
                                    : 'bg-card border-border/40 hover:border-border hover:shadow-lg'
                                }
                            `}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-md whitespace-nowrap">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-primary' : 'text-foreground'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.highlight ? "default" : "outline"}
                                className={`w-full py-6 text-lg ${plan.highlight ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40' : ''}`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
