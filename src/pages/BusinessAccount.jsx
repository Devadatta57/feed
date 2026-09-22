import React from 'react';
import { ChevronRight } from 'lucide-react';
import MyBusinessLayout from '../components/MyBusinessLayout';
import './BusinessAccount.css';

// Generated icons
import businessSetupIcon from '../assets/my-business/business_setup.svg';
import createVendorIcon from '../assets/my-business/create_vendor.svg';
import createProductIcon from '../assets/my-business/create_product.svg';
import shareCapitalIcon from '../assets/my-business/share_capital.svg';

import financeAccountingIcon from '../assets/my-business/finance_accounting.svg';
import purchaseRegistryIcon from '../assets/my-business/purchase_registry.svg';
import salesRegistryIcon from '../assets/my-business/sales_registry.svg';
import bankRegistryIcon from '../assets/my-business/bank_registry.svg';
import cashbookRegistryIcon from '../assets/my-business/cashbook_registry.svg';
import ledgerRegistryIcon from '../assets/my-business/ledger_registry.svg';

import inventoryIcon from '../assets/my-business/inventory.svg';
import stockRegistryIcon from '../assets/my-business/stock_registry.svg';

import insightsReportingIcon from '../assets/my-business/insights_reporting.svg';
import reportsIcon from '../assets/my-business/reports.svg';

export default function BusinessAccount({ onNavigate, isLoggedIn, user, onLogout }) {
  return (
    <MyBusinessLayout 
      onNavigate={onNavigate} 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={onLogout}
      currentTab="business-account"
    >
      <div className="ba-dashboard-container">
        
        {/* Business Setup Section */}
        <section className="ba-main-section">
          <header className="ba-section-header">
            <div className="ba-section-title-wrap">
              <img src={businessSetupIcon} alt="Business Setup" className="ba-section-icon" />
              <div className="ba-section-texts">
                <h2>Business Setup</h2>
                <p>Setup and manage your core business entities</p>
              </div>
            </div>
            <div className="ba-badge purple-badge">3 Modules</div>
          </header>
          
          <div className="ba-modules-grid cols-3">
            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={createVendorIcon} alt="Create Vendor" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Create Vendor</h3>
                  <p>Add and manage your business vendors</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={createProductIcon} alt="Create Product" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Create Product</h3>
                  <p>Add and manage your products & services</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={shareCapitalIcon} alt="Share Capital Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Share Capital Registry</h3>
                  <p>Manage share capital and investors</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Finance & Accounting Section */}
        <section className="ba-main-section">
          <header className="ba-section-header">
            <div className="ba-section-title-wrap">
              <img src={financeAccountingIcon} alt="Finance & Accounting" className="ba-section-icon" />
              <div className="ba-section-texts">
                <h2>Finance & Accounting</h2>
                <p>Manage all your financial transactions and records</p>
              </div>
            </div>
            <div className="ba-badge blue-badge">5 Modules</div>
          </header>
          
          <div className="ba-modules-grid cols-4">
            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={purchaseRegistryIcon} alt="Purchase Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Purchase Registry</h3>
                  <p>Track and manage purchase transactions</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={salesRegistryIcon} alt="Sales Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Sales Registry</h3>
                  <p>Track and manage sales transactions</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={bankRegistryIcon} alt="Bank Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Bank Registry</h3>
                  <p>Manage your bank accounts</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={cashbookRegistryIcon} alt="Cashbook Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Cashbook Registry</h3>
                  <p>Manage cash in hand transactions</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="ba-module-card">
              <div className="ba-module-content">
                <img src={ledgerRegistryIcon} alt="Ledger Registry" className="ba-module-icon" />
                <div className="ba-module-texts">
                  <h3>Ledger Registry</h3>
                  <p>View and manage ledger accounts</p>
                </div>
              </div>
              <button className="ba-module-arrow">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Split Sections */}
        <div className="ba-split-sections">
          {/* Inventory Section */}
          <section className="ba-main-section half-width">
            <header className="ba-section-header">
              <div className="ba-section-title-wrap">
                <img src={inventoryIcon} alt="Inventory" className="ba-section-icon" />
                <div className="ba-section-texts">
                  <h2>Inventory</h2>
                  <p>Manage your stock and inventory</p>
                </div>
              </div>
              <div className="ba-badge green-badge">1 Module</div>
            </header>
            
            <div className="ba-modules-grid cols-1">
              <div className="ba-module-card">
                <div className="ba-module-content">
                  <img src={stockRegistryIcon} alt="Stock Registry" className="ba-module-icon" />
                  <div className="ba-module-texts">
                    <h3>Stock Registry</h3>
                    <p>Track and manage stock items</p>
                  </div>
                </div>
                <button className="ba-module-arrow">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Insights & Reporting Section */}
          <section className="ba-main-section half-width">
            <header className="ba-section-header">
              <div className="ba-section-title-wrap">
                <img src={insightsReportingIcon} alt="Insights & Reporting" className="ba-section-icon" />
                <div className="ba-section-texts">
                  <h2>Insights & Reporting</h2>
                  <p>Analyze and export business insights</p>
                </div>
              </div>
              <div className="ba-badge purple-badge">1 Module</div>
            </header>
            
            <div className="ba-modules-grid cols-1">
              <div className="ba-module-card">
                <div className="ba-module-content">
                  <img src={reportsIcon} alt="Reports" className="ba-module-icon" />
                  <div className="ba-module-texts">
                    <h3>Reports</h3>
                    <p>View insightful reports and analytics</p>
                  </div>
                </div>
                <button className="ba-module-arrow">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </MyBusinessLayout>
  );
}
