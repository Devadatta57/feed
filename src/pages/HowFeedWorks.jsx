import React, { useState } from 'react';
import { 
  Play, Share2, Globe, TrendingUp, BookOpen, Handshake, 
  Leaf, Settings, Globe2, Lightbulb, Store, GraduationCap 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HowFeedWorks.css';

// Using a placeholder avatar logo
import icon1 from '../assets/icon_1.avif';

const categories = [
  { id: 'fpo', label: 'FPO', icon: Leaf },
  { id: 'farming', label: 'FARMING', icon: Settings },
  { id: 'epm', label: 'EPM', icon: Globe2 },
  { id: 'marketing', label: 'MARKETING', icon: Lightbulb },
  { id: 'trading', label: 'TRADING', icon: TrendingUp },
  { id: 'b2b', label: 'B2B MARKET', icon: Store },
  { id: 'course', label: 'COURSE CERTIFICATIONS', icon: GraduationCap }
];

const HowFeedWorks = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="how" />

      {/* Premium Layered Background */}
      <div className="hfw-bg-wrapper">
        <svg preserveAspectRatio="none" viewBox="0 0 1440 800" className="hfw-wave-svg">
          <defs>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <radialGradient id="grad-blue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#0a3a6b" />
              <stop offset="100%" stopColor="#061f3a" />
            </radialGradient>
          </defs>
          {/* Green Layer (Back) */}
          <path fill="url(#grad-green)" d="M 0 0 L 0 650 C 300 800, 700 200, 1440 0 L 0 0 Z" />
          {/* Cyan Layer (Middle) */}
          <path fill="url(#grad-cyan)" d="M 0 0 L 0 550 C 250 700, 600 150, 1250 0 L 0 0 Z" />
          {/* Blue Layer (Front) */}
          <path fill="url(#grad-blue)" d="M 0 0 L 0 450 C 200 600, 500 100, 1100 0 L 0 0 Z" />
        </svg>
      </div>

      {/* Main Content Area */}
      <main className="hfw-main">
        
        {/* Header Section */}
        <header className="hfw-header anim-fade-in-up">
          <h1 className="hfw-title">How FEED Works...</h1>
          <div className="hfw-title-underline"></div>
        </header>

        {/* Category Navigation */}
        <div className="hfw-category-nav-wrapper anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="hfw-category-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`hfw-category-item ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <cat.icon size={18} strokeWidth={2.5} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Area */}
        <div className="hfw-cards-container">
          
          {/* Card 1 */}
          <div className="hfw-card hfw-card-bg-dark anim-zoom-in" style={{ animationDelay: '0.2s' }}>
            <div className="hfw-video-wrapper">
              <iframe 
                src="https://www.youtube.com/embed/ka-nmA0DOAI?rel=0" 
                title="FARM TO FOREIGN EXPORTS" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Card 2 */}
          <div className="hfw-card hfw-card-bg-light anim-zoom-in" style={{ animationDelay: '0.3s' }}>
            <div className="hfw-video-wrapper">
              <iframe 
                src="https://www.youtube.com/embed/bOkzpur79Us?rel=0" 
                title="FEED - EXPORTS & IMPORTS" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </main>

      {/* Existing Homepage Footer */}
      <Footer />
    </div>
  );
};

export default HowFeedWorks;
