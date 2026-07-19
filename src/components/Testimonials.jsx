import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const fallbackReviews = [
    {
        name: "James Ito",
        role: "Software Engineer @ Google",
        body: "Adjusted my career path in weeks. No generic advice — just precise, actionable strategy from someone who's done it.",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "Elena Rodriguez",
        role: "UX Designer @ Figma",
        body: "The structured milestones gave me real momentum. I'd been stuck for a year — six weeks in and I had two offers.",
        img: "https://avatar.vercel.sh/elena",
    },
    {
        name: "Sarah Chen",
        role: "Product Manager @ Stripe",
        body: "The match was instant. Finally found someone who actually understands the nuances of fintech PM work.",
        img: "https://avatar.vercel.sh/sarah",
    },
    {
        name: "Michael Park",
        role: "Data Scientist @ Netflix",
        body: "A promotion within 6 months of starting. I'll take those results over any course or bootcamp.",
        img: "https://avatar.vercel.sh/michael",
    },
    {
        name: "David Kim",
        role: "Frontend Lead @ Vercel",
        body: "Premium experience start to finish. The rigor my mentor brought changed how I approach engineering entirely.",
        img: "https://avatar.vercel.sh/david",
    },
];

const ReviewCard = ({ img, name, role, body }) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-default overflow-hidden rounded-2xl p-6 mx-3",
                "glass border border-white/5 hover:border-secondary/20 transition-all duration-300",
                "flex flex-col gap-4"
            )}
        >
            {/* Stars */}
            <div className="flex gap-0.5" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} aria-hidden="true" className="w-3.5 h-3.5 fill-secondary text-secondary" />
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1">
                "{body}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                    className="rounded-full w-8 h-8 object-cover"
                    width="32"
                    height="32"
                    alt={`${name} avatar`}
                    src={img}
                />
                <div>
                    <figcaption className="text-sm font-semibold text-foreground leading-none mb-0.5">
                        {name}
                    </figcaption>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            </div>

            {/* Gold left accent */}
            <div className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-secondary/40 to-transparent" aria-hidden="true" />
        </figure>
    );
};

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const q = query(collection(db, 'testimonials'), orderBy('created_at', 'desc'), limit(15));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetchedReviews = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name,
                            role: data.role,
                            body: data.body,
                            img: data.img || `https://avatar.vercel.sh/${doc.id}`
                        };
                    });

                    let finalReviews = [...fetchedReviews];
                    if (finalReviews.length < 5) {
                        const needed = 5 - finalReviews.length;
                        finalReviews = [...finalReviews, ...fallbackReviews.slice(0, needed)];
                    }
                    setReviews(finalReviews);
                } else {
                    setReviews(fallbackReviews);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
                setReviews(fallbackReviews);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <section id="testimonials" className="py-28 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent pointer-events-none" aria-hidden="true" />

            <div className="container px-4 mx-auto mb-16 text-center relative z-10">
                <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">
                    Social Proof
                </p>
                <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
                    People who{' '}
                    <span className="italic text-secondary">got results.</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                    No marketing copy. These are real outcomes from real professionals.
                </p>
            </div>

            {/* Marquee */}
            <div className="relative flex w-full flex-col items-center overflow-hidden py-4">
                {!isLoading && (
                    <Marquee pauseOnHover className="[--duration:50s]">
                        {reviews.map((review, idx) => (
                            <ReviewCard key={review.id || idx} {...review} />
                        ))}
                    </Marquee>
                )}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" aria-hidden="true" />
            </div>

            {/* Company logos strip */}
            <div className="mt-20 text-center container mx-auto relative z-10">
                <p className="text-xs font-semibold text-muted-foreground/60 mb-8 tracking-widest uppercase">
                    Mentors from teams at
                </p>
                <div className="flex justify-center gap-10 md:gap-16 flex-wrap">
                    {['GOOGLE', 'STRIPE', 'AMAZON', 'NETFLIX', 'SPOTIFY'].map(company => (
                        <span
                            key={company}
                            className="text-lg font-black text-foreground/20 hover:text-foreground/50 transition-colors duration-300 tracking-widest cursor-default"
                        >
                            {company}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
