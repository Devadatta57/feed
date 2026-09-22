import React from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, FileText, ShieldCheck, Globe,
  Award, Truck, TrendingUp, Users, Building2, UserPlus, Quote
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmContentCoverage.css';

const EpmContentCoverage = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const topics = [
    {
      icon: <FileText size={22} />,
      title: 'Export Procedures & Documentation',
      desc: 'Step-by-step guidance on shipping bills, certificates of origin, letters of credit, and other paperwork exporters must get right the first time.',
      color: 'blue',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Quality & Packaging Standards',
      desc: 'Grading, packaging, and labelling practices that meet the expectations of international buyers and certification bodies.',
      color: 'green',
    },
    {
      icon: <Globe size={22} />,
      title: 'Market Access Requirements',
      desc: 'Country-specific import regulations, phytosanitary requirements, and certification norms for target export markets.',
      color: 'teal',
    },
    {
      icon: <Award size={22} />,
      title: 'Government Schemes & Incentives',
      desc: 'Clarity on subsidies, incentive schemes, and support programs available to exporters at the state and central level.',
      color: 'orange',
    },
    {
      icon: <Truck size={22} />,
      title: 'Logistics Planning',
      desc: 'Practical planning for freight, warehousing, cold chain, and last-mile movement of agricultural produce to ports.',
      color: 'purple',
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Pricing Strategies',
      desc: 'Cost structures, competitive pricing, and negotiating terms so producers capture fair value in every deal.',
      color: 'rose',
    },
  ];

  const process = [
    { num: '01', title: 'Topic Briefing', desc: 'An expert-led briefing introduces the regulatory or commercial topic with real examples relevant to the region.' },
    { num: '02', title: 'Case Walkthrough', desc: 'A real export case is worked through step by step so participants see the topic applied, not just explained.' },
    { num: '03', title: 'Open Q&A', desc: 'Participants raise specific questions relevant to their own commodities, markets, and documentation gaps.' },
    { num: '04', title: 'Reference Takeaways', desc: 'Reference material and checklists are shared for follow-up after the session ends.' },
  ];

  const stats = [
    { icon: <FileText size={20} />, value: '06', label: 'Core Topics Covered' },
    { icon: <Users size={20} />, value: '25+', label: 'EPMs Conducted' },
    { icon: <Building2 size={20} />, value: '10', label: 'Districts Covered' },
    { icon: <Award size={20} />, value: '500+', label: 'Stakeholders Engaged' },
  ];

  return (
    <div className="ecc-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <div className="ecc-container">

        {/* Header / Breadcrumb */}
        <div className="ecc-topbar">
          <button className="ecc-back-btn" onClick={() => onNavigate('epm')}>
            <ArrowLeft size={16} />
            Back to EPM Page
          </button>
          <div className="ecc-breadcrumb">
            <span onClick={() => onNavigate('epm')}>EPM</span>
            <span className="ecc-crumb-sep">/</span>
            <span className="ecc-crumb-active">Content Coverage</span>
          </div>
        </div>

        {/* Hero */}
        <section className="ecc-hero">
          <div className="ecc-hero-glow" />
          <span className="ecc-eyebrow"><Sparkles size={13} /> EPM Initiative &middot; Curriculum</span>
          <h1 className="ecc-title">
            Content Coverage of Export Promotional Meetings <span className="ecc-title-accent">(EPMs)</span>
          </h1>
          <p className="ecc-subtitle">
            Practical, ready-to-use knowledge covering every stage of the export journey,
            from documentation to pricing.
          </p>
        </section>

        {/* Mission statement */}
        <section className="ecc-mission-card">
          <Quote className="ecc-mission-watermark" size={64} fill="currentColor" />
          <p>
            Every Export Promotional Meeting is built around a structured curriculum, not a loose
            set of talks. Sessions cover export procedures and documentation, quality and packaging
            standards, market access requirements, applicable government schemes, logistics planning,
            and pricing strategies. Content is tailored to the districts and commodities represented,
            so participants leave with knowledge they can apply immediately, not just theory.
          </p>
          <p>
            Facilitators combine regulatory experts, successful exporters, and financial institutions
            to make sure each topic is covered from a compliance, commercial, and practical standpoint.
          </p>
        </section>

        {/* Core Coverage Grid */}
        <section className="ecc-section">
          <div className="ecc-section-head">
            <h2>What Every Session Covers</h2>
            <p>Six focus areas that make up the core EPM curriculum</p>
          </div>
          <div className="ecc-topics-grid">
            {topics.map((t, idx) => (
              <div key={idx} className={`ecc-topic-card ecc-topic-${t.color}`}>
                <div className="ecc-topic-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <span className="ecc-topic-divider" />
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process timeline */}
        <section className="ecc-section">
          <div className="ecc-section-head">
            <h2>How Each Session Is Structured</h2>
            <p>A consistent four-part format applied to every topic, in every region</p>
          </div>
          <div className="ecc-process-row">
            {process.map((step, idx) => (
              <div key={idx} className="ecc-process-step">
                <div className="ecc-process-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {idx < process.length - 1 && <span className="ecc-process-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Impact snapshot */}
        <section className="ecc-stats-strip">
          {stats.map((s, idx) => (
            <div key={idx} className="ecc-stat-item">
              <div className="ecc-stat-icon">{s.icon}</div>
              <div>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="ecc-cta-card">
          <div className="ecc-cta-orb orb-1" />
          <div className="ecc-cta-orb orb-2" />
          <div className="ecc-cta-content">
            <h2>Attend a Content Session</h2>
            <p>Sit in on export documentation, compliance, and pricing sessions at our next EPM.</p>
          </div>
          <div className="ecc-cta-actions">
            <button className="ecc-btn-primary" onClick={() => onNavigate('epm-details')}>
              <UserPlus size={16} /> View Upcoming EPMs
            </button>
            <button className="ecc-btn-outline" onClick={() => onNavigate('epm')}>
              Back to EPM Page <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default EpmContentCoverage;
