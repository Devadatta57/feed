import React, { useEffect, useRef, useState } from 'react';
import { Globe, ArrowRight, ShieldCheck, TrendingUp, Landmark, LineChart, Briefcase } from 'lucide-react';
import './WhyExports.css';

const WhyExports = () => {
  const cardsRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCardsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="we-main-content">
      {/* Hero Section */}
      <section className="we-hero">
        <div className="we-hero-overlay"></div>
        <div className="we-hero-left">
          <h1 className="we-hero-title">Why Exports?</h1>
          <p className="we-hero-desc">
            Exports open up a world of opportunities for farmers, traders, MSMEs, and entrepreneurs. By stepping into the global market, you reduce domestic dependency, increase profitability, and build an internationally recognized brand. Embrace the global stage to scale your business sustainably.
          </p>
          <div className="we-hero-glass-cards">
            <div className="we-glass-card">
              <Globe className="we-icon" size={20} />
              <span>Global Opportunities</span>
            </div>
            <div className="we-glass-card">
              <ShieldCheck className="we-icon" size={20} />
              <span>Government Support</span>
            </div>
            <div className="we-glass-card">
              <TrendingUp className="we-icon" size={20} />
              <span>Higher Profits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Curve */}
      <div className="we-curve-transition">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="#ffffff"></path>
        </svg>
      </div>

      {/* Content Section */}
      <section className="we-content-section">
        <div className="we-center-heading">
          <h2>Why Exports?</h2>
          <p>Unlocking global potential, securing better margins, and driving economic growth for your enterprise.</p>
        </div>

        <div className="we-info-bar">
          <div className="we-info-glow"></div>
          <strong>Premium Advantage:</strong> Access global markets with structured government support, leading to sustainable and risk-mitigated business expansion.
        </div>

        <div className={`we-premium-cards ${cardsVisible ? 'animate-in' : ''}`} ref={cardsRef}>
          {/* Card 1 */}
          <div className="we-premium-card border-green">
            <div className="we-card-top">
              <span className="we-card-badge">01</span>
              <div className="we-card-icon-wrapper icon-green">
                <Briefcase size={22} />
              </div>
            </div>
            <h3 className="we-card-title">Benefits of Exporting</h3>
            <p className="we-card-text">Expand your horizons, diversify your market presence, and significantly increase your revenue streams.</p>
            <button className="we-card-btn btn-green">Explore <ArrowRight size={16} /></button>
          </div>

          {/* Card 2 */}
          <div className="we-premium-card border-blue">
            <div className="we-card-top">
              <span className="we-card-badge">02</span>
              <div className="we-card-icon-wrapper icon-blue">
                <Landmark size={22} />
              </div>
            </div>
            <h3 className="we-card-title">Government Incentives</h3>
            <p className="we-card-text">Leverage tax benefits, subsidies, and promotional schemes designed exclusively for exporters.</p>
            <button className="we-card-btn btn-blue">Explore <ArrowRight size={16} /></button>
          </div>

          {/* Card 3 */}
          <div className="we-premium-card border-purple">
            <div className="we-card-top">
              <span className="we-card-badge">03</span>
              <div className="we-card-icon-wrapper icon-purple">
                <Globe size={22} />
              </div>
            </div>
            <h3 className="we-card-title">International Market Opportunities</h3>
            <p className="we-card-text">Identify and target high-demand regions worldwide to establish a robust global footprint.</p>
            <button className="we-card-btn btn-purple">Explore <ArrowRight size={16} /></button>
          </div>

          {/* Card 4 */}
          <div className="we-premium-card border-teal">
            <div className="we-card-top">
              <span className="we-card-badge">04</span>
              <div className="we-card-icon-wrapper icon-teal">
                <LineChart size={22} />
              </div>
            </div>
            <h3 className="we-card-title">Export Success Stories</h3>
            <p className="we-card-text">Learn from top enterprises who transformed their local operations into global success.</p>
            <button className="we-card-btn btn-teal">Explore <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WhyExports;
