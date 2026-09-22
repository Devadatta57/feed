import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Store, 
  Factory, 
  Target, 
  Briefcase, 
  Package, 
  CreditCard, 
  Megaphone, 
  Headset, 
  Truck, 
  FileText, 
  Calendar, 
  Send, 
  Lock,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import './BusinessPlan.css';
import MyBusinessLayout from '../components/MyBusinessLayout';

import bpImg1 from '../assets/my-business/business_plan_icon.avif';
import bpImg2 from '../assets/my-business/capacity_building_icon.avif';

const solutions = [
  { id: 'trading', label: 'Trading', icon: <Store size={28} />, color: '#0ea5e9' },
  { id: 'production', label: 'Production', icon: <Factory size={28} />, color: '#64748b' },
  { id: 'strategy', label: 'Strategy', icon: <Target size={28} />, color: '#ef4444' },
  { id: 'consultancy', label: 'Consultancy', icon: <Briefcase size={28} />, color: '#10b981' },
  { id: 'distribution', label: 'Distribution', icon: <Package size={28} />, color: '#f59e0b' },
  { id: 'retail', label: 'Retail Sales', icon: <CreditCard size={28} />, color: '#3b82f6' },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone size={28} />, color: '#ec4899' },
  { id: 'support', label: 'Support Services', icon: <Headset size={28} />, color: '#06b6d4' },
  { id: 'logistics', label: 'Logistics', icon: <Truck size={28} />, color: '#8b5cf6' },
  { id: 'documentation', label: 'Documentation', icon: <FileText size={28} />, color: '#14b8a6' },
  { id: 'promotion', label: 'Promotion', icon: <Megaphone size={28} />, color: '#f43f5e' },
  { id: 'events', label: 'Events', icon: <Calendar size={28} />, color: '#f97316' },
];

export default function BusinessPlan({ onNavigate, isLoggedIn, user, onLogout }) {
  const [selectedSolution, setSelectedSolution] = useState('');
  const [message, setMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0));
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <MyBusinessLayout 
      onNavigate={onNavigate} 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={onLogout}
      currentTab="business-plan"
    >
      <div className="bp-container">
        {/* Page Header */}
        <div className="bp-header">
          <h1 className="bp-title">Business Plan</h1>
          <p className="bp-subtitle">Build a clear strategy for sustainable business growth.</p>
        </div>

        {/* Two-Column Workspace */}
        <div className="bp-workspace">
          
          {/* LEFT: Business Enquiry Form */}
          <div className="bp-enquiry-section">
            <div className="bp-form-card">
              <div className="bp-form-header">
                <div className="bp-form-icon-wrap">
                  <Headset size={24} color="#4f46e5" />
                </div>
                <div>
                  <h2 className="bp-form-title">Business Enquiry</h2>
                  <p className="bp-form-subtitle">We're here to help you grow your business</p>
                </div>
              </div>

              {/* Introduction Benefits */}
              <div className="bp-benefits-list">
                <div className="bp-benefit-item">
                  <CheckCircle2 size={18} className="bp-benefit-icon" />
                  <span>Create customized plans as per the requirement of the business</span>
                </div>
                <div className="bp-benefit-item">
                  <CheckCircle2 size={18} className="bp-benefit-icon" />
                  <span>Promotes operational &amp; financial sustainability</span>
                </div>
                <div className="bp-benefit-item">
                  <CheckCircle2 size={18} className="bp-benefit-icon" />
                  <span>Expert advice on Trading, Production &amp; Service categories</span>
                </div>
              </div>

              <div className="bp-divider"></div>

              {/* Form Fields */}
              <div className="bp-form-fields">
                <div className="bp-field-group">
                  <label>Contact Number</label>
                  <input type="tel" placeholder="Enter your contact number" className="bp-input" />
                </div>

                <div className="bp-field-group">
                  <label>Solution</label>
                  <select 
                    className="bp-input bp-select" 
                    value={selectedSolution}
                    onChange={(e) => setSelectedSolution(e.target.value)}
                  >
                    <option value="" disabled>Select a solution</option>
                    {solutions.map((sol) => (
                      <option key={sol.id} value={sol.id}>{sol.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bp-field-group">
                  <label>Message</label>
                  <textarea 
                    placeholder="Tell us about your business requirements..." 
                    className="bp-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                  ></textarea>
                  <div className="bp-char-counter">
                    {message.length} / 500
                  </div>
                </div>

                <button className="bp-submit-btn">
                  <Send size={18} />
                  <span>Send Enquiry Now</span>
                </button>

                <div className="bp-secure-text">
                  <Lock size={14} />
                  <span>Your information is secure and confidential</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Business Solutions Grid */}
          <div className="bp-solutions-section">
            <div className="bp-solutions-header">
              <h2 className="bp-solutions-title">How We Can <span>Help You</span></h2>
            </div>
            
            <div className="bp-image-slider-wrapper">
              <button className="bp-carousel-btn bp-prev" onClick={() => setCurrentSlide(prev => prev === 0 ? 1 : 0)}>
                <ChevronLeft size={24} />
              </button>
              
              <div className="bp-slider-container">
                <div 
                  className="bp-slider-track" 
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div className="bp-slide">
                    <img src={bpImg1} alt="Business Planning" className="bp-slide-image" />
                    <div className="bp-slide-caption">
                      <h4>Strategic Planning</h4>
                      <p>Expert guidance across trading, production, and service sectors.</p>
                    </div>
                  </div>
                  <div className="bp-slide">
                    <img src={bpImg2} alt="Capacity Building" className="bp-slide-image" />
                    <div className="bp-slide-caption">
                      <h4>Capacity Building</h4>
                      <p>Customized business plans to promote financial sustainability.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="bp-carousel-btn bp-next" onClick={() => setCurrentSlide(prev => prev === 0 ? 1 : 0)}>
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="bp-carousel-dots">
              <div className={`bp-dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></div>
              <div className={`bp-dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></div>
            </div>
          </div>
        </div>

        {/* Talk To Our Experts Banner */}
        <div className="bp-expert-banner">
          <div className="bp-expert-content">
            <div className="bp-expert-icon-wrap">
              <Headset size={32} color="#ffffff" />
            </div>
            <div className="bp-expert-text">
              <h3 className="bp-expert-title">Talk to Our Experts</h3>
              <p className="bp-expert-subtitle">Our team is ready to understand your requirements and provide the best solution for your business.</p>
            </div>
          </div>
          
          <div className="bp-expert-contact">
            <div className="bp-contact-info">
              <div className="bp-phone-icon-circle">
                <PhoneCall size={20} color="#4f46e5" />
              </div>
              <div>
                <div className="bp-phone-number">+91 98765 43210</div>
                <div className="bp-working-hours">Mon - Sat (10:00 AM - 6:00 PM)</div>
              </div>
            </div>
            <button className="bp-callback-btn">
              <PhoneCall size={18} />
              <span>Request a Callback</span>
            </button>
          </div>
        </div>

      </div>
    </MyBusinessLayout>
  );
}
