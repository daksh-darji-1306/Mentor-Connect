import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for exploring mentorship and getting started.",
            features: [
                "Access to mentor directory",
                "1 Mentor connection",
                "Basic profile",
                "Community support"
            ],
            cta: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "₹6500",
            period: "/month",
            description: "Serious growth for serious professionals who want results.",
            features: [
                "Unlimited mentor connections",
                "Priority messaging",
                "Exclusive webinars",
                "Verified badge",
                "Career roadmap builder"
            ],
            cta: "Go Pro",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Tailored solutions for teams and organizations.",
            features: [
                "Custom mentor matching",
                "Team dashboards",
                "Analytics & reporting",
                "Dedicated success manager",
                "API access"
            ],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-background relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Invest in Your Future</h2>
                    <p className="text-lg text-muted-foreground">Choose the plan that fits your career goals and accelerate your growth with world-class mentorship.</p>
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
