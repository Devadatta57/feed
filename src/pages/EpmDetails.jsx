import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Clock, Filter, RotateCcw,
  CalendarDays, History, ChevronDown, Building2, Map,
  Loader2, AlertTriangle, Search, CheckCircle2, Users, LayoutGrid, List, Bookmark, LayoutList
} from 'lucide-react';
import { fetchEpmEvents, fetchEpmCategories } from '../api/epmApi';
import { formatEventDateLong, formatEventDateParts } from '../utils/epmDate';
import { getCategoryMeta } from '../utils/epmCategory';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EpmDetails.css';

const monthOptions = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
  { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const EMPTY_FILTERS = { query: '', month: '', state: '', district: '', city: '' };

const monthOf = (isoDate) => Number(isoDate.split('-')[1]);

const EpmDetails = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryToken, setRetryToken] = useState(0);
  
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [categories, setCategories] = useState([{ name: 'All Categories', id: 'All Categories', color: 'gray' }]);

  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  // Category list is driven entirely by the backend (EpmCategory enum) so it stays in sync
  // without a frontend redeploy whenever a category is added, renamed or removed.
  useEffect(() => {
    let cancelled = false;
    fetchEpmCategories()
      .then(data => {
        if (cancelled) return;
        const mapped = data.map(c => ({ name: c.label, id: c.id, color: getCategoryMeta(c.id).accent }));
        setCategories([{ name: 'All Categories', id: 'All Categories', color: 'gray' }, ...mapped]);
      })
      .catch(() => {}); // keep the "All Categories" fallback if this fails
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    setDraft(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);

    fetchEpmEvents({ status: activeTab })
      .then(data => { if (!cancelled) setEvents(data); })
      .catch(err => { if (!cancelled) setLoadError(err.message || 'Failed to load EPMs.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeTab, retryToken]);

  const stateOptions = useMemo(() => Array.from(new Set(events.map(e => e.state))).sort(), [events]);
  const districtOptions = useMemo(
    () => Array.from(new Set(events.filter(e => !draft.state || e.state === draft.state).map(e => e.district))).sort(),
    [events, draft.state]
  );
  const cityOptions = useMemo(
    () => Array.from(new Set(events
      .filter(e => (!draft.state || e.state === draft.state) && (!draft.district || e.district === draft.district))
      .map(e => e.city))).sort(),
    [events, draft.state, draft.district]
  );

  const categoryCounts = useMemo(() => {
    const counts = { 'All Categories': events.length };
    events.forEach(e => {
      if (e.category) counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => events.filter(e => {
    const searchMatch = !appliedFilters.query || 
      e.title?.toLowerCase().includes(appliedFilters.query.toLowerCase()) ||
      e.city?.toLowerCase().includes(appliedFilters.query.toLowerCase()) ||
      e.state?.toLowerCase().includes(appliedFilters.query.toLowerCase());

    const monthMatch = !appliedFilters.month || String(monthOf(e.eventDate)) === appliedFilters.month;
    const stateMatch = !appliedFilters.state || e.state === appliedFilters.state;
    const districtMatch = !appliedFilters.district || e.district === appliedFilters.district;
    const cityMatch = !appliedFilters.city || e.city === appliedFilters.city;
    
    const categoryMatch = activeCategory === 'All Categories' || e.category === activeCategory;

    return searchMatch && monthMatch && stateMatch && districtMatch && cityMatch && categoryMatch;
  }), [events, appliedFilters, activeCategory]);

  const filtersActive = appliedFilters.query || appliedFilters.month || appliedFilters.state || appliedFilters.district || appliedFilters.city;

  const handleSubmitFilters = (e) => {
    e.preventDefault();
    setAppliedFilters(draft);
  };

  const handleResetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };
  
  const getCategoryStyle = (categoryStr) => getCategoryMeta(categoryStr);

  return (
    <div className="epm-dir-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="epm" />

      <div className="epm-dir-topbar">
        <button className="epm-dir-back-btn" onClick={() => onNavigate('epm')}>
          <ArrowLeft size={16} /> Back to EPM
        </button>
      </div>

      <div className="epm-dir-hero-wrap">
        <div className="epm-dir-hero">
          <div className="epm-dir-hero-content">
            <h1 className="epm-dir-title">EPM Directory</h1>
            <p className="epm-dir-subtitle">Explore Export Promotional Meetings (EPMs) across India.<br/>Connect, learn, and expand your export opportunities.</p>
            
            <div className="epm-dir-hero-stats">
              <div className="ed-stat-pill">
                <CalendarDays size={18} className="text-green-600" />
                <div>
                  <strong>Discover</strong>
                  <span>Events Near You</span>
                </div>
              </div>
              <div className="ed-stat-pill">
                <Users size={18} className="text-blue-600" />
                <div>
                  <strong>Connect</strong>
                  <span>With Experts</span>
                </div>
              </div>
              <div className="ed-stat-pill">
                <LayoutList size={18} className="text-orange-600" />
                <div>
                  <strong>Grow</strong>
                  <span>Your Global Reach</span>
                </div>
              </div>
            </div>
          </div>
          <div className="epm-dir-hero-img-box">
             <img src="/images/epm/epm-directory-hero-india.avif" alt="India Agricultural Export Opportunities" className="epm-dir-hero-img" />
          </div>
        </div>
      </div>

      <div className="epm-dir-searchbar">
        <form className="ed-filters-form" onSubmit={handleSubmitFilters}>
          <div className="ed-filter-col ed-search-col">
            <label>Search EPMs</label>
            <div className="ed-input-wrap">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search by title, location or keyword..." 
                value={draft.query}
                onChange={(e) => setDraft(d => ({ ...d, query: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="ed-filter-col">
            <label>Month</label>
            <div className="ed-select-wrap">
              <Calendar size={16} />
              <select value={draft.month} onChange={(e) => setDraft(d => ({ ...d, month: e.target.value }))}>
                <option value="">All Months</option>
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
              <ChevronDown size={14} className="ed-chev" />
            </div>
          </div>

          <div className="ed-filter-col">
            <label>State</label>
            <div className="ed-select-wrap">
              <MapPin size={16} />
              <select value={draft.state} onChange={(e) => setDraft(d => ({ ...d, state: e.target.value, district: '', city: '' }))}>
                <option value="">All States</option>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="ed-chev" />
            </div>
          </div>

          <div className="ed-filter-col">
            <label>District</label>
            <div className="ed-select-wrap">
              <Building2 size={16} />
              <select value={draft.district} onChange={(e) => setDraft(d => ({ ...d, district: e.target.value, city: '' }))}>
                <option value="">All Districts</option>
                {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} className="ed-chev" />
            </div>
          </div>

          <div className="ed-filter-col">
            <label>Place</label>
            <div className="ed-select-wrap">
              <Map size={16} />
              <select value={draft.city} onChange={(e) => setDraft(d => ({ ...d, city: e.target.value }))}>
                <option value="">All Places</option>
                {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="ed-chev" />
            </div>
          </div>

          <div className="ed-filter-actions">
            <button type="submit" className="ed-btn-apply"><Filter size={14}/> Apply Filters</button>
            <button type="button" className="ed-btn-reset" onClick={handleResetFilters}><RotateCcw size={14}/> Reset</button>
          </div>
        </form>
      </div>

      <div className="epm-dir-layout">
        <div className="epm-dir-sidebar">
          <div className="ed-sidebar-section">
            <h3 className="ed-sb-title">Filter by Category</h3>
            <div className="ed-sb-categories">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  className={`ed-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="ed-cat-label">
                    <span className={`ed-cat-icon color-${cat.color}`}><LayoutGrid size={14} /></span>
                    {cat.name}
                  </div>
                  <span className="ed-cat-count">{categoryCounts[cat.id] || 0}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="ed-sidebar-section">
            <h3 className="ed-sb-title">Quick Links</h3>
            <div className="ed-sb-links">
              <button className="ed-link-btn active"><CalendarDays size={14} /> Upcoming EPMs</button>
              <button className="ed-link-btn"><Clock size={14} /> Ongoing EPMs</button>
              <button className="ed-link-btn"><History size={14} /> Past EPMs</button>
              <button className="ed-link-btn"><CheckCircle2 size={14} /> My Registered EPMs</button>
            </div>
          </div>
        </div>

        <div className="epm-dir-main">
          <div className="ed-main-toolbar">
            <div className="ed-toolbar-left">
              <div className="ed-toolbar-icon"><CalendarDays size={20} /></div>
              <div>
                <h2>{activeTab === 'upcoming' ? 'Upcoming EPMs' : 'Previous EPMs'}</h2>
                <p>{filteredEvents.length} events found</p>
              </div>
            </div>
            <div className="ed-toolbar-right">
              <div className="ed-tabs">
                <button 
                  className={`ed-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  <CalendarDays size={14} /> Upcoming
                </button>
                <button 
                  className={`ed-tab ${activeTab === 'previous' ? 'active' : ''}`}
                  onClick={() => setActiveTab('previous')}
                >
                  <History size={14} /> Previous
                </button>
              </div>
              
              <div className="ed-view-toggle">
                <button className={`ed-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
                <button className={`ed-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={16} /></button>
              </div>
              
              <div className="ed-sort">
                <span>Sort by: Upcoming First</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="ed-event-list">
            {loading ? (
               <div className="ed-state-msg"><Loader2 className="spin" size={24}/> Loading Events...</div>
            ) : loadError ? (
               <div className="ed-state-msg text-red-500"><AlertTriangle size={24}/> {loadError}</div>
            ) : filteredEvents.length === 0 ? (
               <div className="ed-state-msg">No events match your criteria.</div>
            ) : (
              <div className={viewMode === 'list' ? 'ed-cards-list' : 'ed-cards-grid'}>
                {filteredEvents.map(event => {
                  const dateParts = formatEventDateParts(event.eventDate);
                  const styleData = getCategoryStyle(event.category);
                  const registeredCount = Math.floor(Math.random() * 80) + 20; // Mock count
                  const description = event.description || `Learn about export compliance, documentation, and international certification processes for ${event.category || 'agriculture'}.`;
                  
                  return (
                    <div className={`ed-card ${viewMode} style-${styleData.badge}`} key={event.id}>
                      <div className="ed-card-date">
                        <span className="ed-month">{dateParts.month}</span>
                        <span className="ed-day">{dateParts.day}</span>
                        <span className="ed-dow">{dateParts.weekday.substring(0,3).toUpperCase()}</span>
                      </div>
                      
                      <div className="ed-card-info">
                        <span className={`ed-badge ${styleData.badge}`}>{event.category ? event.category.toUpperCase() : 'EPM EVENT'}</span>
                        <h3 className="ed-event-title">{event.title}</h3>
                        <div className="ed-event-meta-grid">
                          <span><MapPin size={14}/> {event.city}, {event.state}</span>
                          <span><Calendar size={14}/> {formatEventDateLong(event.eventDate)}</span>
                          {event.timeRange && <span><Clock size={14}/> {event.timeRange}</span>}
                          {event.venue && <span><Building2 size={14}/> {event.venue}</span>}
                        </div>
                      </div>
                      
                      <div className="ed-card-desc">
                        <p>{description}</p>
                        <div className="ed-attendees">
                          <div className="ed-avatars">
                            <img src="https://i.pravatar.cc/100?img=1" alt="user" />
                            <img src="https://i.pravatar.cc/100?img=2" alt="user" />
                            <img src="https://i.pravatar.cc/100?img=3" alt="user" />
                          </div>
                          <span>+{registeredCount} Registered</span>
                        </div>
                      </div>
                      
                      <div className="ed-card-actions">
                        <span className="ed-status-pill upcoming">Upcoming</span>
                        <div className="ed-action-btns">
                          <button className="ed-btn-details" onClick={() => onNavigate('epm-event-details', { eventId: event.id })}>
                            View Details <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                          </button>
                          <button className="ed-btn-bookmark"><Bookmark size={16} /></button>
                        </div>
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="ed-card-bg-art" style={{backgroundImage: `url(${styleData.img})`}}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EpmDetails;
