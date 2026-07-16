import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Check, Globe, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { countries } from '../../utils/countries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import GridPattern from '../ui/grid-pattern';
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
                            {role === 'mentor' ? "Share your expertise,\nshape the future." : "Accelerate your career with expert guidance."}
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Join 5,000+ professionals",
                                "Earn doing what you love",
                                "Verified community"
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
                <div className="flex-[1.5] p-8 md:p-12 overflow-y-auto relative flex flex-col bg-background">
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-muted-foreground">Let's get your basics set up.</p>
                        {errors.general && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        {/* Role Toggle */}
                        <div className="bg-muted/50 p-1.5 rounded-xl flex gap-1">
                            {['mentee', 'mentor'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 capitalize",
                                        role === r
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    I'm a {r}
                                </button>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="John Doe"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.fullName && "border-destructive focus-visible:ring-destructive")}
                                    />
                                </div>
                                {errors.fullName && <p className="text-xs text-destructive font-medium">{errors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="john@example.com"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.password && "border-destructive focus-visible:ring-destructive")}
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-destructive font-medium">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-destructive font-medium">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 relative">
                            <div className="space-y-2 relative group">
                                <Label>Country</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Select Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.country && "border-destructive focus-visible:ring-destructive")}
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
                                <Label>Language</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Primary Language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className={cn("pl-9", errors.language && "border-destructive focus-visible:ring-destructive")}
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

                        <Button onClick={handleSignUp} className="w-full mt-2" size="lg" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Button variant="outline" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                                Google
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground mt-2">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default SignUp;
