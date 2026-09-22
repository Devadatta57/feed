import React from 'react';
import {
  LayoutGrid, Users, User, Store, GraduationCap, Ship,
  ChevronRight, Headphones, ArrowRight
} from 'lucide-react';
import './MyFPOServiceHub.css';

const sidebarItems = [
  { id: 'fpo', title: 'My FPO', icon: Users, color: '#16a34a', internal: true },
  { id: 'farmer', title: 'Farmer', icon: User, color: '#65a30d', internal: true },
  { id: 'msme', title: 'MSME', icon: Store, color: '#f59e0b', internal: true },
  { id: 'student', title: 'Student', icon: GraduationCap, color: '#3b82f6', route: 'home' },
  { id: 'exports', title: 'Exports', icon: Ship, color: '#0ea5e9', internal: true },
];

const MyToolsSidebar = ({ activeId, onSelectTool, onNavigate }) => (
  <aside className="fpo-hub-sidebar">
    <div className="fpo-sidebar-header">
      <div className="fpo-sidebar-brand-icon">
        <LayoutGrid size={20} strokeWidth={2.5} />
      </div>
      <div className="fpo-sidebar-brand-text">
        <h2>My Tools</h2>
        <span>5 workspaces</span>
      </div>
    </div>

    <p className="fpo-sidebar-section">Workspaces</p>

    <nav className="fpo-sidebar-nav">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeId;
        return (
          <div
            key={item.id}
            className={`fpo-sidebar-item ${isActive ? 'active' : ''}`}
            style={{ '--item-color': item.color }}
            onClick={() => {
              if (isActive) return;
              if (item.internal) onSelectTool && onSelectTool(item.id);
              else onNavigate && onNavigate(item.route);
            }}
          >
            <span className="fpo-sidebar-icon">
              <Icon size={17} strokeWidth={2.25} />
            </span>
            <span className="fpo-sidebar-text">{item.title}</span>
            {isActive && <ChevronRight size={15} className="fpo-sidebar-arrow" />}
          </div>
        );
      })}
    </nav>

    <div className="fpo-sidebar-cta">
      <div className="fpo-sidebar-cta-icon">
        <Headphones size={18} strokeWidth={2.25} />
      </div>
      <h4>Need Help?</h4>
      <p>Get expert guidance to register, run and grow your business.</p>
      <button className="fpo-sidebar-cta-btn" onClick={() => onNavigate && onNavigate('contact')}>
        Contact Us
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  </aside>
);

export default MyToolsSidebar;
