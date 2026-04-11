import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';

const TopNavigation = () => {
    const location = useLocation();
    const { user, toggleRole } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Sessions', path: '/sessions' },
        { label: 'Mentors', path: '/mentors' },
        { label: 'Messages', path: '/messages' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: Logo & Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">M</div>
                        <span className="font-bold text-lg hidden md:block">Mentor Connect</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    px-4 py-2 text-sm font-medium rounded-full transition-all
                                    ${location.pathname === item.path
                                        ? 'bg-secondary/50 text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                                    }
                                `}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-muted/50 border border-transparent focus:border-border rounded-full pl-9 pr-4 py-1.5 text-sm w-48 transition-all focus:w-64 focus:bg-background outline-none"
                        />
                    </div>

                    <Button variant="outline" size="sm" onClick={toggleRole} className="hidden sm:flex h-8 bg-secondary/50 text-xs font-semibold">
                        View as {user?.role === 'mentor' ? 'Mentee' : 'Mentor'}
                    </Button>

                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <div className="h-4 w-px bg-border/50 hidden md:block"></div>

                    <button className="flex items-center gap-2 pl-2 rounded-full hover:bg-secondary/30 transition-colors p-1 pr-3 border border-transparent hover:border-border/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-primary-foreground text-xs font-bold uppercase overflow-hidden">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.fullName ? user.fullName.substring(0, 2) : 'MK'
                            )}
                        </div>
                        <span className="text-sm font-medium hidden md:block">{user?.fullName || 'User'}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;
