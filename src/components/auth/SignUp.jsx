import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Check, Briefcase, Globe, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { countries } from '../../utils/countries';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import GridPattern from '../ui/grid-pattern';
import { useAuth } from '../../context/AuthContext';
import { X, Plus } from 'lucide-react';
import PageTransition from '../layout/PageTransition';

const COMMON_SKILLS = [
    "Frontend Development", "Backend Development", "Full Stack", "Mobile Development",
    "UI/UX Design", "Product Management", "System Design", "DevOps",
    "Data Science", "Machine Learning", "Artificial Intelligence", "Cybersecurity",
    "Cloud Computing", "Project Management", "Leadership", "Career Guidance",
    "Resume Review", "Interview Prep", "JavaScript", "Python", "Java", "React", "Node.js"
];

const SignUp = () => {
    const navigate = useNavigate();
    const { signupWithEmail, loginWithGoogle } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            localStorage.setItem('signup_intent', 'true');
            localStorage.setItem('signup_role', role);
            await loginWithGoogle();
        } catch (error) {
            setErrors(prev => ({ ...prev, general: "Failed to sign up with Google" }));
        }
    };

    const [step, setStep] = useState(1);
    const [role, setRole] = useState('mentor');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        language: '',
        terms: false,
        headline: '',
        company: '',
        experience: '',
        linkedin: '',
        expertise: []
    });
    const [expertiseInput, setExpertiseInput] = useState('');
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
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

    const validateStep1 = () => {
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

    const handleAddSkill = (skill) => {
        if (skill && !formData.expertise.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                expertise: [...prev.expertise, skill]
            }));
        }
        setExpertiseInput('');
        setShowSkillSuggestions(false);
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev.expertise.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (expertiseInput.trim()) {
                handleAddSkill(expertiseInput.trim());
            }
        }
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleCompleteProfile = async () => {
        setIsLoading(true);
        try {
            // Prepare data for Firestore
            const profileData = {
                fullName: formData.fullName,
                role: role,
                country: formData.country,
                language: formData.language,
                headline: formData.headline,
                company: formData.company,
                experience: formData.experience,
                linkedin: formData.linkedin,
                // Add any other fields you want to save
            };

            await signupWithEmail(formData.email, formData.password, profileData);
            navigate('/onboarding'); // Redirect to onboarding
        } catch (error) {
            console.error(error);
            // Handle specific Firebase errors if needed
            if (error.message.includes('already registered') || error.message.includes('unique constraint')) {
                setErrors(prev => ({ ...prev, email: 'Email is already registered' }));
                setStep(1);
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
                    {/* Header with Steps */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-2 w-full max-w-xs">
                                <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                                <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", step === 2 ? 'bg-primary' : 'bg-muted')}></div>
                            </div>
                            <span className="ml-4 text-primary font-bold whitespace-nowrap text-sm">Step {step} of 2</span>
                        </div>

                        <h2 className="text-3xl font-bold mb-2">
                            {step === 1 ? 'Create Account' : 'Complete Profile'}
                        </h2>
                        <p className="text-muted-foreground">
                            {step === 1 ? "Let's get your basics set up." : "Tell us about your professional journey."}
                        </p>
                        {errors.general && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
                                {errors.general}
                            </div>
                        )}
                    </div>

                    {/* Step 1: Account Info */}
                    {step === 1 && (
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

                            <Button onClick={handleNext} className="w-full mt-2" size="lg">
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
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
                    )}

                    {/* Step 2: Profile Info */}
                    {step === 2 && (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="space-y-2">
                                <Label>Professional Headline</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="e.g. Senior Engineer @ Google"
                                        name="headline"
                                        value={formData.headline}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Company</Label>
                                    <Input
                                        placeholder="Company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Experience (Years)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Years"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Areas of Expertise <span className="text-muted-foreground text-xs font-normal ml-1">(Select or type to add custom)</span></Label>

                                <div className="space-y-3">
                                    <div className="relative group">
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Type a skill/topic (e.g. React, Leadership)..."
                                                value={expertiseInput}
                                                onChange={(e) => {
                                                    setExpertiseInput(e.target.value);
                                                    setShowSkillSuggestions(true);
                                                }}
                                                onKeyDown={handleSkillKeyDown}
                                                onFocus={() => setShowSkillSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                                                className="pl-9"
                                            />
                                        </div>

                                        {/* Suggestions Dropdown */}
                                        {showSkillSuggestions && expertiseInput && (
                                            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-popover border border-border rounded-md shadow-md z-50 animate-in fade-in zoom-in-95 duration-100">
                                                {COMMON_SKILLS
                                                    .filter(s => s.toLowerCase().includes(expertiseInput.toLowerCase()) && !formData.expertise.includes(s))
                                                    .slice(0, 5) // Show top 5 matches
                                                    .map(skill => (
                                                        <div
                                                            key={skill}
                                                            onClick={() => handleAddSkill(skill)}
                                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm text-popover-foreground flex items-center justify-between group/item"
                                                        >
                                                            {skill}
                                                            <Plus className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-primary" />
                                                        </div>
                                                    ))}
                                                {/* Option to add what they typed as custom if it's not a direct match in the visible list */}
                                                {!COMMON_SKILLS.some(s => s.toLowerCase() === expertiseInput.toLowerCase()) && (
                                                    <div
                                                        onClick={() => handleAddSkill(expertiseInput)}
                                                        className="px-4 py-2 hover:bg-muted cursor-pointer text-sm text-primary font-medium border-t border-border flex items-center gap-2"
                                                    >
                                                        <Plus className="w-3 h-3" /> Add "{expertiseInput}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Skills Tags */}
                                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                                        {formData.expertise.map(skill => (
                                            <div key={skill} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 animate-in zoom-in-50 duration-200">
                                                {skill}
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.expertise.length === 0 && (
                                            <span className="text-muted-foreground text-sm italic py-1.5">No skills added yet.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>LinkedIn URL</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="linkedin.com/in/..."
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <Button className="flex-[2]" onClick={handleCompleteProfile} disabled={isLoading}>
                                    {isLoading ? 'Creating Account...' : 'Complete Profile'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default SignUp;
