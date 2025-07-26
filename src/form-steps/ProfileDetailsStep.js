// ProfileDetailsStep.js

import React, { useState } from 'react';
import './ProfileDetailsStep.css';

function ProfileDetailsStep({ role, data = {}, onComplete }) {
  const isMentor = role?.id === 'mentor';
  const [fields, setFields] = useState({
    // Mentor fields
    yearsOfExperience: data.yearsOfExperience || '',
    expertise: data.expertise || '',
    availability: data.availability || '',
    // Mentee fields
    educationLevel: data.educationLevel || '',
    fieldOfInterest: data.fieldOfInterest || '',
    learningGoals: data.learningGoals || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (isMentor) {
      if (!fields.yearsOfExperience) newErrors.yearsOfExperience = 'Required.';
      if (!fields.expertise.trim()) newErrors.expertise = 'Required.';
      if (!fields.availability) newErrors.availability = 'Required.';
    } else {
      if (!fields.educationLevel) newErrors.educationLevel = 'Required.';
      if (!fields.fieldOfInterest.trim()) newErrors.fieldOfInterest = 'Required.';
      if (!fields.learningGoals.trim()) newErrors.learningGoals = 'Required.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      // Only send relevant fields
      if (isMentor) {
        onComplete({
          yearsOfExperience: fields.yearsOfExperience,
          expertise: fields.expertise,
          availability: fields.availability
        });
      } else {
        onComplete({
          educationLevel: fields.educationLevel,
          fieldOfInterest: fields.fieldOfInterest,
          learningGoals: fields.learningGoals
        });
      }
    }
  };

  return (
    <form className="profile-details-step" onSubmit={handleSubmit} autoComplete="off">
      {isMentor ? (
        <>
          <div className="form-group">
            <label htmlFor="yearsOfExperience">Years of Experience<span className="required">*</span></label>
            <select
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={fields.yearsOfExperience}
              onChange={handleChange}
              className={errors.yearsOfExperience ? 'error' : ''}
            >
              <option value="">Select...</option>
              <option value="1-2">1-2</option>
              <option value="3-5">3-5</option>
              <option value="6-10">6-10</option>
              <option value="10+">10+</option>
            </select>
            {errors.yearsOfExperience && <div className="error-message">{errors.yearsOfExperience}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="expertise">Area of Expertise<span className="required">*</span></label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              value={fields.expertise}
              onChange={handleChange}
              placeholder="e.g. Software Engineering, Data Science"
              className={errors.expertise ? 'error' : ''}
            />
            {errors.expertise && <div className="error-message">{errors.expertise}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="availability">Weekly Availability<span className="required">*</span></label>
            <select
              id="availability"
              name="availability"
              value={fields.availability}
              onChange={handleChange}
              className={errors.availability ? 'error' : ''}
            >
              <option value="">Select...</option>
              <option value="1-2h">1-2h</option>
              <option value="3-5h">3-5h</option>
              <option value="6-10h">6-10h</option>
              <option value="10+h">10+h</option>
            </select>
            {errors.availability && <div className="error-message">{errors.availability}</div>}
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="educationLevel">Education Level<span className="required">*</span></label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={fields.educationLevel}
              onChange={handleChange}
              className={errors.educationLevel ? 'error' : ''}
            >
              <option value="">Select...</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
            {errors.educationLevel && <div className="error-message">{errors.educationLevel}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="fieldOfInterest">Field of Interest<span className="required">*</span></label>
            <input
              type="text"
              id="fieldOfInterest"
              name="fieldOfInterest"
              value={fields.fieldOfInterest}
              onChange={handleChange}
              placeholder="e.g. Product Management, AI"
              className={errors.fieldOfInterest ? 'error' : ''}
            />
            {errors.fieldOfInterest && <div className="error-message">{errors.fieldOfInterest}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="learningGoals">Learning Goals<span className="required">*</span></label>
            <textarea
              id="learningGoals"
              name="learningGoals"
              value={fields.learningGoals}
              onChange={handleChange}
              placeholder="Describe your learning goals..."
              className={errors.learningGoals ? 'error' : ''}
              rows={4}
            />
            {errors.learningGoals && <div className="error-message">{errors.learningGoals}</div>}
          </div>
        </>
      )}
      <button type="submit" className="submit-btn">Continue</button>
    </form>
  );
}

export default ProfileDetailsStep; 