import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const footerLinks = {
    Platform: [
        { label: 'Browse Mentors', href: '/mentors' },
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Open Source', href: '/#opensource' },
        { label: 'Sign In', href: '/login' },
    ],
    Company: [
        { label: 'About', href: '#' },
        { label: 'Become a Mentor', href: '/signup' },
        { label: 'Contact', href: '#' },
        { label: 'Privacy Policy', href: '#' },
    ],
};

const Footer = () => {
    return (
        <footer className="border-t border-border/30 bg-background pt-16 pb-8 relative overflow-hidden">

            {/* Subtle glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

                    {/* Brand col */}
                    <div className="col-span-1 md:col-span-2 space-y-5">
                        <Link to="/" className="flex items-center gap-2.5 w-fit" aria-label="Mentor Connect home">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center">
                                <span className="text-xs font-bold text-background">M</span>
                            </div>
                            <span className="font-heading font-semibold text-lg tracking-tight text-foreground">
                                Mentor<span className="text-secondary">Connect</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Bridging the gap between ambition and achievement through structured, 
                            expert-led mentorship. Free and open source.
                        </p>
                        <a
                            href="https://github.com/daksh-darji-1306/Mentor-Connect"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors duration-200 font-medium link-gold"
                        >
                            <Github aria-hidden="true" className="w-4 h-4" />
                            View on GitHub
                        </a>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-body text-xs font-semibold tracking-widest uppercase text-muted-foreground/60 mb-5">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        {link.href.startsWith('/') || link.href.startsWith('#') ? (
                                            link.href.startsWith('/') ? (
                                                <Link
                                                    to={link.href}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                                >
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={link.href}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                                >
                                                    {link.label}
                                                </a>
                                            )
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground/50">
                        © {new Date().getFullYear()} Mentor Connect. Open source under MIT License.
                    </p>
                    <p className="text-xs text-muted-foreground/40">
                        Built with ❤️ for the community
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
