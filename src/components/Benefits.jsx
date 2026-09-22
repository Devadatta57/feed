import React, { useEffect, useRef, useState } from 'react';
import {
  Leaf, Globe, Warehouse, Tractor, HandCoins, Users, MapPin, BarChart2, Check, ArrowRight,
  Sprout, Factory, PiggyBank, Smartphone, GraduationCap
} from 'lucide-react';
import './Benefits.css';

const benefitsData = [
  {
    id: 'farming',
    num: '01',
    tone: 'green',
    Icon: Sprout,
    title: 'Farming & Production',
    desc: 'Grow more. Grow better.',
    image: '/images/benefits/farming_production.avif',
    points: ['3×–5× yield potential', 'GAP/BharatGAP compliance support']
  },
  {
    id: 'value_addition',
    num: '02',
    tone: 'orange',
    Icon: Factory,
    title: 'Value Addition & Processing',
    desc: 'Turn produce into premium products.',
    image: '/images/benefits/value_addition.avif',
    points: ['Up to 5× price realization', 'APEDA-certified packhouse access']
  },
  {
    id: 'market_export',
    num: '03',
    tone: 'blue',
    Icon: Globe,
    title: 'Market & Export',
    desc: 'Connecting farmers to global opportunities',
    image: '/images/benefits/market_export.avif',
    points: ['2x–4x export premium', 'Direct access to global buyers', 'Support for quality & certification']
  },
  {
    id: 'commodity_trading',
    num: '04',
    tone: 'purple',
    Icon: Warehouse,
    title: 'Commodity Trading & Warehouse Finance',
    desc: 'Better storage. Better prices. Greater earnings.',
    image: '/images/benefits/warehouse_finance.avif',
    points: ['15–25% trading margin potential', 'eNAM trading & warehouse storage', 'Reduced post-harvest losses']
  },
  {
    id: 'asset_leasing',
    num: '05',
    tone: 'green',
    Icon: Tractor,
    title: 'Asset Leasing & Equipment',
    desc: 'Modern tools for modern farming.',
    image: '/images/benefits/asset_leasing.avif',
    points: ['40–50% SMAM subsidy support', 'Access to modern machinery & CHCs', 'Improved productivity & efficiency']
  },
  {
    id: 'finance_credit',
    num: '06',
    tone: 'orange',
    Icon: HandCoins,
    title: 'Finance & Credit',
    desc: 'Capital that helps farmers grow.',
    image: '/images/benefits/finance_credit.avif',
    points: ['₹15–18L FPO equity grant support', 'KCC linkage & working capital', 'Financial literacy & handholding']
  },
  {
    id: 'cost_reduction',
    num: '07',
    tone: 'blue',
    Icon: PiggyBank,
    title: 'Cost Reduction',
    desc: 'Lower costs, higher margins.',
    image: '/images/benefits/cost_reduction.avif',
    points: ['15–25% input cost reduction', 'Cooperative bulk-purchase depots']
  },
  {
    id: 'technology',
    num: '08',
    tone: 'purple',
    Icon: Smartphone,
    title: 'Technology & Traceability',
    desc: 'Digital farm-to-market visibility.',
    image: '/images/benefits/technology_traceability.avif',
    points: ['Digital farm-to-market visibility', 'Farm-to-packhouse digital monitoring']
  },
  {
    id: 'training',
    num: '09',
    tone: 'green',
    Icon: GraduationCap,
    title: 'Training & Governance',
    desc: 'Learn • Participate • Co-own',
    image: '/images/benefits/training_governance.avif',
    points: ['Farm-level & export training', 'Cooperative leadership programs']
  }
];

const highlightsData = [
  { label: 'Farmers Empowered', num: '10,000+', Icon: Users, tone: 'green' },
  { label: 'Districts Reached', num: '25', Icon: MapPin, tone: 'orange' },
  { label: 'Global Markets', num: 'EU & Gulf', Icon: Globe, tone: 'blue' },
  { label: 'Average Income Growth', num: '5x', Icon: BarChart2, tone: 'purple' }
];

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const BenefitCard = ({ b, hidden }) => {
  return (
    <article className={`benefit-card tone-${b.tone}`} aria-hidden={hidden || undefined}>
      <div className="benefit-card-top-decor"></div>
      <div className="benefit-card-header">
        <div className="benefit-card-num-wrapper">
          <span className="benefit-card-num">{b.num}</span>
        </div>

        <div className="benefit-card-icon-wrapper">
          <b.Icon size={20} />
        </div>
      </div>

      <div className="benefit-card-title-area">
        <h3>{b.title}</h3>
        <p>{b.desc}</p>
      </div>

      <div className="benefit-card-media">
        <img src={b.image} alt={b.title} loading="lazy" className="benefit-card-image" />
      </div>

      <div className="benefit-card-body">
        <ul className="benefit-points">
          {b.points.map((pt) => (
            <li key={pt}>
              <span className="benefit-check"><Check size={12} strokeWidth={3} /></span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        <div className="benefit-btn-wrapper">
          <button className="benefit-btn">
            Learn More <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

const Benefits = () => {
  const [sectionRef, inView] = useInView();
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    let animationFrameId;
    const scroll = () => {
      if (!isHovered && !isDragging) {
        track.scrollLeft += 0.7;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft -= track.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setTimeout(() => setIsDragging(false), 500);

  return (
    <section className={`benefits-section ${inView ? 'benefits-in-view' : ''}`} ref={sectionRef}>
      <div className="benefits-container">

        <div className="benefits-header">
          <span className="benefits-eyebrow"><Leaf size={11} /> TOGETHER WE EMPOWER</span>
          <h2>Benefits</h2>
          <p className="benefits-subtitle">
            SafeMission connects farmers with the knowledge, infrastructure, finance and opportunities needed to create greater value.
          </p>

          <div className="benefits-metrics-row">
            {highlightsData.map((h, i) => (
              <React.Fragment key={h.label}>
                <div className={`metric-item tone-${h.tone}`}>
                  <div className="metric-icon"><h.Icon size={15} /></div>
                  <div className="metric-text">
                    <strong>{h.num}</strong>
                    <span>{h.label}</span>
                  </div>
                </div>
                {i < highlightsData.length - 1 && <div className="metric-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      <div
        className="benefits-carousel-wrapper"
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="benefits-carousel">
          <div className="carousel-track">
             <svg className="benefits-connector hidden-mobile" viewBox="0 0 3096 100" preserveAspectRatio="none">
              <path
                d="M 172 50 Q 344 10 516 50 T 860 50 T 1204 50 T 1548 50 T 1892 50 T 2236 50 T 2580 50 T 2924 50"
                fill="none"
                stroke="url(#connector-gradient-1)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="connector-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="25%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="75%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </svg>
            {benefitsData.map((b) => <BenefitCard b={b} key={b.id} />)}
          </div>
          <div className="carousel-track" aria-hidden="true">
             <svg className="benefits-connector hidden-mobile" viewBox="0 0 3096 100" preserveAspectRatio="none">
              <path
                d="M 172 50 Q 344 10 516 50 T 860 50 T 1204 50 T 1548 50 T 1892 50 T 2236 50 T 2580 50 T 2924 50"
                fill="none"
                stroke="url(#connector-gradient-2)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="connector-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16a34a" />
                  <stop offset="25%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="75%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </svg>
            {benefitsData.map((b) => <BenefitCard b={b} key={`${b.id}-dup`} hidden />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
