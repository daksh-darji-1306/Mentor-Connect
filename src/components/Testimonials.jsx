import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const fallbackReviews = [
    {
        name: "James Ito",
        role: "Software Engineer",
        body: "Adjusted my career path in weeks. No generic advice, just strategy.",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "Elena Rodriguez",
        role: "UX Designer",
        body: "Checking off milestones gave me real momentum. Highly recommended.",
        img: "https://avatar.vercel.sh/elena",
    },
    {
        name: "Sarah Chen",
        role: "Product Manager",
        body: "The match was instant. Finally found someone who actually understands fintech.",
        img: "https://avatar.vercel.sh/sarah",
    },
    {
        name: "Michael Park",
        role: "Data Scientist",
        body: "A promotion within 6 months. Tangible outcomes only.",
        img: "https://avatar.vercel.sh/michael",
    },
    {
        name: "David Kim",
        role: "Frontend Dev",
        body: "Premium experience from start to finish. Worth every cent.",
        img: "https://avatar.vercel.sh/david",
    },
];

const ReviewCard = ({
    img,
    name,
    role,
    body,
}) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6 mx-4",
                "border-border/30 bg-card/50 hover:bg-card/80 transition-colors",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img className="rounded-full opacity-80" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-foreground">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-muted-foreground">{role}</p>
                </div>
            </div>
            <blockquote className="mt-4 text-sm text-foreground/80 leading-relaxed">"{body}"</blockquote>
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
                    
                    // The Marquee component repeats its children to create an infinite scroll effect.
                    // If we only have 1 or 2 real reviews, the user will see the exact same review 
                    // repeated 4-5 times in a row, which looks like a bug.
                    // To prevent this, if we have fewer than 5 real reviews, we will pad the array 
                    // with some of the fallback reviews to keep the marquee diverse.
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
        <section id="testimonials" className="py-24 bg-background relative border-y border-border/40">
            <div className="container px-4 mx-auto mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
                    Real Feedback
                </h2>
                <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                    No marketing noise. Just results.
                </p>
            </div>

            <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
                {!isLoading && (
                    <Marquee pauseOnHover className="[--duration:40s]">
                        {reviews.map((review, idx) => (
                            <ReviewCard key={review.id || idx} {...review} />
                        ))}
                    </Marquee>
                )}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
            </div>

            {/* Trust Badges */}
            <div className="mt-20 text-center container mx-auto">
                <p className="font-semibold text-muted-foreground mb-8 tracking-widest text-xs uppercase">Mentors from top companies</p>
                <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Simple typographic logos for placeholders */}
                    <span className="text-2xl font-black text-foreground">GOOGLE</span>
                    <span className="text-2xl font-black text-foreground">SPOTIFY</span>
                    <span className="text-2xl font-black text-foreground">AMAZON</span>
                    <span className="text-2xl font-black text-foreground">NETFLIX</span>
                    <span className="text-2xl font-black text-foreground">STRIPE</span>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
