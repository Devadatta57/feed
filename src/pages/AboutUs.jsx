import React, { useEffect } from 'react';
import { CheckCircle2, Eye, Target, Sprout, Cloud, Leaf, Star, Sun } from 'lucide-react';
import './AboutUs.css';

import aboutHeroBg from '../assets/about_hero_gen.avif';
import ourVision from '../assets/about_vision_gen.avif';
import ourMission from '../assets/about_mission_gen.avif';
import farmersMsmes from '../assets/about_objective_gen.avif';
import why1 from '../assets/why_1.avif';
import why2 from '../assets/why_2.avif';
import why3 from '../assets/why_3.avif';
import why4 from '../assets/why_4.avif';
import why5 from '../assets/why_5.avif';
import why6 from '../assets/why_6.avif';
import why7 from '../assets/why_7.avif';
import why8 from '../assets/why_8.avif';

const HERO_SUB =
  'Empowering Farmers, Traders, MSMEs & Rural Entrepreneurs with Technology, Training and Global Opportunities.';

const VISION_TEXT =
  'To spread to all corners of India and emerge as a one-stop solution to farmers, small traders, MSMEs, new entrepreneurs from rural and semi-urban areas for marketing their agricultural commodities in domestic and International markets by means of effective technical interface.';

const MISSION_TEXT =
  'To form product based cooperative societies (FPOs), impart the capacity building to export in the form of training sessions, provide the information on global marketing opportunities through "FEED STARTUP" Technology for their respective agricultural products and render end-to-end support in real-time export process i.e., from selection of buyers to shipment of good.';

const OBJECTIVE_TEXT =
  'FEED is a multi-state co-operative society working for the uplift of exports from all corners of India, We Provide Crucial technical software and social platform connecting : "Farmers, Traders, MSME industries & new entrepreneurs" in Rural and Semi Urban areas with "International markets, Export Promotional councils, Central and state governments, Banks and Financial institutes, ports" by organizing Exports Promotional meetings, Forming FPO\'s (product wise) and supporting the FPOs with technical information & support on processing export orders.';

const whyChooseFeed = [
  { num: '01', text: 'Registered under the Multi-State Cooperative Societies Act, 2002', img: why1, theme: 'theme-green' },
  { num: '02', text: 'India\'s first cooperative society for export promotion', img: why2, theme: 'theme-pink' },
  { num: '03', text: 'Supported by 15+ Government Ministries and Departments', img: why3, theme: 'theme-blue' },
  { num: '04', text: 'MoUs with 11 State Governments and UTs', img: why4, theme: 'theme-orange' },
  { num: '05', text: 'State-level Export Promotional Meetings (SEPMs)', img: why5, theme: 'theme-purple' },
  { num: '06', text: 'Product-based Export FPOs across the country', img: why6, theme: 'theme-yellow' },
  { num: '07', text: 'Modern processing and packaging units', img: why7, theme: 'theme-red' },
  { num: '08', text: 'End-to-end handholding support for exporters', img: why8, theme: 'theme-cyan' }
];

const AboutUs = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          } else {
            entry.target.classList.remove('animate-reveal');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('#about-us .scroll-fade');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-us-container" id="about-us">
      {/* Animated Cartoon Background Objects */}
      <div className="about-animated-bg">
        {/* Clouds */}
        <Cloud className="moving-obj obj-cloud-1" size={140} strokeWidth={2} />
        <Cloud className="moving-obj obj-cloud-2" size={90} strokeWidth={2.5} />
        <Cloud className="moving-obj obj-cloud-3" size={110} strokeWidth={2} />
        <Cloud className="moving-obj obj-cloud-4" size={160} strokeWidth={2} />
        <Cloud className="moving-obj obj-cloud-5" size={100} strokeWidth={2.5} />
        
        {/* Leaves */}
        <Leaf className="moving-obj obj-leaf-1" size={75} strokeWidth={2} />
        <Leaf className="moving-obj obj-leaf-2" size={55} strokeWidth={2.5} />
        <Leaf className="moving-obj obj-leaf-3" size={65} strokeWidth={2} />
        <Leaf className="moving-obj obj-leaf-4" size={50} strokeWidth={2} />
        <Leaf className="moving-obj obj-leaf-5" size={80} strokeWidth={2} />
        <Leaf className="moving-obj obj-leaf-6" size={40} strokeWidth={2.5} />
        
        {/* Sun */}
        <Sun className="moving-obj obj-sun" size={180} strokeWidth={2} />
        
        {/* Stars */}
        <Star className="moving-obj obj-star-1" size={50} strokeWidth={2.5} />
        <Star className="moving-obj obj-star-2" size={40} strokeWidth={2.5} />
        <Star className="moving-obj obj-star-3" size={60} strokeWidth={2} />
        <Star className="moving-obj obj-star-4" size={45} strokeWidth={2} />
        <Star className="moving-obj obj-star-5" size={55} strokeWidth={2} />
        <Star className="moving-obj obj-star-6" size={35} strokeWidth={2.5} />
        
        {/* Soft Background Color Blobs for depth */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="about-us-header scroll-fade">
        <h3>About <span>Us</span></h3>
        <p>Discover the vision and mission driving our ecosystem</p>
      </div>
      <div className="about-board">

        {/* Hero */}
        <article
          className="about-hero-card scroll-fade"
          style={{ backgroundImage: `url(${aboutHeroBg})` }}
        >
          <div className="about-hero-veil" />
          <div className="about-hero-content">
            <span className="about-badge">
              <CheckCircle2 size={14} strokeWidth={2.6} />
              ABOUT FEED STARTUP
            </span>
            <h2 className="about-hero-title">
              From Indian Fields to <span>Global Markets</span>
            </h2>
            <p className="about-hero-sub">{HERO_SUB}</p>
          </div>
        </article>

        {/* Vision + Mission */}
        <div className="about-duo">
          <article
            className="about-story-card vision-card scroll-fade"
            style={{ backgroundImage: `url(${ourVision})` }}
          >
            <div className="story-veil" />
            <div className="story-content">
              <div className="story-head">
                <span className="story-icon vision-icon">
                  <Eye size={20} strokeWidth={2.3} />
                </span>
                <h3>Our Vision</h3>
              </div>
              <p>{VISION_TEXT}</p>
            </div>
          </article>

          <article
            className="about-story-card mission-card scroll-fade"
            style={{ backgroundImage: `url(${ourMission})` }}
          >
            <div className="story-veil" />
            <div className="story-content">
              <div className="story-head">
                <span className="story-icon mission-icon">
                  <Target size={20} strokeWidth={2.3} />
                </span>
                <h3>Our Mission</h3>
              </div>
              <p>{MISSION_TEXT}</p>
            </div>
          </article>
        </div>

        {/* Main Objective */}
        <article
          className="about-story-card objective-card scroll-fade"
          style={{ backgroundImage: `url(${farmersMsmes})` }}
        >
          <div className="story-veil objective-veil" />
          <div className="story-content objective-content">
            <div className="story-head">
              <span className="story-icon objective-icon">
                <Sprout size={20} strokeWidth={2.3} />
              </span>
              <h3>Main Objective</h3>
            </div>
            <p>{OBJECTIVE_TEXT}</p>
          </div>
        </article>
      </div>

      {/* Why Choose Section */}
      <div className="why-choose-section scroll-fade">
        <div className="why-choose-header">
          <h3>
            Why Choose <span>FEED?</span>
          </h3>
        </div>
        <p className="why-choose-sub">The definitive ecosystem for agricultural and MSME exports</p>

        <div className="why-choose-grid">
          {whyChooseFeed.map((point) => (
            <div key={point.num} className={`ap-why-item ${point.theme} scroll-fade`}>
              <div className="ap-why-num">{point.num}</div>
              <div className="ap-why-img-wrapper">
                <img src={point.img} alt={`Reason ${point.num}`} className="ap-why-img" />
              </div>
              <p className="ap-why-text">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
