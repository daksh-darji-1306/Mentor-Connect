import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Calendar,
    TrendingUp,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import useSidebarStore from '../../store/useSidebarStore';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { isCollapsed, toggle } = useSidebarStore();
    const { user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        user?.role === 'mentor'
            ? { icon: Users, label: 'Mentees', path: '/mentees' }
            : { icon: Users, label: 'Mentors', path: '/mentors' },
        { icon: Calendar, label: 'Sessions', path: '/sessions' },
        { icon: BookOpen, label: 'Resources', path: '/resources' },
        { icon: TrendingUp, label: 'Progress', path: '/progress' },
        { icon: MessageSquare, label: 'Community', path: '/community' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const displayName = user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User';
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen sticky top-0 bg-background border-r border-white/5 flex flex-col z-50 overflow-hidden relative"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -left-32 top-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-noise opacity-[0.8]" />
            </div>

            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 relative shrink-0 z-10">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 min-w-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(201,168,76,0.4)]">
                                <span className="text-xs font-bold text-background">M</span>
                            </div>
                            <span className="font-heading font-bold text-lg tracking-tight text-foreground truncate">
                                Mentor<span className="text-secondary italic">Connect</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapse toggle */}
                <button
                    onClick={toggle}
                    className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors duration-200 absolute right-4 top-1/2 -translate-y-1/2"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar z-10">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-secondary/10 text-secondary'
                                : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active background glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavBg"
                                        className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent rounded-2xl border border-secondary/20"
                                    />
                                )}

                                {/* Active Left Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-secondary shadow-[0_0_10px_#C9A84C]"
                                    />
                                )}

                                <div className="relative z-10 flex items-center gap-4">
                                    <item.icon
                                        size={20}
                                        className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-secondary' : 'group-hover:text-foreground'}`}
                                    />

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -6 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -6 }}
                                                transition={{ duration: 0.15 }}
                                                className="whitespace-nowrap text-sm font-semibold tracking-wide"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-background border border-white/10 rounded-lg text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User profile */}
            <div className="p-4 shrink-0 z-10 border-t border-white/5">
                <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-background font-bold text-sm shadow-md shrink-0 uppercase">
                        {initials}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-background rounded-full shadow-[0_0_8px_#34d399]" />
                    </div>

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                transition={{ duration: 0.15 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{user?.role || 'Member'}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
