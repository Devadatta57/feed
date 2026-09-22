import React, { useState } from 'react';
import { 
  Search, Bell, Grid, ChevronRight, HelpCircle, ArrowLeft, ArrowRight,
  Users, Landmark, BarChart2, CheckCircle, Banknote, Network, Mail
} from 'lucide-react';
import './FpoPortal.css';
import heroImg from '../assets/hero_1.avif';
import fpoHeroBg from '../assets/fpo_hero_bg.avif';
import icon1 from '../assets/icon_1.avif';
import icon2 from '../assets/icon_2.avif';
import icon3 from '../assets/icon_3.avif';
import icon4 from '../assets/icon_4.avif';
import icon5 from '../assets/icon_5.avif';
import rsb1 from '../assets/rsb_1.avif';
import rsb2 from '../assets/rsb_2.avif';
import rsb3 from '../assets/rsb_3.avif';
import rsb4 from '../assets/rsb_4.avif';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sidebarItems = [
  { id: 'home', title: 'Home', icon: Grid, active: true },
  { id: 'about', title: 'About FPC', icon: HelpCircle },
  { id: 'account', title: 'FPC Account', icon: Users },
  { id: 'business', title: 'Business Plan', icon: Landmark },
  { id: 'capacity', title: 'Capacity Building', icon: Users },
  { id: 'compliance', title: 'Compliances', icon: CheckCircle },
  { id: 'meetings', title: 'AGM & Board', icon: Users },
  { id: 'loans', title: 'Loans', icon: Banknote },
  { id: 'reports', title: 'Reports', icon: BarChart2 },
  { id: 'connect', title: 'Connect', icon: Network }
];

const quickAccessCards = [
  { title: 'About FPO', desc: 'Farmer profiles & documents', img: icon1, color: 'blue' },
  { title: 'FPO Account', desc: 'Wallet, Identity, KYC', img: icon2, color: 'teal' },
  { title: 'Business Plan', desc: 'Targets & Checklists', img: icon3, color: 'green' },
  { title: 'Capacity Building', desc: 'Learning & Growth', img: icon4, color: 'orange' },
  { title: 'Compliances', desc: 'Security & Certifications', img: icon5, color: 'purple' },
  { title: 'AGM & Board', desc: 'Meetings & Discussions', img: '/icons/icon-trade-updates.avif', color: 'blue' },
  { title: 'Loans & Schemes', desc: 'Financial support', img: '/icons/icon-finance.avif', color: 'green' },
  { title: 'Reports', desc: 'Analytics & Dashboards', img: '/icons/icon-tariffs.avif', color: 'teal' }
];

const stats = [
  { title: 'Total FPOs', value: '1,245', img: '/icons/icon-krushi.avif', color: 'blue' },
  { title: 'Active Schemes', value: '84', img: '/icons/icon-policies.avif', color: 'teal' },
  { title: 'Loans Disbursed', value: '$2.4M', img: '/icons/icon-finance.avif', color: 'green' },
  { title: 'Members Connected', value: '45.2K', img: '/icons/icon-buyers-connection.avif', color: 'purple' }
];

const updates = [
  { title: 'My Products', desc: 'Manage your fresh produce', img: rsb1 },
  { title: 'My Business', desc: 'B2B networks & handshakes', img: rsb2 },
  { title: 'My Export', desc: 'Global shipping & containers', img: rsb3 },
  { title: 'My Market', desc: 'Growth graphs & analytics', img: rsb4 }
];

const FpoPortal = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('0');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="fpo" />
      <div className="fpo-dashboard">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="fpo-sidebar">

        <nav className="fpo-nav">
          {sidebarItems.map((item) => (
            <div 
              key={item.id} 
              className={`fpo-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="fpo-icon-wrap">
                <item.icon size={18} />
              </div>
              <span className="fpo-nav-title">{item.title}</span>
              {activeTab === item.id && <ChevronRight size={16} className="fpo-nav-arrow" />}
            </div>
          ))}
        </nav>

      </aside>

      {/* 2. CENTER MAIN DASHBOARD */}
      <main className="fpo-main-content">
        
        {/* Top Navigation */}
        <header className="fpo-top-nav anim-fly-in-top" style={{ animationDelay: '0.1s' }}>
          <div className="fpo-top-left">
            <button className="fpo-back-btn" onClick={() => onNavigate('home')}>
              <ArrowLeft size={20} />
            </button>
            <div className="fpo-page-titles">
              <h2>Dashboard</h2>
              <span>Overview & Analytics</span>
            </div>
          </div>

          <div className="fpo-top-right">
            <div className="fpo-search-box">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search FPO services..." />
            </div>
            <button className="fpo-icon-btn">
              <Grid size={18} />
            </button>
            <button className="fpo-icon-btn with-dot">
              <Bell size={18} />
              <span className="fpo-dot"></span>
            </button>
            <div className="fpo-avatar">
              <img src="https://i.pravatar.cc/100?img=12" alt="User" />
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="fpo-hero-section anim-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="fpo-hero-bg" style={{ backgroundImage: `url(${fpoHeroBg})` }}>
            <div className="fpo-hero-overlay"></div>
          </div>
          <div className="fpo-hero-content">
            <h1 className="fpo-hero-title">Empowering FPOs<br/>Building Stronger Communities</h1>
            <p className="fpo-hero-desc">
              Uniting farmers with global markets, providing end-to-end digital agriculture support and scaling local businesses internationally.
            </p>
            <div className="fpo-hero-stats">
              <div className="hero-stat">
                <h3>1.2K+</h3>
                <span>Active FPOs</span>
              </div>
              <div className="hero-stat">
                <h3>50+</h3>
                <span>Schemes</span>
              </div>
              <div className="hero-stat">
                <h3>100%</h3>
                <span>Compliance</span>
              </div>
            </div>
          </div>
          <div className="fpo-hero-slider">
            <button><ArrowLeft size={16} /></button>
            <button><ArrowRight size={16} /></button>
          </div>
        </section>

        {/* Quick Access */}
        <section className="fpo-quick-access">
          <div className="fpo-section-header anim-fly-in-left" style={{ animationDelay: '0.3s' }}>
            <h3>Quick Access</h3>
            <p>Access all FPC services in one place</p>
          </div>
          <div className="fpo-cards-grid">
            {quickAccessCards.map((card, idx) => {
              const animClasses = ['anim-fly-in-left', 'anim-fly-in-bottom', 'anim-fly-in-right', 'anim-fly-in-top'];
              return (
              <div 
                className={`fpo-glass-card ${animClasses[idx % 4]}`} 
                key={idx}
                style={{ animationDelay: `${0.3 + (idx * 0.05)}s` }}
              >
                <div className={`fpo-card-icon-area bg-${card.color}`}>
                  {card.img ? (
                    <img src={card.img} alt={card.title} />
                  ) : (
                    <card.fallbackIcon size={32} className="fpo-fallback-icon" />
                  )}
                </div>
                <div className="fpo-card-info">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
                <button className="fpo-card-arrow">
                  <ArrowRight size={16} />
                </button>
              </div>
            );
            })}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="fpo-stats-section">
          <div className="fpo-section-header anim-fly-in-left" style={{ animationDelay: '0.5s' }}>
            <h3>At a Glance</h3>
          </div>
          <div className="fpo-stats-grid">
            {stats.map((stat, idx) => (
              <div 
                className="fpo-stat-box anim-fly-in-bottom" 
                key={idx}
                style={{ animationDelay: `${0.5 + (idx * 0.1)}s` }}
              >
                <div className={`fpo-stat-icon text-${stat.color}`} style={{ background: 'transparent' }}>
                  {stat.img ? (
                    <img src={stat.img} alt={stat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    <stat.icon size={24} />
                  )}
                </div>
                <div className="fpo-stat-details">
                  <span className="fpo-stat-label">{stat.title}</span>
                  <span className="fpo-stat-value">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. RIGHT SIDEBAR (UPDATES PANEL) */}
      <aside className="fpo-updates-panel">
        <div className="fpo-updates-header anim-fly-in-right" style={{ animationDelay: '0.2s' }}>
          <h3>FEED Updates</h3>
          <button className="fpo-view-all">View All</button>
        </div>
        <div className="fpo-updates-list">
          {updates.map((update, idx) => (
            <div 
              className="fpo-update-card anim-fly-in-right" 
              key={idx}
              style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
            >
              <img src={update.img} alt={update.title} className="fpo-update-img" />
              <div className="fpo-update-info">
                <h4>{update.title}</h4>
                <p>{update.desc}</p>
              </div>
              <button className="fpo-update-arrow">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="fpo-newsletter-card anim-fly-in-bottom" style={{ animationDelay: '0.7s' }}>
          <div className="fpo-news-icon">
            <Mail size={24} />
          </div>
          <h4>Stay Updated</h4>
          <p>Subscribe to our newsletter for the latest schemes and policies.</p>
          <button className="fpo-subscribe-btn">Subscribe</button>
        </div>
      </aside>

    </div>
    <Footer />
    </div>
  );
};

export default FpoPortal;
