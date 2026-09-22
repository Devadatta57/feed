import React from 'react';
import { ClipboardList, FileSignature, Files, Send } from 'lucide-react';
import './HowToStartExports.css';

const processCards = [
  {
    id: 'order',
    title: 'How do I proceed with an export order?',
    desc: 'Learn the initial steps, verifications, and compliance requirements to accept and process an international order.',
    icon: ClipboardList,
    colorClass: 'icon-blue'
  },
  {
    id: 'customs',
    title: 'What are the documents to be submitted to Customs?',
    desc: 'Understand the mandatory shipping bills, commercial invoices, and packing lists required for customs clearance.',
    icon: FileSignature,
    colorClass: 'icon-teal'
  },
  {
    id: 'negotiable',
    title: 'What are Negotiable set of documents?',
    desc: 'Details on Bill of Lading, Letter of Credit, and other financial instruments crucial for secure export trade.',
    icon: Files,
    colorClass: 'icon-purple'
  },
  {
    id: 'advice',
    title: 'How do I send export advice to importer?',
    desc: 'Guidelines on communicating shipment dispatch, tracking details, and document handover to your overseas buyer.',
    icon: Send,
    colorClass: 'icon-orange'
  }
];

const HowToStartExports = () => {
  return (
    <div className="htse-container">
      {/* Hero Section */}
      <section className="htse-hero">
        <div className="htse-hero-overlay"></div>
        <div className="htse-hero-content">
          <h1 className="htse-hero-title">How to Start Export</h1>
          <p className="htse-hero-subtitle">
            Comprehensive guide on export process starting from registration of company to claiming the export incentives from government
          </p>
        </div>
        {/* Elegant SVG wave transition */}
        <div className="htse-hero-wave">
          <svg preserveAspectRatio="none" viewBox="0 0 1440 100">
            <path d="M0,50 C320,150 420,-50 1440,50 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="htse-intro">
        <h2 className="htse-intro-title">Starting Exports</h2>
        <p className="htse-intro-text">
          Export process is a tedious process with numerous documents to be submitted to different authorities at different point of time. We provide step-by-step guidance throughout the export process along with the usage and importance of each and every document used in the export process.
        </p>
      </section>

      {/* Process Options Grid */}
      <section className="htse-process-section">
        <h2 className="htse-process-heading">What are the preliminary requirements to start exports?</h2>
        
        <div className="htse-grid">
          {processCards.map((card) => (
            <div 
              key={card.id} 
              className="htse-card"
            >
              <div className={`htse-icon-wrap ${card.colorClass}`}>
                <card.icon size={32} />
              </div>
              <div className="htse-card-content">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowToStartExports;
