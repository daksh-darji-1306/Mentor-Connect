import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Settings, Bell, Palette, Shield, ChevronRight,
    Camera, Save, Moon, Sun, Check, Trash2, AlertTriangle, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { setPreference, getPreference } from '../utils/cookieManager';
import { useNavigate } from 'react-router-dom';

const tabs = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'account',       label: 'Account',       icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance',    label: 'Appearance',    icon: Palette },
];

const fadeUp = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ── Delete Account Confirmation Modal ───────────────────────────
function DeleteAccountModal({ onCancel, onConfirm, isDeleting }) {
    const [confirmText, setConfirmText] = useState('');
    const isValid = confirmText === 'DELETE';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="bg-card border border-destructive/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <h2 className="font-bold text-foreground">Delete Account</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-1">
                        <p className="text-sm font-semibold text-destructive">This action is permanent!</p>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-2 list-disc list-inside">
                            <li>Your profile and all personal data will be deleted</li>
                            <li>All sessions you created will be removed</li>
                            <li>Your messages and requests will be erased</li>
                            <li>You will be immediately signed out</li>
                        </ul>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                            Type <span className="font-bold text-destructive tracking-widest">DELETE</span> to confirm
                        </label>
                        <Input
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here..."
                            className={`transition-colors ${isValid ? 'border-destructive/60 focus-visible:ring-destructive/30' : ''}`}
                            disabled={isDeleting}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        disabled={!isValid || isDeleting}
                        onClick={onConfirm}
                    >
                        {isDeleting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                        ) : (
                            <><Trash2 className="w-4 h-4" /> Delete Account</>
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Main Settings Page ───────────────────────────────────────────
export default function SettingsPage() {
    const { user, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab]       = useState('profile');
    const [isSaving, setIsSaving]         = useState(false);
    const [saved, setSaved]               = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting]     = useState(false);
    const [deleteError, setDeleteError]   = useState('');

    // Profile form state
    const [fullName,  setFullName]  = useState(user?.fullName    || user?.full_name || '');
    const [headline,  setHeadline]  = useState(user?.profile_data?.headline || '');
    const [company,   setCompany]   = useState(user?.profile_data?.company   || '');
    const [bio,       setBio]       = useState(user?.profile_data?.bio       || '');
    const [location,  setLocation]  = useState(user?.profile_data?.location  || '');

    // Notification toggles
    const [notifEmail,   setNotifEmail]   = useState(true);
    const [notifSession, setNotifSession] = useState(true);
    const [notifMessage, setNotifMessage] = useState(true);

    // Appearance
    const [theme, setTheme] = useState(() => getPreference('theme') || 'dark');

    const applyTheme = (t) => {
        setTheme(t);
        setPreference('theme', t);
        document.documentElement.classList.toggle('dark', t === 'dark');
    };

    // ── Save profile ─────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            if (user?.id) {
                await updateDoc(doc(db, 'profiles', user.id), {
                    full_name: fullName,
                    profile_data: {
                        ...(user.profile_data || {}),
                        headline,
                        company,
                        bio,
                        location,
                    },
                });
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    // ── Delete account ───────────────────────────────────────────
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError('');
        try {
            await deleteDoc(doc(db, 'profiles', user.id));
            await deleteAccount();

            // Sign out and redirect
            navigate('/');
        } catch (err) {
            console.error('Delete account error:', err);
            if (err.code === 'auth/requires-recent-login') {
                setDeleteError('For security reasons, you must log out and log back in before deleting your account.');
            } else {
                setDeleteError('A network error occurred. Please check your connection and try again.');
            }
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteAccountModal
                        isDeleting={isDeleting}
                        onCancel={() => { setShowDeleteModal(false); setDeleteError(''); }}
                        onConfirm={handleDeleteAccount}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="max-w-4xl mx-auto space-y-6 pb-12"
            >
                {/* Page Header */}
                <motion.div variants={fadeUp}>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <aside className="w-full md:w-56 shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            active
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {tab.label}
                                        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Panel */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">

                            {/* ── PROFILE TAB ── */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-card border border-border/50 rounded-2xl overflow-hidden"
                                >
                                    {/* Avatar banner */}
                                    <div className="bg-gradient-to-r from-primary/20 via-violet-500/10 to-fuchsia-500/10 h-24 relative">
                                        <div className="absolute -bottom-8 left-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-card overflow-hidden">
                                                    {user?.avatar_url
                                                        ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                                        : (fullName || 'U').substring(0, 2).toUpperCase()
                                                    }
                                                </div>
                                                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                                                    <Camera className="w-3 h-3 text-primary-foreground" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-14 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-foreground">{fullName || 'Your Name'}</p>
                                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                            </div>
                                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium capitalize">
                                                {user?.role || 'mentee'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                                                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Headline</label>
                                                <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior React Developer" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company / School</label>
                                                <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Where do you work or study?" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                                                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={e => setBio(e.target.value)}
                                                rows={3}
                                                placeholder="Tell others a bit about yourself..."
                                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                            />
                                        </div>

                                        <Button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2">
                                            {saved
                                                ? <><Check className="w-4 h-4" /> Saved!</>
                                                : <><Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}</>
                                            }
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── ACCOUNT TAB ── */}
                            {activeTab === 'account' && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-card border border-border/50 rounded-2xl p-6 space-y-6"
                                >
                                    <h2 className="text-base font-semibold text-foreground">Account &amp; Security</h2>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
                                        <Input value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
                                        <p className="text-xs text-muted-foreground mt-1">Email is managed by your login provider.</p>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="border border-destructive/25 rounded-xl p-5 space-y-3 bg-destructive/5">
                                        <div className="flex items-center gap-2 text-destructive">
                                            <AlertTriangle className="w-4 h-4" />
                                            <h3 className="text-sm font-bold">Danger Zone</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Permanently delete your account, profile, sessions, messages, and all associated data.
                                            <strong className="text-foreground"> This action cannot be undone.</strong>
                                        </p>
                                        {deleteError && (
                                            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                                                {deleteError}
                                            </p>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete My Account
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── NOTIFICATIONS TAB ── */}
                            {activeTab === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-card border border-border/50 rounded-2xl p-6 space-y-5"
                                >
                                    <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                                    {[
                                        { label: 'Email Notifications',  desc: 'Receive updates and reminders via email',    value: notifEmail,   set: setNotifEmail },
                                        { label: 'Session Reminders',    desc: 'Get reminded before upcoming sessions',      value: notifSession, set: setNotifSession },
                                        { label: 'New Message Alerts',   desc: 'Notify you when a mentor sends a message',  value: notifMessage, set: setNotifMessage },
                                    ].map(({ label, desc, value, set }) => (
                                        <div key={label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{label}</p>
                                                <p className="text-xs text-muted-foreground">{desc}</p>
                                            </div>
                                            <button
                                                onClick={() => set(v => !v)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary' : 'bg-secondary'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* ── APPEARANCE TAB ── */}
                            {activeTab === 'appearance' && (
                                <motion.div
                                    key="appearance"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-card border border-border/50 rounded-2xl p-6 space-y-5"
                                >
                                    <h2 className="text-base font-semibold text-foreground">Appearance</h2>
                                    <p className="text-sm text-muted-foreground">Choose how Mentor Connect looks for you.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { value: 'dark',  label: 'Dark',  icon: Moon, preview: 'bg-zinc-900 border-zinc-700' },
                                            { value: 'light', label: 'Light', icon: Sun,  preview: 'bg-white border-zinc-200' },
                                        ].map(({ value, label, icon: Icon, preview }) => (
                                            <button
                                                key={value}
                                                onClick={() => applyTheme(value)}
                                                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                                                    theme === value
                                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                        : 'border-border/40 hover:border-border'
                                                }`}
                                            >
                                                <div className={`w-full h-16 rounded-xl border ${preview} flex items-center justify-center gap-1`}>
                                                    <div className={`w-6 h-2 rounded ${value === 'dark' ? 'bg-violet-500' : 'bg-violet-600'} opacity-80`} />
                                                    <div className={`w-10 h-2 rounded ${value === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{label}</span>
                                                </div>
                                                {theme === value && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-primary-foreground" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
