import React from 'react';
import { 
  IndianRupee, ShieldCheck, ArrowRight, Wallet, 
  Landmark, Activity, FileText, Banknote, Shield,
  CheckCircle2, Globe, TrendingUp
} from 'lucide-react';
import './ExportFinanceInsurance.css';

const ExportFinanceInsurance = () => {
  return (
    <div className="efi-dashboard">
      
      {/* 1. HERO SECTION */}
      <section className="efi-hero-banner">
        <div className="efi-hero-overlay"></div>
        <div className="efi-hero-content">
          <h1>Export-Import Finance & Insurance</h1>
          <p>Financial solutions and insurance protection supporting secure international trade.</p>
        </div>
      </section>

      <div className="efi-dashboard-container">
        
        {/* 2. FINANCE & INSURANCE INTRO VISUALS */}
        <section className="efi-intro-row">
          
          <div className="efi-intro-card efi-finance-intro">
            <div className="efi-intro-icon-wrapper blue-glow">
              <IndianRupee size={36} strokeWidth={2.5} />
            </div>
            <h2>FINANCE</h2>
            <div className="efi-intro-text">
              <p>Finance in any business is necessary to meet working capital needs or to overcome unforeseen contingencies.</p>
              <p>Even in the export process, finance plays a major role at every stage. For example, a new exporter may require financial support for setting up of his business. An established entrepreneur may need export finance to expand into new global markets or to open new branches. Likewise, an exporter will need export finance to meet the working capital requirements.</p>
            </div>
          </div>

          <div className="efi-intro-card efi-insurance-intro">
            <div className="efi-intro-icon-wrapper green-glow">
              <ShieldCheck size={36} strokeWidth={2.5} />
            </div>
            <h2>INSURANCE</h2>
            <div className="efi-intro-text">
              <p>ECGC Ltd. (Formerly Export Credit Guarantee Corporation of India Ltd.), wholly owned by Government of India, was set up in 1957 with the objective of promoting exports from the country by providing Credit Risk Insurance and related services for exports.</p>
            </div>
          </div>

        </section>

        {/* 3. EXPORT FINANCE SOLUTIONS */}
        <section className="efi-section efi-finance-solutions">
          <div className="efi-section-header">
            <h2 className="efi-section-title">
              <TrendingUp className="title-icon blue-icon" size={28} />
              Export Finance Solutions
            </h2>
            <p className="efi-section-subtitle">There are different types of export finance namely:</p>
          </div>

          <div className="efi-service-grid">
            <div className="efi-service-tile">
              <div className="tile-icon-bg"><Wallet size={24} /></div>
              <h3>Pre-shipment</h3>
            </div>
            <div className="efi-service-tile">
              <div className="tile-icon-bg"><Landmark size={24} /></div>
              <h3>Post-shipment</h3>
            </div>
            <div className="efi-service-tile">
              <div className="tile-icon-bg"><FileText size={24} /></div>
              <h3>Export finance against collection of bills</h3>
            </div>
            <div className="efi-service-tile">
              <div className="tile-icon-bg"><Activity size={24} /></div>
              <h3>Deferred export finance</h3>
            </div>
            <div className="efi-service-tile">
              <div className="tile-icon-bg"><Banknote size={24} /></div>
              <h3>Export finance against allowances and subsidies</h3>
            </div>
          </div>

          <p className="efi-solutions-text">
            Which type suits your needs or at what stage you need the finance solely depends on the type of business and its needs.
          </p>

          <div className="efi-cta-container">
            <div className="efi-premium-cta">
              <div className="cta-info">
                <h3>Explore Export Finance Types</h3>
                <p>Learn more about export finance and the institutions involved.</p>
              </div>
              <a href="https://www.dripcapital.com/en-in/resources/blog/export-finance-types" target="_blank" rel="noopener noreferrer" className="cta-btn">
                Learn More <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <div className="efi-divider"></div>

        {/* 4. ECGC / EXPORT CREDIT INSURANCE */}
        <section className="efi-section efi-insurance-details">
          <div className="efi-section-header">
            <h2 className="efi-section-title">
              <Globe className="title-icon green-icon" size={28} />
              ECGC / Export Credit Insurance
            </h2>
          </div>

          <div className="efi-insurance-modules">
            
            <div className="efi-info-module">
              <h3>What does ECGC do?</h3>
              <ul className="efi-check-list">
                <li><CheckCircle2 size={20} className="check-icon" /> Provides a range of credit risk insurance covers to exporters against loss in export of goods and services</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Offers Export Credit Insurance covers to banks and financial institutions to enable exporters to obtain better facilities from them</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Provides Overseas Investment Insurance to Indian companies investing in joint ventures abroad in the form of equity or loan</li>
              </ul>
            </div>

            <div className="efi-info-module">
              <h3>How does ECGC help exporters?</h3>
              <ul className="efi-check-list">
                <li><CheckCircle2 size={20} className="check-icon" /> ECGC Offers insurance protection to exporters against payment risks.</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Provides guidance in export-related activities.</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Makes available information on different countries with its own credit ratings.</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Makes it easy to obtain export finance from banks/financial institutions.</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Assists exporters in recovering bad debts.</li>
                <li><CheckCircle2 size={20} className="check-icon" /> Provides information on credit-worthiness of overseas buyers.</li>
              </ul>
            </div>

            <div className="efi-info-module efi-long-text-module">
              <h3>Need for export credit insurance</h3>
              <div className="efi-article-content">
                <p>
                  Payments for exports are open to risks even at the best of times. The risks have assumed large proportions today due to the far-reaching political and economic changes that are sweeping the world. 
                </p>
                <p>
                  An outbreak of war or civil war may block or delay payment for goods exported. A coup or an insurrection may also bring about the same result. Economic difficulties or balance of payment problems may lead a country to impose restrictions on either import of certain goods or on transfer of payments for goods imported. 
                </p>
                <p>
                  In addition, the exporters have to face commercial risks of insolvency or protracted default of buyers. The commercial risks of a foreign buyer going bankrupt or losing his capacity to pay are aggravated due to the political and economic uncertainties. 
                </p>
                <p className="highlight-paragraph">
                  Export credit insurance is designed to protect exporters from the consequences of the payment risks, both political and commercial, and to enable them to expand their overseas business without fear of loss.
                </p>
              </div>
            </div>

          </div>
        </section>

        <div className="efi-divider"></div>

        {/* 5. ECGC PRODUCTS & SERVICES */}
        <section className="efi-section efi-products-section">
          <div className="efi-section-header">
            <h2 className="efi-section-title">
              <Shield className="title-icon green-icon" size={28} />
              ECGC Products & Services
            </h2>
            <p className="efi-section-subtitle">There are 3 types of products & services offered by ECGC namely:</p>
          </div>

          <div className="efi-product-cards-row">
            
            <div className="efi-product-card">
              <div className="card-icon-header">
                <ShieldCheck size={32} />
              </div>
              <div className="card-body">
                <h4>ECIE Short Term</h4>
                <h5>Turnover Based</h5>
                <div className="card-accent-line"></div>
              </div>
            </div>

            <div className="efi-product-card">
              <div className="card-icon-header">
                <ShieldCheck size={32} />
              </div>
              <div className="card-body">
                <h4>ECIE Short Term</h4>
                <h5>Exposure Based</h5>
                <div className="card-accent-line"></div>
              </div>
            </div>

            <div className="efi-product-card">
              <div className="card-icon-header">
                <ShieldCheck size={32} />
              </div>
              <div className="card-body">
                <h4>ECIE Short Term</h4>
                <h5>Medium & Long Term</h5>
                <div className="card-accent-line"></div>
              </div>
            </div>

          </div>

          <div className="efi-product-dropdown-section">
            <fieldset className="efi-dropdown-fieldset">
              <legend className="efi-dropdown-legend">Product/service</legend>
              <select className="efi-dropdown-select" defaultValue="">
                <option value="" disabled hidden></option>
                <option value="banana">Banana</option>
                <option value="apple">Apple</option>
                <option value="grapes">Grapes</option>
                <option value="kiwi">Kiwi</option>
                <option value="orange">Orange</option>
                <option value="papaya">Papaya</option>
              </select>
            </fieldset>
            
            <button className="efi-policy-btn">import /export policy</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ExportFinanceInsurance;
