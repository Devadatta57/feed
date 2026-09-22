import React, { useState } from 'react';
import bgImage from '../assets/reg.avif';
import logoImage from '../assets/logo.avif';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

const apDistricts = [
  'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 
  'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 
  'Kakinada', 'Krishna', 'Kurnool', 'Markapuram (Newly formed)', 'Nandyal', 'NTR', 
  'Palnadu', 'Parvathipuram Manyam', 'Polavaram (Newly formed)', 'Prakasam', 
  'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 
  'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'Y.S.R. Kadapa'
].sort();

const tgDistricts = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial', 'Jangaon', 
  'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 
  'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 
  'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 
  'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 
  'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 
  'Yadadri Bhuvanagiri'
].sort();

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    phone: '',
    dob: '',
    email: '',
    education: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    city: '',
    userType: ''
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData({ ...formData, state: value, district: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match!' });
      return;
    }
    
    setIsSubmitting(true);
    setNotification(null);

    try {
      const response = await fetch(`http://${window.location.hostname}:8080/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setNotification({ type: 'success', message: data?.message || 'Registration successful!' });
        setTimeout(() => {
          onBackToLogin();
        }, 3000);
      } else {
        let errorMessage = 'Registration failed. Please try again.';
        if (data) {
          if (data.error) {
            errorMessage = data.error;
          } else if (Object.keys(data).length > 0) {
            // Handle validation errors by getting the first one
            const firstErrorKey = Object.keys(data)[0];
            errorMessage = `${firstErrorKey}: ${data[firstErrorKey]}`;
          }
        }
        setNotification({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({ type: 'error', message: 'Network error. Please make sure the backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Main brand colors
  const brandGreen = '#3e6b36';
  const textDark = '#1a1a1a';
  const textLight = '#6b7280';
  const inputBg = '#ffffff';
  const inputBorder = '#e5e7eb';
  const panelBg = '#faf9f6';

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: textDark,
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: textDark,
    marginBottom: '6px',
    display: 'block'
  };

  return (
    <div 
      className="fullscreen-register-wrapper"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f4f4f9',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
        paddingRight: '6%',
        margin: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div 
        className="register-panel"
        style={{
          background: panelBg,
          borderRadius: '24px',
          padding: '32px 32px 24px 32px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          scrollbarWidth: 'none', // hide scrollbar for firefox
          msOverflowStyle: 'none',  // hide scrollbar for IE 10+
        }}
      >
        <style>{`
          .register-panel::-webkit-scrollbar { display: none; }
          .gender-radio {
            appearance: none;
            width: 16px;
            height: 16px;
            border: 2px solid ${inputBorder};
            border-radius: 50%;
            outline: none;
            cursor: pointer;
            position: relative;
            margin: 0;
          }
          .gender-radio:checked {
            border-color: ${brandGreen};
          }
          .gender-radio:checked::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background-color: ${brandGreen};
            border-radius: 50%;
          }
          @keyframes slideDown {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', marginTop: '8px' }}>
          <button 
            type="button" 
            onClick={onBackToLogin}
            style={{ 
              position: 'absolute',
              left: '0',
              top: '0',
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: textLight,
              display: 'flex',
              padding: '4px',
              marginLeft: '-4px'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <img src={logoImage} alt="Logo" style={{ height: '96px', marginBottom: '16px', objectFit: 'contain' }} />
          <h2 style={{ margin: 0, fontSize: '24px', color: textDark, fontWeight: '700', textAlign: 'center' }}>Create an Account</h2>
        </div>

        {/* Notification Popup */}
        {notification && (
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fecaca'}`,
            animation: 'slideDown 0.3s ease-out'
          }}>
            {notification.type === 'success' ? <Check size={20} color="#059669" /> : <AlertCircle size={20} color="#dc2626" />}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', color: 'inherit', marginLeft: '8px' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <input 
                type="text" 
                name="firstName"
                placeholder="Enter First Name" 
                value={formData.firstName}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Middle Name</label>
              <input 
                type="text" 
                name="middleName"
                placeholder="Enter Middle Name" 
                value={formData.middleName}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Last Name</label>
            <input 
              type="text" 
              name="lastName"
              placeholder="Enter Last Name" 
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = brandGreen}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
          </div>

          <div>
            <label style={labelStyle}>Gender</label>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '40px' }}>
              {['Male', 'Female', 'Others'].map((g) => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: textDark, cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value={g} 
                    className="gender-radio"
                    checked={formData.gender === g}
                    onChange={handleChange}
                    required
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Phone</label>
              <div style={{ display: 'flex', position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  fontSize: '14px', 
                  color: textDark,
                  fontWeight: '500' 
                }}>
                  +91
                </span>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="00000 00000" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingLeft: '48px' }}
                  onFocus={(e) => e.target.style.borderColor = brandGreen}
                  onBlur={(e) => e.target.style.borderColor = inputBorder}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={{ ...inputStyle, color: formData.dob ? textDark : '#9ca3af' }}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter Email" 
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = brandGreen}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
          </div>

          <div>
            <label style={labelStyle}>Education</label>
            <input 
              type="text" 
              name="education"
              placeholder="Enter Education" 
              value={formData.education}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = brandGreen}
              onBlur={(e) => e.target.style.borderColor = inputBorder}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Enter Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
          </div>

          <div style={{ marginTop: '8px', paddingTop: '20px', borderTop: `1px solid ${inputBorder}` }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: textDark, fontWeight: '700' }}>Membership Details</h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => e.target.style.borderColor = brandGreen}
                  onBlur={(e) => e.target.style.borderColor = inputBorder}
                >
                  <option value="" disabled>Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, cursor: formData.state ? 'pointer' : 'not-allowed', backgroundColor: formData.state ? inputBg : '#f9fafb' }}
                  onFocus={(e) => e.target.style.borderColor = brandGreen}
                  onBlur={(e) => e.target.style.borderColor = inputBorder}
                  disabled={!formData.state}
                >
                  <option value="" disabled>Select District</option>
                  {formData.state === 'Andhra Pradesh' && apDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  {formData.state === 'Telangana' && tgDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>City/Village</label>
                <input 
                  type="text" 
                  name="city"
                  placeholder="Enter City or Village" 
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = brandGreen}
                  onBlur={(e) => e.target.style.borderColor = inputBorder}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>User Type</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={(e) => e.target.style.borderColor = brandGreen}
                  onBlur={(e) => e.target.style.borderColor = inputBorder}
                >
                  <option value="" disabled>Select User Type</option>
                  <option value="Individual">Individual</option>
                  <option value="Institutional">Institutional</option>
                  <option value="International Buyer">International Buyer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '8px',
              border: 'none',
              background: brandGreen,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(62, 107, 54, 0.2)',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = '#2c5225')}
            onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = brandGreen)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Registering...</span>
            ) : (
              <>
                <Check size={20} />
                Register
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;
