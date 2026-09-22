import React from 'react';
import './Footer.css';
import { 
  ChevronRight, 
  Link as LinkIcon, 
  Briefcase, 
  BarChart2, 
  Headphones, 
  Users,
  ShieldCheck,
  FileText,
  Lock,
  ArrowUp,
  Mail,
  Send
} from 'lucide-react';
import logo from '../assets/logo.avif';

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const FooterBackground = () => (
  <div className="footer-premium-bg" aria-hidden="true">
    <div className="f-mesh-1" />
    <div className="f-mesh-2" />
    <div className="f-mesh-3" />

    <div className="f-ambient-glow" />
    <div className="f-newsletter-glow" />

    <div className="f-world-map" />

    <div className="f-planet-green">
      <div className="f-planet-core" />
      <div className="f-planet-ring f-planet-ring-1" />
      <div className="f-planet-ring f-planet-ring-2" />
    </div>

    <div className="f-planet-orange" />

    <svg className="f-leaf-tl" viewBox="0 0 100 100">
      <path d="M0,0 C50,0 100,50 100,100 C50,100 0,50 0,0 Z" fill="rgba(34,197,94,0.04)" />
    </svg>
    <svg className="f-leaf-br" viewBox="0 0 100 100">
      <path d="M100,100 C50,100 0,50 0,0 C50,0 100,50 100,100 Z" fill="rgba(34,197,94,0.04)" />
    </svg>

    <div className="f-stars">
      <div className="f-star f-star-1" />
      <div className="f-star f-star-2" />
      <div className="f-star f-star-3" />
      <div className="f-star f-star-4" />
      <div className="f-star f-star-5" />
      <div className="f-star f-star-6" />
      <div className="f-star f-star-7" />
      <div className="f-star f-star-8" />
    </div>

    <div className="f-vignette" />
    
    <svg width="0" height="0">
      <defs>
        <linearGradient id="f-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="f-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="new-footer">
      <FooterBackground />
      <div className="footer-container">
        
        {/* Top Banner */}
        <div className="footer-top-banner">
          <div className="banner-left">
            <div className="banner-logo-placeholder">
              <img src={logo} alt="FEED Logo" className="banner-logo" />
            </div>
            <div className="banner-text-content">
              <h2>Together We Empower.<br/><span className="text-green">Together We Grow.</span></h2>
              <p>FEED is a multi-state cooperative society working for the uplift of exports from all corners of <span className="text-green">India</span>.</p>
            </div>
          </div>
          <div className="banner-right">
            <div className="subscribe-card">
              <h3>Stay updated with<br/><span className="text-green">latest insights</span> & opportunities</h3>
              <div className="subscribe-input-group">
                <Mail className="input-icon" size={16} />
                <input type="email" placeholder="Enter your email address" />
                <button className="subscribe-btn">Subscribe <Send size={12} /></button>
              </div>
              <p className="privacy-note"><Lock size={10} /> We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-links-section">
          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="column-title"><div className="icon-bg green-bg"><LinkIcon size={14} /></div> Quick Links</h4>
            <ul className="footer-list">
              <li><a href="#"><ChevronRight size={12} /> Sitemap</a></li>
              <li><a href="#"><ChevronRight size={12} /> Pricing</a></li>
              <li><a href="#"><ChevronRight size={12} /> Join us</a></li>
              <li><a href="#"><ChevronRight size={12} /> Contact us</a></li>
            </ul>
            <div className="info-card light-green-card">
              <p>Empowering<br/>Communities.<br/>Strengthening<br/>Exports.</p>
              <div className="card-icon-placeholder globe-sprout"></div>
            </div>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h4 className="column-title"><div className="icon-bg purple-bg"><Briefcase size={14} /></div> Services</h4>
            <ul className="footer-list">
              <li><a href="#"><ChevronRight size={12} /> My Fpo</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Farm</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Business</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Products</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Exports</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Market</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Education</a></li>
              <li><a href="#"><ChevronRight size={12} /> My Tools</a></li>
            </ul>
          </div>

          {/* FEED Insights */}
          <div className="footer-column">
            <h4 className="column-title"><div className="icon-bg blue-bg"><BarChart2 size={14} /></div> FEED Insights</h4>
            <ul className="footer-list">
              <li><a href="#"><ChevronRight size={12} /> Suggestions</a></li>
              <li><a href="#"><ChevronRight size={12} /> Sample works</a></li>
              <li><a href="#"><ChevronRight size={12} /> Queries</a></li>
              <li><a href="#"><ChevronRight size={12} /> Complaints</a></li>
            </ul>
            <div className="info-card light-blue-card">
              <div className="card-content-flex">
                 <div className="doc-icon-wrapper"><FileText size={18} /></div>
                 <div>
                   <p>Insights that inspire.<br/>Knowledge that<br/>creates impact.</p>
                 </div>
              </div>
              <a href="#" className="explore-link">Explore Insights &rarr;</a>
            </div>
          </div>

          {/* Help */}
          <div className="footer-column">
            <h4 className="column-title"><div className="icon-bg orange-bg"><Headphones size={14} /></div> Help</h4>
            <ul className="footer-list">
              <li><a href="#"><ChevronRight size={12} /> FAQs</a></li>
              <li><a href="#"><ChevronRight size={12} /> Reporting</a></li>
              <li><a href="#"><ChevronRight size={12} /> Documentation</a></li>
              <li><a href="#"><ChevronRight size={12} /> Support Policy</a></li>
              <li><a href="#"><ChevronRight size={12} /> Terms & conditions</a></li>
              <li><a href="#" className="text-orange"><ChevronRight size={12} /> Privacy Policy</a></li>
              <li><a href="#"><ChevronRight size={12} /> Disclaimer</a></li>
            </ul>
          </div>

          {/* Connect with us */}
          <div className="footer-column">
            <h4 className="column-title"><div className="icon-bg pink-bg"><Users size={14} /></div> Connect with us</h4>
            <p className="connect-text">Stay connected with our latest insights, services, and opportunities.</p>
            <div className="social-icons-row">
              <a href="#" className="social-circle fb"><FacebookIcon /></a>
              <a href="#" className="social-circle tw"><TwitterIcon /></a>
              <a href="#" className="social-circle li"><LinkedinIcon /></a>
              <a href="#" className="social-circle ig"><InstagramIcon /></a>
              <a href="#" className="social-circle yt"><YoutubeIcon /></a>
            </div>
            <div className="info-card green-gradient-card">
              <p><strong>Let's build a<br/>stronger tomorrow,<br/>together.</strong></p>
              <button className="join-btn">Join FEED Community &rarr;</button>
              <div className="card-bg-image"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <div className="bottom-left">
            <img src={logo} alt="Company Logo" className="bottom-logo" />
            <div className="copyright-text">
              <p>&copy; 2026 FEED Organization.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
          
          <div className="bottom-right">
            <a href="#" className="bottom-link"><ShieldCheck size={14} /> Privacy Policy</a>
            <span className="divider">|</span>
            <a href="#" className="bottom-link"><FileText size={14} /> Terms & Conditions</a>
            <span className="divider">|</span>
            <a href="#" className="bottom-link"><Lock size={14} /> Disclaimer</a>
            
            <button className="scroll-top-btn" onClick={scrollToTop}>
              <ArrowUp size={16} color="#0f2b3e" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
