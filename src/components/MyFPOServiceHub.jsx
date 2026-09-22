import React, { useState } from 'react';
import {
  ShieldCheck, Users, Zap, TrendingUp, ArrowRight,
  FileCheck, Laptop, Briefcase, FileText, Calculator, Megaphone,
  PiggyBank, Umbrella, Truck, Scale, Globe2
} from 'lucide-react';
import MyToolsSidebar from './MyToolsSidebar';
import './MyFPOServiceHub.css';

const fpoServices = [
  { title: 'Statutory Registrations', description: 'Easy and fast registration for your FPO', image: '/images/statutory_registrations.avif', accent: 'green', icon: FileCheck, category: 'Compliance' },
  { title: 'Business Compliances', description: 'Stay compliant with all regulatory requirements', image: '/images/business_compliances.avif', accent: 'blue', icon: ShieldCheck, category: 'Compliance' },
  { title: 'Legal Services', description: 'Legal guidance and documentation support', image: '/images/legal_services.avif', accent: 'orange', icon: Scale, category: 'Compliance' },
  { title: 'Document Formats', description: 'Professional templates ready to use', image: '/images/document_formats.avif', accent: 'pink', icon: FileText, category: 'Compliance' },
  { title: 'Loan Services', description: 'Easy access to loans and financial support', image: '/images/loan_services.avif', accent: 'green', icon: PiggyBank, category: 'Finance' },
  { title: 'Insurance Services', description: 'Secure your business and your future', image: '/images/insurance_services.avif', accent: 'blue', icon: Umbrella, category: 'Finance' },
  { title: 'Calculators', description: 'Smart tools for quick business calculations', image: '/images/calculators.avif', accent: 'cyan', icon: Calculator, category: 'Finance' },
  { title: 'IT & Digital Marketing', description: 'Grow your reach with smart digital solutions', image: '/images/it_digital_marketing.avif', accent: 'purple', icon: Laptop, category: 'Growth' },
  { title: 'Marketing Services', description: 'Boost brand presence and market reach', image: '/images/marketing_services.avif', accent: 'yellow', icon: Megaphone, category: 'Growth' },
  { title: 'Industry Consultant', description: 'Expert advice for sustainable business growth', image: '/images/industry_consultant.avif', accent: 'orange', icon: Briefcase, category: 'Growth' },
  { title: 'Logistics Services', description: 'Efficient supply chain and logistics support', image: '/images/logistics_services.avif', accent: 'cyan', icon: Truck, category: 'Operations' },
  { title: 'Import & Export Services', description: 'Expand globally with import-export solutions', image: '/images/import_export_services.avif', accent: 'blue', icon: Globe2, category: 'Operations' },
];

const categories = ['All', 'Compliance', 'Finance', 'Growth', 'Operations'];

const benefits = [
  { title: 'Trusted & Secure', desc: '100% secure and reliable services', icon: ShieldCheck, color: '#16a34a', bg: '#dcfce7' },
  { title: 'Expert Support', desc: 'Professional guidance at every step', icon: Users, color: '#a855f7', bg: '#f3e8ff' },
  { title: 'Fast & Efficient', desc: 'Quick solutions for your business', icon: Zap, color: '#3b82f6', bg: '#dbeafe' },
  { title: 'Grow Your Business', desc: 'Tools and services to scale higher', icon: TrendingUp, color: '#eab308', bg: '#fef9c3' }
];

const MyFPOServiceHub = ({ onNavigate, onSelectTool }) => {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const visibleServices = activeCategory === 'All'
    ? fpoServices
    : fpoServices.filter((s) => s.category === activeCategory);

  return (
    <div className="fpo-hub-layout">
      <MyToolsSidebar activeId="fpo" onSelectTool={onSelectTool} onNavigate={onNavigate} />

      <div className="fpo-hub-container">
        <div className="fpo-hub-content-wrap">

          {/* Category filters */}
          <div className="fpo-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`fpo-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Grid */}
          <div className="fpo-hub-grid">
            {visibleServices.map((service, idx) => {
              const Icon = service.icon;
              const isSelected = selected === service.title;
              return (
                <div
                  key={service.title}
                  className={`fpo-service-card accent-${service.accent}${isSelected ? ' selected' : ''}`}
                  style={{ animationDelay: `${idx * 0.045}s` }}
                  onClick={() => setSelected(isSelected ? null : service.title)}
                >
                  <div className="fpo-service-media">
                    <img src={service.image} alt={service.title} className="fpo-service-image" />
                    <span className="fpo-service-tag">{service.category}</span>
                    <span className="fpo-service-badge">
                      <Icon size={18} strokeWidth={2.25} />
                    </span>
                  </div>

                  <div className="fpo-service-content">
                    <h3 className="fpo-service-title">{service.title}</h3>
                    <p className="fpo-service-desc">{service.description}</p>
                    <div className="fpo-service-foot">
                      <span className="fpo-service-action">Explore</span>
                      <span className="fpo-service-arrow">
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="fpo-hub-benefits">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div className="fpo-benefit-item" key={idx}>
                  <div className="fpo-benefit-icon" style={{ backgroundColor: item.bg, color: item.color }}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="fpo-benefit-text">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyFPOServiceHub;
