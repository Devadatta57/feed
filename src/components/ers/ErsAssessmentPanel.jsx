import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, ArrowRight, Check, RotateCcw, Loader2,
  AlertTriangle, CircleCheck, CircleX, ShieldCheck,
  Landmark, Award, Package, Sprout, IndianRupee, Globe, FileText,
} from 'lucide-react';
import { sections, scoreSections, computeGaps, getTier, TOTAL_MAX } from './ersData';
import useScrollToTop from '../../hooks/useScrollToTop';
import './ErsAssessmentPanel.css';

const SECTION_ICONS = {
  landmark: Landmark,
  award: Award,
  package: Package,
  sprout: Sprout,
  rupee: IndianRupee,
  globe: Globe,
  file: FileText,
};

const apiBase = () => `http://${window.location.hostname}:8080/api/ers`;

function authHeaders(extra = {}) {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
}

const ErsAssessmentPanel = ({ onBack, onStatusUpdated }) => {
  const [phase, setPhase] = useState('loading'); // loading | quiz | results
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resultMeta, setResultMeta] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  // phase (loading/quiz/results) and currentSection (wizard step) each swap the whole
  // panel content in place, so each transition should land back at the panel's top.
  useScrollToTop(`${phase}-${currentSection}`);

  // Load the user's latest attempt once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/status`, { headers: authHeaders() });
        if (!res.ok) { if (!cancelled) setPhase('quiz'); return; }
        const data = await res.json();
        if (cancelled) return;
        if (data.attempted) {
          setAnswers(data.status.answers || {});
          setResultMeta({
            totalScore: data.status.totalScore,
            percentage: data.status.percentage,
            passed: data.status.passed,
            createdAt: data.status.createdAt,
          });
          setPhase('results');
        } else {
          setPhase('quiz');
        }
      } catch {
        if (!cancelled) setPhase('quiz');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (phase === 'results') {
      setAnimateIn(false);
      const t = setTimeout(() => setAnimateIn(true), 80);
      return () => clearTimeout(t);
    }
    setAnimateIn(false);
  }, [phase, resultMeta]);

  const dimScores = useMemo(() => scoreSections(answers), [answers]);
  const gaps = useMemo(() => computeGaps(answers), [answers]);
  const tier = useMemo(() => getTier(resultMeta?.percentage ?? 0), [resultMeta]);

  const section = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const filledInSection = section.questions.filter(q => answers[q.id] !== undefined).length;
  const sectionComplete = (i) => sections[i].questions.every(q => answers[q.id] !== undefined);
  const overallPct = Math.round(
    ((currentSection + (filledInSection / section.questions.length)) / sections.length) * 100
  );

  const selectOption = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const goPrev = () => setCurrentSection(c => Math.max(0, c - 1));

  const goNext = () => {
    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSection(c => Math.min(sections.length - 1, c + 1));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${apiBase()}/submit`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setResultMeta({
        totalScore: data.totalScore,
        percentage: data.percentage,
        passed: data.passed,
        createdAt: data.createdAt,
      });
      setPhase('results');
      onStatusUpdated?.();
    } catch {
      setSubmitError("Couldn't save your result to the server — showing a local preview instead. Check your connection and reassess to save it.");
      const localTotal = Object.entries(answers).reduce((sum, [, v]) => sum + (v || 0), 0);
      const localPct = (localTotal / TOTAL_MAX) * 100;
      setResultMeta({ totalScore: localTotal, percentage: localPct, passed: localPct > 70, createdAt: null });
      setPhase('results');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentSection(0);
    setResultMeta(null);
    setSubmitError('');
    setPhase('quiz');
  };

  // Semi-circle gauge geometry.
  const R = 108, CX = 140, CY = 140, STROKE = 18;
  const CIRC = Math.PI * R;
  const pct = Math.max(0, Math.min(100, resultMeta?.percentage ?? 0));
  const dialOffset = animateIn ? CIRC * (1 - pct / 100) : CIRC;
  const needleAngle = animateIn ? -90 + (180 * (pct / 100)) : -90;

  return (
    <div className="ers-view">
      <button className="ers-back-btn" onClick={onBack} type="button">
        <ArrowLeft size={17} /> Back to Dashboard
      </button>

      <div className="ers-card">
        <header className="ers-panel-header">
          <div className="ers-header-title">
            <div className="ers-header-icon"><ShieldCheck size={20} /></div>
            <div>
              <h2>Export Readiness Assessment</h2>
              <p>For FPOs, SHGs &amp; first-time exporters · 7 dimensions · ~8 minutes</p>
            </div>
          </div>
        </header>

        {phase === 'loading' && (
          <div className="ers-loading">
            <Loader2 size={22} className="ers-spin" />
            <span>Loading your assessment…</span>
          </div>
        )}

        {phase === 'quiz' && (
          <>
            <div className="ers-progress-row">
              <div className="ers-progress-track">
                <div className="ers-progress-fill" style={{ width: `${overallPct}%` }} />
              </div>
              <div className="ers-progress-labels">
                <span>Section {currentSection + 1} of {sections.length}</span>
                <span>{overallPct}% complete</span>
              </div>
            </div>

            <div className="ers-body">
              <div className="ers-section-header">
                <div className="ers-section-icon" style={{ background: section.iconBg, color: section.iconColor }}>
                  {React.createElement(SECTION_ICONS[section.icon], { size: 20 })}
                </div>
                <div>
                  <div className="ers-section-title">{section.name}</div>
                  <div className="ers-section-subtitle">Max {section.max} pts · {section.subtitle}</div>
                </div>
              </div>

              {section.questions.map(q => (
                <div className="ers-q-card" key={q.id}>
                  <div className="ers-q-top">
                    <div className="ers-q-label">{q.label}</div>
                    <span className="ers-q-weight" style={{ background: section.iconBg, color: section.iconColor }}>
                      {q.weight} pts
                    </span>
                  </div>
                  <div className="ers-q-hint">{q.hint}</div>
                  <div className="ers-opts">
                    {q.options.map(opt => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <div
                          key={opt.value}
                          className={`ers-opt ${selected ? 'selected' : ''}`}
                          onClick={() => selectOption(q.id, opt.value)}
                          role="radio"
                          aria-checked={selected}
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(q.id, opt.value); } }}
                        >
                          <span className="ers-opt-radio">{selected && <span className="ers-opt-radio-dot" />}</span>
                          <span className="ers-opt-text">{opt.text}</span>
                          <span className="ers-opt-pts">{opt.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="ers-stepper">
              {sections.map((s, i) => {
                const done = sectionComplete(i);
                const active = i === currentSection;
                return (
                  <button
                    key={s.id}
                    className={`ers-step-dot ${active ? 'active' : ''} ${done && !active ? 'done' : ''}`}
                    onClick={() => setCurrentSection(i)}
                    type="button"
                    aria-label={`Go to section ${i + 1}: ${s.name}`}
                  >
                    {done && !active ? <Check size={13} /> : i + 1}
                  </button>
                );
              })}
            </div>

            <footer className="ers-nav-row">
              <button
                className="ers-btn"
                onClick={goPrev}
                style={{ visibility: currentSection === 0 ? 'hidden' : 'visible' }}
                type="button"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="ers-nav-status">{filledInSection}/{section.questions.length} answered</span>
              <button className="ers-btn primary" onClick={goNext} disabled={submitting} type="button">
                {submitting ? (
                  <><Loader2 size={16} className="ers-spin" /> Scoring…</>
                ) : isLastSection ? (
                  <>See my score <ArrowRight size={16} /></>
                ) : (
                  <>Next <ChevronRight size={16} /></>
                )}
              </button>
            </footer>
          </>
        )}

        {phase === 'results' && resultMeta && (
          <div className="ers-body ers-results">
            {submitError && (
              <div className="ers-error-banner"><AlertTriangle size={15} /> {submitError}</div>
            )}

            <div className="ers-dial-wrap">
              <svg className="ers-dial-svg" width="280" height="176" viewBox="0 0 280 176">
                <path
                  d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                  fill="none" stroke="#EDEBE3" strokeWidth={STROKE} strokeLinecap="round"
                />
                <path
                  d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                  fill="none" stroke="url(#ersDialGrad)" strokeWidth={STROKE} strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={dialOffset}
                  style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)' }}
                />
                <defs>
                  <linearGradient id="ersDialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E24B4A" />
                    <stop offset="50%" stopColor="#EF9F27" />
                    <stop offset="100%" stopColor="#1D9E75" />
                  </linearGradient>
                </defs>
                <line
                  x1={CX} y1={CY} x2={CX} y2={CY - R + 30}
                  stroke="#1E293B" strokeWidth="3" strokeLinecap="round"
                  style={{
                    transformOrigin: `${CX}px ${CY}px`,
                    transform: `rotate(${needleAngle}deg)`,
                    transition: 'transform 1.1s cubic-bezier(.22,1,.36,1)',
                  }}
                />
                <circle cx={CX} cy={CY} r="6" fill="#1E293B" />
                <text x={CX} y={CY - 22} textAnchor="middle" fontSize="34" fontWeight="800" fill="#0f172a">
                  {Math.round(resultMeta.percentage)}%
                </text>
                <text x={CX - R} y={CY + 22} fontSize="11" fill="#94a3b8" textAnchor="middle">0</text>
                <text x={CX + R} y={CY + 22} fontSize="11" fill="#94a3b8" textAnchor="middle">100</text>
              </svg>

              <div className={`ers-pass-badge ${resultMeta.passed ? 'pass' : 'fail'}`}>
                {resultMeta.passed ? <><CircleCheck size={15} /> Passed</> : <><CircleX size={15} /> Not Passed</>}
                <span className="ers-pass-sub">· {resultMeta.totalScore}/{TOTAL_MAX} pts</span>
              </div>
              <div className="ers-tier" style={{ color: tier.color }}>{tier.tier}</div>
              <div className="ers-tier-desc">{tier.desc}</div>
            </div>

            <div className="ers-dim-grid">
              {dimScores.map(d => (
                <div className="ers-dim-card" key={d.id}>
                  <div className="ers-dim-name">{d.name}</div>
                  <div className="ers-dim-bar-track">
                    <div
                      className="ers-dim-bar-fill"
                      style={{ width: animateIn ? `${d.pct}%` : '0%', background: d.color }}
                    />
                  </div>
                  <div className="ers-dim-score">{d.raw}/{d.max} pts ({d.pct}%)</div>
                </div>
              ))}
            </div>

            <div className="ers-gap-list">
              <div className="ers-gap-title">Priority Gap List</div>
              {gaps.length === 0 ? (
                <div className="ers-gap-item minor">
                  <span className="ers-gap-badge minor">Excellent</span>
                  <div className="ers-gap-text">No significant gaps found. You are well-prepared to export.</div>
                </div>
              ) : gaps.map(g => (
                <div key={g.id} className={`ers-gap-item ${g.severity}`}>
                  <span className={`ers-gap-badge ${g.severity}`}>{g.severity}</span>
                  <div>
                    <div className="ers-gap-text">{g.label}</div>
                    <div className="ers-gap-action">{g.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ers-restart-row">
              <button className="ers-btn primary" onClick={handleRestart} type="button">
                <RotateCcw size={16} /> Reassess
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErsAssessmentPanel;
