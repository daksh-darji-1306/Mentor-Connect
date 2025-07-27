/** 
 * PreferencesStep Component
 * 
 * Core component handling user preferences collection with:
 * - Motivation text area
 * - Preferred mode checkboxes
 * - Terms agreement checkbox
 * 
 * Form Fields:
 * - Motivation for joining
 * - Preferred session types (1:1, group, chat)
 * - Terms agreement
 * 
 * Props:
 * @prop {object} data - Initial form data
 * @prop {function} onComplete - Submission callback
 * 
 * State Management:
 * - Tracks form field values
 * - Manages validation errors
 * - Handles form submission
 */
import React, { useState } from 'react';
import './PreferencesStep.css';

const MODES = [
  { value: '1:1', label: '1:1 Sessions' },
  { value: 'group', label: 'Group Sessions' },
  { value: 'chat', label: 'Chat Only' }
];

function PreferencesStep({ data = {}, onComplete }) {
  const [fields, setFields] = useState({
    motivation: data.motivation || '',
    preferredMode: data.preferredMode || [],
    agreed: !!data.agreed
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'preferredMode') {
      setFields(f => ({
        ...f,
        preferredMode: checked
          ? [...f.preferredMode, value]
          : f.preferredMode.filter(v => v !== value)
      }));
    } else if (type === 'checkbox') {
      setFields(f => ({ ...f, [name]: checked }));
    } else {
      setFields(f => ({ ...f, [name]: value }));
    }
    setErrors(e => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!fields.motivation.trim()) newErrors.motivation = 'Motivation is required.';
    if (!fields.agreed) newErrors.agreed = 'You must agree to the terms.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      onComplete(fields);
    }
  };

  return (
    <form className="preferences-step" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-group">
        <label htmlFor="motivation">Motivation<span className="required">*</span></label>
        <textarea
          id="motivation"
          name="motivation"
          value={fields.motivation}
          onChange={handleChange}
          rows={4}
          className={errors.motivation ? 'error' : ''}
          placeholder="What motivates you to join this program?"
        />
        {errors.motivation && <div className="error-message">{errors.motivation}</div>}
      </div>
      <div className="form-group">
        <label>Preferred Mode</label>
        <div className="checkbox-group">
          {MODES.map(mode => (
            <label key={mode.value} className={`checkbox-label${fields.preferredMode.includes(mode.value) ? ' checked' : ''}`}>
              <input
                type="checkbox"
                name="preferredMode"
                value={mode.value}
                checked={fields.preferredMode.includes(mode.value)}
                onChange={handleChange}
              />
              <span className="custom-checkbox" />
              {mode.label}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="checkbox-label terms-label">
          <input
            type="checkbox"
            name="agreed"
            checked={fields.agreed}
            onChange={handleChange}
          />
          <span className="custom-checkbox" />
          I agree to the terms<span className="required">*</span>
        </label>
        {errors.agreed && <div className="error-message">{errors.agreed}</div>}
      </div>
      <button type="submit" className="submit-btn" disabled={!fields.agreed}>Continue</button>
    </form>
  );
}

export default PreferencesStep;