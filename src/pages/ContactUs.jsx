import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Headphones,
  User,
  MessageSquare,
  Send,
  Lock,
  ExternalLink,
  Clock,
  HeartHandshake,
  Users,
} from 'lucide-react';

import './ContactUs.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const MAPS_URL = 'https://maps.app.goo.gl/Go2hsc82AL3rFNW59';
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=16.5388453,80.634379&z=17&output=embed';

const SocialIcon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    {children}
  </svg>
);

const FacebookIcon = () => (
  <SocialIcon>
    <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3.2L17 11h-4V9c0-.6.4-1 1-1z" />
  </SocialIcon>
);

const InstagramIcon = () => (
  <SocialIcon>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6.8a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z" />
  </SocialIcon>
);

const TwitterIcon = () => (
  <SocialIcon>
    <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.9-6.4L5.6 22H3l7.1-8.1L2 2h6.3l4.4 5.8L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
  </SocialIcon>
);

const LinkedinIcon = () => (
  <SocialIcon>
    <path d="M6.3 9.3H2.9V21h3.4V9.3zM4.6 3A2 2 0 1 0 4.6 7a2 2 0 0 0 0-4zM21 21h-3.4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H10V9.3h3.3v1.6h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.3V21z" />
  </SocialIcon>
);

const YoutubeIcon = () => (
  <SocialIcon>
    <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-4.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
  </SocialIcon>
);

const ContactBackground = () => (
  <div className="contact-background" aria-hidden="true">
    <div className="bg-radial-glow" />

    <div className="bg-dots bg-dots-left" />
    <div className="bg-dots bg-dots-right" />

    <svg className="bg-waves" viewBox="0 0 1440 600" preserveAspectRatio="none">
      <path fill="rgba(56, 189, 248, 0.04)" d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,234.7C672,267,768,277,864,245.3C960,213,1056,139,1152,117.3C1248,96,1344,128,1392,144L1440,160L1440,600L1392,600C1344,600,1248,600,1152,600C1056,600,960,600,864,600C768,600,672,600,576,600C480,600,384,600,288,600C192,600,96,600,48,600L0,600Z"></path>
      <path fill="rgba(187, 247, 208, 0.08)" d="M0,96L60,117.3C120,139,240,181,360,186.7C480,192,600,160,720,149.3C840,139,960,149,1080,160C1200,171,1320,181,1380,186.7L1440,192L1440,600L1380,600C1320,600,1200,600,1080,600C960,600,840,600,720,600C600,600,480,600,360,600C240,600,120,600,60,600L0,600Z"></path>
    </svg>

    <svg className="bg-ribbons" viewBox="0 0 1440 400" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="50%" stopColor="#4ade80" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-100,250 C300,-50 900,450 1540,100" fill="none" stroke="url(#ribbon-grad)" strokeWidth="8" />
      <path d="M-100,150 C400,-150 800,550 1540,50" fill="none" stroke="url(#ribbon-grad)" strokeWidth="4" opacity="0.6"/>
    </svg>

    <svg className="bg-globe" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="95" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2"/>
      <ellipse cx="100" cy="100" rx="40" ry="95" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2"/>
      <ellipse cx="100" cy="100" rx="75" ry="95" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2"/>
      <path d="M5,100 L195,100 M100,5 L100,195" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2" />
      <path d="M25,160 Q100,120 175,160 M25,40 Q100,80 175,40" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2" />
    </svg>

    <svg className="bg-leaves" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="leaf1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="leaf2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M180,200 C180,100 100,80 20,120 C70,180 130,200 180,200 Z" fill="url(#leaf1)" />
      <path d="M200,170 C150,110 80,110 40,160 C90,190 140,190 200,170 Z" fill="url(#leaf2)" />
    </svg>

    <div className="bg-plane-container">
      <svg className="bg-plane-trail" viewBox="0 0 400 150" preserveAspectRatio="none">
        <path d="M0,130 Q150,150 250,80 T400,20" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="6,6" opacity="0.5"/>
      </svg>
      <div className="bg-plane">
        <Send size={22} color="#f97316" />
      </div>
    </div>

    <div className="bg-icon bg-envelope"><Mail size={24} color="#38bdf8" /></div>
    <div className="bg-icon bg-bubble"><MessageSquare size={24} color="#4ade80" /></div>

    <div className="bg-bokeh bokeh-1" />
    <div className="bg-bokeh bokeh-2" />
    <div className="bg-bokeh bokeh-3" />
    <div className="bg-sparkle sparkle-1" />
    <div className="bg-sparkle sparkle-2" />
    <div className="bg-sparkle sparkle-3" />

    <div className="bg-card-glow glow-1" />
    <div className="bg-card-glow glow-2" />
  </div>
);

const ContactUs = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState('Fetching live address from map coordinates...');

  useEffect(() => {
    const match = MAP_EMBED_URL.match(/q=([0-9.]+),([0-9.]+)/);
    if (match) {
      const lat = match[1];
      const lon = match[2];
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress('Address could not be resolved from coordinates.');
          }
        })
        .catch(err => {
          console.error("Geocoding failed:", err);
          setAddress('Address could not be fetched (Network Error).');
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', mobile: '', email: '', message: '' });
  };

  return (
    <div className="contact-page-container">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="contact" />
      <ContactBackground />
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <h1>
            Let&apos;s Connect, Let&apos;s <span className="accent">Grow Together</span>
          </h1>
          <p>
            We&apos;re here to help you with any questions, feedback, or partnership opportunities.
          </p>
        </div>


      </section>

      <div className="contact-main">
        <article className="contact-card branch-card">
          <div className="branch-header">
            <div className="branch-icon">
              <Building2 size={22} />
            </div>
            <div>
              <span className="label">Branch Office</span>
              <span className="city">Vijayawada</span>
            </div>
          </div>

          <div className="branch-address">
            <MapPin size={18} />
            <p>{address}</p>
          </div>

          <div className="branch-map">
            <iframe
              title="FEED branch office location"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="maps-open-btn"
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="contact-details">
            <h3>Contact Details</h3>
            <a className="detail-row" href="tel:+919293858689">
              <Phone size={16} />
              +91 9293858689
            </a>
            <a className="detail-row" href="mailto:info@feedorg.com">
              <Mail size={16} />
              info@feedorg.com
            </a>
            <a
              className="detail-row"
              href="https://www.feedorg.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe size={16} />
              www.feedorg.com
            </a>
          </div>

          <div className="response-badge">
            <div className="badge-icon">
              <Headphones size={16} />
            </div>
            <p>
              We usually respond <span>within 24 hours!</span>
            </p>
          </div>
        </article>

        <article className="contact-card form-card">
          <h2>Get in Touch</h2>
          <div className="form-accent" />

          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-icon name">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-icon mobile">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span className="field-icon email">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field textarea-field">
              <span className="field-icon message">
                <MessageSquare size={16} />
              </span>
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="send-btn">
              <Send size={16} />
              Send Message
            </button>
          </form>

          <p className="privacy-note">
            <Lock size={13} />
            Your information is safe with us. We respect your privacy.
          </p>
          {submitted && (
            <p className="form-success">Thanks! Your message has been received.</p>
          )}
        </article>

        <aside className="contact-card social-rail">
          <h3>Connect with us</h3>
          <div className="social-rail-line" />
          <div className="social-links">
            <a className="social-link facebook" href="#" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a className="social-link instagram" href="#" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a className="social-link twitter" href="#" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a className="social-link linkedin" href="#" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a className="social-link youtube" href="#" aria-label="YouTube">
              <YoutubeIcon />
            </a>
          </div>
          <div className="social-footer">
            <div className="social-footer-icon">
              <Users size={20} />
            </div>
          </div>
        </aside>
      </div>

      <section className="contact-info-bar">
        <div className="info-item">
          <div className="info-icon hours">
            <Clock size={18} />
          </div>
          <div className="info-copy">
            <strong>Office Hours</strong>
            <p>Mon - Sat: 9:30 AM - 6:30 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon support">
            <Headphones size={18} />
          </div>
          <div className="info-copy">
            <strong>Quick Support</strong>
            <p>Call or email us anytime, we&apos;re happy to help.</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon partner">
            <HeartHandshake size={18} />
          </div>
          <div className="info-copy">
            <strong>Partnerships</strong>
            <p>Let&apos;s collaborate for a stronger tomorrow.</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon presence">
            <MapPin size={18} />
          </div>
          <div className="info-copy">
            <strong>Pan India Presence</strong>
            <p>Working across states to empower every stakeholder.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
