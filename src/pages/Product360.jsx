import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  TREE,
  SEGMETA,
  GRAD,
  ICONS,
  SEG_ORDER,
  LAYER_ORDER,
  FLAGS,
} from '../data/product360Data';
import './Product360.css';

function icon(tag) {
  return ICONS[tag] || '▪️';
}

function gradFor(seg, layer) {
  return GRAD[`${seg}|${layer}`];
}

function statusBadge(tag) {
  const t = (tag || '').trim();
  const m = {
    '✅': ['OK', 'b-ok'],
    '🆕': ['NEW', 'b-ok'],
    '🔬': ['LAB', 'b-ok'],
    '🗺️': ['MAP', 'b-ok'],
    '🟠': ['MED', 'b-med'],
    '🟡': ['LOW', 'b-low'],
    '🔴': ['CRIT', 'b-crit'],
  };
  if (m[t]) {
    return <span className={`badge ${m[t][1]}`}>{m[t][0]}</span>;
  }
  return null;
}

function partSearchBlob(p) {
  return `${p.id} ${p.title} ${p.source || ''}`.toLowerCase();
}

function PartRow({ seg, layer, part, hidden }) {
  const flag = FLAGS[`${seg}|${layer}|${part.id}`];
  return (
    <div className={`part-row${hidden ? ' hide' : ''}`} data-search={partSearchBlob(part)}>
      <div className="p-ic">{icon(part.tag)}</div>
      <div className="p-id">{part.id}</div>
      <div className="p-title">
        {part.title}
        {flag ? <div className="overlap-flag">⚠ {flag}</div> : null}
      </div>
      <div className="p-src">{part.source || ''}</div>
      <div className="p-status">{statusBadge(part.status)}</div>
    </div>
  );
}

function DivBlock({ seg, layer, div, g, query, forceOpen }) {
  const [open, setOpen] = useState(Boolean(forceOpen));
  useEffect(() => {
    if (forceOpen) setOpen(true);
    if (!query) setOpen(false);
  }, [forceOpen, query]);

  const matchParts = div.parts.map((p) => ({
    part: p,
    match: !query || partSearchBlob(p).includes(query),
  }));
  const hasMatch = matchParts.some((m) => m.match);
  if (query && !hasMatch) return null;

  return (
    <div className={`div-block${open ? ' open' : ''}`} style={{ '--accent': g.accent }}>
      <div className="div-head" onClick={() => setOpen((v) => !v)}>
        <span className="div-ic">{icon(div.tag)}</span>
        <span className="div-txt">
          <span className="div-num">DIV {div.num}</span>
          {div.name}
        </span>
        <span className="div-count">{div.parts.length} Parts</span>
        <span className="chevron">▶</span>
      </div>
      <div className="div-body">
        {matchParts.map(({ part, match }) => (
          <PartRow
            key={part.id}
            seg={seg}
            layer={layer}
            part={part}
            hidden={query ? !match : false}
          />
        ))}
      </div>
    </div>
  );
}

function CatCard({ seg, layer, cat, g, query, forceOpen }) {
  const [open, setOpen] = useState(Boolean(forceOpen));
  useEffect(() => {
    if (forceOpen) setOpen(true);
    if (!query) setOpen(false);
  }, [forceOpen, query]);

  const visibleDivs = cat.divs.filter((dv) => {
    if (!query) return true;
    return dv.parts.some((p) => partSearchBlob(p).includes(query));
  });
  if (query && visibleDivs.length === 0) return null;

  return (
    <div className={`cat-card${open ? ' open' : ''}`}>
      <div
        className="cat-head"
        style={{ background: `linear-gradient(120deg,${g.g1},${g.g2})` }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="cat-ic">{icon(cat.tag)}</div>
        <div className="cat-txt">
          <div className="cat-num">CATEGORY {cat.num}</div>
          <div className="cat-name">{cat.name}</div>
        </div>
        <div className="cat-count">{cat.count} Parts</div>
        <div className="chevron">▶</div>
      </div>
      <div className="cat-body">
        {visibleDivs.map((dv) => (
          <DivBlock
            key={`${dv.num}-${dv.name}`}
            seg={seg}
            layer={layer}
            div={dv}
            g={g}
            query={query}
            forceOpen={Boolean(query)}
          />
        ))}
      </div>
    </div>
  );
}

const Product360 = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [activeSeg, setActiveSeg] = useState(SEG_ORDER[0]);
  const [activeLayer, setActiveLayer] = useState('PRODUCT');
  const [query, setQuery] = useState('');
  const tabbarRef = useRef(null);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const matchCount = useMemo(() => {
    if (!searching) return 0;
    let n = 0;
    SEG_ORDER.forEach((seg) => {
      LAYER_ORDER.forEach((layer) => {
        TREE[seg][layer].forEach((cat) => {
          cat.divs.forEach((dv) => {
            dv.parts.forEach((p) => {
              if (partSearchBlob(p).includes(q)) n += 1;
            });
          });
        });
      });
    });
    return n;
  }, [q, searching]);

  const grandTotal = useMemo(
    () => SEG_ORDER.reduce((a, seg) => a + SEGMETA[seg].total, 0),
    []
  );

  const layerCount = (seg, layer) =>
    TREE[seg][layer].reduce((a, c) => a + c.count, 0);

  const showSeg = (seg) => {
    setActiveSeg(seg);
    setActiveLayer('PRODUCT');
    if (tabbarRef.current) {
      window.scrollTo({ top: tabbarRef.current.offsetTop - 10, behavior: 'smooth' });
    }
  };

  return (
    <div className="product360-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} currentPage="product360" />
      <div style={{ height: '86px', flexShrink: 0 }} />

      {/* ===== HERO ===== */}
      <section className="p360-hero">
        <div className="hero-glow" />
        <div className="hero-glow glow2" />
        <span className="p360-eyebrow">
          <span className="eye-dot" />
          SAFE Mission · FEED MSCS Ltd · కృషి యేవ జయతే
        </span>
        <h1>GENERAL PRODUCT 360</h1>
        <p className="hero-sub">
          Farm to Port — 4 segments, 998 Parts, fully traced from source-of-truth spreadsheets.
          Explore every Category → Division → Part across the entire compliance architecture.
        </p>
        <div className="p360-verify">
          <span className="verify-dot" />
          <b>998 / 998 Parts verified</b>
          <span className="verify-detail">
            · FarmGate 337 · Market 77 · ValueAddition 442 · Exports 142 · last verified 2026-08-06
          </span>
        </div>
      </section>

      {/* ===== JOURNEY PIPELINE ===== */}
      <section className="p360-journey">
        <div className="journey-pipe">
          {SEG_ORDER.map((seg) => {
            const g = gradFor(seg, 'PRODUCT');
            return (
              <div key={seg} className="jnode" onClick={() => showSeg(seg)}>
                <div
                  className="jnode-ring"
                  style={{ background: `linear-gradient(135deg,${g.g1},${g.g2})` }}
                >
                  {SEGMETA[seg].icon}
                </div>
                <div className="jnode-label">{SEGMETA[seg].journey}</div>
                <div className="jnode-sub">{SEGMETA[seg].label}</div>
                <div className="jnode-badge" style={{ background: `${g.g2}cc` }}>
                  {SEGMETA[seg].total} Parts
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="p360-stats">
        {SEG_ORDER.map((seg) => {
          const g = gradFor(seg, 'PRODUCT');
          return (
            <div key={seg} className="stat-glass" style={{ borderTop: `2px solid ${g.g2}` }}>
              <div className="stat-num" style={{ color: g.g1 }}>{SEGMETA[seg].total}</div>
              <div className="stat-lbl">{SEGMETA[seg].icon} {SEGMETA[seg].label}</div>
            </div>
          );
        })}
        <div className="stat-glass stat-grand">
          <div className="stat-num">{grandTotal}</div>
          <div className="stat-lbl">Grand Total Parts</div>
        </div>
      </section>

      {/* ===== SEARCH ===== */}
      <section className="p360-search-wrap">
        <div className="p360-searchbox">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 998 Parts — try 'Cold Storage', 'MRL', 'P126', 'Phytosanitary'…"
          />
        </div>
        <div className="p360-search-hint">
          Live search across every segment, layer, category, division and part.
        </div>
      </section>

      {searching && (
        <div className="p360-search-status">
          Showing {matchCount} matching Part(s) across all 4 segments &amp; both layers — tabs are
          temporarily disabled while searching.
        </div>
      )}

      {/* ===== SEGMENT TABS ===== */}
      <div className="p360-tabbar" ref={tabbarRef}>
        {SEG_ORDER.map((seg) => {
          const g = gradFor(seg, 'PRODUCT');
          const active = !searching && activeSeg === seg;
          return (
            <button
              key={seg}
              type="button"
              className={`seg-pill${active ? ' active' : ''}${searching ? ' disabled' : ''}`}
              onClick={() => !searching && showSeg(seg)}
              style={
                active
                  ? { background: `linear-gradient(120deg,${g.g1},${g.g2})` }
                  : undefined
              }
            >
              <div className="pill-row1">
                <span className="pill-ic">{SEGMETA[seg].icon}</span>
                {SEGMETA[seg].label}
              </div>
              <div className="pill-row2">{SEGMETA[seg].sub}</div>
              <div className="pill-row3">{SEGMETA[seg].total} Parts</div>
            </button>
          );
        })}
      </div>

      {/* ===== LAYER SUB-TABS ===== */}
      {!searching && (
        <div className="p360-subtabbar">
          {LAYER_ORDER.map((layer) => {
            const g = gradFor(activeSeg, layer);
            const active = activeLayer === layer;
            return (
              <button
                key={layer}
                type="button"
                className={`layer-pill${active ? ' active' : ''}`}
                onClick={() => setActiveLayer(layer)}
                style={
                  active
                    ? { background: `linear-gradient(100deg,${g.g1},${g.g2})` }
                    : undefined
                }
              >
                {layer === 'PRODUCT' ? '🌱' : '🏢'} {layer}{' '}
                <span style={{ opacity: 0.75 }}>({layerCount(activeSeg, layer)})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="p360-content">
        {searching
          ? SEG_ORDER.map((seg) =>
              LAYER_ORDER.map((layer) => {
                const g = gradFor(seg, layer);
                return (
                  <div key={`${seg}-${layer}`} style={{ marginBottom: 28 }}>
                    <div className="p360-seg-label" style={{ color: g.g1 }}>
                      {SEGMETA[seg].icon} {seg} · {layer}
                    </div>
                    {TREE[seg][layer].map((cat) => (
                      <CatCard
                        key={`${seg}-${layer}-${cat.num}`}
                        seg={seg}
                        layer={layer}
                        cat={cat}
                        g={g}
                        query={q}
                        forceOpen
                      />
                    ))}
                  </div>
                );
              })
            )
          : TREE[activeSeg][activeLayer].map((cat) => (
              <CatCard
                key={`${activeSeg}-${activeLayer}-${cat.num}`}
                seg={activeSeg}
                layer={activeLayer}
                cat={cat}
                g={gradFor(activeSeg, activeLayer)}
                query=""
              />
            ))}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="p360-footer">
        SAFE Mission · FEED MSCS Ltd · Chairman: K. Raghu Vamsi · Mirror of current source-file
        reality — icons and tags are auto-assigned for visual scanning only, not part of source
        data. Overlap-flagged Parts (🔴) reflect open Chairman decisions, not final merges.
      </footer>
    </div>
  );
};

export default Product360;
