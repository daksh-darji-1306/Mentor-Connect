import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { setPreference, getPreference } from '../../utils/cookieManager';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../layout/PageTransition';
import { Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import GridPattern from '../ui/grid-pattern';



export default function SignIn() {
    const { loginWithGoogle, loginWithLinkedIn, loginWithEmail } = useAuth();
    const [error, setError] = useState('');
    const [cookieConsent, setCookieConsent] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const consent = getPreference('cookie_consent');
        if (consent === 'true') {
            setCookieConsent(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await loginWithEmail(formData.email, formData.password);
            if (cookieConsent) {
                setPreference('last_login_method', 'email');
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').replace('auth/', ''));
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await loginWithGoogle();
            if (cookieConsent) {
                setPreference('last_login_method', 'google');
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google');
            console.error(err);
        }
    };

    const handleLinkedInLogin = async () => {
        try {
            setError('');
            await loginWithLinkedIn();
            if (cookieConsent) {
                setPreference('last_login_method', 'linkedin');
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with LinkedIn');
            console.error(err);
        }
    };

    const handleCookieToggle = (e) => {
        const isChecked = e.target.checked;
        setCookieConsent(isChecked);
        setPreference('cookie_consent', isChecked ? 'true' : 'false');
    };

    return (
        <PageTransition className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-4 md:p-8">
            <GridPattern
                width={40}
                height={40}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
                    "opacity-30 dark:opacity-20"
                )}
            />

            <div className="relative z-10 w-full max-w-6xl min-h-[700px] flex shadow-2xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50">
                {/* Visual Side (Left) */}
                <div className="hidden lg:flex flex-1 flex-col justify-center p-12 bg-primary/5 border-r border-border relative text-foreground">
                    <Link to="/" className="inline-flex items-center gap-2 mb-auto no-underline text-foreground hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">M</div>
                        <span className="font-bold text-2xl tracking-tight">Mentor Connect</span>
                    </Link>

                    <div className="my-auto space-y-8">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                            Welcome back to your professional community.
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Continue your progress",
                                "Connect with industry leaders",
                                "Access exclusive resources"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full"><Check className="w-5 h-5 text-primary" /></div>
                                    <span className="text-lg opacity-90 font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto opacity-60 text-sm font-medium">
                        © 2024 Mentor Connect. All rights reserved.
                    </div>
                </div>

                {/* Form Side (Right) */}
                <div className="flex-[1.5] p-8 md:p-12 overflow-y-auto relative flex flex-col justify-center bg-background">

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">Sign In</h2>

                        <p className="text-muted-foreground">Enter your credentials to access your account.</p>

                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium capitalize">
                                {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Password</Label>
                                <Link to="/forgot-password" class="text-xs text-primary hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={handleGoogleLogin} className="flex items-center gap-2">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                            Google
                        </Button>
                        <Button variant="outline" onClick={handleLinkedInLogin} className="flex items-center gap-2">
                            <svg className="h-5 w-5 fill-[#0077b5]" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            LinkedIn
                        </Button>
                    </div>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="flex items-start space-x-2 justify-center">
                            <input
                                type="checkbox"
                                id="cookie-consent"
                                checked={cookieConsent}
                                onChange={handleCookieToggle}
                                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <label htmlFor="cookie-consent" className="text-sm text-muted-foreground cursor-pointer select-none">
                                Remember my login preference
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
