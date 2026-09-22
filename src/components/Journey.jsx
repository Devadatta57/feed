import React, { useEffect, useRef } from 'react';
import {
  Leaf, Users, ClipboardCheck, Sprout, Settings2, Truck, TrendingUp, Send, Globe
} from 'lucide-react';
import './Journey.css';

const journeyStages = [
  { num: '01', id: 'join', tone: 'green', Icon: Users, title: 'Join', desc: 'Enroll as a farmer, FPO, SHG or partner.', img: '/images/journey/01_join.avif' },
  { num: '02', id: 'assess', tone: 'blue', Icon: ClipboardCheck, title: 'Assess', desc: 'Farm, crop and market assessment to understand opportunities.', img: '/images/journey/02_assess.avif' },
  { num: '03', id: 'grow', tone: 'orange', Icon: Sprout, title: 'Grow', desc: 'Multi-layer production supported by GAP-oriented and sustainable farming practices.', img: '/images/journey/03_grow.avif' },
  { num: '04', id: 'add_value', tone: 'purple', Icon: Settings2, title: 'Add Value', desc: 'Sorting, grading, processing and packaging to create higher-value products.', img: '/images/journey/04_add_value.avif' },
  { num: '05', id: 'go_to_market', tone: 'teal', Icon: Truck, title: 'Go to Market', desc: 'Connect with buyers, trade opportunities, exports and logistics.', img: '/images/journey/05_go_to_market.avif' },
  { num: '06', id: 'scale', tone: 'coral', Icon: TrendingUp, title: 'Scale', desc: 'Technology, training, assets and enterprise support for long-term growth.', img: '/images/journey/06_scale.avif' }
];

const impactStrip = [
  { label: 'Sustainable Farms', sub: 'For Today and Tomorrow', Icon: Leaf, tone: 'green' },
  { label: 'Prosperous Communities', sub: 'Stronger Together', Icon: Users, tone: 'blue' },
  { label: 'Global Markets', sub: 'Greater Opportunities', Icon: Globe, tone: 'orange' },
  { label: 'Lasting Impact', sub: 'For Generations', Icon: TrendingUp, tone: 'teal' }
];

const Connector = ({ isUp }) => {
  const cy = isUp ? 5 : 35;
  const controlY = isUp ? -10 : 50;

  return (
    <div className="step-connector">
      <svg className="connector-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path
          d={`M 0,20 Q 50,${controlY} 100,20`}
          fill="none"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="path-line"
        />
        {/* Double arrow circle */}
        <circle cx="50" cy={cy} r="5" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
        <path
          d={`M 48.5,${cy - 2} L 51,${cy} L 48.5,${cy + 2} M 50.5,${cy - 2} L 53,${cy} L 50.5,${cy + 2}`}
          fill="none"
          stroke="#16a34a"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const Journey = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Subtle scroll reveal animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    const steps = sectionRef.current?.querySelectorAll('.journey-step');
    steps?.forEach((step, index) => {
      step.style.setProperty('--stagger', `${index * 0.15}s`);
      observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="journey-section" ref={sectionRef}>
      <div className="journey-decor" aria-hidden="true">
        <span className="journey-leaf journey-leaf-1" />
        <span className="journey-leaf journey-leaf-2" />
      </div>

      <div className="journey-header">
        <span className="journey-annotation journey-annotation-left">Stronger Farmers,<br />Brighter Tomorrows</span>
        <span className="journey-annotation journey-annotation-right"><Send size={14} className="journey-annotation-icon" /> From Our Farms<br />to a Better Tomorrow</span>

        <span className="journey-eyebrow"><Leaf size={13} /> How It Works</span>
        <h2 className="journey-title">
          One connected <span className="journey-title-accent">journey</span>
          <svg className="title-leaf" viewBox="0 0 24 24" fill="#16a34a" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.025 2.5C10.45 2.5 4.5 7.5 2.5 14C2.5 14 6 13.5 9 15C9 15 6 16.5 4 21.5C11 21.5 17.5 16 20.5 9C20.5 9 22.5 4 17.025 2.5Z" />
          </svg>
        </h2>
        <p className="journey-desc">SAFE Mission is a guided pathway from membership and farm assessment to production, value addition, markets and scale.</p>
      </div>

      <div className="journey-container">
        <div className="journey-steps">
          {journeyStages.map((stage, index) => {
            const isLast = index === journeyStages.length - 1;
            // Alternate the wave pattern: down, up, down, up, down
            const isUp = index % 2 === 1;

            return (
              <div className={`journey-step tone-${stage.tone}`} key={stage.id}>
                {/* SVG Connecting Path */}
                {!isLast && <Connector isUp={isUp} />}

                <span className="journey-num">{stage.num}</span>

                <div className="journey-image-wrapper">
                  <img src={stage.img} alt={stage.title} className="journey-image" />
                  <span className="journey-icon-badge"><stage.Icon size={17} /></span>
                </div>

                <div className="journey-text-content">
                  <h3 className="journey-step-title">{stage.title}</h3>
                  <p className="journey-step-desc">{stage.desc}</p>
                  <span className="journey-accent-line" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="journey-impact-strip">
        {impactStrip.map(({ label, sub, Icon, tone }) => (
          <div className={`journey-impact-item tone-${tone}`} key={label}>
            <span className="journey-impact-icon"><Icon size={17} /></span>
            <div className="journey-impact-text">
              <strong>{label}</strong>
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Journey;
