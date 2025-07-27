/**
 * ProgressIndicator Component
 * 
 * Visual indicator showing user progress through multi-step signup form.
 * Features animated transitions between steps using Framer Motion.
 * 
 * Key Features:
 * - Animated step circles with completion states (pending/current/complete)
 * - Dynamic connecting lines between steps
 * - Responsive to currentStep prop changes
 * - Checkmark animation for completed steps
 * 
 * Props:
 * @prop {number} currentStep - Current active step (1-indexed)
 * @prop {number} totalSteps - Total number of steps in process
 * 
 * Animation Details:
 * - Uses spring physics for smooth transitions
 * - Scales current step for emphasis
 * - Color transitions indicate state changes
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProgressIndicator.css';

// List of steps for the progress indicator
const steps = [
  { label: 'Basic Info' },
  { label: 'Profile' },
  { label: 'Preferences' }
];

/**
 * Renders animated progress indicator for signup steps.
 */
function ProgressIndicator({ currentStep = 1, totalSteps = 3 }) {
  return (
    <div className="progress-indicator">
      {steps.map((step, idx) => {
        // Determine step status
        const stepNum = idx + 1;
        const isComplete = currentStep > stepNum;
        const isCurrent = currentStep === stepNum;
        const isPending = currentStep < stepNum;

        return (
          <React.Fragment key={step.label}>
            <div className="step-container">
              {/* Step circle with animation and status */}
              <motion.div
                className={`step-circle ${isComplete ? 'complete' : isCurrent ? 'current' : 'pending'}`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  borderColor: isCurrent || isComplete ? '#8b5cf6' : '#6b7280',
                  backgroundColor: isComplete ? '#8b5cf6' : '#1f2937',
                  color: isComplete ? '#fff' : isCurrent ? '#8b5cf6' : '#6b7280',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Show checkmark for completed steps, step number otherwise */}
                {isComplete ? (
                  <motion.span
                    className="checkmark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span className="step-number">{stepNum}</span>
                )}
              </motion.div>
              {/* Step label below the circle */}
              <span className={`step-label ${isCurrent ? 'active' : ''}`}>{step.label}</span>
            </div>
            {/* Line connecting steps, except after last step */}
            {idx < steps.length - 1 && (
              <motion.div
                className="step-line"
                initial={false}
                animate={{
                  background: currentStep > stepNum ? 'linear-gradient(90deg, #8b5cf6 60%, #6b7280 100%)' : '#374151',
                  width: 48
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ProgressIndicator;