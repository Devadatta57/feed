import React, { useEffect, useState } from 'react';
import {
  Bell, ChevronDown, User, Package, Users, FileText, Star, Settings,
  Home, Users2, Calendar, Sprout, ShieldCheck, Banknote, BookOpen,
  ArrowRightLeft, BarChart3, Activity, CheckCircle, MoreHorizontal,
  BellRing, ShoppingCart, Link2, ChevronRight, ArrowRight, TrendingUp,
  Megaphone, MapPin, CloudRain, TrendingDown, Info, ScrollText,
  Coins, Crown, ClipboardList, Warehouse, Wallet, Landmark, Receipt,
  Briefcase, GraduationCap, Truck, Stethoscope, Tractor, Cpu, Palette, Smartphone, Tag,
  Ship, Store, Building2, Layers, Key, PawPrint, Globe2, UserCog, PhoneCall,
  Play, Leaf
} from 'lucide-react';
import './Dashboard.css';
import MyDetailsForm from '../components/MyDetailsForm';
import ErsAssessmentPanel from '../components/ers/ErsAssessmentPanel';
import PlansPage from '../components/plans/PlansPage';
import { plans, CURRENT_PLAN_ID } from '../components/plans/plansData';
import useScrollToTop from '../hooks/useScrollToTop';

const sidebarMenu = [
  {
    category: '',
    items: [
      {
        id: 'profile', title: 'My Profile', icon: User,
        subItems: [
          { id: 'profile-details', title: 'My Details', icon: User },
          { id: 'profile-products', title: 'My Products', icon: Package },
          { id: 'profile-vendors', title: 'My Vendors', icon: Users },
          { id: 'profile-certificates', title: 'My Certificates & Licences', icon: FileText },
          { id: 'profile-testimonials', title: 'My Testimonials', icon: Star },
          { id: 'profile-subscriptions', title: 'Active Subscriptions', icon: Settings },
        ]
      },
      {
        id: 'org', title: 'MY Org', icon: Home,
        subItems: [
          { id: 'org-about', title: 'About My Org', icon: Info },
          {
            id: 'org-members', title: 'My Members', icon: Users2,
            subItems: [
              { id: 'org-members-share-capital', title: 'Share Capital Registry - All Options', icon: ArrowRightLeft },
              { id: 'org-members-ledger', title: 'Member Ledger', icon: ScrollText },
            ]
          },
          { id: 'org-agm', title: 'AGM & BoD Meetings', icon: Calendar },
          { id: 'org-farm-activity', title: 'Farm Activity', icon: Sprout },
          { id: 'org-schemes', title: 'Schemes', icon: ShieldCheck },
          { id: 'org-loans', title: 'Loans & Finance', icon: Banknote },
        ]
      },
      {
        id: 'accounts', title: 'My Accounts', icon: BookOpen,
        subItems: [
          {
            id: 'accounts-registers', title: 'My Registers', icon: ScrollText,
            subItems: [
              { id: 'accounts-registers-purchase', title: 'Purchase Registry', icon: ClipboardList },
              { id: 'accounts-registers-sales', title: 'Sales Registry', icon: TrendingUp },
              { id: 'accounts-registers-stock', title: 'Stock Registry', icon: Warehouse },
            ]
          },
          {
            id: 'accounts-transactions', title: 'My Transactions', icon: ArrowRightLeft,
            subItems: [
              { id: 'accounts-transactions-cashbook', title: 'Cash Book Registry', icon: Wallet },
              { id: 'accounts-transactions-bank', title: 'Bank Registry', icon: Landmark },
              { id: 'accounts-transactions-expenses', title: 'Expenses Registry', icon: Receipt },
            ]
          },
        ]
      },
      {
        id: 'reports', title: 'My Reports', icon: BarChart3,
        subItems: [
          { id: 'reports-ledger', title: 'Ledger Registry', icon: ScrollText },
          { id: 'reports-financial', title: 'Financial Reports', icon: FileText },
        ]
      },
      { id: 'status', title: 'Status of Activities', icon: Activity },
      { id: 'compliances', title: 'My Compliances', icon: CheckCircle },
      {
        id: 'other', title: 'Other Services', icon: MoreHorizontal,
        subItems: [
          { id: 'other-org-business-plan', title: 'Org Business Plan', icon: Briefcase },
          { id: 'other-capacity-building', title: 'Capacity Building', icon: GraduationCap },
          { id: 'other-godown-storage', title: 'Godown/Storage', icon: Warehouse },
          { id: 'other-logistics', title: 'Logistics - Item Tracking', icon: Truck },
          { id: 'other-farm-advisory', title: 'Farm Advisory Services/Crop Doctor', icon: Stethoscope },
          { id: 'other-agri-inputs', title: 'Seeds, Fertilizers, Agri Machinery', icon: Tractor },
          { id: 'other-technology', title: 'Technology', icon: Cpu },
          { id: 'other-branding', title: 'Branding & Promotion', icon: Palette },
          { id: 'other-digital-marketing', title: 'Digital Marketing', icon: Smartphone },
        ]
      },
      {
        id: 'news', title: 'News & Alerts', icon: BellRing,
        subItems: [
          { id: 'news-alerts-notifications', title: 'Alerts & Notifications', icon: Bell },
          { id: 'news-offers-coupons', title: 'Offers & Coupons', icon: Tag },
          { id: 'news-subscriptions-plans', title: 'Subscriptions & Plans', icon: Settings },
        ]
      },
      {
        id: 'trade', title: 'My Trade', icon: ShoppingCart,
        subItems: [
          {
            id: 'trade-plans', title: 'My Plans', icon: ClipboardList,
            subItems: [
              { id: 'trade-plans-export', title: 'Export - KYJ with FEED', icon: Ship },
              {
                id: 'trade-plans-domestic', title: 'Domestic Trade', icon: Store,
                subItems: [
                  { id: 'trade-plans-domestic-tenders', title: 'Tenders & Institutional Domestic Supply', icon: Building2 },
                  { id: 'trade-plans-domestic-ecommerce', title: 'E-commerce - My Market', icon: ShoppingCart },
                  { id: 'trade-plans-domestic-value-addition', title: 'Value Addition', icon: Layers },
                  { id: 'trade-plans-domestic-cfc', title: 'CFC - Give Place for Hire', icon: Key },
                  { id: 'trade-plans-domestic-animal-husbandry', title: 'Animal Husbandry', icon: PawPrint },
                ]
              },
            ]
          },
          {
            id: 'trade-connections', title: 'My Connections', icon: Users2,
            subItems: [
              { id: 'trade-connections-export', title: 'Export Connections - International Buyers', icon: Globe2 },
              { id: 'trade-connections-domestic', title: 'Domestic Connections - My Market Trade Buyers (Vendors)', icon: Users },
            ]
          },
        ]
      },
      {
        id: 'directory', title: 'Directory', icon: Users2,
        subItems: [
          { id: 'directory-officers', title: 'Horticulture/Agriculture Officers', icon: UserCog },
          { id: 'directory-input-dealers', title: 'Input Seed / Dealers Numbers', icon: Tractor },
          { id: 'directory-govt-schemes', title: 'Govt. Loans & Schemes', icon: Landmark },
          { id: 'directory-nbfcs', title: 'NBFCs & Financial Services', icon: Coins },
          { id: 'directory-farm-service', title: 'Farm Service Contacts', icon: PhoneCall },
          { id: 'directory-feed-offices', title: 'FEED Office Numbers - Dist. Wise', icon: MapPin },
        ]
      },
    ]
  }
];

import Navbar, { servicesMegaMenu } from '../components/Navbar';
import Footer from '../components/Footer';

const HERO_CONTENT_DURATION = 6000;
const HERO_SERVICES_DURATION = 20000;

const marketItems = [
  { id: 1, name: 'Wheat', price: '₹2,200', trend: 'up', percent: '+2.4%', bg: 'bg-wheat', icon: 'W' },
  { id: 2, name: 'Rice (Paddy)', price: '₹2,100', trend: 'down', percent: '-1.2%', bg: 'bg-rice', icon: 'R' },
  { id: 3, name: 'Soyabean', price: '₹4,500', trend: 'up', percent: '+3.8%', bg: 'bg-soya', icon: 'S' },
  { id: 4, name: 'Maize', price: '₹2,350', trend: 'up', percent: '+0.5%', bg: 'bg-maize', icon: 'M' },
  { id: 5, name: 'Sugarcane', price: '₹3,150', trend: 'up', percent: '+0.5%', bg: 'bg-sugar', icon: 'S' },
  { id: 6, name: 'Mustard', price: '₹5,400', trend: 'up', percent: '+4.2%', bg: 'bg-mustard', icon: 'M' },
];

const alertsData = [
  {
    id: 1, tag: 'New', icon: Megaphone, iconBg: '#dcfce7', iconColor: '#16a34a',
    title: 'New Subsidy Scheme Announced',
    desc: 'Get up to 50% subsidy on drip irrigation equipment.',
    time: '2 hours ago',
  },
  {
    id: 2, icon: Megaphone, iconBg: '#ffedd5', iconColor: '#ea580c',
    title: 'Training Program Update',
    desc: 'Farmers Training Program scheduled on 28 May.',
    time: '5 hours ago',
  },
  {
    id: 3, icon: Info, iconBg: '#dbeafe', iconColor: '#2563eb',
    title: 'Market Update',
    desc: 'Wheat prices increased by 2.4% in your region.',
    time: '1 day ago',
  },
];

const activityData = [
  {
    id: 1, icon: User, iconBg: '#dbeafe', iconColor: '#2563eb',
    title: 'Profile Updated', desc: 'You updated your profile information', time: '2 hours ago',
  },
  {
    id: 2, icon: Package, iconBg: '#dcfce7', iconColor: '#16a34a',
    title: 'Product Added', desc: 'You added new product: Organic Wheat', time: '5 hours ago',
  },
  {
    id: 3, icon: Users, iconBg: '#ffedd5', iconColor: '#ea580c',
    title: 'New Member Joined', desc: 'Ramesh Kumar joined your organization', time: '1 day ago',
  },
  {
    id: 4, icon: FileText, iconBg: '#f3e8ff', iconColor: '#9333ea',
    title: 'Report Generated', desc: 'Monthly report for April generated', time: '2 days ago',
  },
];

const Dashboard = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('0');
  const [openMenus, setOpenMenus] = useState({});
  const [ersPanelOpen, setErsPanelOpen] = useState(false);
  const [plansPanelOpen, setPlansPanelOpen] = useState(false);
  const [ersStatus, setErsStatus] = useState({ attempted: false, percentage: 0, passed: false, completedOn: null });
  const [heroPhase, setHeroPhase] = useState('content');

  // activeTab/ersPanelOpen/plansPanelOpen together decide what's on screen inside the
  // dashboard - none of them touch App.jsx's currentPage, so this view needs its own reset.
  useScrollToTop(plansPanelOpen ? 'plans' : ersPanelOpen ? 'ers' : activeTab);

  const currentPlan = plans.find((p) => p.id === CURRENT_PLAN_ID) || plans[0];

  const ERS_RING_RADIUS = 36;
  const ERS_RING_CIRCUMFERENCE = 2 * Math.PI * ERS_RING_RADIUS;
  const ersRingOffset = ERS_RING_CIRCUMFERENCE * (1 - (ersStatus.attempted ? ersStatus.percentage : 0) / 100);
  const ersStatusTone = !ersStatus.attempted ? 'pending' : ersStatus.passed ? 'pass' : 'fail';
  const ersCtaLabel = !ersStatus.attempted ? 'Start Assessment' : ersStatus.passed ? 'View Results' : 'Retake Assessment';
  const ersCtaSubtext = !ersStatus.attempted ? 'Begin your empowerment journey' : ersStatus.passed ? 'See your certificate & score' : 'Track your progress and improve';
  const ersEncourageTitle = !ersStatus.attempted ? "Let's\nBegin!" : ersStatus.passed ? 'Great\nProgress!' : 'Keep\nGoing!';
  const ersEncourageText = !ersStatus.attempted
    ? 'Take the test'
    : ersStatus.passed
      ? 'Keep it up!'
      : "You're close";
  const ersCompletedOnLabel = ersStatus.completedOn
    ? new Date(ersStatus.completedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const KRISHI_COINS_BALANCE = 12450;
  const [coinsDisplay, setCoinsDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCoinsDisplay(Math.round(eased * KRISHI_COINS_BALANCE));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fetchErsStatus = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      const res = await fetch(`http://${window.location.hostname}:8080/api/ers/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.attempted) {
        setErsStatus({
          attempted: true,
          percentage: data.status.percentage,
          passed: data.status.passed,
          completedOn: data.status.createdAt,
        });
      } else {
        setErsStatus({ attempted: false, percentage: 0, passed: false, completedOn: null });
      }
    } catch (e) {
      console.error('Failed to fetch ERS status', e);
    }
  };

  useEffect(() => {
    fetchErsStatus();
  }, []);

  // Cycle the hero banner between the intro copy and the scrolling services strip, forever.
  useEffect(() => {
    const duration = heroPhase === 'content' ? HERO_CONTENT_DURATION : HERO_SERVICES_DURATION;
    const next = heroPhase === 'content' ? 'services' : 'content';
    const timer = setTimeout(() => setHeroPhase(next), duration);
    return () => clearTimeout(timer);
  }, [heroPhase]);

  const toggleMenu = (depth, id) => {
    setOpenMenus(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (Number(k) >= depth) delete next[k]; });
      if (prev[depth] !== id) next[depth] = id;
      return next;
    });
  };

  const branchContainsActive = (item) => {
    if (item.id === activeTab) return true;
    return !!item.subItems && item.subItems.some(branchContainsActive);
  };

  const firstLeafId = (item) => (item.subItems ? firstLeafId(item.subItems[0]) : item.id);

  const renderNavItems = (items, depth = 0) => (
    <ul className={depth === 0 ? 'db-nav-list' : 'db-nav-sublist'}>
      {items.map(item => {
        const hasSubItems = !!item.subItems;
        const isOpen = openMenus[depth] === item.id;
        const isActiveBranch = branchContainsActive(item);
        return (
          <React.Fragment key={item.id}>
            <li
              className={`${depth === 0 ? 'db-nav-item' : 'db-nav-subitem'} ${isActiveBranch ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (hasSubItems) {
                  toggleMenu(depth, item.id);
                  setActiveTab(firstLeafId(item));
                } else {
                  setActiveTab(item.id);
                }
              }}
            >
              <item.icon size={depth === 0 ? 18 : 15} className="db-nav-icon" />
              <span className="db-nav-title">{item.title}</span>
              {hasSubItems && (
                <ChevronDown
                  size={16}
                  className="db-nav-arrow"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              )}
            </li>
            {hasSubItems && isOpen && renderNavItems(item.subItems, depth + 1)}
          </React.Fragment>
        );
      })}
    </ul>
  );

  // Simulated active tabs logic from ExportsPortal...
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="dashboard" />
      <div className="db-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sidebar-bg" style={{ backgroundImage: "url('/images/sidebar_bg.avif')" }}>
          <div className="db-sidebar-overlay"></div>
        </div>
        
        <div className="db-sidebar-content">
          {/* Logo & Header */}
          <div className="db-sidebar-header">
            <div className="db-logo-wrapper">
              <img src="/dashboard-logo.avif" alt="Logo" className="db-logo" />
            </div>
            <div className="db-brand-text">
              <h2 className="db-brand-title">FEED MSCS</h2>
              <div className="db-brand-subtitle">SAFE MISSION</div>
              <div className="db-brand-tagline">Cooperative Dashboard</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="db-nav">
            {sidebarMenu.map((group, gIdx) => (
              <div key={gIdx} className="db-nav-group">
                {group.category && <h3 className="db-nav-category">{group.category}</h3>}
                {renderNavItems(group.items)}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="db-main">
        
        {/* Top Header */}


        <div className="db-content-scroll">

          {ersPanelOpen ? (
            <ErsAssessmentPanel
              onBack={() => setErsPanelOpen(false)}
              onStatusUpdated={fetchErsStatus}
            />
          ) : plansPanelOpen ? (
            <PlansPage onBack={() => setPlansPanelOpen(false)} />
          ) : !activeTab.startsWith('profile') ? (
            <>
              {/* Hero Banner */}
          <section className="db-hero">
            <div className="db-hero-bg" style={{ backgroundImage: "url('/images/hero_bg.avif')" }}>
              <div className="db-hero-overlay"></div>
            </div>
            
            <div className="db-hero-content-stage">
              <div className={`db-hero-content ${heroPhase === 'content' ? 'is-active' : 'is-hidden'}`}>
                <h2>Empowering Farmers,<br/>Building a Better Tomorrow</h2>
                <p>Manage, Grow, Achieve – All in One Place</p>
                <button className="db-btn-primary">
                  Explore Dashboard <ArrowRight size={18} />
                </button>
              </div>

              <div className={`db-hero-services ${heroPhase === 'services' ? 'is-active' : 'is-hidden'}`}>
                <span className="db-hero-services-eyebrow">Explore Our Services</span>
                <div className="db-hero-services-track-wrap">
                  <div className="db-hero-services-track">
                    {[...servicesMegaMenu, ...servicesMegaMenu].map((service, idx) => (
                      <div className="db-hero-service-chip" key={`${service.name}-${idx}`}>
                        <div className={`srv-icon-circle color-${service.color}`}>
                          <img src={service.img} alt={service.name} className="srv-card-image" />
                        </div>
                        <span className="db-hero-service-chip-label">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <img src="/images/farmer_illustration.avif" alt="Farmer" className="db-hero-farmer" />
          </section>



          {/* Overview Summary Row: ERS / Krishi Coins / Plan */}
          <section className="db-summary-grid">

            <div
              className="db-summary-card db-ers-card"
              onClick={() => setErsPanelOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setErsPanelOpen(true); } }}
            >
              <svg className="db-ers-illustration" viewBox="0 0 140 80" aria-hidden="true" focusable="false">
                <circle cx="112" cy="18" r="10" fill="#fde68a" />
                <path d="M0 62 C 30 46, 60 70, 90 50 C 105 40, 120 46, 140 38 L140 80 L0 80 Z" fill="#a7f3d0" opacity="0.6" />
                <path d="M0 70 C 35 58, 70 76, 140 60 L140 80 L0 80 Z" fill="#5eead4" opacity="0.5" />
                <rect x="30" y="58" width="3" height="10" fill="#0f766e" opacity="0.75" />
                <circle cx="31.5" cy="54" r="7" fill="#34d399" opacity="0.75" />
                <rect x="58" y="52" width="20" height="16" rx="1.5" fill="#ffffff" stroke="#0d9488" strokeWidth="1.2" opacity="0.85" />
                <path d="M55 52 L68 42 L81 52 Z" fill="#0d9488" opacity="0.85" />
              </svg>

              <div className="db-ers-header">
                <div className="db-ers-icon">
                  <Sprout size={19} strokeWidth={2.2} />
                </div>
                <div className="db-ers-heading">
                  <h4 className="db-ers-title">ERS</h4>
                  <div className="db-ers-heading-row">
                    <p className="db-ers-subtitle">Empowerment &amp; Rural Support</p>
                    <span className="db-ers-badge">
                      <span className="db-ers-badge-dot" aria-hidden="true"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="db-ers-body">
                <div className="db-ers-progress-col">
                  <div className="db-ers-ring">
                    <svg viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="ersRingGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <circle className="db-ers-ring-track" cx="50" cy="50" r={ERS_RING_RADIUS} />
                      <circle
                        className="db-ers-ring-fill"
                        cx="50" cy="50" r={ERS_RING_RADIUS}
                        style={{ strokeDasharray: ERS_RING_CIRCUMFERENCE, strokeDashoffset: ersRingOffset }}
                      />
                    </svg>
                    <div className="db-ers-ring-center">
                      {ersStatus.attempted ? (
                        <span className="db-ers-ring-value">{Math.round(ersStatus.percentage)}%</span>
                      ) : (
                        <>
                          <Play size={16} className="db-ers-ring-play" fill="currentColor" />
                          <span className="db-ers-ring-caption">Get Started</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="db-ers-encourage">
                    <div className="db-ers-encourage-icon">
                      <Activity size={12} strokeWidth={2.4} />
                    </div>
                    <div>
                      <div className="db-ers-encourage-title">
                        {ersEncourageTitle.split('\n').map((line, i) => (
                          <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                        ))}
                      </div>
                      <div className="db-ers-encourage-text">{ersEncourageText}</div>
                    </div>
                  </div>
                </div>

                <div className="db-ers-status-col">
                  <div className={`db-ers-status-panel db-ers-status-${ersStatusTone}`}>
                    <div className="db-ers-status-badge" aria-hidden="true">
                      <ShieldCheck size={12} />
                    </div>
                    <span className="db-ers-status-eyebrow">Assessment Status</span>
                    <span className="db-ers-status-value">
                      {ersStatus.attempted ? (ersStatus.passed ? 'Passed' : 'Not Passed') : 'Not Started'}
                    </span>
                    <span className="db-ers-status-sub">
                      {!ersStatus.attempted ? (
                        'Take the assessment to get started'
                      ) : ersStatus.passed ? (
                        'Completed successfully'
                      ) : (
                        <>Review your answers and <span className="db-ers-status-retake">retake</span></>
                      )}
                    </span>
                    {ersCompletedOnLabel && (
                      <div className="db-ers-status-meta">
                        <Calendar size={11} />
                        <span className="db-ers-status-meta-text">
                          <span className="db-ers-status-meta-label">Completed On</span>
                          <span className="db-ers-status-meta-date">{ersCompletedOnLabel}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button className="db-ers-cta" type="button">
                <span className="db-ers-cta-icon"><FileText size={15} /></span>
                <span className="db-ers-cta-text">
                  <strong>{ersCtaLabel}</strong>
                  <small>{ersCtaSubtext}</small>
                </span>
                <span className="db-ers-cta-arrow"><ArrowRight size={14} /></span>
              </button>
            </div>

            <div className="db-summary-card db-coins2-card">
              <div className="db-premium-glow db-coins2-glow-a" aria-hidden="true"></div>
              <div className="db-premium-glow db-coins2-glow-b" aria-hidden="true"></div>
              <Coins className="db-premium-watermark" aria-hidden="true" />
              <div className="db-premium-dots" aria-hidden="true"></div>

              <div className="db-premium-header">
                <div className="db-premium-icon-wrap db-coins2-icon-wrap">
                  <Coins size={19} strokeWidth={2.3} />
                </div>
                <div className="db-premium-heading">
                  <h4 className="db-premium-title">Krishi Coins</h4>
                  <p className="db-premium-subtitle">Your rewards balance</p>
                </div>
              </div>

              <div className="db-coins2-body">
                <div className="db-coins2-balance-col">
                  <div className="db-coins2-balance">
                    <span className="db-coins2-balance-value">{coinsDisplay.toLocaleString()}</span>
                    <span className="db-coins2-balance-label">Krishi Coins</span>
                  </div>
                  <div className="db-coins2-growth">
                    <TrendingUp size={11} /> +320 this month
                  </div>
                </div>

                <div className="db-coin-stack" aria-hidden="true">
                  <div className="db-coin-stack-glow"></div>
                  <Leaf className="db-coin-stack-leaf" size={15} strokeWidth={1.6} />
                  <div className="db-coin-stack-base"></div>
                  <div className="db-coin-stack-coin db-coin-stack-coin-3"></div>
                  <div className="db-coin-stack-coin db-coin-stack-coin-2"></div>
                  <div className="db-coin-stack-coin db-coin-stack-coin-1"></div>
                  <div className="db-coin-stack-coin db-coin-stack-coin-front">
                    <span className="db-coin-symbol">&#8377;</span>
                  </div>
                </div>
              </div>

              <div className="db-coins2-footer">
                <span className="db-premium-hint">Redeem for discounts &amp; inputs</span>
                <button className="db-premium-cta db-coins2-cta" type="button">
                  <span className="db-premium-cta-text"><strong>Redeem Now</strong></span>
                  <span className="db-premium-cta-circle"><ArrowRight size={13} /></span>
                </button>
              </div>
            </div>

            <div className="db-summary-card db-card-plan">
              <div className="db-plan-corner-ribbon">{currentPlan.name}</div>
              <div className="db-summary-top">
                <div className="db-summary-left">
                  <div className="db-summary-icon-wrap">
                    <Crown size={19} />
                  </div>
                  <div>
                    <h4 className="db-summary-title">Plan</h4>
                    <p className="db-summary-subtitle">{currentPlan.duration}</p>
                  </div>
                </div>
                <div className="db-summary-right">
                  <div className="db-plan-tier-badge"><Crown size={12} fill="currentColor" /> {currentPlan.name}</div>
                  <button className="db-upgrade-btn" onClick={() => setPlansPanelOpen(true)}>Manage Plan <ArrowRight size={14} /></button>
                </div>
              </div>
              <div className="db-summary-bar-track">
                <div className="db-summary-bar-fill"></div>
              </div>
            </div>

          </section>



          {/* Quick Access - Frequently Used */}
          <section className="db-quick-actions">
            <div className="db-section-header">
              <div className="db-section-line"></div>
              <h3>Quick Access – Frequently Used</h3>
            </div>
            
            <div className="db-actions-grid">
              
              <div className="db-action-card bg-pastel-green">
                <img src="/images/farmer_profile.avif" alt="Profile" className="db-action-img" />
                <h4>Update<br/>My Profile</h4>
                <button className="db-action-btn bg-dark-green"><ChevronRight size={18} /></button>
              </div>

              <div className="db-action-card bg-pastel-blue">
                <img src="/images/veg_produce.avif" alt="Product" className="db-action-img" />
                <h4>Add<br/>Product / Service</h4>
                <button className="db-action-btn bg-dark-blue"><ChevronRight size={18} /></button>
              </div>

              <div className="db-action-card bg-pastel-orange">
                <img src="/images/people_group.avif" alt="Members" className="db-action-img" />
                <h4>View<br/>Members</h4>
                <button className="db-action-btn bg-dark-orange"><ChevronRight size={18} /></button>
              </div>

              <div className="db-action-card bg-pastel-purple">
                <img src="/images/chart_report.avif" alt="Reports" className="db-action-img" />
                <h4>View<br/>Reports</h4>
                <button className="db-action-btn bg-dark-purple"><ChevronRight size={18} /></button>
              </div>

              <div className="db-action-card bg-pastel-pink">
                <img src="/images/megaphone.avif" alt="Alerts" className="db-action-img" />
                <h4>News &<br/>Alerts</h4>
                <button className="db-action-btn bg-dark-pink"><ChevronRight size={18} /></button>
              </div>

            </div>
          </section>



          <section className="db-widgets-grid">

            {/* Latest Alerts & Announcements */}
            <div className="db-widget-card">
              <div className="db-widget-header">
                <BellRing size={20} color="#db2777" />
                <h3>Latest Alerts & Announcements</h3>
              </div>
              <div className="db-widget-content">
                <div className="db-alert-list">
                  {[...alertsData, ...alertsData].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="db-alert-item">
                      <div className="db-alert-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                        <item.icon size={16} />
                      </div>
                      <div className="db-alert-info">
                        <div className="db-alert-title-row">
                          <div className="db-alert-title-group">
                            {item.tag && <span className="db-alert-tag">{item.tag}</span>}
                            <h4>{item.title}</h4>
                          </div>
                          <span className="db-alert-time">{item.time}</span>
                        </div>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="db-widget-footer">
                <button className="db-view-all">View All Alerts</button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="db-widget-card">
              <div className="db-widget-header">
                <Activity size={20} color="#2563eb" />
                <h3>Recent Activity</h3>
              </div>
              <div className="db-widget-content">
                <div className="db-activity-list">
                  {[...activityData, ...activityData].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="db-activity-item">
                      <div className="db-activity-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                        <item.icon size={16} />
                      </div>
                      <div className="db-activity-info">
                        <div className="db-activity-top">
                          <h4>{item.title}</h4>
                          <span>{item.time}</span>
                        </div>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="db-widget-footer">
                <button className="db-view-all">View All Activity</button>
              </div>
            </div>

            {/* Market Prices */}
            <div className="db-widget-card">
              <div className="db-widget-header">
                <BarChart3 size={20} color="#ea580c" />
                <h3>Market Prices</h3>
              </div>
              <div className="db-market-table">
                <div className="db-market-table-head">
                  <span>Commodity</span>
                  <span>Price (₹/q)</span>
                  <span>Change</span>
                </div>
                <div className="db-market-table-body-wrap">
                  <div className="db-market-table-body">
                    {[...marketItems, ...marketItems].map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="db-market-table-row">
                        <div className="db-market-table-name">
                          <div className={`db-market-icon ${item.bg}`}>{item.icon}</div>
                          <span className="db-market-name">{item.name}</span>
                        </div>
                        <div className="db-market-table-price">{item.price}</div>
                        <div className={`db-market-table-change ${item.trend}`}>
                          {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {item.percent}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="db-widget-footer">
                <button className="db-view-full-market">View Full Market</button>
              </div>
            </div>

          </section>
            </>
          ) : (
            <div style={{ padding: '24px' }}>
              <div className="hide-scrollbar" style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '16px'
              }}>
                {[
                  { id: 'profile-details', label: 'My Details', icon: User, bg: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' },
                  { id: 'profile-products', label: 'My Products', icon: Package, bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
                  { id: 'profile-vendors', label: 'My Vendors', icon: Users, bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
                  { id: 'profile-certificates', label: 'My Certificates & Licences', icon: FileText, bg: '#fdf4ff', color: '#c026d3', border: '#fbcfe8' },
                  { id: 'profile-testimonials', label: 'My Testimonials', icon: Star, bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
                  { id: 'profile-subscriptions', label: 'Active Subscriptions', icon: Settings, bg: '#f0fdfa', color: '#0d9488', border: '#ccfbf1' },
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        backgroundColor: tab.bg,
                        color: tab.color,
                        border: isActive ? `2px solid ${tab.color}` : `1px solid ${tab.border}`,
                        padding: isActive ? '11px 19px' : '12px 20px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: isActive ? `0 4px 10px ${tab.border}` : '0 2px 4px rgba(0,0,0,0.05)',
                        flexShrink: 0
                      }}
                    >
                      <tab.icon size={18} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '24px', minHeight: '60vh' }}>
                {activeTab === 'profile-details' ? (
                  <MyDetailsForm />
                ) : (
                  <div style={{ minHeight: '60vh', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1.125rem' }}>
                    <p>Content will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </main>

    </div>
    <Footer />
    </div>
  );
};

export default Dashboard;
