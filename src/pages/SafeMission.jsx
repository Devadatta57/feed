import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Benefits from '../components/Benefits';
import Journey from '../components/Journey';
import SafeMissionTestimonialsJoin from '../components/SafeMissionTestimonialsJoin';
import './SafeMission.css';

const SafeMission = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  return (
    <div className="safe-mission-page" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="safe-mission" />

      <section className="safe-hero">
        <video 
          src="/vid1.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="safe-hero-video"
        />
      </section>

      <Benefits />
      <Journey />
      
      <SafeMissionTestimonialsJoin />

      <Footer />
    </div>
  );
};

export default SafeMission;
