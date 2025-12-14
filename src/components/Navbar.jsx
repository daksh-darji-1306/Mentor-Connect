import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { setPreference, getPreference } from '../utils/cookieManager';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = getPreference('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
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

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
                        M
                    </div>
                    <span className="font-bold text-3xl tracking-tight text-foreground">
                        Mentor Connect
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="/#features" className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary">
                        Features
                    </a>
                    <a href="/#how-it-works" className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary">
                        How it Works
                    </a>
                    <a href="/#testimonials" className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary">
                        Stories
                    </a>

                    <div className="flex items-center gap-4 ml-4">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                        <Link to="/login">
                            <Button variant="ghost" className="text-lg font-medium">Log In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="text-lg font-medium shadow-md shadow-primary/20 hover:glow-primary transition-all px-6 py-5">Get Started</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border/40 bg-background p-4 shadow-xl">
                    <div className="flex justify-between items-center px-2 pb-4">
                        <span className="text-sm font-medium text-muted-foreground">Theme</span>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <a
                            href="#features"
                            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            How it Works
                        </a>
                        <a
                            href="#testimonials"
                            className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            Stories
                        </a>
                        <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full justify-center text-lg">Log In</Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>
                                <Button className="w-full justify-center shadow-lg shadow-primary/20 text-lg py-6">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
