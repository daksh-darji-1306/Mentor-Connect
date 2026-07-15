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
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    BookOpen
} from 'lucide-react';
import useSidebarStore from '../../store/useSidebarStore';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { isCollapsed, toggle } = useSidebarStore();
    const { logout } = useAuth(); // Assuming generic logout function exists

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

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-screen sticky top-0 bg-dashboard-card border-r border-dashboard-border flex flex-col z-50 shadow-xl"
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-dashboard-border relative">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-dashboard-accent to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <span className="text-xl font-bold text-dashboard-text font-display">MentorFlow</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggle}
                    className="p-2 rounded-full hover:bg-dashboard-cardHover text-dashboard-textMuted hover:text-white transition-colors absolute -right-3 top-7 bg-dashboard-card border border-dashboard-border shadow-lg"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-dashboard-accent/10 text-dashboard-accent shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                : 'text-dashboard-textMuted hover:bg-dashboard-cardHover hover:text-white'
                            }
            `}
                    >
                        <item.icon size={22} className="min-w-[22px]" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Hover Tooltip for Collapsed State */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-dashboard-card border border-dashboard-border rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-dashboard-border">
                <div className={`flex items-center gap-3 p-3 rounded-xl hover:bg-dashboard-cardHover transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg relative uppercase">
                        {(user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User').substring(0, 2)}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dashboard-card rounded-full"></div>
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-dashboard-text truncate">{user?.full_name || user?.fullName || user?.email?.split('@')[0] || 'User'}</h4>
                            <p className="text-xs text-dashboard-textMuted truncate capitalize">{user?.role || 'Member'}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
