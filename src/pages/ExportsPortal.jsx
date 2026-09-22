import React, { useState } from 'react';
import { 
  Search, Bell, Grid, ChevronRight, ChevronsLeft,
  HelpCircle, Flag, ShoppingBasket, Network,
  ShieldCheck, Landmark, GitCommit, FileText,
  Globe2, Map, Percent, PenTool, ArrowRight,
  Home, Target
} from 'lucide-react';
import './ExportsPortal.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhyExports from './exports/WhyExports';
import HowToStartExports from './exports/HowToStartExports';
import ExportImportPolicy from './exports/ExportImportPolicy';
import ProceduresRegulations from './exports/ProceduresRegulations';
import CountrySelection from './exports/CountrySelection';
import ExportFinanceInsurance from './exports/ExportFinanceInsurance';
import useScrollToTop from '../hooks/useScrollToTop';

const navItems = [
  { id: '0', title: 'My Exports', icon: Home, active: true },
  { id: '1', title: 'Why Exports', icon: HelpCircle, active: false },
  { id: '2', title: 'How to Start Exports', icon: Flag },
  { id: '3', title: 'Product Selection', icon: ShoppingBasket },
  { id: '4', title: 'Buyers Connection', icon: Network },
  { id: '5', title: 'Exports Import Policies and Regulations', icon: ShieldCheck },
  { id: '6', title: 'Export Import Finance & Insurance', icon: Landmark },
  { id: '7', title: 'Process & Export Order', icon: GitCommit },
  { id: '8', title: 'Export Documentation', icon: FileText },
  { id: '9', title: 'Global Trade Updates & Events', icon: Globe2 },
  { id: '10', title: 'Country Selection', icon: Map },
  { id: '11', title: 'Export & Import Tariff and Benefits', icon: Percent },
  { id: '12', title: 'Tools & Services', icon: PenTool },
];

const cards = [
  {
    num: '01', title: 'Why Exports',
    desc: 'Understand the importance of exports and its benefits.',
    color: 'green',
    img: '/icons/icon-why-exports.avif'
  },
  {
    num: '02', title: 'How to Start Exports',
    desc: 'Step-by-step guide to begin your export journey.',
    color: 'blue',
    img: '/icons/icon-start-exports.avif'
  },
  {
    num: '03', title: 'Product Selection',
    desc: 'Choose the right products for global markets.',
    color: 'orange',
    img: '/icons/icon-product-selection.avif'
  },
  {
    num: '04', title: 'Buyers Connection',
    desc: 'Connect with verified global buyers & importers.',
    color: 'purple',
    img: '/icons/icon-buyers-connection.avif'
  },
  {
    num: '05', title: 'Export - Import Policies & Regulations',
    desc: 'Stay updated with policies, compliances & regulations.',
    color: 'pink',
    img: '/icons/icon-policies.avif'
  },
  {
    num: '06', title: 'Export - Import Finance & Insurance',
    desc: 'Find financial support & insurance for exporters.',
    color: 'teal',
    img: '/icons/icon-finance.avif'
  },
  {
    num: '07', title: 'Process & Export Order',
    desc: 'Complete export process from order to shipment.',
    color: 'yellow',
    img: '/icons/icon-process-order.avif'
  },
  {
    num: '08', title: 'Export - Import Documentation',
    desc: 'Essential documents for smooth export operations.',
    color: 'blue-light',
    img: '/icons/icon-documentation.avif'
  },
  {
    num: '09', title: 'Global Trade Updates & Events',
    desc: 'Latest trade updates, fairs, webinars & global events.',
    color: 'green-light',
    img: '/icons/icon-trade-updates.avif'
  },
  {
    num: '10', title: 'Country Selection',
    desc: 'Explore country insights & export opportunities.',
    color: 'purple-light',
    img: '/icons/icon-country-selection.avif'
  },
  {
    num: '11', title: 'Export - Import Tariff & Benefits',
    desc: 'Know tariffs, duty benefits & trade incentives.',
    color: 'orange-light',
    img: '/icons/icon-tariffs.avif'
  },
  {
    num: '12', title: 'Tools & Services',
    desc: 'Useful tools and services to empower exporters.',
    color: 'blue',
    img: '/icons/icon-tools-services.avif'
  },
];

const ExportsPortal = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('0');
  useScrollToTop(activeTab);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
      
      {/* Reusing Home Navbar */}
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="exports" />
      <div style={{ height: '86px', flexShrink: 0 }}></div>

      <div className="ep-layout">
        {/* LEFT SIDEBAR */}
        <aside className="ep-sidebar">
          <nav className="ep-nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`ep-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <item.icon size={18} className="ep-nav-icon" />
                  <span>{item.title}</span>
                  {isActive && <ChevronRight size={16} className="ep-nav-arrow" />}
                </div>
              );
            })}
          </nav>

        </aside>

        {/* MAIN CONTENT */}
        {activeTab === '0' && (
          <main className="ep-main-content">
        
        {/* HEADER */}
        <header className="ep-header">
          <div className="ep-header-titles">
            <h1>My Exports Hub</h1>
            <p>Everything you need to start, grow and succeed in global markets.</p>
          </div>
          <div className="ep-header-actions">
            <div className="ep-search">
              <Search size={16} className="ep-search-icon" />
              <input type="text" placeholder="Search FPO's, Schemes, Policies..." />
            </div>
            <button className="ep-quick-menu">
              <Grid size={16} />
              Quick Menu
            </button>
            <button className="ep-bell">
              <Bell size={20} />
              <span className="ep-bell-dot"></span>
            </button>
            <div className="ep-avatar">
              <img src="https://i.pravatar.cc/100?img=11" alt="User avatar" />
            </div>
          </div>
        </header>


        {/* GRID OF CARDS */}
        <div className="ep-cards-grid">
          {cards.map((card, idx) => {
            const animations = ['epSlideInFromLeft', 'epSlideInFromTop', 'epSlideInFromBottom', 'epSlideInFromRight'];
            const animName = animations[idx % 4];
            const animDelay = `${Math.floor(idx / 4) * 0.1}s`;

            return (
              <div 
                className="ep-card" 
                key={idx}
                onClick={() => setActiveTab(parseInt(card.num, 10).toString())}
                style={{
                  cursor: 'pointer',
                  animation: `${animName} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${animDelay} backwards`
                }}
              >
                <div className={`ep-card-badge color-${card.color}`}>{card.num}</div>
                <div className="ep-card-content">
                  <div className="ep-card-icon-area">
                    <div className={`ep-icon-circle color-${card.color}`}>
                      <img src={card.img} alt={card.title} className="ep-card-image" />
                    </div>
                  </div>
                  <div className="ep-card-text-area">
                    <h3>{card.title}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        </main>
        )}
        {activeTab === '1' && <WhyExports />}
        {activeTab === '2' && <HowToStartExports />}
        {activeTab === '5' && <ExportImportPolicy />}
        {activeTab === '6' && <ExportFinanceInsurance />}
        {activeTab === '11' && <ProceduresRegulations />}
        {activeTab === '10' && <CountrySelection />}
      </div>
      <Footer />
    </div>
  );
};

export default ExportsPortal;
