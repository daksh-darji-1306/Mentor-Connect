// App.js

import React, { useState } from 'react';
import './App.css';
import RoleSelectionPage from './components/RoleSelectionPage';
import SignupForm from './components/SignupForm';
import SuccessScreen from './components/SuccessScreen';

function App() {
  const [currentPage, setCurrentPage] = useState("role-selection");
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    basicInfo: {},
    mentorProfile: {},
    menteeProfile: {},
    preferences: {}
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentPage("signup");
  };

  const handleFormComplete = (data) => {
    setFormData(data);
    setCurrentPage("success");
  };

  const handleBackToRoleSelection = () => {
    setCurrentPage("role-selection");
    setSelectedRole(null);
    setFormData({
      basicInfo: {},
      mentorProfile: {},
      menteeProfile: {},
      preferences: {}
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "role-selection":
        return (
          <RoleSelectionPage 
            onRoleSelect={handleRoleSelect}
          />
        );
      case "signup":
        return (
          <SignupForm 
            selectedRole={selectedRole}
            onComplete={handleFormComplete}
            onBack={handleBackToRoleSelection}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "success":
        return (
          <SuccessScreen 
            selectedRole={selectedRole}
            formData={formData}
            onBackToStart={handleBackToRoleSelection}
          />
        );
      default:
        return <RoleSelectionPage onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App; 