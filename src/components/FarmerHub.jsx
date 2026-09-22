import React from 'react';
import { Leaf, ShieldCheck, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import MyToolsSidebar from './MyToolsSidebar';
import './MyFPOServiceHub.css';
import './FarmerHub.css';

const primaryTools = [
  { title: 'Crop Expenditure Tool', description: 'Plan and track your crop expenses effectively.', image: '/images/farmer/crop_expenditure.svg' },
  { title: 'Crop Advisory', description: 'Get expert advice for better crop health and yield.', image: '/images/farmer/crop_advisory.svg' },
  { title: 'Farm Equipment', description: 'Find and compare the best equipment for your farm.', image: '/images/farmer/farm_equipment.svg' },
  { title: 'Find Dealers', description: 'Connect with trusted dealers near your location.', image: '/images/farmer/find_dealers.svg' },
  { title: 'Value Addition Units', description: 'Explore nearby value addition units.', image: '/images/farmer/value_addition.svg' },
  { title: 'Fertilizer Calculator', description: 'Calculate the right amount of fertilizers.', image: '/images/farmer/fertilizer_calculator.svg' },
];

const secondaryTools = [
  { title: 'Marketing Services', description: 'Promote and sell your produce easily.', image: '/images/marketing_services.avif' },
  { title: 'Loan Services', description: 'Access easy loans for your agricultural needs.', image: '/images/loan_services.avif' },
  { title: 'Insurance Services', description: 'Protect your crops and secure your future.', image: '/images/insurance_services.avif' },
  { title: 'Logistics Services', description: 'Reliable logistics solutions for your produce.', image: '/images/logistics_services.avif' },
];

const benefits = [
  { title: 'Trusted & Secure', desc: '100% safe and reliable services', icon: ShieldCheck, color: '#16a34a', bg: '#dcfce7' },
  { title: 'Expert Support', desc: 'Get guidance from industry experts', icon: Users, color: '#a855f7', bg: '#f3e8ff' },
  { title: 'Time Saving', desc: 'Smart tools to save your time', icon: Clock, color: '#3b82f6', bg: '#dbeafe' },
  { title: 'Grow Better', desc: 'Make informed decisions and grow', icon: TrendingUp, color: '#f97316', bg: '#ffedd5' },
];

const FarmerHub = ({ onNavigate, onSelectTool }) => {
  return (
    <div className="fpo-hub-layout">
      <MyToolsSidebar activeId="farmer" onSelectTool={onSelectTool} onNavigate={onNavigate} />

      <div className="farmer-hub">
        {/* Hero */}
        <div className="farmer-hero">
          <div className="farmer-hero-bg" />
          <div className="farmer-hero-fade" />

          <div className="farmer-hero-inner">
            <div className="farmer-badge">
              <Leaf size={15} strokeWidth={2.5} color="#16a34a" />
              <span>Welcome, <strong>Farmer</strong></span>
            </div>

            <h1 className="farmer-heading">
              Smart Tools for
              <span>Better Farming</span>
            </h1>

            <p className="farmer-subtext">
              Get expert tools and services to improve productivity,
              reduce costs and grow your business.
            </p>

            <div className="farmer-divider">
              <span className="farmer-divider-line" />
              <span className="farmer-divider-dot" />
              <span className="farmer-divider-dot" />
            </div>
          </div>
        </div>

        {/* Primary tools — 6 across */}
        <div className="farmer-grid-6">
          {primaryTools.map((tool, idx) => {
            const animationClasses = ['farmer-slide-left', 'farmer-slide-top', 'farmer-slide-bottom', 'farmer-slide-right'];
            const animClass = animationClasses[idx % animationClasses.length];
            return (
              <div
                className={`farmer-card ${animClass}`}
                key={tool.title}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="farmer-card-media">
                  <img src={tool.image} alt={tool.title} />
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <span className="farmer-card-arrow">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Secondary tools — 4 across, horizontal */}
        <div className="farmer-grid-4">
          {secondaryTools.map((tool, idx) => {
            const animationClasses = ['farmer-slide-left', 'farmer-slide-top', 'farmer-slide-bottom', 'farmer-slide-right'];
            const animClass = animationClasses[(idx + 6) % animationClasses.length];
            return (
              <div
                className={`farmer-card wide ${animClass}`}
                key={tool.title}
                style={{ animationDelay: `${(idx + 6) * 0.05}s` }}
              >
                <div className="farmer-card-left">
                  <div className="farmer-card-media">
                    <img src={tool.image} alt={tool.title} />
                  </div>
                  <span className="farmer-card-arrow">
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </span>
                </div>
                <div className="farmer-card-right">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits bar */}
        <div className="farmer-benefits">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.title}>
                <div className="farmer-benefit">
                  <span className="farmer-benefit-icon" style={{ backgroundColor: item.bg, color: item.color }}>
                    <Icon size={19} strokeWidth={2.5} />
                  </span>
                  <div className="farmer-benefit-text">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
                {idx < benefits.length - 1 && <span className="farmer-benefit-sep" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FarmerHub;
