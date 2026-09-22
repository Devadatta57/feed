import React, { useState } from 'react';
import bgImage from '../assets/Login.avif';
import logoImage from '../assets/logo.avif';
import { Mail, Lock, EyeOff, Eye, ArrowRight, UserPlus, Leaf, ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import DeviceRow from '../components/DeviceRow';

const Login = ({ onLogin, onRegisterClick, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Set when /login is blocked by the 3-device cap - holds the active sessions the
  // "log out a device to continue" screen lets the user pick from.
  const [blockedSessions, setBlockedSessions] = useState(null);
  const [blockedMessage, setBlockedMessage] = useState('');
  const [revokingId, setRevokingId] = useState(null);

  // Shared by the initial submit and by the auto-retry that fires right after a device
  // is logged out, so freeing a slot takes the user straight into the app.
  const attemptLogin = async () => {
    const response = await fetch(`http://${window.location.hostname}:8080/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      setBlockedSessions(null);
      setNotification({ type: 'success', message: data?.message || 'Login successful!' });
      setTimeout(() => {
        onLogin(data);
      }, 1200);
      return;
    }

    if (response.status === 409 && Array.isArray(data?.activeSessions)) {
      setBlockedSessions(data.activeSessions);
      setBlockedMessage(
        data?.error || 'You are already logged in on 3 devices. Log out from one device to continue on this device.'
      );
      return;
    }

    setBlockedSessions(null);
    setNotification({ type: 'error', message: data?.error || 'User not found' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      await attemptLogin();
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ type: 'error', message: 'Network error. Please make sure the backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeDevice = async (sessionId) => {
    setRevokingId(sessionId);
    try {
      const res = await fetch(`http://${window.location.hostname}:8080/api/login/sessions/${sessionId}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        // Drop it from the list right away, then continue the login this device was
        // originally trying to do - only that one device's session is touched.
        setBlockedSessions((prev) => (prev ? prev.filter((s) => s.id !== sessionId) : prev));
        setNotification({ type: 'success', message: 'Logged out from that device. Logging you in…' });
        setIsSubmitting(true);
        await attemptLogin();
        setIsSubmitting(false);
      } else {
        setNotification({ type: 'error', message: data?.error || 'Could not log out that device.' });
      }
    } catch (error) {
      console.error('Revoke session error:', error);
      setNotification({ type: 'error', message: 'Network error. Please make sure the backend is running.' });
    } finally {
      setRevokingId(null);
    }
  };

  // Main brand color
  const brandGreen = '#3e6b36';
  const textDark = '#1a1a1a';
  const textLight = '#6b7280';
  const inputBg = '#ffffff';
  const inputBorder = '#e5e7eb';
  const panelBg = '#faf9f6';

  return (
    <div 
      className="fullscreen-login-wrapper"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 75%',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f4f4f9',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
        paddingRight: '6%', // Adjusted for a bit closer to edge like image
        margin: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div 
        className="login-panel"
        style={{
          background: panelBg,
          borderRadius: '32px',
          padding: '32px 40px 20px 40px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          scrollbarWidth: 'none', // hide scrollbar for firefox
          msOverflowStyle: 'none',  // hide scrollbar for IE 10+
        }}
      >
        <style>{`
          .login-panel::-webkit-scrollbar { display: none; }
          .custom-checkbox {
            appearance: none;
            background-color: #fff;
            margin: 0;
            font: inherit;
            color: currentColor;
            width: 1.15em;
            height: 1.15em;
            border: 1px solid ${inputBorder};
            border-radius: 4px;
            display: grid;
            place-content: center;
            cursor: pointer;
          }
          .custom-checkbox::before {
            content: "";
            width: 0.65em;
            height: 0.65em;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em white;
            background-color: white;
            transform-origin: center;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
          }
          .custom-checkbox:checked {
            background-color: ${brandGreen};
            border-color: ${brandGreen};
          }
          .custom-checkbox:checked::before {
            transform: scale(1);
          }
          @keyframes slideInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Notification Popup (top right) */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 2000,
            border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fecaca'}`,
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '360px'
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

        {/* Back Button */}
        {onBack && (
          <button 
            type="button" 
            onClick={onBack}
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: textLight,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
              marginBottom: '16px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = brandGreen}
            onMouseOut={(e) => e.currentTarget.style.color = textLight}
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        )}

        {/* Logo Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <img src={logoImage} alt="Feed Logo" style={{ height: '180px', objectFit: 'contain' }} />
        </div>

       

       

        {/* "Maximum devices reached" screen, shown instead of the form after a 409 */}
        {blockedSessions && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: textDark, marginBottom: '4px' }}>
                Maximum 3 devices reached
              </div>
              <div style={{ fontSize: '13px', color: textLight }}>{blockedMessage}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blockedSessions.map((s) => (
                <DeviceRow key={s.id} session={s} onLogout={handleRevokeDevice} busy={revokingId === s.id} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setBlockedSessions(null);
                setNotification(null);
              }}
              style={{
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: textLight,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <ArrowLeft size={16} />
              Use a different account
            </button>
          </div>
        )}

        {/* Form */}
        {!blockedSessions && (
        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: textDark }}>Email or Phone Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '14px', color: '#9ca3af', display: 'flex' }}>
                <Mail size={18} strokeWidth={2} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your email or phone number" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '8px',
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: textDark,
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: textDark }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '14px', color: '#9ca3af', display: 'flex' }}>
                <Lock size={18} strokeWidth={2} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '8px',
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: textDark,
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = brandGreen}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '14px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#9ca3af',
                  display: 'flex',
                  padding: 0
                }}
              >
                {showPassword ? <Eye size={18} strokeWidth={2} /> : <EyeOff size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: textLight, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="custom-checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>
            <a href="#" style={{ fontSize: '13px', color: brandGreen, textDecoration: 'none', fontWeight: '600' }}>
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '8px',
              border: 'none',
              background: brandGreen,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(62, 107, 54, 0.2)',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = '#2c5225')}
            onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = brandGreen)}
          >
            <span style={{ flex: 1, textAlign: 'center' }}>{isSubmitting ? 'Logging in...' : 'Login'}</span>
            {!isSubmitting && <ArrowRight size={20} />}
          </button>
        </form>
        )}

        {/* OR Divider */}
        {!blockedSessions && (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '16px 0', color: textLight, fontSize: '12px', fontWeight: '600' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ margin: '0 16px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>
        )}

        {/* Registration Section */}
        {!blockedSessions && (
        <div style={{
          width: '100%',
          background: '#f1f4ed',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: '14px', color: textLight }}>Don't have an account?</span>
          <button 
            type="button"
            onClick={onRegisterClick}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '8px',
              border: `1px solid ${brandGreen}`,
              background: 'transparent',
              color: brandGreen,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = brandGreen;
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = brandGreen;
            }}
          >
            <UserPlus size={18} />
            Register Now
          </button>
        </div>
        )}

      </div>
    </div>
  );
};

export default Login;
