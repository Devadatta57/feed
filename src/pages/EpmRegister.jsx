import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { fetchEpmEvents, submitEpmRegistration } from '../api/epmApi';
import { formatEventDateLong, formatEventDateParts } from '../utils/epmDate';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollToTop from '../hooks/useScrollToTop';
import './EpmForms.css';

const EpmRegister = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedEpmId, setSelectedEpmId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    state: '',
    district: '',
    participantType: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // This page swaps between browse / form / success entirely via local state rather than
  // App-level navigation, so it needs its own scroll reset on each step - otherwise landing on
  // the success screen keeps whatever scroll position the form was left at.
  useScrollToTop(isSuccess ? 'success' : (selectedEpmId || 'browse'));

  useEffect(() => {
    let cancelled = false;
    fetchEpmEvents({ status: 'upcoming' })
      .then(data => { if (!cancelled) setEvents(data); })
      .catch(err => { if (!cancelled) setLoadError(err.message || 'Failed to load upcoming EPMs.'); })
      .finally(() => { if (!cancelled) setLoadingEvents(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedEpm = events.find(epm => epm.id === selectedEpmId);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.participantType) newErrors.participantType = 'Please select a participant type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitEpmRegistration({
        epmEventId: selectedEpmId,
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim() || null,
        state: formData.state.trim(),
        district: formData.district.trim(),
        participantType: formData.participantType,
        consent: formData.consent,
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="epm-premium-container">
        <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
        <div className="epm-success-state">
          <div className="epm-success-icon-wrap">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h2 className="epm-success-title">You're Registered</h2>
          <div className="epm-success-meta">
            {selectedEpm?.city} EPM · {formatEventDateLong(selectedEpm?.eventDate)}
          </div>
          <p className="epm-success-text">
            Your registration has been received successfully. We look forward to seeing you there and will share further details shortly.
          </p>
          <button className="epm-back-btn" onClick={() => onNavigate('epm')}>
            <ArrowLeft size={18} /> Back to EPM
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="epm-premium-container">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <div className="epm-premium-nav">
        <button className="epm-back-link" onClick={() => onNavigate('epm')}>
          <ArrowLeft size={18} /> Back to EPM
        </button>
      </div>

      {!selectedEpmId ? (
        <>
          <div className="epm-hero-split">
            <div className="epm-hero-content">
              <span className="epm-badge">EXPORT PROMOTIONAL MEETINGS</span>
              <h1 className="epm-hero-title">Register for EPM</h1>
              <p className="epm-hero-subtitle">Your journey from the farm to the global market begins here.</p>
            </div>
            <div className="epm-hero-visual">
              <img src="/images/epm_register_hero.avif" alt="EPM Global Market Journey" className="epm-hero-image" />
            </div>
          </div>

          <div className="epm-events-section">
            <h2 className="epm-section-heading">Upcoming EPM Locations</h2>
            {loadingEvents ? (
              <p style={{ color: '#64748b' }}>Loading upcoming EPMs…</p>
            ) : loadError ? (
              <p className="epm-form-error" style={{ fontSize: '0.95rem' }}>{loadError}</p>
            ) : events.length === 0 ? (
              <p style={{ color: '#64748b' }}>There are no upcoming EPMs open for registration right now. Please check back soon.</p>
            ) : (
              <div className="epm-events-timeline">
                {events.map(epm => {
                  const { day, month, year } = formatEventDateParts(epm.eventDate);
                  return (
                    <div
                      key={epm.id}
                      className="epm-event-card"
                      onClick={() => setSelectedEpmId(epm.id)}
                    >
                      <div className="epm-event-date-block">
                        <span className="epm-date-day">{day}</span>
                        <span className="epm-date-month">{month}</span>
                        <span className="epm-date-year">{year}</span>
                      </div>
                      <div className="epm-event-details">
                        <h3 className="epm-event-city">{epm.city}</h3>
                        <p className="epm-event-state">{epm.state}</p>
                        <div className="epm-event-venue">
                          <MapPin size={14} /> {epm.venue}
                        </div>
                      </div>
                      <div className="epm-event-action">
                        <span className="epm-text-btn">Register for this EPM <ArrowRight size={16} /></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="epm-form-layout">
          <div className="epm-form-sidebar">
            <button onClick={() => setSelectedEpmId('')} className="epm-change-location-btn">
              <ArrowLeft size={16} /> Change Location
            </button>
            <div className="epm-selected-event-info">
              <span className="epm-info-label">Registering for</span>
              <h2 className="epm-info-city">{selectedEpm.city}</h2>
              <p className="epm-info-state">{selectedEpm.state}</p>

              <div className="epm-info-meta-list">
                <div className="epm-info-meta-item">
                  <Calendar size={18} />
                  <span>{formatEventDateLong(selectedEpm.eventDate)}</span>
                </div>
                <div className="epm-info-meta-item">
                  <MapPin size={18} />
                  <span>{selectedEpm.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="epm-form-main">
            <h3 className="epm-form-title">Your Details</h3>
            {submitError && (
              <div className="epm-form-error" style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px'
              }}>
                <AlertCircle size={16} /> {submitError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="epm-grid-2">
                <div className="epm-form-group">
                  <label className="epm-form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    className="epm-form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="epm-form-error">{errors.fullName}</span>}
                </div>

                <div className="epm-form-group">
                  <label className="epm-form-label">Mobile Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    className="epm-form-input"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.mobileNumber && <span className="epm-form-error">{errors.mobileNumber}</span>}
                </div>

                <div className="epm-form-group">
                  <label className="epm-form-label">State <span className="required">*</span></label>
                  <input
                    type="text"
                    name="state"
                    className="epm-form-input"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Maharashtra"
                  />
                  {errors.state && <span className="epm-form-error">{errors.state}</span>}
                </div>

                <div className="epm-form-group">
                  <label className="epm-form-label">District <span className="required">*</span></label>
                  <input
                    type="text"
                    name="district"
                    className="epm-form-input"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Nashik"
                  />
                  {errors.district && <span className="epm-form-error">{errors.district}</span>}
                </div>

                <div className="epm-form-group">
                  <label className="epm-form-label">Participant Type <span className="required">*</span></label>
                  <select
                    name="participantType"
                    className="epm-form-select"
                    value={formData.participantType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select type</option>
                    <option value="Farmer">Farmer</option>
                    <option value="FPO">FPO</option>
                    <option value="PACS">PACS</option>
                    <option value="SHG">SHG</option>
                    <option value="MSME">MSME</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.participantType && <span className="epm-form-error">{errors.participantType}</span>}
                </div>

                <div className="epm-form-group">
                  <label className="epm-form-label">Email Address <span className="optional">(Optional)</span></label>
                  <input
                    type="email"
                    name="email"
                    className="epm-form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="epm-form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="epm-checkbox-group">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                />
                <label htmlFor="consent" className="epm-checkbox-label">
                  I agree to receive EPM-related updates via SMS/Email.
                </label>
              </div>

              <button type="submit" className="epm-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Register for EPM'} <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EpmRegister;
