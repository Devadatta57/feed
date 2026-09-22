import React from 'react';
import { ArrowRight } from 'lucide-react';
import './MyBusiness.css';
import MyBusinessLayout from '../components/MyBusinessLayout';

// Importing generated illustrations
import aboutImg from '../assets/my-business/about_business_icon.avif';
import accountImg from '../assets/my-business/business_account_icon.avif';
import planImg from '../assets/my-business/business_plan_icon.avif';
import capacityImg from '../assets/my-business/capacity_building_icon.avif';
import compliancesImg from '../assets/my-business/compliances_icon.avif';
import agmImg from '../assets/my-business/agm_board_icon.avif';
import loansImg from '../assets/my-business/loans_schemes_icon.avif';
import reportsImg from '../assets/my-business/reports_icon.avif';

const row1Services = [
  {
    title: 'About Business',
    description: 'Know more about your business profile',
    illustration: aboutImg,
    accent: '#2563eb', // blue
    route: 'business-profile'
  },
  {
    title: 'Business Account',
    description: 'Manage your accounts and transactions',
    illustration: accountImg,
    accent: '#16a34a', // green
    route: 'business-account'
  },
  {
    title: 'Business Plan',
    description: 'Plan, analyze and achieve your goals',
    illustration: planImg,
    accent: '#9333ea', // purple
    route: 'business-plan'
  },
  {
    title: 'Capacity Building',
    description: 'Upskill and grow your business capabilities',
    illustration: capacityImg,
    accent: '#d97706', // orange/brown
    route: 'capacity-building'
  },
  {
    title: 'Compliances',
    description: 'Stay compliant and meet requirements',
    illustration: compliancesImg,
    accent: '#e11d48', // red/pink
    route: 'compliances'
  }
];

const row2Services = [
  {
    title: 'Agm & Board',
    description: 'Manage meetings and board activities',
    illustration: agmImg,
    accent: '#0d9488', // teal
    route: 'agm-board'
  },
  {
    title: 'Loans & Schemes',
    description: 'Discover loans and government schemes',
    illustration: loansImg,
    accent: '#ea580c', // orange/gold
    route: 'loans-schemes'
  },
  {
    title: 'Reports',
    description: 'View analytics and download reports',
    illustration: reportsImg,
    accent: '#0284c7', // blue
    route: 'reports'
  }
];

export default function MyBusiness({ onNavigate, isLoggedIn, user, onLogout }) {
  return (
    <MyBusinessLayout 
      onNavigate={onNavigate} 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={onLogout}
      currentTab="mybusiness"
    >
      <main className="mb-main-content">
        {/* Topbar */}
        <header className="mb-header">
          <div className="mb-greeting">
            <h1>Hello 👋</h1>
            <p>Manage and grow your business with smart tools and insights.</p>
          </div>
        </header>

        {/* Services Grid */}
        <div className="mb-services-container">
          {/* Row 1: 5 cards */}
          <div className="mb-cards-row-5">
            {row1Services.map((service, idx) => {
              const animations = ['mbFlyInLeft', 'mbFlyInTop', 'mbFlyInBottom', 'mbFlyInRight', 'mbFlyInLeft'];
              const animName = animations[idx % 5];
              return (
              <div 
                key={`r1-${idx}`} 
                className="mb-service-card mb-card-animated" 
                style={{ 
                  borderTop: `6px solid ${service.accent}`,
                  animation: `${animName} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s forwards`
                }}
                onClick={() => {
                  if (service.route === 'business-account' || service.route === 'agm-board' || service.route === 'business-plan') {
                    onNavigate(service.route);
                  }
                }}
              >
                <div className="mb-card-img-wrap">
                  <img src={service.illustration} alt={service.title} />
                </div>
                <div className="mb-card-content">
                  <h3 style={{ color: service.accent }}>{service.title}</h3>
                  <p>{service.description}</p>
                  <button className="mb-card-arrow" style={{ color: service.accent, borderColor: service.accent + '40' }}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )})}
          </div>

          {/* Row 2: 3 cards */}
          <div className="mb-cards-row-3">
            {row2Services.map((service, idx) => {
              const animations = ['mbFlyInBottom', 'mbFlyInTop', 'mbFlyInRight'];
              const animName = animations[idx % 3];
              return (
              <div 
                key={`r2-${idx}`} 
                className="mb-service-card wide-card mb-card-animated" 
                style={{ 
                  borderTop: `6px solid ${service.accent}`,
                  animation: `${animName} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${(idx + 5) * 0.1}s forwards`
                }}
                onClick={() => {
                  if (service.route === 'agm-board' || service.route === 'business-account' || service.route === 'business-plan') {
                    onNavigate(service.route);
                  }
                }}
              >
                <div className="mb-card-img-wrap">
                  <img src={service.illustration} alt={service.title} />
                </div>
                <div className="mb-card-content">
                  <h3 style={{ color: service.accent }}>{service.title}</h3>
                  <p>{service.description}</p>
                  <button className="mb-card-arrow" style={{ color: service.accent, borderColor: service.accent + '40' }}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </main>
    </MyBusinessLayout>
  );
}
