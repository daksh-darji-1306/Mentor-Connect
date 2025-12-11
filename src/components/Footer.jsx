import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-border/40 bg-background pt-16 pb-8">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                                M
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground">
                                Mentor Connect
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Bridging the gap between ambition and achievement through meaningful mentorship.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Browse Mentors</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Become a Mentor</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Newsletter</h4>
                        <p className="text-muted-foreground text-sm mb-4">Get the latest career tips and updates.</p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="bg-background"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Mentor Connect. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
