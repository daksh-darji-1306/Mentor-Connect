/**
 * SignupForm Component
 * 
 * Core component handling the multi-step signup process with:
 * - Left branding panel with app information
 * - Right form panel with step navigation
 * - Progress tracking and role switching
 * 
 * Form Architecture:
 * - 3-step process (Basic Info → Profile Details → Preferences)
 * - Dynamic step rendering based on currentStep state
 * - Form data aggregation across all steps
 * 
 * Key Features:
 * - Split-screen layout (branding/form)
 * - Integrated ProgressIndicator
 * - RoleSwitcher for changing roles mid-flow
 * - Navigation buttons with conditional logic
 * 
 * Props:
 * @prop {object} selectedRole - Currently selected role with metadata
 * @prop {function} onComplete - Final submission callback
 * @prop {function} onBack - Navigation callback to role selection
 * @prop {object} formData - Aggregated form data from all steps
 * @prop {function} setFormData - State setter for form data
 * 
 * State Management:
 * - Tracks current step (1-3)
 * - Manages form data collection
 * - Handles navigation between steps
 */

import React, { useState } from 'react';
import './SignupForm.css';
import RoleSwitcher from './RoleSwitcher';
import ProgressIndicator from './ProgressIndicator';
import BasicInfoStep from '../form-steps/BasicInfoStep';
import ProfileDetailsStep from '../form-steps/ProfileDetailsStep';
import PreferencesStep from '../form-steps/PreferencesStep';

/**
 * Main signup form logic.
 * Tracks current step and handles navigation between steps.
 */
function SignupForm({ 
  selectedRole, 
  onComplete, 
  onBack, 
  formData, 
  setFormData 
}) {
  // Track current step in signup process
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

  /**
   * Move to next step or complete signup
   */
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to success step (step 4)
      onComplete(formData);
    }
  };

  /**
   * Go back to previous step or role selection
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go back to role selection
      onBack();
    }
  };

  /**
   * Save step data and move to next step
   */
  const handleStepComplete = (stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
    handleNext();
  };

  /**
   * Render the current form step
   */
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            data={formData.basicInfo}
            onComplete={(data) => handleStepComplete({ basicInfo: data })}
          />
        );
      case 2:
        return (
          <ProfileDetailsStep 
            role={selectedRole}
            data={formData[selectedRole?.id === 'mentor' ? 'mentorProfile' : 'menteeProfile']}
            onComplete={(data) => handleStepComplete({ 
              [selectedRole?.id === 'mentor' ? 'mentorProfile' : 'menteeProfile']: data 
            })}
          />
        );
      case 3:
        return (
          <PreferencesStep 
            data={formData.preferences}
            onComplete={(data) => handleStepComplete({ preferences: data })}
          />
        );
      default:
        return <BasicInfoStep data={formData.basicInfo} onComplete={() => {}} />;
    }
  };

  /**
   * Get title for current step
   */
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return selectedRole?.id === 'mentor' ? "Mentor Profile" : "Mentee Profile";
      case 3:
        return "Preferences";
      default:
        return "Sign Up";
    }
  };

  return (
    <div className="signup-form-page">
      {/* Left Panel - Branding */}
      <div className="branding-panel">
        <div className="branding-content">
          <div className="brand-logo">
            <span className="logo-emoji">👥</span>
          </div>
          <h1 className="brand-title">Join Our Community</h1>
          <p className="brand-subtitle">
            Connect with {selectedRole?.id === 'mentor' ? 'mentees' : 'mentors'} and 
            {selectedRole?.id === 'mentor' ? ' share your expertise' : ' accelerate your growth'}
          </p>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Personalized matching</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure & private</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>Proven results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="form-panel">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <div className="header-content">
              <h2 className="form-title">{getStepTitle()}</h2>
              <div className="role-indicator">
                <span className="role-icon">{selectedRole?.icon}</span>
                <span className="role-text">{selectedRole?.title}</span>
              </div>
            </div>
          </div>

          {/* Role Switcher and Progress */}
          <div className="form-navigation">
            <RoleSwitcher 
              selectedRole={selectedRole}
              onRoleChange={onBack}
            />
            <ProgressIndicator 
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>

          {/* Form Step */}
          <div className="form-step-container">
            {renderFormStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation-buttons">
            <button 
              className="back-button"
              onClick={handleBack}
            >
              <span className="back-icon">←</span>
              {currentStep === 1 ? 'Back to Roles' : 'Previous'}
            </button>
            
            <button 
              className="continue-button"
              onClick={handleNext}
            >
              <span>{currentStep === totalSteps ? 'Complete' : 'Continue'}</span>
              <span className="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;