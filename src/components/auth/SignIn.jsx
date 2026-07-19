import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { setPreference, getPreference } from '../../utils/cookieManager';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../layout/PageTransition';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function SignIn() {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const [error, setError] = useState('');
    const [cookieConsent, setCookieConsent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        const consent = getPreference('cookie_consent');
        if (consent === 'true') setCookieConsent(true);

        const params = new URLSearchParams(window.location.search);
        if (params.get('error') === 'not_registered') {
            setError('This email is not registered. Please sign up first.');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            setError('');
            await loginWithEmail(formData.email, formData.password);
            if (cookieConsent) setPreference('last_login_method', 'email');
            navigate('/dashboard');
        } catch (err) {
            if (err.code === 'auth/invalid-credential' || err.message?.includes('auth/invalid-credential')) {
                setError('Invalid credentials. If you signed up with Google, use the button below.');
            } else {
                setError(err.message || 'Sign in failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            setError('');
            localStorage.setItem('signup_intent', 'false');
            const loggedInUser = await loginWithGoogle();
            if (!loggedInUser) return;
            if (cookieConsent) setPreference('last_login_method', 'google');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCookieToggle = (e) => {
        const isChecked = e.target.checked;
        setCookieConsent(isChecked);
        setPreference('cookie_consent', isChecked ? 'true' : 'false');
    };

    return (
        <PageTransition className="min-h-screen w-full flex bg-background relative overflow-hidden">
            {/* Ambient Background Glow for Right Side */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none" aria-hidden="true" />

            {/* ── Left panel: Dark editorial ── */}
            <div className="hidden lg:flex flex-col w-[45%] relative border-r border-white/5 overflow-hidden glass z-10">

                {/* Deep glow orbs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" aria-hidden="true" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-[100px]" aria-hidden="true" />

                {/* Content */}
                <div className="relative z-20 flex flex-col h-full p-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group w-fit" aria-label="Mentor Connect home">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.5)]">
                            <span className="text-sm font-bold text-background">M</span>
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                            Mentor<span className="text-secondary italic">Connect</span>
                        </span>
                    </Link>

                    {/* Main editorial copy */}
                    <div className="my-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-secondary mb-6">
                                Welcome Back
                            </p>
                            <h2 className="font-heading text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-8">
                                Your next career
                                <br />
                                <span className="italic text-secondary">chapter awaits.</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-sm">
                                Your mentors are ready. Your sessions are waiting. Sign back in and keep moving forward.
                            </p>
                        </motion.div>

                        {/* Trust items */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
                            {[
                                'Track your milestone progress',
                                'Connect with your mentor team',
                                'Access your session notes',
                            ].map((text, i) => (
                                <motion.div key={text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                                        <Sparkles aria-hidden="true" className="w-3 h-3 text-secondary" />
                                    </div>
                                    <span className="text-sm text-foreground/80 font-semibold tracking-wide">{text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-muted-foreground/40 font-medium">
                        © {new Date().getFullYear()} Mentor Connect. All rights reserved.
                    </p>
                </div>
            </div>

            {/* ── Right panel: Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative z-10">

                <div className="w-full max-w-md">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Heading */}
                        <div className="mb-10">
                            <h1 className="font-heading text-4xl font-bold text-foreground mb-3 tracking-tight">
                                Sign in
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                Enter your credentials to access your dashboard.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-8 px-5 py-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-semibold" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            <div className="space-y-2 group">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Email Address</Label>
                                <div className="relative">
                                    <Mail aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-secondary hover:text-secondary/80 font-bold transition-colors underline-offset-4 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    'w-full h-14 rounded-2xl text-base font-bold tracking-wide gap-3 mt-4',
                                    'bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(201,168,76,0.3)]',
                                    'hover:bg-secondary/90 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 transition-all duration-300',
                                    'focus:ring-2 focus:ring-secondary focus:outline-none',
                                    'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'
                                )}
                            >
                                {isLoading ? 'Authenticating…' : 'Access Account'}
                                {!isLoading && <ArrowRight aria-hidden="true" className="w-5 h-5" />}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    Or Continue With
                                </span>
                            </div>
                        </div>

                        {/* Google OAuth */}
                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 gap-3 font-semibold text-foreground focus:ring-2 focus:ring-white/20 focus:outline-none"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt=""
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                            Google
                        </Button>

                        {/* Sign up link */}
                        <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-secondary font-bold hover:text-secondary/80 transition-colors underline-offset-4 hover:underline">
                                Create one free
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
