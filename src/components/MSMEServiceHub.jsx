import React, { useState } from 'react';
import {
  Search, ArrowRight, FileCheck, ClipboardCheck, Megaphone,
  Briefcase, FileText, Calculator, TrendingUp, Landmark,
  ShieldCheck, Truck, Scale, Ship, Users
} from 'lucide-react';
import MyToolsSidebar from './MyToolsSidebar';
import './MSMEServiceHub.css';

const msmeServices = [
  { 
    title: 'Statutory Registrations', 
    description: 'Register your business and stay compliant with ease.', 
    icon: FileCheck, 
    color: '#3b82f6', 
    bg: '#eff6ff' 
  },
  { 
    title: 'Business Compliances', 
    description: 'Manage all regulatory compliances in one place.', 
    icon: ClipboardCheck, 
    color: '#16a34a', 
    bg: '#f0fdf4' 
  },
  { 
    title: 'IT & Digital Marketing', 
    description: 'Boost your online presence and reach more customers.', 
    icon: Megaphone, 
    color: '#f97316', 
    bg: '#fff7ed' 
  },
  { 
    title: 'Industry Consultant', 
    description: 'Get expert guidance tailored to your industry.', 
    icon: Briefcase, 
    color: '#8b5cf6', 
    bg: '#f5f3ff' 
  },
  { 
    title: 'Document Formats', 
    description: 'Download ready-to-use document templates.', 
    icon: FileText, 
    color: '#2563eb', 
    bg: '#eff6ff' 
  },
  { 
    title: 'Calculators', 
    description: 'Smart calculators for your business needs.', 
    icon: Calculator, 
    color: '#ec4899', 
    bg: '#fdf2f8' 
  },
  { 
    title: 'Marketing Services', 
    description: 'Promote your business with result-driven strategies.', 
    icon: TrendingUp, 
    color: '#22c55e', 
    bg: '#f0fdf4' 
  },
  { 
    title: 'Loan Services', 
    description: 'Explore financing options for your business growth.', 
    icon: Landmark, 
    color: '#0ea5e9', 
    bg: '#f0f9ff' 
  },
  { 
    title: 'Insurance Services', 
    description: 'Secure your business with the right insurance plans.', 
    icon: ShieldCheck, 
    color: '#a855f7', 
    bg: '#faf5ff' 
  },
  { 
    title: 'Logistics Services', 
    description: 'Reliable logistics solutions for smooth operations.', 
    icon: Truck, 
    color: '#f59e0b', 
    bg: '#fffbeb' 
  },
  { 
    title: 'Legal Services', 
    description: 'Legal support for contracts, agreements & more.', 
    icon: Scale, 
    color: '#eab308', 
    bg: '#fefce8' 
  },
  { 
    title: 'Import & Export Services', 
    description: 'Expand your business globally with ease.', 
    icon: Ship, 
    color: '#14b8a6', 
    bg: '#f0fdfa' 
  },
];

const MSMEServiceHub = ({ onNavigate, onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = msmeServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="msme-hub-layout">
      {/* Left Sidebar */}
      <MyToolsSidebar activeId="msme" onSelectTool={onSelectTool} onNavigate={onNavigate} />

      {/* Right Content Area */}
      <div className="msme-hub-container">
        

        {/* Hero Section */}
        <div className="msme-hero-section">
          
          <div className="msme-hero-content">
            <div className="msme-hero-top-row">
              <h1 className="msme-hero-title">
                Empowering MSMEs
              </h1>
              <div className="msme-hero-pill">
                <span className="star-icon">★</span> One Stop Solution for Every Business
              </div>
            </div>
            
            <h2 className="msme-hero-subtitle">
              Building Businesses, Strengthening <span className="highlight-text">Bharat</span>
            </h2>
            
            <p className="msme-hero-desc">
              All the essential services and tools to start, manage and grow your business
            </p>
            
            <div className="msme-search-bar">
              <Search className="msme-search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search services, tools and more..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="msme-search-btn">
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="msme-hero-illustration">
            <img src="/images/msme_compact_illustration.avif" alt="MSME Business Growth" className="msme-hero-img" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="msme-services-section">
          {filteredServices.length > 0 ? (
            <div className="msme-services-grid">
              {filteredServices.map((service, idx) => {
                const Icon = service.icon;
                const animationClasses = ['msme-slide-left', 'msme-slide-top', 'msme-slide-bottom', 'msme-slide-right'];
                const animClass = animationClasses[idx % animationClasses.length];
                return (
                  <div 
                    key={service.title} 
                    className={`msme-service-card ${animClass}`}
                    onClick={() => console.log('Navigate to:', service.title)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="msme-service-icon-wrap" style={{ backgroundColor: service.bg, color: service.color }}>
                      <Icon size={32} strokeWidth={2} />
                    </div>
                    <div className="msme-service-content">
                      <h3 className="msme-service-title">{service.title}</h3>
                      <p className="msme-service-desc">{service.description}</p>
                    </div>
                    <button className="msme-service-arrow" style={{ backgroundColor: service.color }}>
                      <ArrowRight size={16} color="white" strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="msme-no-results">
              <Search size={48} color="#94a3b8" />
              <h3>No services found</h3>
              <p>Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MSMEServiceHub;
