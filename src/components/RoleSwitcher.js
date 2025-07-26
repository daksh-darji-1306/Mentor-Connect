// RoleSwitcher.js

import React from 'react';
import { motion } from 'framer-motion';
import './RoleSwitcher.css';

function RoleSwitcher({ selectedRole, onRoleChange }) {
  const roles = [
    {
      id: 'mentor',
      title: 'Mentor',
      icon: '🎓'
    },
    {
      id: 'mentee',
      title: 'Mentee',
      icon: '👥'
    }
  ];

  const handleRoleClick = (role) => {
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  const getSelectedIndex = () => {
    return roles.findIndex(role => role.id === selectedRole?.id);
  };

  return (
    <div className="role-switcher">
      <div className="role-switcher-container">
        {/* Sliding Indicator */}
        <motion.div
          className="sliding-indicator"
          initial={false}
          animate={{
            x: getSelectedIndex() * 50 + '%',
            width: '50%'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
        
        {/* Role Buttons */}
        {roles.map((role, index) => (
          <button
            key={role.id}
            className={`role-button ${selectedRole?.id === role.id ? 'selected' : ''}`}
            onClick={() => handleRoleClick(role)}
          >
            <span className="role-icon">{role.icon}</span>
            <span className="role-title">{role.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleSwitcher; 