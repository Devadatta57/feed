import React from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, Leaf, Ship, Globe,
  Building2, ShieldCheck, Truck, Users, Award, UserPlus, Quote
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmInvitees.css';

const EpmInvitees = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const invitees = [
    {
      icon: <Leaf size={22} />,
      title: 'Farmers & FPOs',
      desc: 'Individual farmers and Farmer Producer Organisations producing export-ready agricultural commodities.',
      color: 'green',
    },
    {
      icon: <Ship size={22} />,
      title: 'Exporters & Traders',
      desc: 'Established exporters and traders looking to expand sourcing networks and enter new markets.',
      color: 'purple',
    },
    {
      icon: <Globe size={22} />,
      title: 'Importers & Global Buyers',
      desc: 'International buyers and importers actively sourcing Indian agricultural produce.',
      color: 'blue',
    },
    {
      icon: <Building2 size={22} />,
      title: 'Trade Associations',
      desc: 'Industry bodies and trade associations representing sector-wide interests and standards.',
      color: 'teal',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Government Officials',
      desc: 'Representatives from agriculture, commerce, and export-promotion departments.',
      color: 'orange',
    },
    {
      icon: <Truck size={22} />,
      title: 'Banking & Logistics Partners',
      desc: 'Financial institutions and logistics providers enabling trade finance and the movement of goods.',
      color: 'rose',
    },
  ];

  const process = [
    { num: '01', title: 'Map the Region', desc: 'Identify export-ready commodities and districts for the upcoming EPM.' },
    { num: '02', title: 'Identify Stakeholders', desc: 'Shortlist farmers, exporters, buyers, and officials relevant to those commodities.' },
    { num: '03', title: 'Curate the Room', desc: 'Balance the invite list so every stakeholder group in the value chain is represented.' },
    { num: '04', title: 'Confirm & Brief', desc: 'Confirm attendance and share a briefing so every invitee arrives prepared to engage.' },
  ];

  const stats = [
    { icon: <Award size={20} />, value: '06', label: 'Invitee Categories' },
    { icon: <Users size={20} />, value: '500+', label: 'Stakeholders Engaged' },
    { icon: <Building2 size={20} />, value: '10', label: 'Districts Covered' },
    { icon: <Ship size={20} />, value: '25+', label: 'EPMs Conducted' },
  ];

  return (
    <div className="ein-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <div className="ein-container">

        {/* Header / Breadcrumb */}
        <div className="ein-topbar">
          <button className="ein-back-btn" onClick={() => onNavigate('epm')}>
            <ArrowLeft size={16} />
            Back to EPM Page
          </button>
          <div className="ein-breadcrumb">
            <span onClick={() => onNavigate('epm')}>EPM</span>
            <span className="ein-crumb-sep">/</span>
            <span className="ein-crumb-active">Invitees</span>
          </div>
        </div>

        {/* Hero */}
        <section className="ein-hero">
          <div className="ein-hero-glow" />
          <span className="ein-eyebrow"><Sparkles size={13} /> EPM Initiative &middot; Who Attends</span>
          <h1 className="ein-title">
            Invitees to Export Promotional Meetings <span className="ein-title-accent">(EPMs)</span>
          </h1>
          <p className="ein-subtitle">
            A curated mix of stakeholders from across the agri-export value chain.
          </p>
        </section>

        {/* Mission statement */}
        <section className="ein-mission-card">
          <Quote className="ein-mission-watermark" size={64} fill="currentColor" />
          <p>
            EPMs are only as valuable as the people in the room. Each meeting brings together farmers,
            FPOs, exporters, importers, trade associations, government officials, and banking and
            logistics partners from across the agri-export value chain. Invitees are selected based on
            the commodities and districts being featured, so every conversation is relevant to the
            people having it.
          </p>
          <p>
            This curated mix is what turns an EPM from an information session into a working
            marketplace of ideas, capital, and commitments.
          </p>
        </section>

        {/* Invitee categories grid */}
        <section className="ein-section">
          <div className="ein-section-head">
            <h2>Who Attends an EPM</h2>
            <p>Six stakeholder groups brought together at every meeting</p>
          </div>
          <div className="ein-invitees-grid">
            {invitees.map((inv, idx) => (
              <div key={idx} className={`ein-invitee-card ein-invitee-${inv.color}`}>
                <div className="ein-invitee-icon">{inv.icon}</div>
                <h3>{inv.title}</h3>
                <span className="ein-invitee-divider" />
                <p>{inv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process timeline */}
        <section className="ein-section">
          <div className="ein-section-head">
            <h2>How Invitees Are Selected</h2>
            <p>A consistent four-step process for curating every EPM guest list</p>
          </div>
          <div className="ein-process-row">
            {process.map((step, idx) => (
              <div key={idx} className="ein-process-step">
                <div className="ein-process-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {idx < process.length - 1 && <span className="ein-process-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Impact snapshot */}
        <section className="ein-stats-strip">
          {stats.map((s, idx) => (
            <div key={idx} className="ein-stat-item">
              <div className="ein-stat-icon">{s.icon}</div>
              <div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="ein-cta-card">
          <div className="ein-cta-orb orb-1" />
          <div className="ein-cta-orb orb-2" />
          <div className="ein-cta-content">
            <h2>Join as an Invitee</h2>
            <p>Whether you farm, export, buy, or finance trade, there is a seat for you at the next EPM.</p>
          </div>
          <div className="ein-cta-actions">
            <button className="ein-btn-primary" onClick={() => onNavigate('epm-details')}>
              <UserPlus size={16} /> View Upcoming EPMs
            </button>
            <button className="ein-btn-outline" onClick={() => onNavigate('epm')}>
              Back to EPM Page <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default EpmInvitees;
