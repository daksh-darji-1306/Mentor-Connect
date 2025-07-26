// BasicInfoStep.js

import React, { useState, useRef } from 'react';
import './BasicInfoStep.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

function BasicInfoStep({ data = {}, onComplete, role }) {
  const [fields, setFields] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    password: '',
    confirmPassword: '',
    linkedIn: data.linkedIn || '',
    resume: data.resume || null
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  const isMentor = role?.id === 'mentor';

  const validate = () => {
    const newErrors = {};
    if (!fields.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!fields.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) newErrors.email = 'Invalid email address.';
    if (!fields.password) newErrors.password = 'Password is required.';
    else if (fields.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!fields.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (fields.password !== fields.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (isMentor && fields.resume) {
      if (!ALLOWED_TYPES.includes(fields.resume.type)) newErrors.resume = 'File type not allowed.';
      if (fields.resume.size > MAX_FILE_SIZE) newErrors.resume = 'File size exceeds 10MB.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(e => ({ ...e, resume: 'File type not allowed.' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors(e => ({ ...e, resume: 'File size exceeds 10MB.' }));
      return;
    }
    setFields(f => ({ ...f, resume: file }));
    setErrors(e => ({ ...e, resume: undefined }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      // Only send relevant fields
      const submitData = { ...fields };
      if (!isMentor) {
        delete submitData.linkedIn;
        delete submitData.resume;
      }
      onComplete(submitData);
    }
  };

  return (
    <form className="basic-info-step" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-group">
        <label htmlFor="fullName">Full Name<span className="required">*</span></label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fields.fullName}
          onChange={handleChange}
          className={errors.fullName ? 'error' : ''}
          autoComplete="name"
        />
        {errors.fullName && <div className="error-message">{errors.fullName}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address<span className="required">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          autoComplete="email"
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password<span className="required">*</span></label>
        <input
          type="password"
          id="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          autoComplete="new-password"
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password<span className="required">*</span></label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'error' : ''}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>
      {isMentor && (
        <>
          <div className="form-group">
            <label htmlFor="linkedIn">LinkedIn URL</label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={fields.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              autoComplete="url"
            />
          </div>
          <div className="form-group">
            <label>Resume (PDF, DOC, DOCX, ≤10MB)</label>
            <div
              className={`resume-dropzone${dragActive ? ' drag-active' : ''}${errors.resume ? ' error' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload resume"
            >
              {fields.resume ? (
                <span className="file-name">{fields.resume.name}</span>
              ) : (
                <span className="dropzone-text">Drag & drop or click to upload</span>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
            {errors.resume && <div className="error-message">{errors.resume}</div>}
          </div>
        </>
      )}
      <button type="submit" className="submit-btn">Continue</button>
    </form>
  );
}

export default BasicInfoStep; 