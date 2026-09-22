import React from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, Target, Globe, HeartHandshake,
  BookOpen, Handshake, ShieldCheck, Users, TrendingUp, Award, Building2,
  Quote, UserPlus
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmObjective.css';

const EpmObjective = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const objectives = [
    {
      icon: <Globe size={22} />,
      title: 'Market Access & Expansion',
      desc: 'Open direct channels between local producers and international buyers by identifying demand-ready markets for high-potential agricultural commodities.',
      color: 'green',
    },
    {
      icon: <HeartHandshake size={22} />,
      title: 'Stakeholder Collaboration',
      desc: 'Bring farmers, FPOs, exporters, financiers, and government departments onto one platform to align efforts and close coordination gaps.',
      color: 'blue',
    },
    {
      icon: <BookOpen size={22} />,
      title: 'Knowledge & Capacity Building',
      desc: 'Equip participants with practical knowledge of export documentation, quality standards, certification, and pricing so they can trade with confidence.',
      color: 'orange',
    },
    {
      icon: <Handshake size={22} />,
      title: 'Direct Buyer–Seller Linkages',
      desc: 'Facilitate structured B2B interactions that convert first introductions into signed commitments and repeat business.',
      color: 'purple',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Policy & Scheme Awareness',
      desc: 'Create clarity around government export incentives, subsidies, and compliance requirements relevant to each region and commodity.',
      color: 'teal',
    },
    {
      icon: <Target size={22} />,
      title: 'Ecosystem Problem-Solving',
      desc: 'Surface on-ground challenges such as logistics, storage, and pricing volatility, and route them to the right authorities for resolution.',
      color: 'rose',
    },
  ];

  const process = [
    { num: '01', title: 'Identify & Convene', desc: 'Select export-ready districts and commodities, then invite exporters, farmers, and government stakeholders relevant to that region.' },
    { num: '02', title: 'Facilitate Dialogue', desc: 'Host structured sessions covering export procedures, quality standards, and live market opportunities.' },
    { num: '03', title: 'Match & Connect', desc: 'Pair farmers and exporters with buyers, financiers, and certification bodies for direct, on-the-spot conversations.' },
    { num: '04', title: 'Track & Follow Up', desc: 'Document every outcome and follow up on commitments until they convert into confirmed trade.' },
  ];

  const stats = [
    { icon: <Users size={20} />, value: '25+', label: 'EPMs Conducted' },
    { icon: <Building2 size={20} />, value: '10', label: 'Districts Covered' },
    { icon: <Award size={20} />, value: '500+', label: 'Stakeholders Engaged' },
    { icon: <Target size={20} />, value: '06', label: 'Core Objectives' },
  ];

  return (
    <div className="eo-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <div className="eo-container">

        {/* Header / Breadcrumb */}
        <div className="eo-topbar">
          <button className="eo-back-btn" onClick={() => onNavigate('epm')}>
            <ArrowLeft size={16} />
            Back to EPM Page
          </button>
          <div className="eo-breadcrumb">
            <span onClick={() => onNavigate('epm')}>EPM</span>
            <span className="eo-crumb-sep">/</span>
            <span className="eo-crumb-active">Objective</span>
          </div>
        </div>

        {/* Hero */}
        <section className="eo-hero">
          <div className="eo-hero-glow" />
          <span className="eo-eyebrow"><Sparkles size={13} /> EPM Initiative &middot; Our Purpose</span>
          <h1 className="eo-title">
            Objective of Export Promotional Meetings <span className="eo-title-accent">(EPMs)</span>
          </h1>
          <p className="eo-subtitle">
            Bringing exporters, farmers, buyers, and institutions onto one platform to unlock
            India&rsquo;s agricultural export potential.
          </p>
        </section>

        {/* Mission statement */}
        <section className="eo-mission-card">
          <Quote className="eo-mission-watermark" size={64} fill="currentColor" />
          <p>
            Export Promotional Meetings (EPMs) are structured platforms that bring together exporters,
            buyers, farmers, cooperatives, government bodies, and industry stakeholders to create meaningful
            business opportunities. Conducted across key agricultural regions, these meetings are designed to
            promote agricultural products, explore new and emerging markets, strengthen partnerships across
            the value chain, and collectively address the operational and regulatory challenges that hold back
            India&rsquo;s export ecosystem.
          </p>
          <p>
            Each EPM is curated as a working session, not a ceremonial gathering, with clear outcomes in mind:
            new buyer connections, documented action points, and a shared roadmap for the districts and
            commodities involved.
          </p>
        </section>

        {/* Core Objectives Grid */}
        <section className="eo-section">
          <div className="eo-section-head">
            <h2>Core Objectives</h2>
            <p>Six focus areas that guide every Export Promotional Meeting we conduct</p>
          </div>
          <div className="eo-objectives-grid">
            {objectives.map((obj, idx) => (
              <div key={idx} className={`eo-obj-card eo-obj-${obj.color}`}>
                <div className="eo-obj-icon">{obj.icon}</div>
                <h3>{obj.title}</h3>
                <span className="eo-obj-divider" />
                <p>{obj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process timeline */}
        <section className="eo-section">
          <div className="eo-section-head">
            <h2>How EPMs Deliver on This Objective</h2>
            <p>A consistent four-step approach applied at every meeting, in every region</p>
          </div>
          <div className="eo-process-row">
            {process.map((step, idx) => (
              <div key={idx} className="eo-process-step">
                <div className="eo-process-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {idx < process.length - 1 && <span className="eo-process-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Impact snapshot */}
        <section className="eo-stats-strip">
          {stats.map((s, idx) => (
            <div key={idx} className="eo-stat-item">
              <div className="eo-stat-icon">{s.icon}</div>
              <div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="eo-cta-card">
          <div className="eo-cta-orb orb-1" />
          <div className="eo-cta-orb orb-2" />
          <div className="eo-cta-content">
            <h2>Be Part of the Next EPM</h2>
            <p>Register as a participant or explore how your business can benefit from our upcoming meetings.</p>
          </div>
          <div className="eo-cta-actions">
            <button className="eo-btn-primary" onClick={() => onNavigate('epm-details')}>
              <UserPlus size={16} /> View Upcoming EPMs
            </button>
            <button className="eo-btn-outline" onClick={() => onNavigate('epm')}>
              Back to EPM Page <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default EpmObjective;
