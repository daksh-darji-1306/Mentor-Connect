/**
 * Main Application Component
 * 
 * This component serves as the root of the Mentor-Connect signup application.
 * It manages the overall application state and handles navigation between:
 * 1. Role selection (Mentor/Mentee)
 * 2. Multi-step signup form
 * 3. Success confirmation screen
 * 
 * State Management:
 * - Tracks current page/view (role-selection/signup/success)
 * - Stores selected role (mentor/mentee)
 * - Maintains form data across all steps
 */
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