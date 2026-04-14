import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Upload, Briefcase, Code, Database, BookOpen, Clock, Wallet } from 'lucide-react';
import GridPattern from '@/components/ui/grid-pattern';

const Onboarding = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const [formData, setFormData] = useState({
        // Step 1: About You
        university: '',
        yearOfStudy: '',
        currentRole: '', // For mentors
        currentCompany: '', // For mentors
        location: '',
        linkedin: '',
        github: '',

        // Step 2: Skills
        languages: [], // Now objects { name: 'Python', proficiency: 'Beginner' } ? Or just map proficiency separately. 
        // Usage: languages: ['Python'] and languageProficiency: { Python: 'Intermediate' } might be easier.
        // Let's stick to array of strings for simplicity if possible, but PRD asks for proficiency. 
        // Let's use a separate object for proficiency map.
        languageProficiency: {},
        frameworks: [],
        tools: [],
        databases: [], // Added Databases category

        // Step 3: Learning Goals
        primaryGoal: '',
        specificTech: '',
        timeline: '',
        specializations: [],
        mentoringStyle: '',

        // Step 4: Career & Budget
        careerGoal: [],
        weeklyCommitment: 10, // Added default
        budget: 2000,
        yearsOfExperience: 1,
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!user) {
            setErrorMsg("You are not currently logged in. Please sign in via the homepage to save your profile.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    profile_data: { ...formData, onboardingCompleted: true },
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            // Wait, supabase update sometimes returns error=null but updates 0 rows
            // We should ideally check that a row was updated, but an error means an actual crash (e.g. UUID casting)
            if (error) throw error;
            
            // Refresh global user state to recognize onboarding as complete
            await refreshProfile();
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving profile:', error);
            setErrorMsg(error.message || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                        <div className="space-y-4">
                            {user?.role !== 'mentor' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>University / College *</Label>
                                        <Input
                                            placeholder="e.g. IIT Bombay"
                                            value={formData.university}
                                            onChange={e => handleChange('university', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Year of Study *</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={formData.yearOfStudy}
                                            onChange={e => handleChange('yearOfStudy', e.target.value)}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="Graduate">Recent Graduate</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label>Current Title / Role *</Label>
                                        <Input
                                            placeholder="e.g. Senior Software Engineer"
                                            value={formData.currentRole}
                                            onChange={e => handleChange('currentRole', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Current Company</Label>
                                        <Input
                                            placeholder="e.g. Google or Freelance"
                                            value={formData.currentCompany}
                                            onChange={e => handleChange('currentCompany', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <Label>Location *</Label>
                                <Input
                                    placeholder="City, State"
                                    value={formData.location}
                                    onChange={e => handleChange('location', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>LinkedIn URL</Label>
                                    <Input
                                        placeholder="linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={e => handleChange('linkedin', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>GitHub URL</Label>
                                    <Input
                                        placeholder="github.com/..."
                                        value={formData.github}
                                        onChange={e => handleChange('github', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Your Current Skills</h2>
                        <div className="space-y-6 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-3">
                                <Label>Languages</Label>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'JavaScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'PHP'].map(tech => (
                                            <div
                                                key={tech}
                                                onClick={() => {
                                                    const newArr = formData.languages.includes(tech)
                                                        ? formData.languages.filter(t => t !== tech)
                                                        : [...formData.languages, tech];
                                                    handleChange('languages', newArr);

                                                    // Remove proficiency if unchecked
                                                    if (formData.languages.includes(tech)) {
                                                        const newProf = { ...formData.languageProficiency };
                                                        delete newProf[tech];
                                                        handleChange('languageProficiency', newProf);
                                                    }
                                                }}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
                                                    formData.languages.includes(tech)
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                {tech}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Proficiency Sliders for Selected Languages */}
                                    {formData.languages.length > 0 && (
                                        <div className="space-y-3 pt-2 animate-in fade-in">
                                            {formData.languages.map(lang => (
                                                <div key={lang} className="flex items-center gap-4 bg-secondary/20 p-3 rounded-lg">
                                                    <span className="text-sm font-medium w-24">{lang}</span>
                                                    <div className="flex-1 flex gap-2">
                                                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                                            <div
                                                                key={level}
                                                                onClick={() => {
                                                                    handleChange('languageProficiency', {
                                                                        ...formData.languageProficiency,
                                                                        [lang]: level
                                                                    });
                                                                }}
                                                                className={cn(
                                                                    "flex-1 text-xs py-1.5 text-center rounded cursor-pointer transition-colors",
                                                                    formData.languageProficiency[lang] === level
                                                                        ? "bg-primary text-primary-foreground"
                                                                        : "bg-background border hover:bg-muted"
                                                                )}
                                                            >
                                                                {level}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Frameworks & Libraries</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Spring Boot', 'Next.js', 'Express'].map(tech => (
                                        <div
                                            key={tech}
                                            onClick={() => {
                                                const newArr = formData.frameworks.includes(tech)
                                                    ? formData.frameworks.filter(t => t !== tech)
                                                    : [...formData.frameworks, tech];
                                                handleChange('frameworks', newArr);
                                            }}
                                            className={cn(
                                                "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
                                                formData.frameworks.includes(tech)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Databases</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase'].map(tech => (
                                        <div
                                            key={tech}
                                            onClick={() => {
                                                const newArr = formData.databases.includes(tech)
                                                    ? formData.databases.filter(t => t !== tech)
                                                    : [...formData.databases, tech];
                                                handleChange('databases', newArr);
                                            }}
                                            className={cn(
                                                "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
                                                formData.databases.includes(tech)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Tools</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['Git', 'Docker', 'AWS', 'Linux', 'VS Code', 'Kubernetes'].map(tech => (
                                        <div
                                            key={tech}
                                            onClick={() => {
                                                const newArr = formData.tools.includes(tech)
                                                    ? formData.tools.filter(t => t !== tech)
                                                    : [...formData.tools, tech];
                                                handleChange('tools', newArr);
                                            }}
                                            className={cn(
                                                "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
                                                formData.tools.includes(tech)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {tech}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return user?.role === 'mentor' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Mentoring Areas</h2>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label>Specializations (Select multiple)</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'DevOps', 'Mobile', 'System Design', 'Career Growth'].map(goal => (
                                        <div
                                            key={goal}
                                            onClick={() => {
                                                const newArr = formData.specializations?.includes(goal)
                                                    ? formData.specializations.filter(g => g !== goal)
                                                    : [...(formData.specializations || []), goal];
                                                handleChange('specializations', newArr);
                                            }}
                                            className={cn(
                                                "cursor-pointer p-3 rounded-xl border text-center text-sm transition-all",
                                                formData.specializations?.includes(goal)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {goal}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Mentoring Style</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                                    placeholder="e.g. Hands-on coding, code reviews, career guidance..."
                                    value={formData.mentoringStyle || ''}
                                    onChange={e => handleChange('mentoringStyle', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Learning Goals</h2>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label>Primary Interest</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'DevOps', 'Mobile'].map(goal => (
                                        <div
                                            key={goal}
                                            onClick={() => handleChange('primaryGoal', goal)}
                                            className={cn(
                                                "cursor-pointer p-3 rounded-xl border text-center text-sm transition-all",
                                                formData.primaryGoal === goal
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {goal}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Specific Technologies You Want to Master</Label>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                                    placeholder="e.g. React with TypeScript, Node.js with Express, AWS deployment workflows..."
                                    value={formData.specificTech}
                                    onChange={e => handleChange('specificTech', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Target Timeline</Label>
                                <div className="flex gap-2">
                                    {['1-3 months', '3-6 months', '6+ months'].map(time => (
                                        <div
                                            key={time}
                                            onClick={() => handleChange('timeline', time)}
                                            className={cn(
                                                "flex-1 cursor-pointer py-2 px-1 text-center rounded-lg border text-sm",
                                                formData.timeline === time ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"
                                            )}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return user?.role === 'mentor' ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Availability & Experience</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Years of Experience</Label>
                                <span className="text-primary font-bold">{formData.yearsOfExperience || 1} {formData.yearsOfExperience === 1 ? 'year' : 'years'}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={formData.yearsOfExperience || 1}
                                onChange={e => handleChange('yearsOfExperience', parseInt(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 year</span>
                                <span>20+ years</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between">
                                <Label>Mentoring Capacity (Hours/Week)</Label>
                                <span className="text-primary font-bold">{formData.weeklyCommitment} hours/week</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={formData.weeklyCommitment}
                                onChange={e => handleChange('weeklyCommitment', parseInt(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 hour</span>
                                <span>20 hours</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <h2 className="text-2xl font-bold">Career & Budget</h2>

                        <div className="space-y-3">
                            <Label>Career Goals (Select all that apply)</Label>
                            <div className="space-y-2">
                                {['Get Internship', 'Get Full-time Job', 'Switch Domains', 'Freelancing'].map(goal => (
                                    <div
                                        key={goal}
                                        onClick={() => {
                                            const newArr = formData.careerGoal.includes(goal)
                                                ? formData.careerGoal.filter(g => g !== goal)
                                                : [...formData.careerGoal, goal];
                                            handleChange('careerGoal', newArr);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                            formData.careerGoal.includes(goal) ? "border-primary bg-primary/5" : "hover:bg-muted"
                                        )}
                                    >
                                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", formData.careerGoal.includes(goal) ? "bg-primary border-primary" : "border-muted-foreground")}>
                                            {formData.careerGoal.includes(goal) && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-sm">{goal}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Weekly Commitment</Label>
                                    <span className="text-primary font-bold">{formData.weeklyCommitment} hours/week</span>
                                </div>
                                <input
                                    type="range"
                                    min="2"
                                    max="40"
                                    step="1"
                                    value={formData.weeklyCommitment}
                                    onChange={e => handleChange('weeklyCommitment', parseInt(e.target.value))}
                                    className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>2 hours</span>
                                    <span>40 hours</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Monthly Budget</Label>
                                    <span className="text-primary font-bold">₹{formData.budget}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="500"
                                    value={formData.budget}
                                    onChange={e => handleChange('budget', parseInt(e.target.value))}
                                    className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>₹500</span>
                                    <span>₹10,000+</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center bg-secondary/30 p-2 rounded">
                                    💡 Most students invest ₹2,000-3,000/month
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Sidebar Steps */}
            <div className="hidden lg:flex flex-col w-80 border-r border-border p-8 bg-muted/10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-primary">Onboarding</h1>
                    <p className="text-sm text-muted-foreground">Setup your profile</p>
                </div>
                <div className="space-y-6">
                    {(user?.role === 'mentor' ? ['About You', 'Skills', 'Mentoring Areas', 'Availability'] : ['About You', 'Skills', 'Learning Goals', 'Career & Budget']).map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = step === stepNum;
                        const isCompleted = step > stepNum;

                        return (
                            <div key={label} className="flex items-center gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors",
                                    isActive ? "bg-primary text-primary-foreground border-primary" :
                                        isCompleted ? "bg-primary/20 text-primary border-primary/20" : "bg-background text-muted-foreground"
                                )}>
                                    {isCompleted ? "✓" : stepNum}
                                </div>
                                <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 relative overflow-hidden">
                <GridPattern className="absolute inset-0 opacity-[0.03] z-0" />

                <div className="w-full max-w-lg z-10">
                    <div className="mb-8 lg:hidden">
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={cn("h-1 flex-1 rounded-full", step >= i ? "bg-primary" : "bg-secondary")} />
                            ))}
                        </div>
                        <p className="text-center text-sm text-muted-foreground">Step {step} of 4</p>
                    </div>

                    <div className="bg-card border border-border/50 shadow-xl rounded-2xl p-8 min-h-[400px] flex flex-col">
                        <div className="flex-1">
                            {renderStep()}
                        </div>

                        <div className="flex flex-col pt-8 mt-4 border-t border-border/50">
                            {errorMsg && (
                                <div className="text-red-500 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">
                                    {errorMsg}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={step === 1}
                                    className={cn(step === 1 && "invisible")}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>

                                {step < 4 ? (
                                    <Button onClick={handleNext}>
                                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} disabled={loading} className="w-32">
                                        {loading ? 'Saving...' : 'Complete'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
