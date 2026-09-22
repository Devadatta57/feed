import React, { useState, useEffect, useRef } from 'react';
import {
  Quote, TrendingUp, Globe, Users, ChevronRight, ChevronLeft, Check,
  ShieldCheck, MapPin, Briefcase, IndianRupee, Sprout, Phone, FileText,
  Target, CreditCard, Star, Leaf
} from 'lucide-react';
import './SafeMissionTestimonialsJoin.css';

const TESTIMONIALS = [
  {
    name: 'Ramesh Naidu',
    role: 'Farmer, Vijayawada, AP',
    text: 'With multi-layer farming, my 14 acres now give year-round income. My earnings have 4x in just two years!',
    impactTitle: 'Income',
    impactValue: '4x',
    imageSrc: '/images/safe-mission/farmer_1.avif',
    Icon: IndianRupee,
  },
  {
    name: 'Lakshmi Devi',
    role: 'FPO Member, Guntur, AP',
    text: 'The packhouse and value-addition support helped us get better prices and direct market access. S.A.F.E. Mission really stands with farmers.',
    impactTitle: 'Prices',
    impactValue: 'Better',
    imageSrc: '/images/safe-mission/farmer_2.avif',
    Icon: Sprout,
  },
  {
    name: 'Kiran Reddy',
    role: 'Cooperative Member, Krishna, AP',
    text: 'Export opportunities through S.A.F.E. Mission opened global markets for our produce. Our cooperative is now financially stronger than ever.',
    impactTitle: 'Opportunities',
    impactValue: 'Global',
    imageSrc: '/images/safe-mission/farmer_3.avif',
    Icon: Globe,
  },
];

const IMPACT_STATS = [
  { value: '10,000+', label: 'Farmers Empowered', Icon: Users, tone: 'green' },
  { value: '25', label: 'Districts', Icon: MapPin, tone: 'orange' },
  { value: '5x', label: 'Avg. Income Growth', Icon: TrendingUp, tone: 'blue' },
  { value: 'Stronger', label: 'Rural Communities', Icon: ShieldCheck, tone: 'purple' },
];

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const StarRow = () => (
  <div className="sm-stars" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
    ))}
  </div>
);

const ImpactStats = () => (
  <div className="sm-impact-stats">
    {IMPACT_STATS.map(({ value, label, Icon, tone }) => (
      <div className={`sm-stat-item sm-tone-${tone}`} key={label}>
        <div className="sm-stat-icon"><Icon size={13} /></div>
        <div className="sm-stat-content">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      </div>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const [sectionRef, inView] = useInView();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setActive(index);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
  };

  const t = TESTIMONIALS[active];

  return (
    <div ref={sectionRef} className={`sm-testimonials-section ${inView ? 'sm-in-view' : ''}`}>
      <div className="sm-glow sm-glow-left" aria-hidden="true" />

      <div className="sm-testimonials-header">
        <span className="sm-header-eyebrow"><Users size={13} /> Our Farmers, Our Strength</span>
        <span className="sm-handwritten sm-handwritten-top">Stronger Farmers,<br />Brighter Tomorrows</span>
        <h2 className="sm-header-title">Real Farmers,<br /><span className="sm-title-accent">Real Impact</span></h2>
        <p className="sm-header-subtitle">Stories of progress, prosperity and pride — empowered through S.A.F.E. Mission.</p>
      </div>

      <div className="sm-testimonial-card" key={active}>
        <Quote className="sm-quote-mark" size={20} />
        <p className="sm-testimonial-text">{t.text}</p>
        <div className="sm-testimonial-author-row">
          <div className="sm-testimonial-author-left">
            <img src={t.imageSrc} alt={t.name} className="sm-testimonial-avatar" />
            <div className="sm-testimonial-author-info">
              <strong>{t.name}</strong>
              <span>{t.role}</span>
              <StarRow />
            </div>
          </div>
          <span className="sm-testimonial-badge">
            <t.Icon size={13} /> {t.impactValue} {t.impactTitle}
          </span>
        </div>
      </div>

      <div className="sm-testimonial-dots" role="tablist" aria-label="Testimonials">
        {TESTIMONIALS.map((item, i) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show testimonial from ${item.name}`}
            className={`sm-dot ${i === active ? 'sm-dot-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <ImpactStats />

      <div
        className="sm-landscape-strip"
        style={{ backgroundImage: 'url(/images/safe-mission/agri_bg.avif)' }}
      >
        <span className="sm-handwritten sm-landscape-caption">Together for a Sustainable Tomorrow</span>
      </div>
    </div>
  );
};

const BENEFITS = [
  { label: 'Higher Income', Icon: IndianRupee, tone: 'green' },
  { label: 'Tech Access', Icon: Briefcase, tone: 'orange' },
  { label: 'Global Markets', Icon: Globe, tone: 'blue' },
  { label: 'Cooperatives', Icon: Users, tone: 'purple' },
  { label: 'Greener Future', Icon: Sprout, tone: 'green' },
];

const MissionBenefits = () => (
  <div className="sm-mission-benefits">
    {BENEFITS.map(({ label, Icon, tone }) => (
      <div className={`sm-benefit-item sm-tone-${tone}`} key={label}>
        <div className="sm-benefit-icon-wrapper"><Icon size={15} /></div>
        <span>{label}</span>
      </div>
    ))}
  </div>
);

const STEPS = [
  { title: 'Basic Information', subtitle: 'Tell us about yourself', Icon: Users },
  { title: 'Additional Details', subtitle: 'Share details about your farming', Icon: Sprout },
  { title: 'Area & Membership', subtitle: 'Help us understand your interests', Icon: Target },
  { title: 'Review & Submit', subtitle: 'Your data is safe with us', Icon: ShieldCheck },
];

const initialFormData = {
  fullName: '',
  mobileNumber: '',
  village: '',
  state: '',
  landOwned: '',
  landOwnershipType: '',
  primaryCrops: '',
  interestedObjective: '',
  membershipStatus: '',
  agreeToTerms: false,
  aadhaarNumber: '',
};

const JoinSafeMission = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [sectionRef, inView] = useInView();
  const lastStep = STEPS.length - 1;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step < lastStep) {
      setStep((s) => s + 1);
      return;
    }
    console.log('Form Submitted:', formData);
    alert('Thank you for your interest! Your application has been submitted successfully.');
    setFormData(initialFormData);
    setStep(0);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div ref={sectionRef} className={`sm-join-section ${inView ? 'sm-in-view' : ''}`}>
      <div className="sm-glow sm-glow-right" aria-hidden="true" />

      <div className="sm-join-header">
        <span className="sm-header-eyebrow sm-eyebrow-orange"><Leaf size={13} /> Be Part of a Brighter Tomorrow</span>
        <span className="sm-handwritten sm-handwritten-top">Grow Together,<br />Go Further</span>
        <h2 className="sm-header-title">
          Join <span className="sm-title-accent">S.A.F.E.</span> Mission <Leaf className="sm-leaf-icon" size={24} />
        </h2>
        <p className="sm-header-subtitle">Sustainable Agriculture &amp; Farm Export Acceleration Mission</p>
      </div>

      <MissionBenefits />

      <div className="sm-stepper">
        <div className="sm-stepper-track">
          <div
            className="sm-stepper-track-fill"
            style={{ width: `${(step / lastStep) * 100}%` }}
          />
        </div>
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className={`sm-stepper-item ${i === step ? 'sm-stepper-active' : ''} ${i < step ? 'sm-stepper-done' : ''}`}
          >
            <div className="sm-stepper-circle">{i < step ? <Check size={14} /> : i + 1}</div>
            <span className="sm-stepper-label">{s.title}</span>
          </div>
        ))}
      </div>
      <p className="sm-stepper-progress-text">Step {step + 1} of {STEPS.length} &middot; {STEPS[step].subtitle}</p>

      <form className="sm-join-form" onSubmit={handleFormSubmit}>
        <div className="sm-step-panel" key={step}>
          <div className="sm-step-panel-header">
            <div className="sm-step-panel-icon">
              {React.createElement(STEPS[step].Icon, { size: 20 })}
            </div>
            <div>
              <h3 className="sm-step-title">{STEPS[step].title}</h3>
              <p className="sm-step-subtitle">{STEPS[step].subtitle}</p>
            </div>
            <span className="sm-step-panel-tag"><Sprout size={13} /> Small steps. A bigger future.</span>
          </div>

          {step === 0 && (
            <div className="sm-form-grid">
              <div className="sm-form-group">
                <label>Full Name *</label>
                <div className="sm-input-wrapper">
                  <Users size={18} className="sm-input-icon" />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                </div>
              </div>
              <div className="sm-form-group">
                <label>Mobile Number *</label>
                <div className="sm-input-wrapper">
                  <Phone size={18} className="sm-input-icon" />
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter 10-digit mobile number" pattern="[0-9]{10}" required />
                </div>
              </div>
              <div className="sm-form-group">
                <label>Village / District *</label>
                <div className="sm-input-wrapper">
                  <MapPin size={18} className="sm-input-icon" />
                  <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="Enter your village or district" required />
                </div>
              </div>
              <div className="sm-form-group">
                <label>State *</label>
                <div className="sm-input-wrapper">
                  <Globe size={18} className="sm-input-icon" />
                  <select name="state" value={formData.state} onChange={handleChange} required>
                    <option value="" disabled>Select state</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="sm-form-grid sm-grid-3">
              <div className="sm-form-group">
                <label>Land Owned (in acres) *</label>
                <div className="sm-input-wrapper">
                  <MapPin size={18} className="sm-input-icon" />
                  <input type="number" name="landOwned" value={formData.landOwned} onChange={handleChange} placeholder="Enter land size" required min="0" step="0.1" />
                </div>
              </div>
              <div className="sm-form-group">
                <label>Land Ownership Type *</label>
                <div className="sm-input-wrapper">
                  <FileText size={18} className="sm-input-icon" />
                  <select name="landOwnershipType" value={formData.landOwnershipType} onChange={handleChange} required>
                    <option value="" disabled>Select type</option>
                    <option value="Owned">Owned</option>
                    <option value="Leased">Leased</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>
              </div>
              <div className="sm-form-group">
                <label>Primary Crop(s) *</label>
                <div className="sm-input-wrapper">
                  <Sprout size={18} className="sm-input-icon" />
                  <input type="text" name="primaryCrops" value={formData.primaryCrops} onChange={handleChange} placeholder="e.g. Paddy, Mango, Chilli" required />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="sm-form-grid sm-grid-2">
              <div className="sm-form-group">
                <label>Interested Objective *</label>
                <div className="sm-input-wrapper">
                  <Target size={18} className="sm-input-icon" />
                  <select name="interestedObjective" value={formData.interestedObjective} onChange={handleChange} required>
                    <option value="" disabled>Select objective</option>
                    <option value="Increase Income">Increase Income</option>
                    <option value="Market Access">Better Market Access</option>
                    <option value="Export">Export Opportunities</option>
                    <option value="Technology">Farming Technology</option>
                  </select>
                </div>
              </div>
              <div className="sm-form-group">
                <label>FPO/Cooperative Membership *</label>
                <div className="sm-input-wrapper">
                  <Users size={18} className="sm-input-icon" />
                  <select name="membershipStatus" value={formData.membershipStatus} onChange={handleChange} required>
                    <option value="" disabled>Select membership status</option>
                    <option value="Member">Currently a Member</option>
                    <option value="Not Member">Not a Member</option>
                    <option value="Interested">Interested in Joining</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="sm-checkbox-group">
                <input type="checkbox" id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                <label htmlFor="agreeToTerms">
                  I agree to the use of my data for S.A.F.E. Mission programs and accept the <a href="#terms">terms &amp; conditions</a>. *
                </label>
              </div>

              <div className="sm-form-group sm-aadhaar-group">
                <label>Aadhaar Number (Optional)</label>
                <div className="sm-aadhaar-wrapper">
                  <div className="sm-input-wrapper">
                    <CreditCard size={18} className="sm-input-icon" />
                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="Enter 12-digit Aadhaar number" pattern="[0-9]{12}" />
                  </div>
                  <span className="sm-aadhaar-hint">Only if KYC-grade signup is needed</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sm-step-actions">
          {step > 0 ? (
            <button type="button" className="sm-btn-back" onClick={goBack}>
              <ChevronLeft size={18} /> Back
            </button>
          ) : <span />}

          {step < lastStep ? (
            <button type="submit" className="sm-btn-next">
              Continue <ChevronRight size={18} className="sm-btn-arrow" />
            </button>
          ) : (
            <button type="submit" className="sm-submit-btn">
              Join S.A.F.E. Mission <ChevronRight size={18} className="sm-btn-arrow" />
            </button>
          )}
        </div>
      </form>

      <div className="sm-security-badge">
        <ShieldCheck size={16} />
        <span>Your information is safe and secure with us.</span>
      </div>
    </div>
  );
};

const SafeMissionTestimonialsJoin = () => {
  return (
    <section className="sm-combined-section">
      <div className="sm-container">
        <TestimonialsSection />
        <JoinSafeMission />
      </div>
    </section>
  );
};

export default SafeMissionTestimonialsJoin;
