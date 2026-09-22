import React from 'react';
import {
  User,
  Wallet,
  FileCheck,
  Users,
  Target,
  PiggyBank,
  Megaphone,
  BarChart3,
  Handshake,
  Store,
  ChevronRight
} from 'lucide-react';
import '../pages/MyBusiness.css';
import Navbar from './Navbar';
import Footer from './Footer';

const navItems = [
  { name: 'Business Profile', icon: <User size={18} />, route: 'business-profile' },
  { name: 'Business Account', icon: <Wallet size={18} />, route: 'business-account' },
  { name: 'Compliances & Registration', icon: <FileCheck size={18} />, route: 'compliances' },
  { name: 'Agm & Board', icon: <Users size={18} />, route: 'agm-board' },
  { name: 'Business Plan', icon: <Target size={18} />, route: 'business-plan' },
  { name: 'Loans & Schemes', icon: <PiggyBank size={18} />, route: 'loans-schemes' },
  { name: 'Marketing Support', icon: <Megaphone size={18} />, route: 'marketing' },
  { name: 'Reports', icon: <BarChart3 size={18} />, route: 'reports' },
  { name: 'Business Connect', icon: <Handshake size={18} />, route: 'connect' },
];

export default function MyBusinessLayout({ children, onNavigate, isLoggedIn, user, onLogout, currentTab }) {
  return (
    <>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage={currentTab} />
      <div className="mb-layout">
        {/* Sidebar */}
        <aside className="mb-sidebar">
          <div className="mb-sidebar-top">
            <div className="mb-sidebar-menu">
              <div 
                className={`mb-menu-item-main ${currentTab === 'mybusiness' ? 'active' : ''}`}
                onClick={() => onNavigate('mybusiness')}
                style={{ cursor: 'pointer' }}
              >
                <div className="mb-menu-item-left">
                  <Store size={20} />
                  <span>My Business</span>
                </div>
                <ChevronRight size={16} />
              </div>

              <div className="mb-nav-list">
                {navItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`mb-nav-item ${currentTab === item.route ? 'active' : ''}`}
                    onClick={() => {
                      onNavigate(item.route);
                    }}
                  >
                    <div className="mb-nav-icon-wrapper">
                      {item.icon}
                    </div>
                    <span className="mb-nav-text">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
