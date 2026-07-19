import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { setPreference, getPreference } from '../utils/cookieManager';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = ({ onOpenWaitlist }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const savedTheme = getPreference('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setPreference('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const navLinks = [
        { label: 'Why', href: '/#features' },
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Reviews', href: '/#testimonials' },
        { label: 'Open Source', href: '/#opensource' },
    ];

    return (
        <>
            {/* Floating Pill Navbar */}
            <header className={cn(
                'fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500',
                scrolled ? 'pt-3' : 'pt-5'
            )}>
                <nav className={cn(
                    'relative flex items-center gap-6 px-5 py-3 transition-all duration-500',
                    scrolled
                        ? 'rounded-2xl glass shadow-soft shadow-black/40 border border-white/5 mx-4 w-auto'
                        : 'rounded-none w-full max-w-7xl px-6'
                )}>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 mr-4 shrink-0 group"
                        aria-label="Mentor Connect home"
                    >
                        <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-background font-body">M</span>
                        </div>
                        <span className="font-heading font-semibold text-lg tracking-tight text-foreground hidden sm:block">
                            Mentor<span className="text-secondary">Connect</span>
                        </span>
                    </Link>

                    {/* Thin separator */}
                    <div className="hidden md:block h-4 w-px bg-border/60" aria-hidden="true" />

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1 flex-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="relative px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 link-gold group"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-2 ml-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground focus:ring-2 focus:ring-secondary"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light'
                                ? <Moon aria-hidden="true" className="h-4 w-4" />
                                : <Sun aria-hidden="true" className="h-4 w-4" />
                            }
                        </Button>

                        <Link to="/login">
                            <Button
                                variant="ghost"
                                className="text-sm font-medium h-8 px-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Log In
                            </Button>
                        </Link>

                        <Link to="/signup">
                            <Button
                                className={cn(
                                    'text-sm font-semibold h-8 px-5 rounded-xl',
                                    'bg-secondary text-secondary-foreground',
                                    'hover:bg-secondary/90 transition-all duration-200',
                                    'shadow-gold focus:ring-2 focus:ring-secondary'
                                )}
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden ml-auto p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors duration-200 focus:ring-2 focus:ring-secondary focus:outline-none"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen
                            ? <X aria-hidden="true" size={20} />
                            : <Menu aria-hidden="true" size={20} />
                        }
                    </button>
                </nav>
            </header>

            {/* Spacer so content doesn't hide behind fixed bar */}
            <div className="h-16" aria-hidden="true" />

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-x-4 top-20 z-40 rounded-2xl glass border border-white/5 shadow-soft p-6 md:hidden">
                    <div className="flex flex-col gap-1 mb-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
                        <div className="flex items-center justify-between px-4">
                            <span className="text-sm text-muted-foreground">Toggle theme</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full w-8 h-8 text-muted-foreground"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light'
                                    ? <Moon aria-hidden="true" className="h-4 w-4" />
                                    : <Sun aria-hidden="true" className="h-4 w-4" />
                                }
                            </Button>
                        </div>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-center">Log In</Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full justify-center bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
