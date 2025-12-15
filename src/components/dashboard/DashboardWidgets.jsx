import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal, Calendar, ArrowRight, Play, FileText, Video, BookOpen, Clock, Activity, Star } from 'lucide-react';

export const Card = ({ children, className = "" }) => (
    <div className={`bg-card border border-border/50 rounded-xl p-6 shadow-sm ${className}`}>
        {children}
    </div>
);

// --- Stats Card ---
export const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <Card className="flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
        <div className="flex w-full justify-between items-start">
            <div className="p-2 bg-secondary/30 rounded-lg text-foreground">
                <Icon size={20} />
            </div>
            {trend && (
                <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
        </div>
    </Card>
);

// --- Profile Card ---
export const ProfileCard = ({ user }) => (
    <Card className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-secondary-foreground">
            MK
        </div>
        <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {user.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 bg-secondary/50 rounded-md text-xs font-medium text-foreground">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    </Card>
);

// --- Chart Section (Simplified) ---
export const ChartSection = ({ data }) => (
    <Card className="col-span-1 md:col-span-2">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Activity</h3>
        </div>
        <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg bg-secondary/5">
            Activity Chart Placeholder
        </div>
    </Card>
);

// --- Timeline Item ---
const TimelineItem = ({ time, title, type }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mt-2 ${type === 'upcoming' ? 'bg-primary' : 'bg-border'}`}></div>
            <div className="w-px flex-1 bg-border/50 my-1 group-last:hidden"></div>
        </div>
        <div className={`flex-1 p-3 rounded-lg border mb-4 transition-all ${type === 'upcoming' ? 'bg-secondary/20 border-primary/20' : 'bg-transparent border-transparent'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} /> {time}
                    </div>
                </div>
                {type === 'upcoming' && (
                    <button className="text-xs font-semibold text-primary hover:underline">
                        Join
                    </button>
                )}
            </div>
        </div>
    </div>
);

// --- Activity Timeline ---
export const ActivityTimeline = () => (
    <Card className="col-span-1 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Timeline</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground">View All</button>
        </div>

        <div className="space-y-0">
            <TimelineItem time="Today, 3:30 PM" title="Quarterly Goal Review" type="upcoming" />
            <TimelineItem time="Nov 28, 2:00 PM" title="Project Planning" type="past" />
            <TimelineItem time="Nov 25, 10:00 AM" title="Python Basics" type="past" />
        </div>
    </Card>
);

// --- Resources Details ---
export const ResourcesList = () => (
    <Card className="col-span-1">
        <h3 className="text-lg font-bold text-foreground mb-4">Saved Resources</h3>
        <div className="space-y-2">
            {[
                { title: 'Effective Leadership Guide', type: 'Article', icon: FileText },
                { title: 'Machine Learning Basics', type: 'Video', icon: Play },
                { title: 'Mentorship Handbook 2024', type: 'Guide', icon: BookOpen },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
                    <div className="p-2 rounded-md bg-secondary text-primary">
                        <item.icon size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                        <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);
