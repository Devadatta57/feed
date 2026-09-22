import React from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, Handshake, ShieldCheck, Users,
  Globe, Award, TrendingUp, Building2, UserPlus, Quote
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmBenefits.css';

const EpmBenefits = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const benefits = [
    {
      icon: <Handshake size={22} />,
      title: 'Direct Buyer Access',
      desc: 'Meet verified international and domestic buyers directly, without relying on multiple layers of intermediaries.',
      color: 'orange',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Compliance & Certification Support',
      desc: 'Get expert guidance on the certifications and compliance steps required for your specific commodity and target market.',
      color: 'green',
    },
    {
      icon: <Users size={22} />,
      title: 'Industry Networking',
      desc: 'Build relationships with fellow exporters, FPOs, financiers, and logistics partners who solve similar problems.',
      color: 'blue',
    },
    {
      icon: <Globe size={22} />,
      title: 'Market Identification',
      desc: 'Identify the right export markets for your products based on live demand signals shared at the meeting.',
      color: 'teal',
    },
    {
      icon: <Award size={22} />,
      title: 'Government Scheme Access',
      desc: 'Learn which government incentives and schemes apply to you, and exactly how to access them.',
      color: 'purple',
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Brand & Credibility Building',
      desc: 'Gain visibility and credibility with buyers and institutions by participating in a recognized promotional platform.',
      color: 'rose',
    },
  ];

  const process = [
    { num: '01', title: 'Register & Prepare', desc: 'Share your commodity and business profile ahead of the meeting so relevant buyers are matched to you.' },
    { num: '02', title: 'Engage On the Day', desc: 'Take part in structured sessions, buyer meetings, and dedicated networking blocks.' },
    { num: '03', title: 'Follow Up', desc: 'FEED tracks the leads and commitments made during the meeting and helps you follow up on them.' },
    { num: '04', title: 'Convert', desc: 'Turn introductions into signed orders, certifications, or approved scheme benefits.' },
  ];

  const stats = [
    { icon: <Award size={20} />, value: '06', label: 'Key Benefit Areas' },
    { icon: <Users size={20} />, value: '25+', label: 'EPMs Conducted' },
    { icon: <Building2 size={20} />, value: '10', label: 'Districts Covered' },
    { icon: <Handshake size={20} />, value: '500+', label: 'Stakeholders Engaged' },
  ];

  return (
    <div className="ebp-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <div className="ebp-container">

        {/* Header / Breadcrumb */}
        <div className="ebp-topbar">
          <button className="ebp-back-btn" onClick={() => onNavigate('epm')}>
            <ArrowLeft size={16} />
            Back to EPM Page
          </button>
          <div className="ebp-breadcrumb">
            <span onClick={() => onNavigate('epm')}>EPM</span>
            <span className="ebp-crumb-sep">/</span>
            <span className="ebp-crumb-active">Benefits of Participation</span>
          </div>
        </div>

        {/* Hero */}
        <section className="ebp-hero">
          <div className="ebp-hero-glow" />
          <span className="ebp-eyebrow"><Sparkles size={13} /> EPM Initiative &middot; Value For You</span>
          <h1 className="ebp-title">
            Benefits of Participation in Export Promotional Meetings <span className="ebp-title-accent">(EPMs)</span>
          </h1>
          <p className="ebp-subtitle">
            Real, measurable gains for every farmer, exporter, and institution that takes part.
          </p>
        </section>

        {/* Mission statement */}
        <section className="ebp-mission-card">
          <Quote className="ebp-mission-watermark" size={64} fill="currentColor" />
          <p>
            Participation in an EPM is designed to produce outcomes, not just information. Participants
            gain direct access to buyers, expert guidance on compliance and certification, valuable
            networking with industry leaders, and support in identifying the right export markets for
            their products. Every session is structured so attendees leave with a concrete next step —
            a buyer contact, a certification pathway, or a shortlisted export market.
          </p>
          <p>
            Benefits compound across meetings: participants who attend more than one EPM see stronger
            buyer relationships and faster resolution of compliance hurdles.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="ebp-section">
          <div className="ebp-section-head">
            <h2>What Participants Gain</h2>
            <p>Six concrete benefits delivered at every Export Promotional Meeting</p>
          </div>
          <div className="ebp-benefits-grid">
            {benefits.map((b, idx) => (
              <div key={idx} className={`ebp-benefit-card ebp-benefit-${b.color}`}>
                <div className="ebp-benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <span className="ebp-benefit-divider" />
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process timeline */}
        <section className="ebp-section">
          <div className="ebp-section-head">
            <h2>How Participants Turn Benefits Into Results</h2>
            <p>A consistent four-step journey from registration to a confirmed outcome</p>
          </div>
          <div className="ebp-process-row">
            {process.map((step, idx) => (
              <div key={idx} className="ebp-process-step">
                <div className="ebp-process-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {idx < process.length - 1 && <span className="ebp-process-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Impact snapshot */}
        <section className="ebp-stats-strip">
          {stats.map((s, idx) => (
            <div key={idx} className="ebp-stat-item">
              <div className="ebp-stat-icon">{s.icon}</div>
              <div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="ebp-cta-card">
          <div className="ebp-cta-orb orb-1" />
          <div className="ebp-cta-orb orb-2" />
          <div className="ebp-cta-content">
            <h2>Experience These Benefits Firsthand</h2>
            <p>Register for an upcoming EPM and start turning introductions into real business.</p>
          </div>
          <div className="ebp-cta-actions">
            <button className="ebp-btn-primary" onClick={() => onNavigate('epm-details')}>
              <UserPlus size={16} /> View Upcoming EPMs
            </button>
            <button className="ebp-btn-outline" onClick={() => onNavigate('epm')}>
              Back to EPM Page <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default EpmBenefits;
