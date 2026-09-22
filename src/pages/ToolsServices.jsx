import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Users, User, Store, GraduationCap, Ship } from 'lucide-react';
import MyFPOServiceHub from '../components/MyFPOServiceHub';
import FarmerHub from '../components/FarmerHub';
import MSMEServiceHub from '../components/MSMEServiceHub';
import ExportsHub from '../components/ExportsHub';
import './ToolsServices.css';

const ToolsServices = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTool, setActiveTool] = useState(null);
  const fpoHubRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeTool && fpoHubRef.current) {
      fpoHubRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTool]);

  const tools = [
    {
      id: 'fpo',
      title: 'My FPO',
      description: 'Manage Farmer Producer Organizations efficiently',
      icon: <Users size={28} />,
      accentColor: '#16a34a', // green
      route: 'fpo',
      image: '/images/tool_fpo_farmers.avif'
    },
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Access resources and support for farmers',
      icon: <User size={28} />,
      accentColor: '#65a30d', // fresh green
      route: 'home',
      image: '/images/tool_farmer_portrait.avif'
    },
    {
      id: 'msme',
      title: 'MSME',
      description: 'Empowering MSMEs for sustainable growth',
      icon: <Store size={28} />,
      accentColor: '#f59e0b', // amber/orange
      route: 'home',
      image: '/images/tool_msme_shop.avif'
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Learning resources and opportunities',
      icon: <GraduationCap size={28} />,
      accentColor: '#3b82f6', // blue
      route: 'home',
      image: '/images/tool_student_campus.avif'
    },
    {
      id: 'exports',
      title: 'Exports',
      description: 'Explore export services and global markets',
      icon: <Ship size={28} />,
      accentColor: '#0ea5e9', // teal/cyan
      route: 'exports',
      image: '/images/tool_export_cargoship.avif'
    }
  ];

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Valued Guest';

  return (
    <div className="tools-page-container">
      {/* Background Image with Overlays */}
      <div className="tools-bg-layer"></div>
      <div className="tools-bg-overlay-gradient"></div>

      {/* Main Content Area */}
      <div className="tools-content-wrapper">
        <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="tools" />

        <div className="tools-main-section">

          {activeTool ? (
            /* Workspace hubs replace the tools grid within My Tools once one is selected */
            <div ref={fpoHubRef} style={{ width: '100%' }}>
              {activeTool === 'fpo' && (
                <MyFPOServiceHub onNavigate={onNavigate} onSelectTool={setActiveTool} />
              )}
              {activeTool === 'farmer' && (
                <FarmerHub onNavigate={onNavigate} onSelectTool={setActiveTool} />
              )}
              {activeTool === 'msme' && (
                <MSMEServiceHub onNavigate={onNavigate} onSelectTool={setActiveTool} />
              )}
              {activeTool === 'exports' && (
                <ExportsHub onNavigate={onNavigate} onSelectTool={setActiveTool} />
              )}
            </div>
          ) : (
            <>
              {/* Welcome Header */}
              <div className="tools-welcome-section">
                <h2 className="tools-welcome-sub">Welcome back,</h2>
                <h1 className="tools-welcome-name">
                  {displayName}
                  <span className="tools-leaf-decoration">🌿</span>
                </h1>

                <div className="tools-divider">
                  <span className="tools-divider-dot"></span>
                </div>

                <p className="tools-welcome-desc">
                  Explore powerful tools and services designed<br/>
                  to empower growth and success.
                </p>
              </div>

              {/* Tools Cards Grid */}
              <div className="tools-cards-container">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="tool-card"
                    onClick={() => (tool.id === 'fpo' || tool.id === 'farmer' || tool.id === 'msme' || tool.id === 'exports') ? setActiveTool(tool.id) : onNavigate(tool.route)}
                    style={{ '--accent-color': tool.accentColor }}
                  >
                    <div className="tool-card-image-area">
                      <img
                        src={tool.image}
                        alt={tool.title}
                        className="tool-card-image"
                      />
                    </div>

                    <div className="tool-card-content">
                      <div className="tool-card-icon-circle" style={{ backgroundColor: tool.accentColor }}>
                        {React.cloneElement(tool.icon, { color: 'white', size: 24, strokeWidth: 2 })}
                      </div>

                      <h3 className="tool-card-title" style={{ color: tool.accentColor }}>{tool.title}</h3>
                      <p className="tool-card-desc">{tool.description}</p>

                      <button className="tool-card-arrow" style={{ backgroundColor: tool.accentColor + '15', color: tool.accentColor }}>
                        <ArrowRight size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ToolsServices;
