import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Download, PlayCircle, FileText, Shield, Home as HomeIcon, Users, Settings, Calendar, Map, Activity, Users2, Globe2, PhoneCall, Trophy, BadgeCheck, ShieldCheck, Star, User, UserPlus, ChevronDown, ChevronRight, ChevronLeft, ArrowRight, Sprout, Building2, Ship, Coins, Package, TrendingUp, GraduationCap, ClipboardList, Store, HeartHandshake, Wrench, Lightbulb, ShoppingBag, CreditCard, Target, Eye, Rocket, Search, Leaf, Landmark, PieChart, BarChart3, MoreHorizontal, Cloud, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import AboutUs from './AboutUs';
import Navbar, { servicesMegaMenu } from '../components/Navbar';
import '../components/Navbar.css';
// --- Events & Updates Static Data ---
const centralStateUpdates = [
  { id: 1, source: 'FIEO', title: 'FIEO MUMBAI : WEB CONFERENCE ON AWARENESS OF CYBER SECURITY ON SEPTEMBER 30, 202', color: '#0ea5e9' },
  { id: 2, source: 'Apeda', title: 'Report on Development of suitable package & formulation of packaging specification for fresh kiwi from north eastern states.', color: '#16a34a' },
  { id: 3, source: 'IBEF', title: 'PM dedicates to the Nation 35 crop varieties with special traits.', color: '#eab308' },
  { id: 4, source: 'Nabard', title: 'WRONG COVERAGE REGARDING NABARD IN VARIOUS PRINT MEDIA ON KISAN CREDIT CARD.', color: '#22c55e' },
  { id: 5, source: 'Other Updates', title: 'Latest notifications, circulars and announcements from various departments.', color: '#ef4444' }
];

const keyHighlights = [
  { id: 1, title: 'Export Opportunities', desc: 'Explore new markets and export opportunities across the globe.', icon: Package, color: '#16a34a', bg: '#f0fdf4' },
  { id: 2, title: 'Farmer Empowerment', desc: 'Initiatives and schemes for the upliftment of farmers.', icon: Users, color: '#ea580c', bg: '#fff7ed' },
  { id: 3, title: 'Business Growth', desc: 'Resources and support for MSMEs and new entrepreneurs.', icon: TrendingUp, color: '#8b5cf6', bg: '#faf5ff' }
];

const feedServicesList = [
  { id: 1, title: 'FPC', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: Users2, color: '#0ea5e9', bg: '#f0f9ff' },
  { id: 2, title: 'Farm', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: Sprout, color: '#84cc16', bg: '#f7fee7' },
  { id: 3, title: 'My Business', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: HeartHandshake, color: '#3b82f6', bg: '#eff6ff' },
  { id: 4, title: 'My Exports', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: Ship, color: '#6366f1', bg: '#eef2ff' },
  { id: 5, title: 'MY Products', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: Package, color: '#f59e0b', bg: '#fffbeb' },
  { id: 6, title: 'My Market', desc: 'FEED is a multi-state co-operative society working for the uplift.', icon: Store, color: '#ef4444', bg: '#fef2f2' },
];

const featureTags = [
  { id: 1, title: 'Pan India Presence', desc: 'Multiple states, one mission', icon: Globe2, color: '#8b5cf6' },
  { id: 2, title: 'Farmer First Approach', desc: 'Empowering rural communities', icon: Users, color: '#22c55e' },
  { id: 3, title: 'Cooperative Strength', desc: 'Stronger together', icon: HeartHandshake, color: '#f97316' },
  { id: 4, title: 'Export Focused', desc: 'Global opportunities', icon: TrendingUp, color: '#0ea5e9' },
  { id: 5, title: 'Transparent & Trusted', desc: 'Building lasting partnerships', icon: ShieldCheck, color: '#6366f1' },
];

const eventsSliderImages = [
  '/hero-banner-1.avif',
  '/hero-banner-2.avif',
  '/hero-banner-3.avif',
  '/hero-banner-4.avif'
];

const Home = ({ onNavigate, searchQuery, isLoggedIn, user, onLogout }) => {
  const { t, i18n } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null);
  const [eventsSlide, setEventsSlide] = useState(0);

  const servicesBlockRef = useRef(null);
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  
  const aboutUsBlockRef = useRef(null);
  const [isAboutUsVisible, setIsAboutUsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsServicesVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (servicesBlockRef.current) {
      observer.observe(servicesBlockRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboutUsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (aboutUsBlockRef.current) {
      observer.observe(aboutUsBlockRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const eventsTimer = setInterval(() => {
      setEventsSlide(prev => (prev + 1) % eventsSliderImages.length);
    }, 5000);
    return () => clearInterval(eventsTimer);
  }, []);

  useEffect(() => {
    let timer;
    if (currentSlide === 0) {
      timer = setTimeout(() => {
        setCurrentSlide(1);
      }, 4000); // 4 seconds on image
    } else if (currentSlide === 1) {
      if (videoRef.current) {
        // Ensure video plays from start
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      }
    }
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleVideoEnded = () => {
    setCurrentSlide(0);
  };


  const aboutPillars = [
    {
      title: 'Main Objective',
      Icon: Target,
      gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
      glow: 'rgba(249, 115, 22, 0.18)',
      text: (
        <>
          Connecting <strong>farmers, traders, MSMEs and new entrepreneurs</strong> with international markets, export councils, governments and banks through FPO formation, promotion meetings and export-order support.
        </>
      )
    },
    {
      title: 'Vision',
      Icon: Eye,
      gradient: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)',
      glow: 'rgba(22, 163, 74, 0.18)',
      text: (
        <>
          To become India&apos;s trusted one-stop solution for agricultural marketing in domestic and international markets through an effective technical interface.
        </>
      )
    },
    {
      title: 'Mission',
      Icon: Rocket,
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      glow: 'rgba(6, 182, 212, 0.2)',
      text: (
        <>
          Form product-based FPOs, build capacity through training, unlock global opportunities through <strong>FEED STARTUP</strong>, and provide real-time export process support.
        </>
      )
    }
  ];

  const aboutStats = [
    { value: '15+', label: 'Govt. & export bodies connected', Icon: Building2 },
    { value: '10', label: 'Priority products per district', Icon: Package },
    { value: '360°', label: 'Export support ecosystem', Icon: Globe2 },
    { value: 'MSCS', label: 'Registered cooperative society', Icon: ShieldCheck }
  ];
  
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="home-landing-page" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
     
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="home" />

      {/* 2. Hero Slider (Image & Video) */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        
        {/* Slider Track */}
        <div style={{ 
          display: 'flex', 
          width: '200vw', 
          height: '100%',
          transform: `translateX(-${currentSlide * 100}vw)`,
          transition: 'transform 0.8s ease-in-out'
        }}>
          
          {/* Slide 1: Image */}
          <div style={{ 
            width: '100vw', 
            height: '100%', 
            backgroundImage: `url('/home-header.avif')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center bottom',
          }}></div>

          {/* Slide 2: Video */}
          <div style={{ width: '100vw', height: '100%', backgroundColor: '#000' }}>
            <video 
              ref={videoRef}
              src="/vid.mp4" 
              muted 
              playsInline
              onEnded={handleVideoEnded}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

        </div>

        {/* OVERLAYS (These sit ON TOP of the slider track and do not move) */}
        
        {/* Language Selector (Top Right) */}
        <div style={{ position: 'absolute', top: '100px', right: '4%', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', backgroundColor: '#ffffff', borderRadius: '20px', cursor: 'pointer', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <Globe2 size={15} color="#ea580c" strokeWidth={2} />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              style={{ background: 'transparent', color: '#111827', border: 'none', outline: 'none', fontSize: '12px', fontWeight: '700', appearance: 'none', paddingRight: '14px', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="hi">à¤¹à¤¿à¤‚à¤¦à¥€</option>
              <option value="te">à°¤à±†à°²à±à°—à±</option>
            </select>
            <ChevronDown size={12} color="#111827" style={{ position: 'absolute', right: '8px', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* 1. Top Header Bar (Contact & Settings) */}
        <div className="top-header-bar" style={{ position: 'absolute', bottom: '0px', left: 0, right: 0, width: '100%', zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: 'transparent' }}>
          
          {/* Left: Contact Info */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', padding: '6px 16px 6px 6px', borderRadius: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1f2937' }}>
                <PhoneCall size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '15px', lineHeight: '1.2' }}>+91 9293858689</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.2' }}>{t('call_us')}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', padding: '6px 16px 6px 6px', borderRadius: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1f2937' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '15px', lineHeight: '1.2' }}>info@feedorg.com</div>
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.2' }}>{t('mail_us')}</div>
              </div>
            </div>
          </div>

          {/* Right Bottom Badge (Aligned with contact buttons) */}
          <div style={{ backgroundColor: 'white', padding: '6px 16px', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Shield size={24} color="#16a34a" fill="#dcfce7" />
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>REG.No:</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a' }}>MSCS/CR/1295/2020</div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. About Us Section */}
      <AboutUs />

      {/* Services (Ecosystem) Block */}
      <div id="services-block" ref={servicesBlockRef} style={{ width: '100%', padding: '60px 20px', background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 50%, #f3e8ff 100%)', display: 'flex', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Ecosystem Background Objects */}
        <div className="about-animated-bg">
          <Globe2 className="eco-obj eco-globe-1" size={140} strokeWidth={1.5} />
          <Globe2 className="eco-obj eco-globe-2" size={90} strokeWidth={2} />
          <Ship className="eco-obj eco-ship-1" size={120} strokeWidth={1.5} />
          <Ship className="eco-obj eco-ship-2" size={80} strokeWidth={2} />
          <Package className="eco-obj eco-pkg-1" size={75} strokeWidth={2} />
          <Package className="eco-obj eco-pkg-2" size={55} strokeWidth={2} />
          <Package className="eco-obj eco-pkg-3" size={65} strokeWidth={2} />
          <Store className="eco-obj eco-store-1" size={100} strokeWidth={2} />
          <TrendingUp className="eco-obj eco-trend-1" size={80} strokeWidth={2} />
          <Coins className="eco-obj eco-coins-1" size={60} strokeWidth={2} />
          <Coins className="eco-obj eco-coins-2" size={40} strokeWidth={2.5} />
          <Coins className="eco-obj eco-coins-3" size={50} strokeWidth={2} />
        </div>

        <div style={{
          width: '100%',
          maxWidth: '1300px',
          minHeight: '750px',
          backgroundImage: 'url(/services-bg.avif)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          borderRadius: '32px',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2
        }}>
          
          {/* Spacer to push grid down into the white block */}
          <div style={{ height: '35%', minHeight: '260px', width: '100%' }}></div>

          <style>{`
            @keyframes flyInLeft { from { opacity: 0; transform: translateX(-80px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes flyInRight { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes flyInTop { from { opacity: 0; transform: translateY(-80px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes flyInBottom { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
            
            .service-btn-animated {
              opacity: 0;
            }

            .eco-obj {
              position: absolute;
              animation: eco-float infinite ease-in-out alternate;
              z-index: 1;
            }

            .eco-globe-1 { top: 5%; left: 8%; color: #6366f1; animation-duration: 25s; }
            .eco-globe-2 { top: 60%; right: -2%; color: #6366f1; animation-duration: 32s; animation-delay: -10s; }
            
            .eco-ship-1 { top: 20%; right: 10%; color: #0ea5e9; animation-duration: 28s; animation-delay: -5s; transform: rotate(-10deg); }
            .eco-ship-2 { top: 80%; left: 15%; color: #0ea5e9; animation-duration: 22s; animation-delay: -15s; transform: rotate(15deg); }
            
            .eco-pkg-1 { top: 35%; left: 20%; color: #8b5cf6; animation-duration: 18s; animation-delay: -8s; transform: rotate(15deg); }
            .eco-pkg-2 { top: 12%; right: 25%; color: #8b5cf6; animation-duration: 20s; animation-delay: -3s; transform: rotate(-25deg); }
            .eco-pkg-3 { top: 85%; right: 30%; color: #8b5cf6; animation-duration: 25s; animation-delay: -12s; transform: rotate(10deg); }
            
            .eco-store-1 { top: 45%; left: 5%; color: #d946ef; animation-duration: 35s; animation-delay: -20s; }
            
            .eco-trend-1 { top: 10%; left: 45%; color: #10b981; animation-duration: 22s; animation-delay: -7s; }
            
            .eco-coins-1 { top: 75%; left: 5%; color: #f59e0b; animation-duration: 16s; }
            .eco-coins-2 { top: 25%; right: 2%; color: #f59e0b; animation-duration: 14s; animation-delay: -5s; }
            .eco-coins-3 { top: 50%; right: 15%; color: #f59e0b; animation-duration: 18s; animation-delay: -11s; }

            @keyframes eco-float {
              0% { transform: translateY(0) translateX(0) rotate(0deg); }
              33% { transform: translateY(-30px) translateX(20px) rotate(10deg); }
              66% { transform: translateY(15px) translateX(-15px) rotate(-10deg); }
              100% { transform: translateY(35px) translateX(10px) rotate(5deg); }
            }
          `}</style>

          {/* Buttons Grid container positioned tightly in the white space */}
          <div style={{ 
            flex: 1,
            padding: '0 4% 4% 4%', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gridAutoRows: 'min-content',
            gap: '16px',
          }}>
            {servicesMegaMenu.map((service, sIdx) => {
              const animations = ['flyInLeft', 'flyInTop', 'flyInBottom', 'flyInRight'];
              const animName = animations[sIdx % 4];
              return (
              <div key={sIdx} 
                className="srv-card service-btn-animated"
                style={{ 
                  animation: isServicesVisible ? `${animName} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${sIdx * 0.05}s forwards` : 'none',
                  cursor: (service.name === 'PRODUCT 360' || service.name === 'MY EXPORTS' || service.name === 'MY TOOLS' || service.name === 'MY BUSINESS') ? 'pointer' : undefined
                }}
                onClick={() => {
                  if (service.name === 'PRODUCT 360') onNavigate('product360');
                  if (service.name === 'MY EXPORTS') onNavigate('exports');
                  if (service.name === 'MY TOOLS') onNavigate('tools');
                  if (service.name === 'MY BUSINESS') onNavigate('mybusiness');
                }}
              >
                <div className={`srv-card-badge color-${service.color}`}>{service.num}</div>
                <div className="srv-card-content">
                  <div className={`srv-icon-circle color-${service.color}`}>
                    <img src={service.img} alt={service.name} className="srv-card-image" />
                  </div>
                  <div className="srv-card-text-area">
                    <h3>{service.name}</h3>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
        
        <style>{`
          .events-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 1400px; width: 100%; margin-bottom: 32px; }
          @media (min-width: 1024px) {
            .events-grid { grid-template-columns: 3.5fr 5.5fr 3.5fr; gap: 32px; }
          }
          
          .marquee-vertical {
            animation: marquee 20s linear infinite;
          }
          .marquee-vertical:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .marquee-container {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100%;
          }
          
          .slider-btn {
            background: rgba(255,255,255,0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            transition: all 0.2s;
            color: #1e3a8a;
            backdrop-filter: blur(10px);
          }
          .slider-btn:hover {
            background: #fff;
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
          }

          /* Premium List Item Hover Effects */
          .premium-list-item {
            padding: 24px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.04);
            display: flex;
            gap: 16px;
            align-items: flex-start;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            margin: 0 12px;
          }
          .premium-list-item:hover {
            background-color: #ffffff;
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
            border-bottom-color: transparent;
            z-index: 10;
            position: relative;
          }
        `}</style>
      </div>

      {/* Events & Updates Section */}
      <div id="events-updates" style={{ position: 'relative', width: '100%', padding: '32px 20px 40px', backgroundColor: '#fff7ed', backgroundImage: 'radial-gradient(at 0% 0%, rgba(244, 114, 182, 0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(251, 146, 60, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(250, 204, 21, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(52, 211, 153, 0.15) 0px, transparent 50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            EVENTS <span style={{ color: '#ea580c' }}>&</span> UPDATES
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
            <div style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, #ea580c)' }}></div>
            <Leaf size={28} color="#16a34a" fill="#16a34a" />
            <div style={{ width: '100px', height: '3px', background: 'linear-gradient(270deg, transparent, #ea580c)' }}></div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="events-grid" style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Left Column: Central/State Updates */}
          <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '28px', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                  <Landmark size={22} color="#fff" />
                </div>
                <h3 style={{ color: '#fff', fontSize: '19px', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>Central / State Updates</h3>
              </div>
              <MoreHorizontal color="rgba(255,255,255,0.6)" />
            </div>
            <div className="marquee-container" style={{ padding: '12px 0', position: 'relative' }}>
              <div className="marquee-vertical">
                {/* Render the list twice for seamless loop */}
                {[...centralStateUpdates, ...centralStateUpdates].map((item, idx) => (
                  <div key={idx} className="premium-list-item">
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800', color: item.color, fontSize: '12px' }}>
                      {item.source.substring(0, 4)}
                    </div>
                    <div style={{ flex: 1, paddingRight: '10px' }}>
                      <h4 style={{ color: item.color, fontSize: '14px', fontWeight: '800', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.source}</h4>
                      <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5', margin: '0 0 12px 0', fontWeight: '600' }}>{item.title}</p>
                      <a href="#" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', padding: '4px 12px', borderRadius: '20px', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#dbeafe'} onMouseOut={(e)=>e.currentTarget.style.background='#eff6ff'}>
                        Read More <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Image Carousel */}
          <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', height: '600px', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15)', border: '4px solid #ffffff' }}>
            {eventsSliderImages.map((src, idx) => (
              <div key={idx} style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: eventsSlide === idx ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: eventsSlide === idx ? 1 : 0
              }}></div>
            ))}
            
            {/* Arrows */}
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '20px', zIndex: 10 }}>
              <button className="slider-btn" onClick={() => setEventsSlide((prev) => (prev === 0 ? eventsSliderImages.length - 1 : prev - 1))}>
                <ChevronLeft size={24} />
              </button>
            </div>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '20px', zIndex: 10 }}>
              <button className="slider-btn" onClick={() => setEventsSlide((prev) => (prev + 1) % eventsSliderImages.length)}>
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
              {eventsSliderImages.map((_, idx) => (
                <div key={idx} 
                  onClick={() => setEventsSlide(idx)}
                  style={{ 
                    width: eventsSlide === idx ? '24px' : '8px', 
                    height: '8px', 
                    borderRadius: '4px', 
                    backgroundColor: eventsSlide === idx ? '#fff' : 'rgba(255,255,255,0.5)', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FEED Services */}
          <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '28px', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid #22c55e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                  <Leaf size={22} color="#fff" />
                </div>
                <h3 style={{ color: '#fff', fontSize: '19px', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>FEED Services</h3>
              </div>
              <MoreHorizontal color="rgba(255,255,255,0.6)" />
            </div>
            <div className="marquee-container" style={{ padding: '12px 0', position: 'relative' }}>
              <div className="marquee-vertical">
                {/* Render the list twice for seamless loop */}
                {[...feedServicesList, ...feedServicesList].map((item, idx) => (
                  <div key={idx} className="premium-list-item" style={{ alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${item.color}20` }}>
                      <item.icon size={24} color={item.color} />
                    </div>
                    <div style={{ flex: 1, paddingRight: '10px' }}>
                      <h4 style={{ color: '#166534', fontSize: '15.5px', fontWeight: '800', margin: '0 0 4px 0' }}>{item.title}</h4>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4', margin: 0, fontWeight: '500' }}>{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (item.title === 'My Exports') {
                          onNavigate('exports');
                        }
                        if (item.title === 'My Business') {
                          onNavigate('mybusiness');
                        }
                      }}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#16a34a'; e.currentTarget.children[0].style.color='#fff'}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f1f5f9'; e.currentTarget.children[0].style.color='#166534'}}>
                      <ChevronRight size={16} color="#166534" strokeWidth={3} style={{ transition: 'color 0.2s' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
