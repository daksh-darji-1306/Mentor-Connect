import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/AuthContext';

const TopNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    const handleLogout = async () => {
        setIsLoggingOut(true);
        setShowProfileMenu(false);
        await logout();
        navigate('/');
    };

    const handleNavigate = (path) => {
        if (isLoggingOut) return;
        setShowProfileMenu(false);
        navigate(path);
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Sessions', path: '/sessions' },
        { label: 'Resources', path: '/resources' },
        user?.role === 'mentor' 
            ? { label: 'Mentees', path: '/mentees' }
            : { label: 'Mentors', path: '/mentors' },
        { label: 'Messages', path: '/messages' },
        ...(user?.role === 'mentee' ? [{ label: 'AI Matchmaker', path: '/ai' }] : []),
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


                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <div className="h-4 w-px bg-border/50 hidden md:block"></div>

                    <div className="relative" ref={profileMenuRef}>
                        <button 
                            onClick={() => !isLoggingOut && setShowProfileMenu(!showProfileMenu)}
                            className={`flex items-center gap-2 pl-2 rounded-full hover:bg-secondary/30 transition-colors p-1 pr-3 border border-transparent hover:border-border/30 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-primary-foreground text-xs font-bold uppercase overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    (user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User').substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <span className="text-sm font-medium hidden md:block">{user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User'}</span>
                        </button>
                        
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-2 border-b border-border/50 mb-1">
                                    <p className="text-sm font-medium truncate">{user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                                </div>
                                <button
                                    onClick={() => handleNavigate('/profile')}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 flex items-center gap-2 transition-colors"
                                >
                                    <User className="w-4 h-4" /> Profile
                                </button>
                                <button
                                    onClick={() => handleNavigate('/settings')}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 flex items-center gap-2 transition-colors"
                                >
                                    <Settings className="w-4 h-4" /> Settings
                                </button>
                                <div className="h-px bg-border/50 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <LogOut className="w-4 h-4" /> {isLoggingOut ? 'Logging out...' : 'Log out'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;
