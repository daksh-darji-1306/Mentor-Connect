// SuccessScreen.js

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SuccessScreen.css';

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 18,
      when: 'beforeChildren',
      staggerChildren: 0.18
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 18,
      delay: i * 0.08
    }
  })
};

const sparkles = [
  { style: { top: 18, left: 38, fontSize: '1.2rem', color: '#fffbe6' }, delay: 0.1 },
  { style: { top: 60, left: 80, fontSize: '1.1rem', color: '#fcd34d' }, delay: 0.2 },
  { style: { top: 80, left: 30, fontSize: '0.9rem', color: '#a78bfa' }, delay: 0.3 },
  { style: { top: 40, left: 90, fontSize: '1.3rem', color: '#f472b6' }, delay: 0.4 }
];

function SuccessScreen({ formData = {}, selectedRole = {}, onBackToStart }) {
  const name = formData.basicInfo?.fullName || 'User';
  const role = selectedRole?.title || '';

  return (
    <div className="success-screen-bg">
      <AnimatePresence>
        <motion.div
          className="success-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Success Icon + Sparkles */}
          <motion.div className="success-icon-wrap" variants={itemVariants} custom={0}>
            <span className="success-icon">✅</span>
            {sparkles.map((sparkle, i) => (
              <motion.span
                key={i}
                className="sparkle"
                style={sparkle.style}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 + sparkle.delay }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>

          {/* Welcome Message */}
          <motion.h2 className="success-title" variants={itemVariants} custom={1}>
            Welcome, {name}!
          </motion.h2>
          <motion.div className="success-role" variants={itemVariants} custom={2}>
            You have successfully signed up as a <span className="role-highlight">{role}</span>.
          </motion.div>

          {/* Proceed Button */}
          <motion.button
            className="dashboard-btn"
            variants={itemVariants}
            custom={3}
            onClick={onBackToStart}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SuccessScreen; 