import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { fetchEpmEvents, submitEpmVolunteer } from '../api/epmApi';
import { formatEventDateLong, formatEventDateParts } from '../utils/epmDate';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useScrollToTop from '../hooks/useScrollToTop';
import './EpmForms.css';

const EpmVolunteer = ({ onNavigate, isLoggedIn, user, onLogout }) => {
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
    experience: '',
    reason: ''
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.district.trim()) newErrors.district = 'District/City is required';
    if (!formData.experience) newErrors.experience = 'Please select your background';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitEpmVolunteer({
        epmEventId: selectedEpmId,
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim() || null,
        state: formData.state.trim(),
        district: formData.district.trim(),
        experience: formData.experience,
        reason: formData.reason.trim() || null,
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
          <h2 className="epm-success-title">Thank You for Volunteering!</h2>
          <div className="epm-success-meta">
            {selectedEpm?.city} EPM · {formatEventDateLong(selectedEpm?.eventDate)}
          </div>
          <p className="epm-success-text">
            Your interest in supporting the EPM has been received. Our team will contact you with the next steps soon.
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
              <span className="epm-badge">EPM VOLUNTEER NETWORK</span>
              <h1 className="epm-hero-title">Become an EPM Volunteer</h1>
              <p className="epm-hero-subtitle">Help build stronger connections between India's farmers and the global market.</p>

              <div className="epm-story-flow">
                <div className="epm-story-step">
                  <span className="epm-story-label">Connect</span>
                  <span className="epm-story-value">Farmers</span>
                </div>
                <ArrowRight size={20} className="epm-story-arrow" />
                <div className="epm-story-step">
                  <span className="epm-story-label">Support</span>
                  <span className="epm-story-value">District EPM</span>
                </div>
                <ArrowRight size={20} className="epm-story-arrow" />
                <div className="epm-story-step">
                  <span className="epm-story-label">Enable</span>
                  <span className="epm-story-value">Export Options</span>
                </div>
              </div>
            </div>
            <div className="epm-hero-visual">
              <img src="/images/epm_volunteer_hero.avif" alt="EPM Volunteer Community" className="epm-hero-image" />
            </div>
          </div>

          <div className="epm-events-section">
            <h2 className="epm-section-heading">Where would you like to volunteer?</h2>
            {loadingEvents ? (
              <p style={{ color: '#64748b' }}>Loading upcoming EPMs…</p>
            ) : loadError ? (
              <p className="epm-form-error" style={{ fontSize: '0.95rem' }}>{loadError}</p>
            ) : events.length === 0 ? (
              <p style={{ color: '#64748b' }}>There are no upcoming EPMs looking for volunteers right now. Please check back soon.</p>
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
                        <span className="epm-text-btn">Volunteer for this EPM <ArrowRight size={16} /></span>
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
              <span className="epm-info-label">Volunteering at</span>
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
            <h3 className="epm-form-title">Volunteer Application</h3>
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

                <div className="epm-form-group">
                  <label className="epm-form-label">Experience / Background <span className="required">*</span></label>
                  <select
                    name="experience"
                    className="epm-form-select"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="">Select background</option>
                    <option value="Agriculture / Farming">Agriculture / Farming</option>
                    <option value="FPO / Cooperative">FPO / Cooperative</option>
                    <option value="Student">Student</option>
                    <option value="Business / MSME">Business / MSME</option>
                    <option value="Social / Community Work">Social / Community Work</option>
                    <option value="Government / Institutional">Government / Institutional</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.experience && <span className="epm-form-error">{errors.experience}</span>}
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
                  <label className="epm-form-label">District / City <span className="required">*</span></label>
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

                <div className="epm-form-group full-width">
                  <label className="epm-form-label">Why do you want to volunteer? <span className="optional">(Optional)</span></label>
                  <textarea
                    name="reason"
                    className="epm-form-textarea"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Tell us briefly how you would like to contribute..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="epm-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Apply as Volunteer'} <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EpmVolunteer;
