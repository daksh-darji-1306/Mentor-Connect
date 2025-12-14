import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal, Calendar, ArrowRight, Play, FileText, Video, BookOpen, Clock, Activity, Star } from 'lucide-react';

// --- Reusable Glass Card ---
export const GlassCard = ({ children, className = "" }) => (
    <div className={`bg-dashboard-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl ${className}`}>
        {children}
    </div>
);

// --- Stats Card ---
export const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <GlassCard className="relative overflow-hidden group hover:border-dashboard-accent/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-dashboard-card rounded-xl border border-white/5 text-dashboard-accent group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-bold py-1 px-2 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-bold text-white mb-1 font-display tracking-tight">{value}</h3>
            <p className="text-sm text-dashboard-textMuted">{title}</p>
        </div>
        {/* Decorative Glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-dashboard-accent/5 rounded-full blur-3xl group-hover:bg-dashboard-accent/10 transition-colors" />
    </GlassCard>
);

// --- Profile Card ---
export const ProfileCard = ({ user }) => (
    <GlassCard className="col-span-1 md:col-span-2 relative">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start z-10 relative">
            <div className="relative">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-dashboard-accent to-purple-500">
                    <div className="w-full h-full rounded-full bg-dashboard-card flex items-center justify-center overflow-hidden">
                        <span className="text-3xl font-bold text-white">MK</span>
                        {/* Imaginary Image: <img src={user.avatar} alt={user.name} /> */}
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-dashboard-card p-1 rounded-full">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-dashboard-card animate-pulse"></div>
                </div>
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-display">{user.name}</h2>
                        <p className="text-dashboard-textMuted">{user.role}</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-sm text-dashboard-textMuted hover:text-white transition-colors">
                        Edit Profile <SettingsIcon size={16} />
                    </button>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    {user.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-dashboard-card border border-white/5 rounded-full text-xs font-medium text-dashboard-accent">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-6 text-sm text-dashboard-textMuted">
                    <span className="flex items-center gap-2"><Users size={16} className="text-dashboard-accent" /> 4+ years mentoring</span>
                    <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /> 4.9 Rating</span>
                </div>
            </div>
        </div>

        {/* Background Art */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none opacity-20">
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 border border-dashboard-accent/20 rounded-full"></div>
            <div className="absolute top-[-20px] right-[20px] w-20 h-20 border border-purple-500/20 rounded-full"></div>
        </div>
    </GlassCard>
);

const SettingsIcon = ({ size }) => <div className="w-4 h-4" /> // Placeholder

// --- Chart Section ---
export const ChartSection = ({ data }) => (
    <GlassCard className="col-span-1 md:col-span-2 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Mentorship Activity</h3>
            <select className="bg-dashboard-card border border-white/10 rounded-lg text-xs px-3 py-1.5 text-dashboard-textMuted outline-none focus:border-dashboard-accent">
                <option>Last 30 Days</option>
                <option>This Year</option>
            </select>
        </div>

        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#818cf8' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorActivity)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </GlassCard>
);

// --- Timeline Item ---
const TimelineItem = ({ time, title, type }) => (
    <div className="flex gap-4 group cursor-pointer">
        <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full mt-1.5 border-2 ${type === 'upcoming' ? 'bg-dashboard-text border-dashboard-accent shadow-[0_0_10px_#6366f1]' : 'bg-transparent border-dashboard-textMuted'}`}></div>
            <div className="w-0.5 flex-1 bg-white/5 my-1 group-last:hidden"></div>
        </div>
        <div className={`flex-1 p-4 rounded-xl border border-white/5 mb-4 transition-all duration-300 ${type === 'upcoming' ? 'bg-gradient-to-r from-dashboard-accent/10 to-transparent border-dashboard-accent/30' : 'bg-dashboard-card hover:bg-white/5'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block ${type === 'upcoming' ? 'bg-dashboard-accent text-white' : 'text-dashboard-textMuted bg-white/5'}`}>
                        {type === 'upcoming' ? 'Next Up' : 'Completed'}
                    </span>
                    <h4 className="font-bold text-white mb-1 group-hover:text-dashboard-accent transition-colors">{title}</h4>
                    <div className="flex items-center gap-2 text-xs text-dashboard-textMuted">
                        <Clock size={12} /> {time}
                    </div>
                </div>
                {type === 'upcoming' && (
                    <button className="p-2 bg-dashboard-accent rounded-lg text-white hover:bg-dashboard-accentHover transition-colors shadow-lg shadow-indigo-500/20">
                        <Video size={18} />
                    </button>
                )}
            </div>
        </div>
    </div>
);

// --- Activity Timeline ---
export const ActivityTimeline = () => (
    <GlassCard className="col-span-1 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Session Timeline</h3>
            <button className="text-xs text-dashboard-textMuted hover:text-white transition-colors">View All</button>
        </div>

        <div className="space-y-0">
            <TimelineItem time="Today, 3:30 PM" title="Quarterly Goal Review & Feedback" type="upcoming" />
            <TimelineItem time="Nov 28, 2:00 PM" title="Project Planning & Strategy" type="past" />
            <TimelineItem time="Nov 25, 10:00 AM" title="Python Advanced Concepts" type="past" />
        </div>
    </GlassCard>
);

// --- Resources Details ---
export const ResourcesList = () => (
    <GlassCard className="col-span-1">
        <h3 className="text-lg font-bold text-white mb-4">Recommended Resources</h3>
        <div className="space-y-3">
            {[
                { title: 'Effective Leadership Guide', type: 'Article', icon: FileText, color: 'text-blue-400' },
                { title: 'Machine Learning Basics', type: 'Video', icon: Play, color: 'text-pink-400' },
                { title: 'Mentorship Handbook 2024', type: 'Guide', icon: BookOpen, color: 'text-yellow-400' },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-dashboard-card/50 hover:bg-white/5 transition-colors border border-white/5 cursor-pointer group">
                    <div className={`p-2 rounded-lg bg-white/5 ${item.color} group-hover:bg-white/10 transition-colors`}>
                        <item.icon size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-dashboard-accent transition-colors">{item.title}</h4>
                        <span className="text-xs text-dashboard-textMuted">{item.type}</span>
                    </div>
                </div>
            ))}
        </div>
    </GlassCard>
);
