import React, { useState } from 'react';
import { Search, Globe, ArrowRight } from 'lucide-react';
import './CountrySelection.css';

// Complete list of requested countries
const countries = [
  { name: 'Algeria', code: 'dz' },
  { name: 'Angola', code: 'ao' },
  { name: 'Argentina', code: 'ar' },
  { name: 'Australia', code: 'au' },
  { name: 'Bangladesh', code: 'bd' },
  { name: 'Belgium', code: 'be' },
  { name: 'Brazil', code: 'br' },
  { name: 'Canada', code: 'ca' },
  { name: 'China', code: 'cn' },
  { name: 'Egypt', code: 'eg' },
  { name: 'France', code: 'fr' },
  { name: 'Germany', code: 'de' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Hong Kong', code: 'hk' },
  { name: 'Indonesia', code: 'id' },
  { name: 'Iran', code: 'ir' },
  { name: 'Iraq', code: 'iq' },
  { name: 'Israel', code: 'il' },
  { name: 'Italy', code: 'it' },
  { name: 'Japan', code: 'jp' },
  { name: 'Kazakhstan', code: 'kz' },
  { name: 'Kuwait', code: 'kw' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Mexico', code: 'mx' },
  { name: 'Mozambique', code: 'mz' },
  { name: 'Nepal', code: 'np' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Nigeria', code: 'ng' },
  { name: 'Oman', code: 'om' },
  { name: 'Pakistan', code: 'pk' },
  { name: 'Poland', code: 'pl' },
  { name: 'Qatar', code: 'qa' },
  { name: 'Russia', code: 'ru' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Singapore', code: 'sg' },
  { name: 'South Africa', code: 'za' },
  { name: 'South Korea', code: 'kr' },
  { name: 'Spain', code: 'es' },
  { name: 'Sri Lanka', code: 'lk' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Taiwan', code: 'tw' },
  { name: 'Tanzania', code: 'tz' },
  { name: 'Thailand', code: 'th' },
  { name: 'Turkey', code: 'tr' },
  { name: 'UAE', code: 'ae' },
  { name: 'Ukraine', code: 'ua' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'USA', code: 'us' },
  { name: 'Venezuela', code: 've' },
  { name: 'Vietnam', code: 'vn' }
];

const categories = [
  'ALL COUNTRIES',
  'ASIA',
  'EUROPE',
  'AFRICA',
  'NORTH AMERICA',
  'SOUTH AMERICA',
  'OCEANIA'
];

const CountrySelection = () => {
  const [activeCategory, setActiveCategory] = useState('ALL COUNTRIES');
  const [searchQuery, setSearchQuery] = useState('');

  // Optional filtering logic if needed (currently filtering only by name)
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="cs-dashboard">
      
      {/* 1. HERO SECTION */}
      <section className="cs-hero">
        <div className="cs-hero-content">
          <div className="cs-hero-header">
            <Globe size={42} className="cs-hero-icon" strokeWidth={1.5} />
            <h1>Explore Countries</h1>
          </div>
          <p className="cs-hero-subtitle">
            Discover export, import, trade information and opportunities across global markets.
          </p>

          {/* 3. SEARCH BAR */}
          <div className="cs-search-container">
            <div className="cs-search-wrapper">
              <Search className="cs-search-icon" size={22} />
              <input 
                type="text" 
                className="cs-search-input" 
                placeholder="Search by country name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="cs-content-wrapper">
        
        {/* 9. CATEGORY / FILTER BAR */}
        <section className="cs-filters">
          <div className="cs-filter-scroll">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`cs-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 10. COUNTRY COUNT */}
        <div className="cs-grid-header">
          <h2 className="cs-section-title">GLOBAL MARKETS</h2>
          <span className="cs-country-count">Explore {filteredCountries.length} Countries</span>
        </div>

        {/* 4, 6, 8. COUNTRY PRESENTATION & LAYOUT */}
        <div className="cs-country-grid">
          {filteredCountries.map((country) => (
            <div key={country.code} className="cs-country-tile">
              
              <div className="cs-tile-header">
                <div className="cs-flag-circle">
                  <img 
                    src={`https://flagcdn.com/w320/${country.code}.png`} 
                    alt={country.name} 
                    className="cs-flag-img"
                  />
                </div>
                <span className="cs-country-code">{country.code.toUpperCase()}</span>
              </div>
              
              <div className="cs-tile-body">
                <h3 className="cs-country-name">{country.name}</h3>
                <div className="cs-explore-link">
                  <span>Explore Market</span>
                  <ArrowRight size={16} className="cs-explore-arrow" />
                </div>
              </div>
              
            </div>
          ))}
        </div>
        
        {filteredCountries.length === 0 && (
          <div className="cs-no-results">
            <p>No countries found matching your search.</p>
          </div>
        )}

      </div>
    </main>
  );
};

export default CountrySelection;
