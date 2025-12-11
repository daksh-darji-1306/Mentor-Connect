import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import GridPattern from './ui/grid-pattern';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form valid", formData);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-4">
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                    "opacity-40"
                )}
            />

            <div className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 no-underline hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">M</div>
                        <span className="font-bold text-xl tracking-tight text-foreground">Mentor Connect</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                    <p className="text-muted-foreground text-sm">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={cn("pl-9 pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="font-medium text-primary hover:underline underline-offset-4">Forgot Password?</a>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full gap-2 font-normal">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                        Google
                    </Button>
                    <Button variant="outline" className="w-full gap-2 font-normal">
                        <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" className="w-4 h-4" />
                        LinkedIn
                    </Button>
                </div>

                <div className="text-center mt-6 text-sm text-muted-foreground">
                    Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                </div>

                <div className="text-center mt-6 text-xs text-muted-foreground/60">
                    By continuing, you agree to Mentor Connect's{' '}
                    <Link to="/terms" className="hover:text-foreground underline underline-offset-2 transition-colors">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="hover:text-foreground underline underline-offset-2 transition-colors">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
};

export default SignIn;
