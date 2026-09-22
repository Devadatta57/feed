import React, { useState } from 'react';
import {
  Ship, Search, QrCode, UserCheck, Plane, Truck, Banknote, ShieldCheck,
  FileDown, Calculator, ClipboardCheck, ListChecks, Briefcase, Megaphone, Scale,
  ArrowRight
} from 'lucide-react';
import MyToolsSidebar from './MyToolsSidebar';
import './ExportsHub.css';

const exportServices = [
  { id: 1, title: 'HSN Code Search', description: 'Search and find the right HSN codes for your products instantly.', icon: QrCode, accent: 'red' },
  { id: 2, title: 'CHA', description: 'Connect with trusted Custom House Agents for smooth clearance.', icon: UserCheck, accent: 'teal' },
  { id: 3, title: 'Freight Forward', description: 'Reliable freight forwarding services to move your goods across the globe.', icon: Plane, accent: 'blue' },
  { id: 4, title: 'Logistics Services', description: 'End-to-end logistics solutions tailored to your business needs.', icon: Truck, accent: 'purple' },
  { id: 5, title: 'Loan Services', description: 'Access export financing and working capital for your business growth.', icon: Banknote, accent: 'orange' },
  { id: 6, title: 'Insurance Services', description: 'Protect your shipments with comprehensive insurance solutions.', icon: ShieldCheck, accent: 'cyan' },
  { id: 7, title: 'Document Formats', description: 'Download commonly used export document formats and templates.', icon: FileDown, accent: 'blue-alt' },
  { id: 8, title: 'Calculators', description: 'Use smart calculators for duties, taxes, margins and more.', icon: Calculator, accent: 'pink' },
  { id: 9, title: 'Statutory Registrations', description: 'Get guidance on required registrations for export business.', icon: ClipboardCheck, accent: 'orange-alt' },
  { id: 10, title: 'Business Compliances', description: 'Stay compliant with every export regulation and requirement.', icon: ListChecks, accent: 'blue-dark' },
  { id: 11, title: 'Industry Consultant', description: 'Get expert advice from industry specialists for your export journey.', icon: Briefcase, accent: 'coral' },
  { id: 12, title: 'IT & Digital Marketing', description: 'Boost your global presence with digital marketing solutions.', icon: Megaphone, accent: 'green' },
  { id: 13, title: 'Legal Services', description: 'Legal support for contracts, agreements and dispute resolutions.', icon: Scale, accent: 'purple-alt' },
];

const ExportsHub = ({ onNavigate, onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = exportServices.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="exports-hub-layout">
      <MyToolsSidebar activeId="exports" onSelectTool={onSelectTool} onNavigate={onNavigate} />

      <div className="exports-hub-container">
        
        {/* EXPORTS HEADER */}
        <div className="exports-header-section">
          
          <div className="exports-header-content">
            <div className="exports-badge">
              <Ship size={14} className="exports-badge-icon" />
              <span>EXPORTS</span>
            </div>
            
            <h1 className="exports-main-title">
              Simplifying <span className="text-highlight">Global Exports</span>
            </h1>
            
            <p className="exports-subtitle">
              All the tools and services you need to expand your business worldwide
            </p>
            <div className="exports-header-underline"></div>

            {/* SEARCH BAR */}
            <div className="exports-search-wrapper">
              <Search size={18} className="exports-search-icon" />
              <input 
                type="text" 
                placeholder="Search export services, tools and more..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="exports-header-illustration">
            <img src="/images/exports_header_illustration.avif" alt="Global Exports illustration" />
          </div>

        </div>

        {/* SERVICES GRID */}
        <div className="exports-services-wrapper">
          {filteredServices.length > 0 ? (
            <div className="exports-services-grid">
              {filteredServices.map((service, idx) => {
                const animDirections = ['slideInTop', 'slideInRight', 'slideInBottom', 'slideInLeft'];
                const animDir = animDirections[idx % 4];
                const delay = (idx * 0.05) + 's';
                const Icon = service.icon;
                return (
                  <div 
                    key={service.id} 
                    className={`exports-service-card color-${service.accent}`}
                    style={{ animation: `${animDir} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay} both` }}
                    onClick={() => {
                      // Navigate to corresponding page if needed or stay within
                      console.log("Clicked", service.title);
                    }}
                  >
                    <div className="exports-card-icon-wrapper">
                      <Icon size={32} className="exports-card-icon" />
                    </div>
                    <h3 className="exports-card-title">{service.title}</h3>
                    <p className="exports-card-desc">{service.description}</p>
                    <button className="exports-card-arrow-btn">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="exports-empty-state">
              <p>No services found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExportsHub;
