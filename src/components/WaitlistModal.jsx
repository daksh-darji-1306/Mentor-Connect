import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const WaitlistModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student', // student, mentor
    // Student specifics
    university: '',
    yearOfStudy: '',
    // Mentor specifics
    currentRole: '',
    experience: '',
    // Common
    skills: [],
    referral: '',
    agreedToPrivacy: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const skillOptions = [
    'Frontend Development', 'Backend Development', 'Full Stack',
    'AI/ML', 'DevOps', 'Mobile Development', 'Data Science', 'Other'
  ];

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', role: 'student',
      university: '', yearOfStudy: '', currentRole: '', experience: '',
      skills: [], referral: '', agreedToPrivacy: false
    });
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToPrivacy) {
      setError('You must agree to the Privacy Policy.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const waitlistRef = collection(db, 'waitlist');
      const q = query(waitlistRef, where('email', '==', formData.email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setError('This email is already on the waitlist!');
        setLoading(false);
        return;
      }

      await addDoc(waitlistRef, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        university: formData.role === 'student' ? formData.university : null,
        year_of_study: formData.role === 'student' ? formData.yearOfStudy : null,
        mentor_role: formData.role === 'mentor' ? formData.currentRole : null,
        experience: formData.role === 'mentor' ? formData.experience : null,
        skills: formData.skills,
        referral_source: formData.referral,
        created_at: new Date().toISOString(),
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error adding to waitlist:', err);
      setError(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
              <h2 className="text-2xl font-bold tracking-tight">Join the Waitlist</h2>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto" data-lenis-prevent>
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold">You're on the list!</h3>
                  <p className="text-muted-foreground">
                    Thanks for joining. We'll verify your details and reach out properly when we launch.
                  </p>
                  <Button onClick={handleClose} className="w-full mt-4">
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                      <input
                        id="name" type="text" required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email *</label>
                      <input
                        id="email" type="email" required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <input
                      id="phone" type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">I am a...</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['student', 'mentor'].map((r) => (
                        <div
                          key={r}
                          onClick={() => handleChange('role', r)}
                          className={cn(
                            "cursor-pointer text-center py-2 px-4 rounded-md border transition-all capitalize",
                            formData.role === r
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary/50 hover:bg-secondary border-transparent text-secondary-foreground"
                          )}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Fields */}
                  {formData.role === 'student' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">University/College</label>
                        <input
                          type="text"
                          value={formData.university}
                          onChange={(e) => handleChange('university', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="IIT Bombay"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Year of Study</label>
                        <select
                          value={formData.yearOfStudy}
                          onChange={(e) => handleChange('yearOfStudy', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Recent Graduate</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Role</label>
                        <input
                          type="text"
                          value={formData.currentRole}
                          onChange={(e) => handleChange('currentRole', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Senior SDE"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Experience</label>
                        <select
                          value={formData.experience}
                          onChange={(e) => handleChange('experience', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select Range</option>
                          <option value="1-2 years">1-2 years</option>
                          <option value="2-5 years">2-5 years</option>
                          <option value="5-10 years">5-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Interests / Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <div
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "cursor-pointer text-xs py-1.5 px-3 rounded-full border transition-all",
                            formData.skills.includes(skill)
                              ? "bg-primary/20 text-primary border-primary"
                              : "bg-background hover:bg-muted border-input"
                          )}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referral */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">How did you hear about us?</label>
                    <select
                      value={formData.referral}
                      onChange={(e) => handleChange('referral', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select One</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Friend">Friend referral</option>
                      <option value="College">College/University</option>
                      <option value="Google">Google Search</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.agreedToPrivacy}
                      onChange={(e) => handleChange('agreedToPrivacy', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
                    </label>
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md animate-in fade-in">
                      {error}
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full h-11 text-lg mt-2">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
