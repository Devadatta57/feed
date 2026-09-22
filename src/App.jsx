import React, { useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import ExportsPortal from './pages/ExportsPortal';
import Product360 from './pages/Product360';
import FpoPortal from './pages/FpoPortal';
import HowFeedWorks from './pages/HowFeedWorks';
import ToolsServices from './pages/ToolsServices';
import MyBusiness from './pages/MyBusiness';
import BusinessAccount from './pages/BusinessAccount';
import AgmBoard from './pages/AgmBoard';
import BusinessPlan from './pages/BusinessPlan';
import PublicationsHub from './pages/PublicationsHub';
import Epm from './pages/Epm';
import EpmDetails from './pages/EpmDetails';
import EpmGallery from './pages/EpmGallery';
import EpmObjective from './pages/EpmObjective';
import EpmContentCoverage from './pages/EpmContentCoverage';
import EpmBenefits from './pages/EpmBenefits';
import EpmInvitees from './pages/EpmInvitees';
import EpmRegister from './pages/EpmRegister';
import EpmVolunteer from './pages/EpmVolunteer';
import EpmEventDetails from './pages/EpmEventDetails';
import SafeMission from './pages/SafeMission';
import AdminDashboard from './pages/admin/AdminDashboard';
import MyBusinessLayout from './components/MyBusinessLayout';
import useScrollToTop from './hooks/useScrollToTop';
// import TradeFairs from './pages/TradeFairs';

function MyBusinessPlaceholder({ onNavigate, isLoggedIn, user, onLogout, currentTab }) {
  return (
    <MyBusinessLayout 
      onNavigate={onNavigate} 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={onLogout}
      currentTab={currentTab}
    >
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        <h2>Page Under Construction</h2>
        <p>This module is currently being built.</p>
      </div>
    </MyBusinessLayout>
  );
}

// This app has no react-router-dom - the URL never changes between pages, so a hard refresh
// would otherwise always remount App to its `useState('home')` default. Stashing the current
// page in sessionStorage (per-tab, cleared when the tab closes) lets a refresh land back on
// whatever page was actually open instead of bouncing to home.
const PAGE_STORAGE_KEY = 'feed_current_page';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      return sessionStorage.getItem(PAGE_STORAGE_KEY) || 'home';
    } catch {
      return 'home';
    }
  });

  const [user, setUser] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('jwt');
  });

  const handleLogin = (userData) => {
    if (userData && userData.token) {
      localStorage.setItem('jwt', userData.token);
      setUser(userData);
      setIsLoggedIn(true);
      // ADMIN accounts (see UserServiceImpl#resolveRole - whoever logs in with the configured
      // feedworld.admin.email) land on the publication admin dashboard instead of the regular
      // homepage; everyone else's login is unchanged.
      handleNavigate(userData.role === 'ADMIN' ? 'admin-dashboard' : 'home');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        await fetch(`http://${window.location.hostname}:8080/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('jwt');
    setUser(null);
    setIsLoggedIn(false);
    handleNavigate('home');
  };

  React.useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const res = await fetch(`http://${window.location.hostname}:8080/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setIsLoggedIn(true);
          } else {
            // Invalid token
            localStorage.removeItem('jwt');
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (e) {
          console.error('Failed to validate token', e);
        }
      }
    };
    validateToken();
  }, []);

  React.useEffect(() => {
    // Navbar dispatches this after the user uploads/removes their profile picture (each page
    // mounts its own Navbar instance, so this keeps App's single `user` state in sync without
    // threading a callback prop through every page).
    const handleProfileImageUpdated = (event) => {
      setUser((prev) => (prev ? { ...prev, profileImageUrl: event.detail?.profileImageUrl ?? null } : prev));
    };
    window.addEventListener('feed:profile-image-updated', handleProfileImageUpdated);
    return () => window.removeEventListener('feed:profile-image-updated', handleProfileImageUpdated);
  }, []);

  React.useEffect(() => {
    // Without this, the browser's own scroll-position restoration on back/forward navigation
    // races with (and usually wins over) useScrollToTop below, leaving the page scrolled to
    // wherever it happened to be instead of the top.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        const { page, ...rest } = event.state;
        setNavState(rest);
      } else {
        setCurrentPage('home');
        setNavState({});
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize history state on first load
    if (!window.history.state) {
      window.history.replaceState({ page: currentPage }, '');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage]);

  React.useEffect(() => {
    try {
      sessionStorage.setItem(PAGE_STORAGE_KEY, currentPage);
    } catch {
      // sessionStorage unavailable (e.g. private mode) - refresh just falls back to home
    }
  }, [currentPage]);

  const [navState, setNavState] = useState({});

  const handleNavigate = (page, extraState = {}) => {
    setCurrentPage(page);
    setNavState(extraState);
    window.history.pushState({ page, ...extraState }, '');
  };

  React.useEffect(() => {
    if ((currentPage === 'product360' || currentPage === 'dashboard' || currentPage === 'admin-dashboard') && !isLoggedIn) {
      handleNavigate('login');
      return;
    }
    // Defense in depth only - the real enforcement is server-side (SecurityConfig's
    // hasRole("ADMIN") on /api/admin/publications/**). A non-admin who lands here some other
    // way (e.g. typing history state back in) is just bounced to home, not shown the page.
    if (currentPage === 'admin-dashboard' && isLoggedIn && user && user.role !== 'ADMIN') {
      handleNavigate('home');
    }
  }, [currentPage, isLoggedIn, user]);

  useScrollToTop(currentPage);



  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onRegisterClick={() => handleNavigate('register')} onBack={() => handleNavigate('home')} />;
  }

  if (currentPage === 'register') {
    return <Register onBackToLogin={() => handleNavigate('login')} />;
  }

  if (currentPage === 'contact') {
    return <ContactUs onNavigate={handleNavigate} />;
  }

  if (currentPage === 'product360') {
    if (!isLoggedIn) {
      return null;
    }
    return <Product360 onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />;
  }

  return (
    <div className={`app-container ${['home', 'exports', 'fpo', 'how', 'dashboard', 'admin-dashboard', 'tools', 'mybusiness', 'business-account', 'business-profile', 'compliances', 'agm-board', 'business-plan', 'loans-schemes', 'marketing', 'reports', 'connect', 'feedworld', 'epm', 'epm-details', 'epm-gallery', 'epm-objective', 'epm-content-coverage', 'epm-benefits', 'epm-invitees', 'epm-register', 'epm-volunteer', 'safe-mission'].includes(currentPage) ? 'is-home' : ''}`}>
      {/* Search Blur Overlay */}
      {searchQuery && <div className="search-blur-overlay" onClick={() => setSearchQuery('')}></div>}

      <div className={`main-content-bg ${searchQuery ? 'content-blurred' : ''}`}>
        {currentPage === 'home' ? (
          <Home onNavigate={handleNavigate} searchQuery={searchQuery} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'exports' ? (
          <ExportsPortal onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'fpo' ? (
          <FpoPortal onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'how' ? (
          <HowFeedWorks onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'dashboard' ? (
          !isLoggedIn ? null : <Dashboard onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'admin-dashboard' ? (
          !isLoggedIn || user?.role !== 'ADMIN' ? null : (
            <AdminDashboard onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          )
        ) : currentPage === 'tools' ? (
          <ToolsServices onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'mybusiness' ? (
          <MyBusiness onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'business-account' ? (
          <BusinessAccount onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'agm-board' ? (
          <AgmBoard onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'business-plan' ? (
          <BusinessPlan onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'feedworld' ? (
          // An ADMIN landing on Feed World (e.g. via the Services mega menu, not just the
          // post-login redirect) gets the publication management view instead of the regular
          // reader page - same underlying feature, so there's no separate "admin" tile to add.
          user?.role === 'ADMIN' ? (
            <AdminDashboard onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          ) : (
            <PublicationsHub onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
          )
        ) :currentPage === 'TradeFairs'?(
          <TradeFairs onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        )
        : currentPage === 'epm' ? (
          <Epm onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-details' ? (
          <EpmDetails onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-event-details' ? (
          <EpmEventDetails onNavigate={handleNavigate} eventId={navState.eventId} />
        ) : currentPage === 'epm-gallery' ? (
          <EpmGallery onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-objective' ? (
          <EpmObjective onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-content-coverage' ? (
          <EpmContentCoverage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-benefits' ? (
          <EpmBenefits onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-invitees' ? (
          <EpmInvitees onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-register' ? (
          <EpmRegister onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'epm-volunteer' ? (
          <EpmVolunteer onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : currentPage === 'safe-mission' ? (
          <SafeMission onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        ) : ['business-profile', 'compliances', 'loans-schemes', 'marketing', 'reports', 'connect'].includes(currentPage) ? (
          <MyBusinessPlaceholder onNavigate={handleNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} currentTab={currentPage} />
        ) : null}
      </div>

    </div>
  );
}

export default App;
