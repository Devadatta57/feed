import React from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  Gavel, 
  ClipboardList, 
  Bell, 
  FileBadge, 
  Briefcase, 
  Shield, 
  Users,
  ShieldAlert
} from 'lucide-react';
import './AgmBoard.css';
import MyBusinessLayout from '../components/MyBusinessLayout';
import agmBoardImg from '../assets/my-business/agm_board_icon.avif';

export default function AgmBoard({ onNavigate, isLoggedIn, user, onLogout }) {
  const agmModules = [
    {
      title: 'By Laws or MOA & AOA',
      desc: 'View governing documents',
      icon: <Gavel size={24} />,
      color: '#4f46e5', // Indigo
      bg: '#e0e7ff'
    },
    {
      title: 'Member Rights',
      desc: 'View member rights and privileges',
      icon: <ShieldCheck size={24} />,
      color: '#2563eb', // Blue
      bg: '#dbeafe'
    },
    {
      title: 'Rules & Acts',
      desc: 'View rules and applicable acts',
      icon: <ClipboardList size={24} />,
      color: '#059669', // Emerald
      bg: '#d1fae5'
    },
    {
      title: 'Notices',
      desc: 'View all notices and circulars',
      icon: <Bell size={24} />,
      color: '#d97706', // Amber
      bg: '#fef3c7'
    },
    {
      title: 'Resolutions',
      desc: 'View all resolutions and decisions',
      icon: <FileBadge size={24} />,
      color: '#e11d48', // Rose
      bg: '#ffe4e6'
    }
  ];

  const boardModules = [
    {
      title: 'Duties of Directors',
      desc: 'View duties and responsibilities',
      icon: <Briefcase size={24} />,
      color: '#2563eb', // Blue
      bg: '#dbeafe'
    },
    {
      title: 'Powers of Directors',
      desc: 'View powers and authorities',
      icon: <Shield size={24} />,
      color: '#0d9488', // Teal
      bg: '#ccfbf1'
    },
    {
      title: 'List of Directors',
      desc: 'View all board members',
      icon: <Users size={24} />,
      color: '#ea580c', // Orange
      bg: '#ffedd5'
    },
    {
      title: 'Notices',
      desc: 'View all notices and circulars',
      icon: <Bell size={24} />,
      color: '#d97706', // Amber
      bg: '#fef3c7'
    },
    {
      title: 'Rules & Acts',
      desc: 'View rules and applicable acts',
      icon: <ClipboardList size={24} />,
      color: '#059669', // Emerald
      bg: '#d1fae5'
    },
    {
      title: 'Resolutions',
      desc: 'View all resolutions and decisions',
      icon: <FileBadge size={24} />,
      color: '#e11d48', // Rose
      bg: '#ffe4e6'
    }
  ];

  return (
    <MyBusinessLayout 
      onNavigate={onNavigate} 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={onLogout}
      currentTab="agm-board"
    >
      <div className="ab-container">
        {/* Page Header */}
        <div className="ab-header-section">
          <div className="ab-header-content">
            <h1 className="ab-title">AGM & Board Meetings</h1>
            <p className="ab-subtitle">Governance made transparent, decisions made accountable.</p>
          </div>
          <div className="ab-header-illustration">
            <img src={agmBoardImg} alt="Corporate Board Meeting" />
          </div>
        </div>

        {/* Governance Information Panel */}
        <div className="ab-info-panel">
          <div className="ab-info-icon-wrapper">
            <ShieldCheck className="ab-info-icon" size={28} />
          </div>
          <div className="ab-info-text">
            <ul>
              <li>Helps to improve transparency and promotes better governance of the FPO.</li>
              <li>Includes Bye-laws, Notices, Resolutions, Duties of Board and other Rules &amp; Regulations.</li>
            </ul>
          </div>
        </div>

        {/* Main Content Structure */}
        <div className="ab-main-grid">
          {/* Annual General Meeting Section */}
          <div className="ab-section-card">
            <div className="ab-section-header">
              <div className="ab-section-title-wrap">
                <Users className="ab-section-icon" style={{ color: '#4f46e5' }} size={26} />
                <div>
                  <h2 className="ab-section-title">Annual General Meeting</h2>
                  <p className="ab-section-subtitle">Manage and access all AGM related documents and policies</p>
                </div>
              </div>
              <div className="ab-section-divider" style={{ background: '#4f46e5' }}></div>
            </div>
            
            <div className="ab-modules-grid ab-modules-agm">
              {agmModules.map((mod, idx) => (
                <div key={idx} className="ab-module-card">
                  <div className="ab-module-icon-container" style={{ backgroundColor: mod.bg, color: mod.color }}>
                    {mod.icon}
                  </div>
                  <div className="ab-module-content">
                    <h3>{mod.title}</h3>
                    <p>{mod.desc}</p>
                  </div>
                  <button className="ab-module-arrow">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Board of Directors Meeting Section */}
          <div className="ab-section-card">
            <div className="ab-section-header">
              <div className="ab-section-title-wrap">
                <Briefcase className="ab-section-icon" style={{ color: '#2563eb' }} size={26} />
                <div>
                  <h2 className="ab-section-title">Board of Directors Meeting</h2>
                  <p className="ab-section-subtitle">Access board related documents and responsibilities</p>
                </div>
              </div>
              <div className="ab-section-divider" style={{ background: '#2563eb' }}></div>
            </div>
            
            <div className="ab-modules-grid ab-modules-board">
              {boardModules.map((mod, idx) => (
                <div key={idx} className="ab-module-card">
                  <div className="ab-module-icon-container" style={{ backgroundColor: mod.bg, color: mod.color }}>
                    {mod.icon}
                  </div>
                  <div className="ab-module-content">
                    <h3>{mod.title}</h3>
                    <p>{mod.desc}</p>
                  </div>
                  <button className="ab-module-arrow">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Information Banner */}
        <div className="ab-bottom-banner">
          <div className="ab-banner-content">
            <div className="ab-banner-icon-wrapper">
              <ShieldAlert className="ab-banner-shield" size={24} />
            </div>
            <div>
              <h3 className="ab-banner-title">Stronger Governance. Better Decisions.</h3>
              <p className="ab-banner-subtitle">All documents are organized, secure and easily accessible.</p>
            </div>
          </div>
          <div className="ab-banner-visual">
            <div className="ab-banner-abstract-shape"></div>
          </div>
        </div>
      </div>
    </MyBusinessLayout>
  );
}
