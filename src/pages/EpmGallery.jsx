import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, ArrowRight, Star, X, ChevronLeft, ChevronRight, Users, Handshake, Globe, TrendingUp, ImageOff } from 'lucide-react';
import { fetchEpmGalleryImagesByBlock, getEpmGalleryImageUrl } from '../api/epmApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmGallery.css';

// Each page section below owns one backend folder (storage/epm/gallery/<block>/ on the server -
// see EpmGalleryBlock). Dropping image files straight into a block's folder is enough for them
// to appear in that section; nothing here reads from a database.
const BLOCKS = {
  gallery: 'epm-gallery',
  moments: 'epm-moments',
  acrossCities: 'epm-across-cities',
  insideEpm: 'inside-the-epm',
  people: 'people-at-epm',
  connections: 'connections-at-epm',
  eventDetails: 'event-details',
  experience: 'the-epm-experience',
};

export default function EpmGallery({ onNavigate, isLoggedIn, user, onLogout }) {
  const [blockImages, setBlockImages] = useState({});
  const [loading, setLoading] = useState(true);

  const [lightbox, setLightbox] = useState({ isOpen: false, currentIndex: 0, items: [] });

  // Every photo below comes from the backend (admin-uploaded, or simply dropped into a block's
  // folder) - see EpmGalleryController#listByBlock. Each block is fetched independently and a
  // failed/empty block just renders nothing for that section instead of breaking the page.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      Object.values(BLOCKS).map(block =>
        fetchEpmGalleryImagesByBlock(block).then(data => [block, data]).catch(() => [block, []])
      )
    ).then(results => {
      if (!cancelled) setBlockImages(Object.fromEntries(results));
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const galleryImgs = blockImages[BLOCKS.gallery] || [];
  const momentsImgs = blockImages[BLOCKS.moments] || [];
  const citiesImgs = blockImages[BLOCKS.acrossCities] || [];
  const insideImgs = blockImages[BLOCKS.insideEpm] || [];
  const peopleImgs = blockImages[BLOCKS.people] || [];
  const connectionsImgs = blockImages[BLOCKS.connections] || [];
  const detailsImgs = blockImages[BLOCKS.eventDetails] || [];
  const experienceImgs = blockImages[BLOCKS.experience] || [];

  const totalImages = useMemo(
    () => Object.values(blockImages).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0),
    [blockImages]
  );

  // Cycles through however many photos a block actually has, so fixed-position layouts (the
  // masonry, the portrait grid, the story timeline) always fill every cell instead of leaving
  // gaps when a folder has fewer photos than the section has slots.
  const pick = useCallback((arr, index) => (arr.length > 0 ? arr[index % arr.length] : null), []);
  const srcOf = useCallback((arr, index) => {
    const img = pick(arr, index);
    return img ? getEpmGalleryImageUrl(img.imageUrl) : '';
  }, [pick]);

  const openLightbox = (items, index) => {
    setLightbox({ isOpen: true, currentIndex: index, items });
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const nextLightbox = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.items.length
    }));
  }, []);

  const prevLightbox = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length
    }));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, nextLightbox, prevLightbox]);

  // Scroll Animations Observer - re-runs once loading flips to false, since the
  // .animate-on-scroll elements below don't exist in the DOM until the fetched photos render.
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, [loading, totalImages]);

  // Content Data - derived from whatever photos are actually in the "epm-gallery" folder. Sections
  // that name a specific place use each photo's own city/state/caption so a label is never paired
  // with the wrong photo.
  const featuredPool = useMemo(() => {
    const featured = galleryImgs.filter(img => img.featured);
    return (featured.length > 0 ? featured : galleryImgs).slice(0, 4);
  }, [galleryImgs]);

  const topFeatured = useMemo(() => featuredPool.map((img, idx) => ({
    city: img.city || 'Location to be announced',
    title: img.state ? `EPM – ${img.state}` : `EPM Gathering ${idx + 1}`,
    desc: img.caption || 'Bringing together exporters and global buyers to explore new opportunities and partnerships.',
    img: getEpmGalleryImageUrl(img.imageUrl),
  })), [featuredPool]);

  const cityStories = useMemo(() => citiesImgs.map(img => ({
    city: img.city || 'EPM',
    state: img.state || '',
    desc: img.caption || 'EPM – Export Promotional Meeting',
    img: getEpmGalleryImageUrl(img.imageUrl),
  })), [citiesImgs]);

  return (
    <div className="epm-gallery-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />
      {/* 1. PAGE INTRO */}
      <section className="eg-intro animate-on-scroll slide-up">
        <span className="eg-intro-subtitle">Export Promotional Meetings</span>
        <h1>EPM Gallery</h1>
        <p className="eg-intro-desc">A visual collection of Export Promotional Meetings conducted across India.</p>
      </section>

      {loading ? (
        <div className="eg-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
          Loading gallery…
        </div>
      ) : totalImages === 0 ? (
        <div className="eg-container" style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b' }}>
          <ImageOff size={40} style={{ marginBottom: '16px', opacity: 0.6 }} />
          <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>No photos yet</h3>
          <p>Photos from Export Promotional Meetings will appear here once they're added.</p>
        </div>
      ) : (
      <>
      {/* 2. TOP GALLERY - REFERENCE INSPIRED (block: epm-gallery) */}
      {galleryImgs.length > 0 && (
      <section className="eg-ref-section">
        <div className="eg-container">
          <div className="eg-ref-grid">
            {topFeatured.map((item, idx) => (
              <div key={idx} className="eg-ref-card animate-on-scroll slide-up" onClick={() => openLightbox(topFeatured, idx)}>
                <div className="eg-ref-img-wrapper">
                  <img src={item.img} alt={item.title} className="eg-ref-img" />
                </div>
                <div className="eg-ref-content">
                  <div className="eg-ref-location">
                    <MapPin className="eg-ref-loc-icon" /> {item.city}
                  </div>
                  <h3 className="eg-ref-title">{item.title}</h3>
                  <p className="eg-ref-desc">{item.desc}</p>
                  <div className="eg-ref-arrow-btn">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="eg-ref-lower">
            <div className="eg-ref-left animate-on-scroll slide-right">
              <div className="eg-ref-intro-block">
                <div className="eg-ref-icon-large">
                  <Handshake size={32} />
                </div>
                <p className="eg-ref-intro-text">
                  <span>FEED</span> is organizing Export Promotional Meetings (EPMs) across India to connect local exporters with global buyers, create new opportunities, and strengthen India's export ecosystem.
                </p>
              </div>

              <div className="eg-ref-stats-row">
                <div className="eg-ref-stat-item">
                  <div className="eg-ref-stat-icon"><Users size={20} /></div>
                  <div className="eg-ref-stat-text">
                    <h4>50+</h4>
                    <p>EPMs Organized<br/>Across Indian States</p>
                  </div>
                </div>
                <div className="eg-ref-stat-item">
                  <div className="eg-ref-stat-icon"><Handshake size={20} /></div>
                  <div className="eg-ref-stat-text">
                    <h4>2000+</h4>
                    <p>Exporters Connected<br/>And Empowered</p>
                  </div>
                </div>
                <div className="eg-ref-stat-item">
                  <div className="eg-ref-stat-icon"><Globe size={20} /></div>
                  <div className="eg-ref-stat-text">
                    <h4>500+</h4>
                    <p>Global Buyers<br/>Participated</p>
                  </div>
                </div>
                <div className="eg-ref-stat-item">
                  <div className="eg-ref-stat-icon"><TrendingUp size={20} /></div>
                  <div className="eg-ref-stat-text">
                    <h4>₹500 Cr+</h4>
                    <p>Business Opportunities<br/>Generated</p>
                  </div>
                </div>
              </div>

              <div className="eg-ref-rating">
                <div className="eg-ref-rating-score">4.8</div>
                <div>
                  <div className="eg-ref-rating-stars">
                    <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
                  </div>
                  <div className="eg-ref-rating-text">1200+ Exporters Recommend FEED</div>
                </div>
              </div>
            </div>

            <div className="eg-ref-right animate-on-scroll slide-left delay-200">
              <img src={srcOf(galleryImgs, 4)} alt="EPM Large Gathering" className="eg-ref-hero-img" onClick={() => openLightbox([{title: 'EPM Mega Gathering', city: 'National Event', img: srcOf(galleryImgs, 4)}], 0)} />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 5. EPM MOMENTS - Editorial Masonry (block: epm-moments) */}
      {momentsImgs.length > 0 && (
      <section className="eg-moments">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">EPM Moments</h2>
            <p className="eg-section-subtitle">Scenes from meetings that bring exporters and industry participants together.</p>
          </div>

          <div className="eg-masonry">
            <div className="eg-masonry-item animate-on-scroll slide-up eg-masonry-item-large" onClick={() => openLightbox([{title: 'Opening Session', img: srcOf(momentsImgs, 0)}], 0)}>
              <img loading="lazy" src={srcOf(momentsImgs, 0)} alt="Opening Session" />
              <div className="eg-masonry-caption">Opening Session</div>
            </div>
            <div className="eg-masonry-item animate-on-scroll slide-up delay-100" onClick={() => openLightbox([{title: 'Networking', img: srcOf(momentsImgs, 1)}], 0)}>
              <img loading="lazy" src={srcOf(momentsImgs, 1)} alt="Networking" />
              <div className="eg-masonry-caption">Networking</div>
            </div>
            <div className="eg-masonry-item animate-on-scroll slide-up eg-masonry-item-tall" onClick={() => openLightbox([{title: 'Panel Discussion', img: srcOf(momentsImgs, 2)}], 0)}>
              <img loading="lazy" src={srcOf(momentsImgs, 2)} alt="Panel Discussion" />
              <div className="eg-masonry-caption">Panel Discussion</div>
            </div>
            <div className="eg-masonry-item animate-on-scroll slide-up delay-100" onClick={() => openLightbox([{title: 'Buyer Interaction', img: srcOf(momentsImgs, 3)}], 0)}>
              <img loading="lazy" src={srcOf(momentsImgs, 3)} alt="Buyer Interaction" />
              <div className="eg-masonry-caption">Buyer Interaction</div>
            </div>
            <div className="eg-masonry-item animate-on-scroll slide-up eg-masonry-item-wide" onClick={() => openLightbox([{title: 'Delegate Session', img: srcOf(momentsImgs, 4)}], 0)}>
              <img loading="lazy" src={srcOf(momentsImgs, 4)} alt="Delegate Session" />
              <div className="eg-masonry-caption">Delegate Session</div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6. EPM CITY STORIES - Horizontal (block: epm-across-cities) */}
      {citiesImgs.length > 0 && (
      <section className="eg-city-stories">
        <div className="eg-section-header animate-on-scroll slide-up">
          <h2 className="eg-section-title">EPM Across Cities</h2>
        </div>
        <div className="eg-slider-container">
          {cityStories.map((item, idx) => (
            <div key={idx} className="eg-slide animate-on-scroll slide-up" onClick={() => openLightbox(cityStories, idx)}>
              <img loading="lazy" src={item.img} alt={item.city} />
              <div className="eg-slide-overlay">
                <h3 className="eg-slide-city">{item.city}</h3>
                {item.state && <h4 className="eg-slide-state">{item.state}</h4>}
                <p className="eg-slide-caption">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* 7. INSIDE THE EPM - Asymmetrical (block: inside-the-epm) */}
      {insideImgs.length > 0 && (
      <section className="eg-inside">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">Inside the EPM</h2>
            <p className="eg-section-subtitle">Scenes from meetings that bring exporters and industry participants together.</p>
          </div>
          <div className="eg-asym-grid">
            <div className="eg-asym-img animate-on-scroll slide-right eg-asym-1" onClick={() => openLightbox([{title: 'Event Stage', img: srcOf(insideImgs, 0)}], 0)}>
              <img loading="lazy" src={srcOf(insideImgs, 0)} alt="EPM Stage" />
            </div>
            <div className="eg-asym-img animate-on-scroll slide-left eg-asym-2" onClick={() => openLightbox([{title: 'Audience', img: srcOf(insideImgs, 1)}], 0)}>
              <img loading="lazy" src={srcOf(insideImgs, 1)} alt="EPM Audience" />
            </div>
            <div className="eg-asym-img animate-on-scroll slide-up eg-asym-3" onClick={() => openLightbox([{title: 'Speaker Preparing', img: srcOf(insideImgs, 2)}], 0)}>
              <img loading="lazy" src={srcOf(insideImgs, 2)} alt="Speaker" />
            </div>
            <div className="eg-asym-img animate-on-scroll slide-up delay-100 eg-asym-4" onClick={() => openLightbox([{title: 'Delegates Entering', img: srcOf(insideImgs, 3)}], 0)}>
              <img loading="lazy" src={srcOf(insideImgs, 3)} alt="Delegates" />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 8. PEOPLE AT EPM (block: people-at-epm) */}
      {peopleImgs.length > 0 && (
      <section className="eg-people">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">People at EPM</h2>
          </div>
          <div className="eg-portrait-grid">
            {['Speaker', 'Exporter', 'Buyer', 'Delegate', 'Panelist', 'FEED Representative'].map((label, i) => (
              <div key={i} className={`eg-portrait-card animate-on-scroll slide-up delay-${(i % 3) * 100}`} onClick={() => openLightbox([{title: label, img: srcOf(peopleImgs, i)}], 0)}>
                <img loading="lazy" src={srcOf(peopleImgs, i)} alt={label} />
                <div className="eg-portrait-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 9. STAGE & SESSION (reuses block: epm-moments) */}
      {momentsImgs.length > 0 && (
      <section className="eg-cinematic">
        <div className="eg-cine-img animate-on-scroll slide-up" onClick={() => openLightbox([{title: 'Keynote Session', city: 'National Summit', img: srcOf(momentsImgs, 2)}], 0)}>
          <img loading="lazy" src={srcOf(momentsImgs, 2)} alt="Cinematic Stage" />
          <div className="eg-cine-caption">Keynote Sessions</div>
        </div>
      </section>
      )}

      {/* 10. NETWORKING (block: connections-at-epm) */}
      {connectionsImgs.length > 0 && (
      <section className="eg-networking">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">Connections at EPM</h2>
          </div>
          <div className="eg-network-grid">
            <div className="eg-net-col animate-on-scroll slide-right">
              <div className="eg-net-img" onClick={() => openLightbox([{title: 'B2B Meeting', img: srcOf(connectionsImgs, 0)}], 0)}><img loading="lazy" src={srcOf(connectionsImgs, 0)} alt="Net 1" /></div>
              <div className="eg-net-img" onClick={() => openLightbox([{title: 'Group Discussion', img: srcOf(connectionsImgs, 1)}], 0)}><img loading="lazy" src={srcOf(connectionsImgs, 1)} alt="Net 2" /></div>
            </div>
            <div className="eg-net-img animate-on-scroll slide-left delay-200" onClick={() => openLightbox([{title: 'Handshakes', img: srcOf(connectionsImgs, 2)}], 0)}>
              <img loading="lazy" src={srcOf(connectionsImgs, 2)} alt="Net 3" />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 11. EVENT DETAILS (block: event-details) */}
      {detailsImgs.length > 0 && (
      <section className="eg-details">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">Event Details</h2>
          </div>
          <div className="eg-details-grid">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="eg-detail-img animate-on-scroll slide-up" onClick={() => openLightbox([{title: 'Event Detail', img: srcOf(detailsImgs, i)}], 0)}>
                <img loading="lazy" src={srcOf(detailsImgs, i)} alt="Detail" />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 12. EPM EVENT STORIES (block: the-epm-experience) */}
      {experienceImgs.length > 0 && (
      <section className="eg-story">
        <div className="eg-container">
          <div className="eg-section-header animate-on-scroll slide-up">
            <h2 className="eg-section-title">The EPM Experience</h2>
          </div>
          <div className="eg-story-timeline">
            {[
              { num: '01', label: 'Arrival', idx: 0 },
              { num: '02', label: 'Opening', idx: 1 },
              { num: '03', label: 'Keynote', idx: 2 },
              { num: '04', label: 'Discussion', idx: 3 },
              { num: '05', label: 'Networking', idx: 4 },
              { num: '06', label: 'Closing', idx: 5 },
            ].map((step, i) => (
              <div key={i} className="eg-story-item animate-on-scroll slide-up">
                <div className="eg-story-num">{step.num}</div>
                <div className="eg-story-img" onClick={() => openLightbox([{title: step.label, img: srcOf(experienceImgs, step.idx)}], 0)}>
                  <img loading="lazy" src={srcOf(experienceImgs, step.idx)} alt={step.label} />
                </div>
                <div className="eg-story-label">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 13. LARGE FEATURE (reuses block: the-epm-experience) */}
      {experienceImgs.length > 0 && (
      <section className="eg-cinematic" style={{ padding: '40px 0' }}>
        <div className="eg-container">
           <div className="eg-cine-img animate-on-scroll slide-up" style={{ borderRadius: '16px', height: '60vh' }} onClick={() => openLightbox([{title: 'Grand Meeting', img: srcOf(experienceImgs, experienceImgs.length - 1)}], 0)}>
            <img loading="lazy" src={srcOf(experienceImgs, experienceImgs.length - 1)} alt="Large Feature" />
          </div>
        </div>
      </section>
      )}
      </>
      )}

      {/* 14. LIGHTBOX */}
      {lightbox.isOpen && (
        <div className="eg-lightbox">
          <div className="eg-lb-header">
            <div className="eg-lb-count">
              {lightbox.currentIndex + 1} / {lightbox.items.length}
            </div>
            <button className="eg-lb-close" onClick={closeLightbox}>
              <X size={32} />
            </button>
          </div>
          <div className="eg-lb-content">
            {lightbox.items.length > 1 && (
              <button className="eg-lb-nav eg-lb-prev" onClick={prevLightbox}>
                <ChevronLeft size={32} />
              </button>
            )}

            <img loading="lazy"
              src={lightbox.items[lightbox.currentIndex].img}
              alt="Lightbox"
              className="eg-lb-img"
            />

            {lightbox.items.length > 1 && (
              <button className="eg-lb-nav eg-lb-next" onClick={nextLightbox}>
                <ChevronRight size={32} />
              </button>
            )}
          </div>
          <div className="eg-lb-info">
            <h3 className="eg-lb-title">{lightbox.items[lightbox.currentIndex].title}</h3>
            {lightbox.items[lightbox.currentIndex].city && (
              <p className="eg-lb-location">
                {lightbox.items[lightbox.currentIndex].city}
                {lightbox.items[lightbox.currentIndex].state ? `, ${lightbox.items[lightbox.currentIndex].state}` : ''}
              </p>
            )}
            <p className="eg-lb-desc">{lightbox.items[lightbox.currentIndex].desc}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
