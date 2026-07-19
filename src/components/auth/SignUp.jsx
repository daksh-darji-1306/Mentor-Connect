import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Globe, MapPin, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { countries } from '../../utils/countries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../layout/PageTransition';

const SignUp = () => {
    const navigate = useNavigate();
    const { signupWithEmail, loginWithGoogle } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            localStorage.setItem('signup_intent', 'true');
            localStorage.setItem('signup_role', role);
            const loggedInUser = await loginWithGoogle();
            if (!loggedInUser) return;
            navigate('/onboarding');
        } catch (error) {
            console.error('Signup error:', error);
            setErrors(prev => ({ ...prev, general: error.message || "Failed to sign up with Google" }));
        }
    };

    const [role, setRole] = useState('mentor');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        language: '',
        terms: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.language.trim()) newErrors.language = "Language is required";
        if (!formData.terms) newErrors.terms = "You must accept the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Prepare basic data for Firestore
            const profileData = {
                fullName: formData.fullName,
                role: role,
                country: formData.country,
                language: formData.language,
            };

            await signupWithEmail(formData.email, formData.password, profileData);
            navigate('/onboarding'); // Redirect to onboarding
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use' || error.message.includes('already-in-use') || error.message.includes('already registered') || error.message.includes('unique constraint')) {
                setErrors(prev => ({ ...prev, email: 'Email is already registered. Please log in.' }));
            } else {
                setErrors(prev => ({ ...prev, general: error.message }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition className="min-h-screen w-full flex bg-background">

            {/* ── Left panel: Dark editorial ── */}
            <div className="hidden lg:flex flex-col w-[45%] relative bg-card border-r border-border overflow-hidden">

                {/* Glow orbs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/15 rounded-full blur-[100px]" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" aria-hidden="true" />

                <div className="relative z-10 flex flex-col h-full p-12">
                    <Link to="/" className="flex items-center gap-2.5 group w-fit" aria-label="Mentor Connect home">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-background">M</span>
                        </div>
                        <span className="font-heading font-semibold text-xl tracking-tight text-foreground">
                            Mentor<span className="text-secondary">Connect</span>
                        </span>
                    </Link>

                    <div className="my-auto">
                        <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-6">Join the Community</p>
                        <h2 className="font-heading text-4xl xl:text-5xl font-bold text-foreground leading-[1.1] mb-6">
                            {role === 'mentor'
                                ? <>Shape careers,<br /><span className="italic text-secondary">earn respect.</span></>
                                : <>Your next level<br /><span className="italic text-secondary">starts here.</span></>}
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-xs">
                            {role === 'mentor'
                                ? 'Share what took you years to learn. Help someone skip the hard parts.'
                                : 'Get matched with a verified expert who has exactly the experience you need.'}
                        </p>
                        <div className="space-y-3">
                            {['Verified professionals only', 'Structured, goal-oriented sessions', 'Free and open source'].map((text) => (
                                <div key={text} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0">
                                        <Sparkles aria-hidden="true" className="w-2.5 h-2.5 text-secondary" />
                                    </div>
                                    <span className="text-sm text-foreground/70 font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground/50">© {new Date().getFullYear()} Mentor Connect. All rights reserved.</p>
                </div>

                <div className="absolute right-0 top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent" aria-hidden="true" />
            </div>

                {/* ── Right panel: Form ── */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto">

                    {/* Mobile logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8 self-start" aria-label="Mentor Connect home">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-background">M</span>
                        </div>
                        <span className="font-heading font-semibold text-lg text-foreground">
                            Mentor<span className="text-secondary">Connect</span>
                        </span>
                    </Link>

                    <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create Account</h1>
                        <p className="text-muted-foreground text-sm">Let's get your basics set up.</p>
                        {errors.general && (
                            <div className="mt-4 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium" role="alert">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Role Toggle */}
                        <div className="bg-muted/40 p-1 rounded-xl flex gap-1">
                            {['mentee', 'mentor'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 capitalize focus:outline-none focus:ring-2 focus:ring-secondary",
                                        role === r
                                            ? "bg-secondary text-secondary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    I'm a {r}
                                </button>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Full Name</Label>
                                <div className="relative">
                                    <User aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.fullName && "border-destructive")}
                                    />
                                </div>
                                {errors.fullName && <p className="text-xs text-destructive font-medium">{errors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Email</Label>
                                <div className="relative">
                                    <Mail aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="email"
                                        placeholder="you@example.com"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.email && "border-destructive")}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Password</Label>
                                <div className="relative">
                                    <Lock aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.password && "border-destructive")}
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-destructive font-medium">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Confirm Password</Label>
                                <div className="relative">
                                    <Lock aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.confirmPassword && "border-destructive")}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-destructive font-medium">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 relative">
                            <div className="space-y-2 relative group">
                                <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Country</Label>
                                <div className="relative">
                                    <MapPin aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="country"
                                        placeholder="Your country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.country && "border-destructive")}
                                        autoComplete="off"
                                    />
                                </div>
                                {errors.country && <p className="text-xs text-destructive font-medium">{errors.country}</p>}

                                {/* Custom Dropdown */}
                                {formData.country && !countries.includes(formData.country) && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-popover border border-border rounded-md shadow-md z-50">
                                        {countries
                                            .filter(c => c.toLowerCase().includes(formData.country.toLowerCase()))
                                            .map(country => (
                                                <div
                                                    key={country}
                                                    onClick={() => handleChange({ target: { name: 'country', value: country } })}
                                                    className="px-4 py-2 hover:bg-muted cursor-pointer text-sm text-popover-foreground transition-colors"
                                                >
                                                    {country}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language" className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-secondary transition-colors">Language</Label>
                                <div className="relative">
                                    <Globe aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                    <Input
                                        id="language"
                                        placeholder="Primary language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className={cn("pl-12 h-14 rounded-2xl border-white/10 bg-white/[0.02] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all hover:border-white/20 hover:bg-white/[0.04] text-foreground text-base shadow-inner", errors.language && "border-destructive")}
                                    />
                                </div>
                                {errors.language && <p className="text-xs text-destructive font-medium">{errors.language}</p>}
                            </div>
                        </div>

                        <div className="flex items-start space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="terms"
                                className={cn("text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground", errors.terms && "text-destructive")}
                            >
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            onClick={handleSignUp}
                            className={cn(
                                'w-full h-14 rounded-2xl text-base font-bold tracking-wide gap-3 mt-4',
                                'bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(201,168,76,0.3)]',
                                'hover:bg-secondary/90 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 transition-all duration-300',
                                'focus:ring-2 focus:ring-secondary focus:outline-none',
                                'disabled:opacity-60 disabled:cursor-not-allowed'
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account…' : 'Create Account'}
                            {!isLoading && <ArrowRight aria-hidden="true" className="w-5 h-5" />}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                            <div className="relative flex justify-center"><span className="bg-background px-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">or continue with</span></div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 gap-3 font-semibold text-foreground focus:ring-2 focus:ring-white/20 focus:outline-none"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" aria-hidden="true" className="h-5 w-5" />
                            Continue with Google
                        </Button>

                        <p className="text-center text-sm font-medium text-muted-foreground mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-secondary font-bold hover:text-secondary/80 transition-colors underline-offset-4 hover:underline">Sign in</Link>
                        </p>
                    </div>
                    </div>
                </div>
        </PageTransition>
    );
};

export default SignUp;
