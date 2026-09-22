import React from 'react';
import './ExportImportPolicy.css';
import { ChevronRight } from 'lucide-react';

const policyCards = [
  {
    id: 1,
    title: 'Agri-Export Policy',
    desc: 'Comprehensive guidelines and benefits for agricultural exports.',
    icon: '/icons/icon-agri-export.avif',
    color: 'green'
  },
  {
    id: 2,
    title: 'Foreign Trade Policy',
    desc: 'Strategic framework for boosting overall global trade.',
    icon: '/icons/icon-foreign-trade.avif',
    color: 'blue'
  },
  {
    id: 3,
    title: 'Export Policy',
    desc: 'Key regulations and incentives for outward shipments.',
    icon: '/icons/icon-export-policy.avif',
    color: 'orange'
  },
  {
    id: 4,
    title: 'Import Policy',
    desc: 'Guidelines, tariffs, and restrictions on inbound goods.',
    icon: '/icons/icon-import-policy.avif',
    color: 'purple'
  },
  {
    id: 5,
    title: 'State-wise Policy',
    desc: 'Regional policies and state-specific trade benefits.',
    icon: '/icons/icon-state-policy.avif',
    color: 'pink'
  },
  {
    id: 6,
    title: 'E-Commerce Policy',
    desc: 'Rules governing digital trade and cross-border e-commerce.',
    icon: '/icons/icon-ecommerce-policy.avif',
    color: 'teal'
  },
  {
    id: 7,
    title: 'HS Code-wise Policy',
    desc: 'Product-specific guidelines based on Harmonized System codes.',
    icon: '/icons/icon-hs-code.avif',
    color: 'yellow'
  },
  {
    id: 8,
    title: 'Import Regulations',
    desc: 'Mandatory compliance, quality standards, and customs rules.',
    icon: '/icons/icon-import-regulations.avif',
    color: 'blue-light'
  }
];

const ExportImportPolicy = () => {
  return (
    <main className="eip-main-content">
      <header className="eip-header">
        <div className="eip-header-titles">
          <h1>Export-Import Policy & Benefits</h1>
          <p>Explore comprehensive policies, guidelines, and benefits for your global trade journey.</p>
        </div>
      </header>

      <div className="eip-cards-grid">
        {policyCards.map((card, idx) => {
          const animations = ['eipSlideInFromLeft', 'eipSlideInFromTop', 'eipSlideInFromBottom', 'eipSlideInFromRight'];
          const animName = animations[idx % 4];
          const animDelay = `${Math.floor(idx / 4) * 0.1}s`;

          return (
            <div 
              className="eip-card" 
              key={card.id}
              style={{
                animation: `${animName} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${animDelay} backwards`
              }}
            >
              <div className="eip-card-icon-wrapper">
                <div className={`eip-icon-bg color-${card.color}`}>
                  <img src={card.icon} alt={card.title} className="eip-card-image" />
                </div>
              </div>
              <div className="eip-card-content">
                <h3>{card.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ExportImportPolicy;
