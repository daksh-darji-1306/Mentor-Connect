import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { motion, AnimatePresence } from 'framer-motion';

const mentorColor = 'from-blue-500 to-blue-700';
const menteeColor = 'from-purple-500 to-pink-600';
const mentorShadow = 'shadow-[0_4px_32px_0_rgba(59,130,246,0.15)]';
const menteeShadow = 'shadow-[0_4px_32px_0_rgba(168,85,247,0.15)]';

const steps = [
  { label: 'Essentials' },
  { label: 'Profile' },
  { label: 'Intentions' },
];

function RoleToggle({ role, setRole }) {
  return (
    <div className="relative flex gap-0.5 mb-10 w-96 h-14 bg-slate-100 rounded-full p-1 shadow-lg border-2 border-blue-200">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 left-1 h-12 w-1/2 rounded-full z-0"
        style={{
          left: role === 'mentor' ? 4 : '50%',
          width: 'calc(50% - 4px)',
          background: role === 'mentor'
            ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
            : 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
          boxShadow: '0 2px 16px 0 rgba(59,130,246,0.10)',
        }}
      />
      <button
        type="button"
        onClick={() => setRole('mentor')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-l-full font-semibold text-xl transition-colors focus:outline-none ${role === 'mentor' ? 'text-white' : 'text-slate-700 hover:bg-slate-200'}`}
        aria-pressed={role === 'mentor'}
      >
        <span className="text-3xl">🧑‍🏫</span> Mentor
      </button>
      <button
        type="button"
        onClick={() => setRole('mentee')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-r-full font-semibold text-xl transition-colors focus:outline-none ${role === 'mentee' ? 'text-white' : 'text-slate-700 hover:bg-slate-200'}`}
        aria-pressed={role === 'mentee'}
      >
        <span className="text-3xl">🧑‍🎓</span> Mentee
      </button>
    </div>
  );
}

function StepProgress({ step }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2 px-1">
        {steps.map((s, i) => (
          <span key={s.label} className={`text-xs font-semibold ${step === i + 1 ? 'text-blue-700' : 'text-slate-400'}`}>{s.label}</span>
        ))}
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full relative overflow-hidden">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
          initial={false}
          animate={{ width: `${(step - 1) / (steps.length - 1) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ background: step === 1 ? 'linear-gradient(90deg,#3b82f6,#2563eb)' : step === 2 ? 'linear-gradient(90deg,#a855f7,#ec4899)' : 'linear-gradient(90deg,#10b981,#3b82f6)' }}
        />
      </div>
    </div>
  );
}

function FloatingField({ name, label, type = 'text', value, onChange, required, as = 'input', accept, error }) {
  const [focused, setFocused] = useState(false);
  const isFilled = value && value !== '';
  return (
    <Form.Field name={name} className="relative mb-7">
      <Form.Control asChild>
        {as === 'textarea' ? (
          <textarea
            className={`peer w-full border ${error ? 'border-red-500' : 'border-slate-300'} bg-white/70 rounded px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all min-h-[80px] shadow-sm`}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            className={`peer w-full border ${error ? 'border-red-500' : 'border-slate-300'} bg-white/70 rounded px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm`}
            name={name}
            type={type}
            required={required}
            value={type === 'file' ? undefined : value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accept={accept}
          />
        )}
      </Form.Control>
      <Form.Label
        className={`absolute left-3 top-2 text-slate-500 text-sm font-medium pointer-events-none transition-all duration-200
          ${focused || isFilled ? '-translate-y-2 scale-90 text-blue-600 bg-white px-1' : 'translate-y-0 scale-100'}
          ${error ? 'text-red-500' : ''}`}
      >
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </Form.Label>
      {error && <span className="absolute right-3 top-2 text-xs text-red-500 animate-shake">Required</span>}
    </Form.Field>
  );
}

function FormSteps({ step, role, formData, handleInputChange, handleFileChange, errors }) {
  return (
    <>
      {step === 1 && (
        <>
          <FloatingField name="name" label="Full Name" value={formData.name || ''} onChange={handleInputChange} required error={errors.name} />
          <FloatingField name="email" label="Email Address" value={formData.email || ''} onChange={handleInputChange} required error={errors.email} type="email" />
          <FloatingField name="password" label="Password" value={formData.password || ''} onChange={handleInputChange} required error={errors.password} type="password" />
          <FloatingField name="profilePic" label="Profile Picture (optional)" value={formData.profilePic || ''} onChange={handleFileChange} type="file" accept="image/*" />
        </>
      )}
      <AnimatePresence mode="wait">
        {step === 2 && (
          <motion.div
            key={role + '-profile'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {role === 'mentor' ? (
              <>
                <FloatingField name="jobTitle" label="Job Title" value={formData.jobTitle || ''} onChange={handleInputChange} required error={errors.jobTitle} />
                <FloatingField name="company" label="Company" value={formData.company || ''} onChange={handleInputChange} required error={errors.company} />
                <FloatingField name="industry" label="Industry" value={formData.industry || ''} onChange={handleInputChange} required error={errors.industry} />
                <FloatingField name="yearsExperience" label="Years of Experience" value={formData.yearsExperience || ''} onChange={handleInputChange} required error={errors.yearsExperience} type="number" />
                <FloatingField name="linkedin" label="LinkedIn URL (optional)" value={formData.linkedin || ''} onChange={handleInputChange} type="url" />
              </>
            ) : (
              <>
                <FloatingField name="currentRole" label="Current Role" value={formData.currentRole || ''} onChange={handleInputChange} required error={errors.currentRole} />
                <FloatingField name="industryInterest" label="Industry of Interest" value={formData.industryInterest || ''} onChange={handleInputChange} required error={errors.industryInterest} />
                <FloatingField name="careerGoals" label="Career Goals" value={formData.careerGoals || ''} onChange={handleInputChange} required error={errors.careerGoals} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {step === 3 && (
          <motion.div
            key={role + '-intentions'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {role === 'mentor' ? (
              <>
                <FloatingField name="expertise" label="Areas of Expertise" value={formData.expertise || ''} onChange={handleInputChange} required error={errors.expertise} />
                <FloatingField name="keySkills" label="Key Skills" value={formData.keySkills || ''} onChange={handleInputChange} required error={errors.keySkills} />
                <FloatingField name="howHelp" label="How I Can Help" value={formData.howHelp || ''} onChange={handleInputChange} required error={errors.howHelp} as="textarea" />
                <FloatingField name="availability" label="Availability" value={formData.availability || ''} onChange={handleInputChange} required error={errors.availability} />
              </>
            ) : (
              <>
                <FloatingField name="skillsToDevelop" label="Skills I Want to Develop" value={formData.skillsToDevelop || ''} onChange={handleInputChange} required error={errors.skillsToDevelop} />
                <FloatingField name="lookingFor" label="What You’re Looking For in a Mentor" value={formData.lookingFor || ''} onChange={handleInputChange} required error={errors.lookingFor} as="textarea" />
                <FloatingField name="mentoringStyle" label="Mentoring Style" value={formData.mentoringStyle || ''} onChange={handleInputChange} required error={errors.mentoringStyle} />
                <FloatingField name="linkedin" label="LinkedIn (optional)" value={formData.linkedin || ''} onChange={handleInputChange} type="url" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function validate(step, role, formData) {
  const errors = {};
  if (step === 1) {
    if (!formData.name) errors.name = true;
    if (!formData.email) errors.email = true;
    if (!formData.password) errors.password = true;
  }
  if (step === 2) {
    if (role === 'mentor') {
      if (!formData.jobTitle) errors.jobTitle = true;
      if (!formData.company) errors.company = true;
      if (!formData.industry) errors.industry = true;
      if (!formData.yearsExperience) errors.yearsExperience = true;
    } else {
      if (!formData.currentRole) errors.currentRole = true;
      if (!formData.industryInterest) errors.industryInterest = true;
      if (!formData.careerGoals) errors.careerGoals = true;
    }
  }
  if (step === 3) {
    if (role === 'mentor') {
      if (!formData.expertise) errors.expertise = true;
      if (!formData.keySkills) errors.keySkills = true;
      if (!formData.howHelp) errors.howHelp = true;
      if (!formData.availability) errors.availability = true;
    } else {
      if (!formData.skillsToDevelop) errors.skillsToDevelop = true;
      if (!formData.lookingFor) errors.lookingFor = true;
      if (!formData.mentoringStyle) errors.mentoringStyle = true;
    }
  }
  return errors;
}

export function SignUpMorphing() {
  const [role, setRole] = useState('mentor');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validate(step, role, formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0 && step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(step, role, formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted!');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-[1.2fr_1fr] bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Left Panel (Branding & Emotion) - 70% */}
      <motion.div
        className="flex flex-col items-center justify-center relative z-10 px-16"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        {/* Studio Ghibli-style SVG Illustration */}
        <motion.div
          className="w-80 h-80 rounded-full flex items-center justify-center mb-12 relative"
          initial={{ scale: 0.9, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        >
          {/* Animated SVG Background */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 320 320"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r="150" fill="url(#gradient1)" />
            <circle cx="160" cy="160" r="120" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" />
            <circle cx="160" cy="160" r="90" fill="none" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
          </motion.svg>
          
          {/* Central Icon */}
          <motion.div
            className="relative z-10 text-8xl drop-shadow-lg"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: 'easeInOut' 
            }}
          >
            {role === 'mentor' ? '🧑‍🏫' : '🧑‍🎓'}
          </motion.div>
        </motion.div>
        
        {/* Hero Heading */}
        <motion.h1 
          className="text-5xl font-bold leading-tight text-slate-800 mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Mentor <span className="text-blue-600">Connect</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-slate-600 text-center max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Join as a Mentor or Mentee and start your growth journey.
        </motion.p>
      </motion.div>
      
      {/* Right Panel (Form Card) - 30% */}
      <div className="flex items-center justify-center relative z-20 p-8">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white/80 shadow-xl backdrop-blur-md rounded-2xl p-10 w-full max-w-xl border border-slate-200"
        >
          <RoleToggle role={role} setRole={setRole} />
          <StepProgress step={step} />
          <Form.Root
            className="space-y-2"
            onSubmit={step < 3 ? handleNext : handleSubmit}
            autoComplete="off"
          >
            <FormSteps
              step={step}
              role={role}
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              errors={errors}
            />
            <div className="flex justify-between items-center mt-8 gap-4">
              <motion.button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: step === 1 ? 1 : 1.04, boxShadow: step === 1 ? '' : '0 2px 16px 0 rgba(100,116,139,0.10)' }}
                className={`px-5 py-2.5 rounded-lg font-semibold bg-slate-200 text-slate-700 transition-colors shadow-sm ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300'}`}
              >
                Back
              </motion.button>
              {step < 3 ? (
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 2px 16px 0 rgba(59,130,246,0.15)' }}
                  className="px-7 py-2.5 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 2px 16px 0 rgba(16,185,129,0.15)' }}
                  className="px-7 py-2.5 rounded-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:from-green-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Submit
                </motion.button>
              )}
            </div>
          </Form.Root>
        </motion.div>
      </div>
    </div>
  );
}