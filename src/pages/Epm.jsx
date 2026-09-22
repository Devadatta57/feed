import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Building2, Calendar as CalendarIcon,
  ChevronRight, Star, HeartHandshake, UserPlus,
  ArrowRight, CheckCircle2, ChevronLeft,
  Target, BookOpen, Award,
  Ship, Truck, Package, Leaf, TrendingUp, ShieldCheck, Sparkles,
  Image as ImageIcon, Quote
} from 'lucide-react';
import './Epm.css';
import { fetchEpmEvents, fetchEpmGalleryImages, fetchEpmStats, getEpmGalleryImageUrl } from '../api/epmApi';
import { formatEventDateParts } from '../utils/epmDate';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Reveals a block with a directional slide-in the first time it scrolls into view (each caller
// picks its own `dir` - 'left' | 'right' | 'top' | 'bottom' - so blocks visibly arrive from
// different places instead of all fading in the same way).
function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// Counts up from 0 to `target` once `active` first becomes true, fast at the start and easing to
// a stop exactly on the real number - then stays there. Before `active`, it just mirrors `target`
// directly so the stat never flashes 0 while still loading or off-screen.
function useCountUp(target, active, duration = 1100) {
  const [value, setValue] = useState(target);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    if (startedRef.current) {
      // Already ran the one-time animation - just track further target changes directly.
      setValue(target);
      return;
    }
    startedRef.current = true;

    let rafId;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, active, duration]);

  return value;
}

const Epm = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [upcomingEpms, setUpcomingEpms] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  // Real EPMs-conducted/districts/participants counts once fetched; these starting values match
  // the site's existing marketing copy so the card never flashes "0" while stats are loading.
  const [stats, setStats] = useState({ epmsConducted: 25, districtsCovered: 10, totalParticipants: 500 });

  // Each major section reveals from its own direction as it scrolls into view.
  const [infoRef1, infoInView1] = useReveal();
  const [infoRef2, infoInView2] = useReveal();
  const [infoRef3, infoInView3] = useReveal();
  const [infoRef4, infoInView4] = useReveal();
  const [statsRef, statsInView] = useReveal();
  const [upcomingRef, upcomingInView] = useReveal();
  const [galleryRef, galleryInView] = useReveal();
  const [testimonialRef, testimonialInView] = useReveal();
  const [membershipRef, membershipInView] = useReveal();

  // The overview numbers count up fast then settle on the exact figure once the stats card
  // scrolls into view.
  const epmsConductedDisplay = useCountUp(stats.epmsConducted, statsInView);
  const districtsCoveredDisplay = useCountUp(stats.districtsCovered, statsInView);
  const totalParticipantsDisplay = useCountUp(stats.totalParticipants, statsInView);

  const testimonials = [
    { id: 1, text: "Great initiative! EPM helped me understand export opportunities clearly.", author: "Ramesh, Farmer", rating: 5 },
    { id: 2, text: "Informative session with practical insights on global markets.", author: "Sita, Entrepreneur", rating: 5 },
    { id: 3, text: "Well organized and very impactful meeting for our FPO members.", author: "Anand, FPO Member", rating: 5 },
    { id: 4, text: "The networking opportunities were fantastic. Highly recommend attending.", author: "Kiran, Trader", rating: 5 },
    { id: 5, text: "Excellent guidance on export documentation and compliance.", author: "Lakshmi, Agri-Business", rating: 5 },
  ];

  // Real EPM photos (admin-uploaded via AdminEpmGalleryController), not stock/placeholder URLs.
  const [galleryArray, setGalleryArray] = useState([]);

  useEffect(() => {
    fetchEpmGalleryImages()
      .then(data => setGalleryArray(data.slice(0, 8).map(img => getEpmGalleryImageUrl(img.imageUrl))))
      .catch(() => setGalleryArray([]));
    fetchEpmStats().then(setStats).catch(() => {});
  }, []);

  const [testiIndex, setTestiIndex] = useState(testimonials.length * 2);
  const [testiTransition, setTestiTransition] = useState(true);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTransition, setGalleryTransition] = useState(true);

  // galleryArray loads asynchronously (starts at length 0), so the carousel's wraparound
  // starting index is (re)computed once real photos actually arrive.
  useEffect(() => {
    if (galleryArray.length > 0) {
      setGalleryIndex(galleryArray.length * 2);
    }
  }, [galleryArray.length]);

  const isGalleryHovered = useRef(false);

  // "Upcoming EPMs" calendar widget - defaults to the live current month/year (never a hardcoded
  // one), is fully navigable, and drives the event list on the right from the exact same
  // month/year + status='upcoming' query so the two never show mismatched months. Since the
  // backend's "upcoming" filter is eventDate >= today, today's own date is included whenever
  // the calendar is on the current month.
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1); // 1-indexed
  const [calendarEventDays, setCalendarEventDays] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setEventsLoading(true);
    fetchEpmEvents({ status: 'upcoming', year: calendarYear, month: calendarMonth })
      .then(data => {
        if (cancelled) return;
        setCalendarEventDays(Array.from(new Set(data.map(e => Number(e.eventDate.split('-')[2])))));
        setUpcomingEpms(data.slice(0, 3));
      })
      .catch(() => {
        if (cancelled) return;
        setCalendarEventDays([]);
        setUpcomingEpms([]);
      })
      .finally(() => { if (!cancelled) setEventsLoading(false); });
    return () => { cancelled = true; };
  }, [calendarYear, calendarMonth]);

  const goToPrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const calendarMonthLabel = new Date(calendarYear, calendarMonth - 1, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calendarDaysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
  // Grid header runs Mon..Sun, so shift JS's Sun=0..Sat=6 to Mon=0..Sun=6 to know how many
  // leading blank cells the 1st of the month needs.
  const calendarLeadingBlanks = (new Date(calendarYear, calendarMonth - 1, 1).getDay() + 6) % 7;

  // Main scroll interval for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestiTransition(true);
      setTestiIndex(prev => prev - 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Main scroll interval for gallery (faster, every 1.8s as requested)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isGalleryHovered.current) {
        setGalleryTransition(true);
        setGalleryIndex(prev => prev - 1);
      }
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Invisible reset for testimonials
  useEffect(() => {
    if (testiIndex <= testimonials.length) {
      const reset = setTimeout(() => {
        setTestiTransition(false);
        setTestiIndex(prev => prev + testimonials.length);
      }, 600);
      return () => clearTimeout(reset);
    }
  }, [testiIndex, testimonials.length]);

  // Invisible reset for gallery
  useEffect(() => {
    if (galleryIndex <= galleryArray.length) {
      const reset = setTimeout(() => {
        setGalleryTransition(false);
        requestAnimationFrame(() => {
          setGalleryIndex(prev => prev + galleryArray.length);
        });
      }, 850);
      return () => clearTimeout(reset);
    } else if (galleryIndex >= galleryArray.length * 3) {
      const reset = setTimeout(() => {
        setGalleryTransition(false);
        requestAnimationFrame(() => {
          setGalleryIndex(prev => prev - galleryArray.length);
        });
      }, 850);
      return () => clearTimeout(reset);
    }
  }, [galleryIndex, galleryArray.length]);

  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];
  const extendedGallery = [...galleryArray, ...galleryArray, ...galleryArray, ...galleryArray];

  const nextTestimonial = () => {
    setTestiTransition(true);
    setTestiIndex(prev => prev - 1); // Move right
  };

  const prevTestimonial = () => {
    setTestiTransition(true);
    setTestiIndex(prev => prev + 1); // Move left
  };

  const nextGallery = () => {
    setGalleryTransition(true);
    setGalleryIndex(prev => prev + 1);
  };

  const prevGallery = () => {
    setGalleryTransition(true);
    setGalleryIndex(prev => prev - 1);
  };

  const activeGalleryIdx = galleryArray.length > 0
    ? ((galleryIndex % galleryArray.length) + galleryArray.length) % galleryArray.length
    : 0;

  // Gallery swipe handlers
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left means show the image on the right
      // Since our images are moving left-to-right on auto, the next image is physically on the LEFT.
      // Wait, let's follow the standard convention: Swiping left brings the NEXT image from the RIGHT.
      // In our code, diff = 1 is the image on the right.
      // To make diff = 1 become diff = 0, we need to INCREASE galleryIndex by 1.
      setGalleryTransition(true);
      setGalleryIndex(prev => prev + 1);
    }
    if (isRightSwipe) {
      // Swipe right means show image on the left.
      // In our code, diff = -1 is the image on the left.
      // To make diff = -1 become diff = 0, we need to DECREASE galleryIndex by 1.
      setGalleryTransition(true);
      setGalleryIndex(prev => prev - 1);
    }
  };

  return (
    <div className="epm-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      <section className="epm-hero-section">
        <div className="epm-hero-inner">

          {/* Top-right actions */}
          <div className="epm-hero-actions">
            <button className="epm-btn-outline" onClick={() => onNavigate('epm-register')}>
              <UserPlus size={16} />
              Register
            </button>
            <button className="epm-btn-primary" onClick={() => onNavigate('epm-volunteer')}>
              <HeartHandshake size={16} />
              Become a Volunteer
            </button>
          </div>

          {/* Hero intro */}
          <div className="epm-hero-banner">
            <div className="epm-hb-bg">
              <img
                className="epm-hb-image"
                src="/epm_global_agri_export.avif"
                alt="Global Agricultural Exports"
              />
              <div className="epm-hb-gradient"></div>
            </div>
            
            <div className="epm-hb-content">
              <div className="epm-hero-text">
                <span className="epm-hero-eyebrow"><Sparkles size={13} /> EPM Initiative</span>
                <h1 className="epm-hero-title">
                  Export Promotional Meetings <span className="epm-hero-highlight">(EPMs)</span>
                </h1>
                <p className="epm-hero-subtitle">
                  Connecting stakeholders. Creating opportunities.<br className="epm-hero-break" />
                  Empowering agri-exports.
                </p>
                <span className="epm-hero-rule" />
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="epm-info-grid">
            <div ref={infoRef1} className={`epm-info-block accent-green epm-reveal dir-left ${infoInView1 ? 'in-view' : ''}`}>
              <div className="epm-info-decor"><Target size={96} /></div>
              <div className="epm-info-icon"><Target size={24} /></div>
              <h3 className="epm-info-title">Objective of Export Promotional Meetings (EPMs)</h3>
              <span className="epm-info-divider" />
              <div className="epm-info-content">
                <p>Export Promotional Meetings (EPMs) bring together exporters, buyers, farmers, cooperatives, government bodies, and industry stakeholders to create meaningful business opportunities. These meetings focus on promoting agricultural products, exploring new markets, strengthening partnerships, and addressing challenges in the export ecosystem.</p>
              </div>
              <button className="epm-info-btn" onClick={() => onNavigate('epm-objective')}>View Full Details <ArrowRight size={14} /></button>
            </div>
            <div ref={infoRef2} className={`epm-info-block accent-blue epm-reveal dir-top ${infoInView2 ? 'in-view' : ''}`}>
              <div className="epm-info-decor"><BookOpen size={96} /></div>
              <div className="epm-info-icon"><BookOpen size={24} /></div>
              <h3 className="epm-info-title">Content Coverage</h3>
              <span className="epm-info-divider" />
              <div className="epm-info-content">
                <p>Sessions cover export procedures and documentation, quality and packaging standards, market access requirements, applicable government schemes, logistics planning, and pricing strategies — giving participants practical, ready-to-use knowledge.</p>
              </div>
              <button className="epm-info-btn" onClick={() => onNavigate('epm-content-coverage')}>View Full Details <ArrowRight size={14} /></button>
            </div>
            <div ref={infoRef3} className={`epm-info-block accent-orange epm-reveal dir-bottom ${infoInView3 ? 'in-view' : ''}`}>
              <div className="epm-info-decor"><Award size={96} /></div>
              <div className="epm-info-icon"><Award size={24} /></div>
              <h3 className="epm-info-title">Benefits of Participation</h3>
              <span className="epm-info-divider" />
              <div className="epm-info-content">
                <p>Participants gain direct access to buyers, expert guidance on compliance and certification, valuable networking with industry leaders, and support in identifying the right export markets for their products.</p>
              </div>
              <button className="epm-info-btn" onClick={() => onNavigate('epm-benefits')}>View Full Details <ArrowRight size={14} /></button>
            </div>
            <div ref={infoRef4} className={`epm-info-block accent-purple epm-reveal dir-right ${infoInView4 ? 'in-view' : ''}`}>
              <div className="epm-info-decor"><Users size={96} /></div>
              <div className="epm-info-icon"><Users size={24} /></div>
              <h3 className="epm-info-title">Invitees</h3>
              <span className="epm-info-divider" />
              <div className="epm-info-content">
                <p>EPMs bring together farmers, FPOs, exporters, importers, trade associations, government officials, and banking and logistics partners from across the agri-export value chain.</p>
              </div>
              <button className="epm-info-btn" onClick={() => onNavigate('epm-invitees')}>View Full Details <ArrowRight size={14} /></button>
            </div>
          </div>

        </div>
      </section>

      <div className="epm-content-wrap">

        {/* Stats Section */}
        <div ref={statsRef} className={`epm-card stats-card redesign-stats epm-reveal dir-left ${statsInView ? 'in-view' : ''}`}>
          <div className="epm-card-header redesign-header">
            <div className="redesign-header-icon color-green"><TrendingUp size={24} /></div>
            <div>
              <h2 className="epm-card-title">Overview Statistics</h2>
              <p className="redesign-subtitle">Highlights from our Export Promotional Meetings</p>
            </div>
          </div>
          <div className="redesign-stats-grid">
            <div className="redesign-stat-card r-stat-green">
              <div className="r-stat-bg">
                <img src="/epm_stat_1.avif" alt="EPMs Conducted" />
                <div className="r-stat-fade"></div>
              </div>
              <div className="r-stat-content">
                <div className="r-stat-icon-wrapper"><Users size={20} /></div>
                <div>
                  <h3 className="r-stat-value">{epmsConductedDisplay}+</h3>
                  <h4 className="r-stat-label">EPMs Conducted</h4>
                  <span className="r-stat-rule"></span>
                  <p className="r-stat-desc">Successful meetings across regions</p>
                </div>
              </div>
            </div>

            <div className="redesign-stat-card r-stat-blue">
              <div className="r-stat-bg">
                <img src="/epm_stat_2.avif" alt="Districts Covered" />
                <div className="r-stat-fade"></div>
              </div>
              <div className="r-stat-content">
                <div className="r-stat-icon-wrapper"><Building2 size={20} /></div>
                <div>
                  <h3 className="r-stat-value">{districtsCoveredDisplay}</h3>
                  <h4 className="r-stat-label">Districts Covered</h4>
                  <span className="r-stat-rule"></span>
                  <p className="r-stat-desc">Reaching key agricultural hubs</p>
                </div>
              </div>
            </div>

            <div className="redesign-stat-card r-stat-purple">
              <div className="r-stat-bg">
                <img src="/epm_stat_3.avif" alt="Total Attendees" />
                <div className="r-stat-fade"></div>
              </div>
              <div className="r-stat-content">
                <div className="r-stat-icon-wrapper"><Users size={20} /></div>
                <div>
                  <h3 className="r-stat-value">{totalParticipantsDisplay}+</h3>
                  <h4 className="r-stat-label">Total Attendees</h4>
                  <span className="r-stat-rule"></span>
                  <p className="r-stat-desc">Connecting stakeholders worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming EPMs (Full Column) */}
        <div ref={upcomingRef} className={`epm-card upcoming-card redesign-events epm-reveal dir-right ${upcomingInView ? 'in-view' : ''}`}>
          <div className="epm-card-header redesign-header">
            <div className="redesign-header-icon color-green"><CalendarIcon size={24} /></div>
            <div>
              <h2 className="epm-card-title">Upcoming EPMs</h2>
              <p className="redesign-subtitle">Stay updated with our upcoming Export Promotional Meetings</p>
            </div>
          </div>
          
          <div className="redesign-events-layout">
            <div className="redesign-calendar-side">
              <div className="epm-calendar-container">
                <div className="epm-calendar-header">
                  <button className="epm-cal-nav" onClick={goToPrevMonth} aria-label="Previous month"><ChevronLeft size={16} /></button>
                  <h4>{calendarMonthLabel}</h4>
                  <button className="epm-cal-nav" onClick={goToNextMonth} aria-label="Next month"><ChevronRight size={16} /></button>
                </div>
                <div className="epm-calendar-grid">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                    <div key={d} className="epm-cal-day-name">{d}</div>
                  ))}
                  {Array.from({length: calendarLeadingBlanks}, (_, i) => (
                    <div key={`blank-${i}`} className="epm-cal-day empty"></div>
                  ))}
                  {Array.from({length: calendarDaysInMonth}, (_, i) => i + 1).map(day => (
                    <div key={day} className="epm-cal-day">
                      <span className={calendarEventDays.includes(day) ? 'epm-cal-circle' : ''}>
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="redesign-calendar-ill">
                <img src="/epm_calendar.avif" alt="Calendar landscape" />
              </div>
            </div>

            <div className="redesign-events-list">
              {eventsLoading ? (
                <p style={{ color: '#64748b' }}>Loading upcoming EPMs…</p>
              ) : upcomingEpms.length === 0 ? (
                <p style={{ color: '#64748b' }}>No upcoming EPMs scheduled right now. Please check back soon.</p>
              ) : upcomingEpms.map((event, idx) => {
                const colors = ['r-event-green', 'r-event-blue', 'r-event-orange'];
                const { day, month, weekday } = formatEventDateParts(event.eventDate);

                return (
                  <div key={event.id} className={`redesign-event-card ${colors[idx % 3]}`}>
                    {/* The timeline node connection outside the card box on the left */}
                    <div className="r-event-timeline-dot"></div>

                    <div className="r-event-datebox">
                      <span className="r-event-month">{month}</span>
                      <span className="r-event-date">{day}</span>
                      <span className="r-event-day-rule"></span>
                      <span className="r-event-day">{weekday}</span>
                    </div>

                    <div className="r-event-details">
                      <div className="r-event-category"><span>{event.category || 'EPM Event'}</span></div>
                      <h4 className="r-event-title">{event.title}</h4>
                      <div className="r-event-meta">
                        <span className="r-meta-item">{event.city}, {event.state}</span>
                        <span className="r-meta-sep"></span>
                        <span className="r-meta-item">{event.timeRange || 'Time to be announced'}</span>
                      </div>
                    </div>

                    <div className="r-event-accent"></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button className="epm-view-all redesign-view-btn" onClick={() => onNavigate('epm-details')}>View All EPMs <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* Gallery Section */}
        <div ref={galleryRef} className={`epm-card gallery-card epm-reveal dir-left ${galleryInView ? 'in-view' : ''}`}>
          <div className="epm-card-header redesign-header">
            <div className="epm-header-left">
              <div className="redesign-header-icon color-purple"><ImageIcon size={22} /></div>
              <div>
                <h2 className="epm-card-title">Gallery</h2>
                <p className="redesign-subtitle">Moments captured from our Export Promotional Meetings</p>
              </div>
            </div>
            <button className="epm-view-all redesign-view-btn" onClick={() => onNavigate('epm-gallery')}>View All <ArrowRight size={16} /></button>
          </div>
          <div
            className="epm-gallery-container"
            onMouseEnter={() => isGalleryHovered.current = true}
            onMouseLeave={() => isGalleryHovered.current = false}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="epm-gallery-glow"></div>
            {galleryArray.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', width: '100%' }}>
                Photos from Export Promotional Meetings will appear here once they're added.
              </p>
            ) : (
              <>
            <span className="epm-gallery-counter">{String(activeGalleryIdx + 1).padStart(2, '0')} / {String(galleryArray.length).padStart(2, '0')}</span>
            <button className="epm-gallery-arrow left" onClick={prevGallery} aria-label="Previous image"><ChevronLeft size={20} /></button>
            <button className="epm-gallery-arrow right" onClick={nextGallery} aria-label="Next image"><ChevronRight size={20} /></button>
            {extendedGallery.map((imgSrc, index) => {
              const diff = index - galleryIndex;

              // Determine styles based on diff
              let translateX = 0;
              let scale = 1;
              let zIndex = 1;
              let opacity = 0;
              let isCenter = false;

              // We want a flat premium look, not overlapping 3D.
              // diff 0: Center, diff -1: Left, diff 1: Right
              if (diff === 0) {
                translateX = 0;
                scale = 1;
                zIndex = 5;
                opacity = 1;
                isCenter = true;
              } else if (diff === -1) {
                translateX = -95;
                scale = 0.75;
                zIndex = 4;
                opacity = 1;
              } else if (diff === 1) {
                translateX = 95;
                scale = 0.75;
                zIndex = 4;
                opacity = 1;
              } else if (diff === -2) {
                translateX = -170;
                scale = 0.6;
                zIndex = 3;
                opacity = 0; // Hide it out of view or fade out
              } else if (diff === 2) {
                translateX = 170;
                scale = 0.6;
                zIndex = 3;
                opacity = 0;
              } else {
                translateX = diff < 0 ? -200 : 200;
                scale = 0.5;
                zIndex = 1;
                opacity = 0;
              }

              return (
                <div
                  key={index}
                  className={`epm-gallery-slide-flat ${isCenter ? 'is-center' : ''}`}
                  style={{
                    transform: `translateX(${translateX}%) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    transition: galleryTransition ? 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease' : 'none',
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  <div className="epm-gallery-img-wrapper">
                    <img src={imgSrc} alt={`EPM Event ${index}`} />
                  </div>
                  <div className="epm-gallery-pagination">
                    {galleryArray.map((_, dotIdx) => {
                      const actualIdx = galleryIndex % galleryArray.length;
                      const isActive = dotIdx === actualIdx;
                      return (
                        <div
                          key={dotIdx}
                          className={`epm-gallery-dot ${isActive ? 'active' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
              </>
            )}
          </div>
        </div>

        {/* Testimonials (Bottom Section) */}
        <div ref={testimonialRef} className={`epm-card testimonial-card epm-reveal dir-right ${testimonialInView ? 'in-view' : ''}`}>
          <div className="epm-card-header redesign-header">
            <div className="epm-header-left">
              <div className="redesign-header-icon color-amber"><Quote size={20} fill="currentColor" /></div>
              <div>
                <h2 className="epm-card-title">Testimonials</h2>
                <p className="redesign-subtitle">What our participants say about EPMs</p>
              </div>
            </div>
            <div className="epm-testimonial-nav">
              <button onClick={prevTestimonial} className="epm-nav-btn"><ChevronLeft size={18} /></button>
              <button onClick={nextTestimonial} className="epm-nav-btn"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="epm-testimonial-slider">
            <div
              className="epm-testimonial-slide-track"
              style={{
                '--current-slide': testiIndex,
                transition: testiTransition ? 'transform 0.5s ease-in-out' : 'none'
              }}
            >
              {extendedTestimonials.map((testi, index) => {
                const [authorName, authorRole] = testi.author.split(',').map(s => s.trim());
                return (
                  <div key={`${testi.id}-${index}`} className="epm-testimonial-content">
                    <Quote className="epm-testimonial-watermark" size={72} fill="currentColor" />
                    <div className="epm-testimonial-stars">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} size={15} className="epm-star-filled" fill="currentColor" />
                      ))}
                    </div>
                    <p className="epm-testimonial-text">{testi.text}</p>
                    <div className="epm-testimonial-footer">
                      <div className="epm-testimonial-avatar">{authorName.charAt(0)}</div>
                      <div className="epm-testimonial-author-block">
                        <p className="epm-testimonial-author">{authorName}</p>
                        {authorRole && <p className="epm-testimonial-role">{authorRole}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Membership & Services Section */}
        <div ref={membershipRef} className={`epm-card membership-card epm-reveal dir-bottom ${membershipInView ? 'in-view' : ''}`}>
          <div className="epm-membership-decor">
            <span className="epm-membership-orb orb-1"></span>
            <span className="epm-membership-orb orb-2"></span>
            <span className="epm-membership-orb orb-3"></span>
          </div>
          <div className="epm-card-header redesign-header">
            <div className="epm-header-left">
              <div className="redesign-header-icon color-onlight"><ShieldCheck size={22} /></div>
              <div>
                <h2 className="epm-card-title">Membership & Services</h2>
                <p className="redesign-subtitle">Join our growing network of exporters, farmers, and trade partners</p>
              </div>
            </div>
          </div>
          <div className="epm-membership-actions">
            <button 
              className="epm-btn-primary" 
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('services-block')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              <Package size={17} />Explore our services
            </button>
            <button className="epm-btn-primary epm-btn-accent" onClick={() => onNavigate('register')}><Award size={17} />Become a member</button>
            <button className="epm-btn-outline" onClick={() => onNavigate('contact')}><UserPlus size={17} />Contact us</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Epm;
