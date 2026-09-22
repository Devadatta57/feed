import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Sprout, Crown, Gem, Star, Calendar,
  CheckCircle2, Loader2, Info, Sparkles,
} from 'lucide-react';
import { plans, CURRENT_PLAN_ID, formatINR } from './plansData';
import './PlansPage.css';

const PLAN_ICONS = {
  basic: Sprout,
  gold: Crown,
  platinum: Gem,
};

const PlansPage = ({ onBack }) => {
  const [upgradingId, setUpgradingId] = useState(null);
  const [requestedId, setRequestedId] = useState(null);

  const handleUpgrade = (planId) => {
    if (upgradingId || requestedId === planId) return;
    setUpgradingId(planId);
    setTimeout(() => {
      setUpgradingId(null);
      setRequestedId(planId);
    }, 900);
  };

  return (
    <div className="plans-view">
      <button className="plans-back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="plans-header-row">
        <div className="plans-title">
          <div className="plans-eyebrow"><Sparkles size={14} /> Membership Plans</div>
          <h1>Choose the plan that grows with you</h1>
          <p>Unlock more tools, higher limits and priority support for your organisation.</p>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.id];
          const isCurrent = plan.id === CURRENT_PLAN_ID;
          const isRequested = requestedId === plan.id;
          const isUpgrading = upgradingId === plan.id;
          const displayTotal = plan.totalPrice ?? plan.price;

          return (
            <div
              key={plan.id}
              className={`plan-card plan-${plan.id} ${plan.popular ? 'plan-popular' : ''} ${plan.bestChoice ? 'plan-best' : ''} ${isCurrent ? 'plan-current' : ''}`}
            >
              {plan.popular && (
                <div className="plan-ribbon">
                  <Star size={12} fill="currentColor" /> Most Popular
                </div>
              )}
              {plan.bestChoice && <div className="plan-corner-ribbon">Best Choice</div>}

              <div className="plan-card-header">
                <div className="plan-icon-badge">
                  <Icon size={26} />
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
              </div>

              <div className="plan-duration-chip">
                <Calendar size={13} /> {plan.duration}
              </div>

              <div className="plan-pricing">
                <span className="plan-pricing-label">
                  {plan.months > 1 ? 'Total you pay' : 'You pay'}
                </span>
                <div className="plan-total-price">
                  <span className="plan-currency">₹</span>{formatINR(displayTotal)}
                </div>
                {plan.months > 1 && (
                  <div className="plan-monthly-price">₹{formatINR(plan.price)} / month</div>
                )}
                {plan.saveBadge && <div className="plan-save-badge">{plan.saveBadge}</div>}
              </div>

              <div className="plan-services-count">
                {plan.serviceCount} Services Included
              </div>

              <ul className="plan-feature-list">
                {plan.features.map((f) => (
                  <li key={f.name}>
                    <CheckCircle2 size={16} className="plan-feature-check" />
                    <span className="plan-feature-name">{f.name}</span>
                    <span className={`plan-feature-tag ${f.tag === 'Full' ? 'tag-full' : 'tag-limit'}`}>
                      {f.tag}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="plan-cta-btn"
                disabled={isCurrent || isUpgrading || isRequested}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isCurrent ? (
                  <><CheckCircle2 size={16} /> Current Plan</>
                ) : isUpgrading ? (
                  <><Loader2 size={16} className="plan-spin" /> Sending request…</>
                ) : isRequested ? (
                  <><CheckCircle2 size={16} /> Request Sent</>
                ) : (
                  <>Upgrade to {plan.name} <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="plans-footer-note">
        <Info size={16} />
        <span>Subscriptions are activated after admin approval. You&apos;ll receive an in-app notification once your access is activated.</span>
      </div>
    </div>
  );
};

export default PlansPage;
