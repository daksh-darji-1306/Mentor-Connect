import React from 'react';
import { Star } from 'lucide-react';
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
    {
        name: "James Ito",
        role: "Software Engineer",
        body: "The structured micro-courses made it so easy to learn exactly what I needed without committing to a generic 3-month program. Adjusted my career path in weeks.",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "Elena Rodriguez",
        role: "UX Designer",
        body: "I love the goal tracking feature. My mentor and I set clear milestones and checking them off gave me such a sense of progress. Highly recommended!",
        img: "https://avatar.vercel.sh/elena",
    },
    {
        name: "Sarah Chen",
        role: "Product Manager",
        body: "Finding a mentor who actually understood the fintech space was impossible until I found Mentor Connect. The match was instant.",
        img: "https://avatar.vercel.sh/sarah",
    },
    {
        name: "Michael Park",
        role: "Data Scientist",
        body: "The platform's focus on tangible outcomes rather than just 'chats' changed how I view mentorship. I got a promotion within 6 months.",
        img: "https://avatar.vercel.sh/michael",
    },
    {
        name: "David Kim",
        role: "Frontend Dev",
        body: "Super clean UI and the 1:1 video sessions are flawless. It feels like a premium experience from start to finish.",
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
                // dark styles
                "border-border/50 bg-card hover:bg-card/80 transition-colors shadow-soft",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-foreground">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-muted-foreground">{role}</p>
                </div>
            </div>
            <blockquote className="mt-4 text-sm italic text-muted-foreground/90">"{body}"</blockquote>
            <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-secondary text-secondary" />
                ))}
            </div>
        </figure>
    );
};

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-background/50 relative">
            <div className="container px-4 mx-auto mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                    Success Stories
                </h2>
                <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                    Join thousands of professionals who have accelerated their careers through Mentor Connect.
                </p>
            </div>

            <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {reviews.map((review) => (
                        <ReviewCard key={review.name} {...review} />
                    ))}
                </Marquee>
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
