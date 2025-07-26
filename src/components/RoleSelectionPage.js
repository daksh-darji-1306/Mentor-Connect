// RoleSelectionPage.js

/**
 * RoleSelectionPage Component
 * Allows user to select Mentor or Mentee role before signup.
 * Displays role cards, benefits, and a continue button.
 * Props:
 *  - onRoleSelect: function to handle selected role
 */

import React, { useState } from 'react';
import './RoleSelectionPage.css';

/**
 * Main role selection logic.
 * Tracks selected role and handles continue action.
 */
function RoleSelectionPage({ onRoleSelect }) {
  // State for currently selected role
  const [selectedRole, setSelectedRole] = useState(null);

  // List of available roles
  const roles = [
    {
      id: 'mentor',
      title: 'Mentor',
      subtitle: 'Share Your Expertise',
      icon: '🎓',
      description: 'Guide and inspire the next generation of professionals',
      benefits: [
        'Build leadership skills',
        'Expand your network',
        'Give back to the community',
        'Enhance your resume'
      ],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'mentee',
      title: 'Mentee',
      subtitle: 'Learn & Grow',
      icon: '👥',
      description: 'Connect with experienced professionals in your field',
      benefits: [
        'Get career guidance',
        'Learn from experts',
        'Build confidence',
        'Accelerate your growth'
      ],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  /**
   * Handles role card selection
   */
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  /**
   * Handles continue button click
   */
  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="logo-container">
            <span className="logo-emoji">👥</span>
          </div>
          <h1 className="page-title">Choose Your Role</h1>
          <p className="page-subtitle">Select how you'd like to participate in our mentoring community</p>
        </div>

        {/* Role Cards Section */}
        <div className="roles-grid">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-card role-card-${role.id} ${selectedRole?.id === role.id ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role)}
            >
              <div className="role-icon" style={{ background: role.gradient }}>
                <span className="icon-emoji">{role.icon}</span>
              </div>
              <div className="role-content">
                <h2 className="role-title">{role.title}</h2>
                <h3 className="role-subtitle">{role.subtitle}</h3>
                <p className="role-description">{role.description}</p>
                <ul className="benefits-list">
                  {role.benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      <span className="benefit-star">
                        {/* SVG star icon for benefit */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#17343b" />
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Selected indicator for chosen role */}
              {selectedRole?.id === role.id && (
                <div className="selected-indicator">
                  <span className="selected-icon">🎯</span>
                  <span className="selected-text">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="button-section">
          <button
            className={`continue-button ${selectedRole ? 'active' : 'disabled'}`}
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            <span>Continue</span>
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;