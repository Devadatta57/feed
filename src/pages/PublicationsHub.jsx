import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PdfViewer from '../components/PdfViewer';
import {
  BookOpen, Eye, Search, Download, ExternalLink, Calendar,
  Layers, FileText, Loader2, Lock
} from 'lucide-react';
import {
  fetchPublicationsWindow, fetchPublicationById,
  fetchPublicationByYearMonth, searchPublications, fetchPublicationPdfBlob,
  getPublicationFileUrl, getPublicationThumbnailUrl, fetchPublicationYears
} from '../api/publicationsApi';
import useScrollToTop from '../hooks/useScrollToTop';
import { formatPublishedDate } from '../utils/publicationDate';
import './PublicationsHub.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// How many issues the archive sidebar can show at once. 12 is effectively "no cap" here - the
// backend never crosses into another year, so at most 11 other issues (every month of the open
// issue's year besides the open one itself) can ever come back.
const ARCHIVE_WINDOW_SIZE = 12;

const PublicationsHub = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [windowItems, setWindowItems] = useState([]);
  const [windowLoading, setWindowLoading] = useState(false);

  // The page opens completely empty: no year, no month, no publication and - critically - no
  // PDF request. Nothing below is ever seeded from the current date or from the latest issue;
  // the only things that can populate `selected` are explicit user actions (the "View
  // Publication" button, or clicking an issue in the archive).
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  // Has the user asked for a publication yet? Keeps "nothing requested yet" and "that request
  // came back empty" as two visibly different empty states.
  const [hasSearched, setHasSearched] = useState(false);

  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // Seeded with the current/previous year so the dropdown isn't empty during the brief moment
  // before fetchPublicationYears() resolves; replaced with whatever years actually have an
  // uploaded issue as soon as that call comes back, so an admin adding a future year's issue
  // (see PublicationServiceImpl's rolling maxAllowedYear()) shows up here without a code change.
  const [yearOptions, setYearOptions] = useState(() => {
    const current = new Date().getFullYear();
    return [current, current - 1];
  });

  // The PDF bytes for the open issue, held as an object URL over an in-memory blob. Null until
  // an explicit user action has fetched them - the viewer is never pointed at a server URL.
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState('');
  const pdfUrlRef = useRef(null);

  // A publication request is already running. Held in a ref rather than state so a second
  // click - or a StrictMode double-invoke - is rejected synchronously, before any re-render.
  const lookupInFlightRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef(null);

  // Opening a different publication swaps the whole viewer panel in place - reset scroll
  // for that (mount-time scroll-to-top for the hub itself is unaffected, key starts null).
  useScrollToTop(selected?.id ?? null);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    fetchPublicationYears()
      .then((years) => {
        if (cancelled || !Array.isArray(years) || years.length === 0) return;
        setYearOptions(years.map((y) => y.year).sort((a, b) => b - a));
      })
      .catch(() => {
        // Keep the seeded current/previous-year fallback if this fails.
      });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  // Archive sidebar tracks whatever issue is currently open - every other issue published in
  // that same calendar year (both earlier and later months), January to December. It never
  // reaches into the open issue's own month or into another year.
  useEffect(() => {
    if (!isLoggedIn || !selected) {
      setWindowItems([]);
      return;
    }
    let cancelled = false;
    setWindowLoading(true);
    fetchPublicationsWindow(selected.year, selected.month, ARCHIVE_WINDOW_SIZE)
      .then((list) => { if (!cancelled) setWindowItems(list); })
      .catch(() => { if (!cancelled) setWindowItems([]); })
      .finally(() => { if (!cancelled) setWindowLoading(false); });
    return () => { cancelled = true; };
  }, [selected, isLoggedIn]);

  // An object URL pins its blob in memory until it is revoked, so the previous issue's bytes
  // are always released before another issue replaces it (and when the page unmounts).
  const releasePdf = useCallback(() => {
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }
  }, []);

  useEffect(() => releasePdf, [releasePdf]);

  // "Open in New Tab" reuses the in-memory blob URL rather than requesting /file directly, for
  // the same reason as fetchPublicationPdfBlob - avoids download-manager interception.
  const openInNewTab = useCallback(() => {
    if (pdfUrlRef.current) {
      window.open(pdfUrlRef.current, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Shared tail of both explicit open paths (finder button, archive click): show the issue and
  // pull its PDF through the authenticated request. Called only from a click handler - never
  // from an effect - so one click means one PDF request.
  const showPublication = useCallback(async (detail) => {
    releasePdf();
    setPdfUrl(null);
    setPdfError('');
    setSelected(detail);
    try {
      const blob = await fetchPublicationPdfBlob(detail.id);
      const objectUrl = URL.createObjectURL(blob);
      pdfUrlRef.current = objectUrl;
      setPdfUrl(objectUrl);
    } catch (e) {
      // Surface the real reason (server down, 403, wrong content type) next to the issue, and
      // keep the header visible so Download PDF is still reachable.
      setPdfError(e.message || 'The PDF for this issue could not be loaded.');
    }
  }, [releasePdf]);

  const openPublication = useCallback(async (id) => {
    if (lookupInFlightRef.current) return;
    lookupInFlightRef.current = true;
    setDetailLoading(true);
    setPageError('');
    setHasSearched(true);
    try {
      const detail = await fetchPublicationById(id);
      setFilterYear(String(detail.year));
      setFilterMonth(String(detail.month));
      await showPublication(detail);
    } catch (e) {
      setPageError('That publication could not be opened.');
    } finally {
      setDetailLoading(false);
      lookupInFlightRef.current = false;
    }
  }, [showPublication]);

  // Changing a dropdown only records the selection - it must never start a request. Clearing
  // the message keeps a stale validation/lookup error from hanging over a fresh choice.
  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
    setPageError('');
  };

  const handleMonthChange = (e) => {
    setFilterMonth(e.target.value);
    setPageError('');
  };

  // Not a useEffect on [filterYear, filterMonth] - nothing fetches until this click handler runs.
  const handleViewPublication = async () => {
    if (!filterYear && !filterMonth) {
      setPageError('Please select a Year and a Month, then click "View Publication".');
      return;
    }
    if (!filterYear) {
      setPageError('Please select a Year before viewing a publication.');
      return;
    }
    if (!filterMonth) {
      setPageError('Please select a Month before viewing a publication.');
      return;
    }
    if (lookupInFlightRef.current) return;

    lookupInFlightRef.current = true;
    setDetailLoading(true);
    setPageError('');
    setHasSearched(true);
    try {
      const detail = await fetchPublicationByYearMonth(filterYear, filterMonth);
      await showPublication(detail);
    } catch (e) {
      // Nothing published that month - drop the previous issue so the viewer never keeps
      // showing a PDF that no longer matches what the dropdowns say.
      releasePdf();
      setPdfUrl(null);
      setSelected(null);
      setPageError(`No publication found for ${MONTH_NAMES[Number(filterMonth) - 1]} ${filterYear}.`);
    } finally {
      setDetailLoading(false);
      lookupInFlightRef.current = false;
    }
  };

  // Debounced search across all publications, independent of which year is expanded.
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!isLoggedIn || !searchQuery.trim()) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPublications(searchQuery.trim());
        setSearchResults(results);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
        <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="feedworld" />
        <div style={{ height: '86px', flexShrink: 0 }}></div>

        <div className="pubs-hub-container">
          <div className="pubs-hero">
            <div className="pubs-hero-overlay"></div>
            <div className="pubs-hero-content">
              <div className="pubs-hero-label">
                <BookOpen size={14} /> PUBLICATIONS
              </div>
              <h1 className="pubs-hero-title">
                <span className="fw-brand-text">Feed World</span>
                <span className="pubs-highlight-text">Publications</span>
              </h1>
              <p className="pubs-hero-subtitle">
                Explore insights, reports and updates that<br/>
                empower agriculture and global trade.
              </p>
            </div>
          </div>

          <div className="pubs-login-gate">
            <div className="pubs-login-gate-icon"><Lock size={28} /></div>
            <h2>Please log in to use this feature</h2>
            <p>Feed World publications are available to logged-in members only.</p>
            <button className="pubs-view-btn" onClick={() => onNavigate('login')}>
              Log In
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="feedworld" />
      <div style={{ height: '86px', flexShrink: 0 }}></div>

      <div className="pubs-hub-container">
        {/* HEADER */}
        <div className="pubs-hero">
          <div className="pubs-hero-overlay"></div>
          <div className="pubs-hero-content">
            <div className="pubs-hero-label">
              <BookOpen size={14} /> PUBLICATIONS
            </div>
            <h1 className="pubs-hero-title">
              <span className="fw-brand-text">Feed World</span>
              <span className="pubs-highlight-text">Publications</span>
            </h1>
            <p className="pubs-hero-subtitle">
              Explore insights, reports and updates that<br/>
              empower agriculture and global trade.
            </p>
          </div>
        </div>

        {pageError && <div className="pubs-alert">{pageError}</div>}

        {/* FIND A PUBLICATION */}
        <div className="pubs-finder-card">
          <div className="pubs-finder-left">
            <div className="pubs-finder-brand">
              <div className="pubs-finder-icon-wrap"><BookOpen size={24} /></div>
              <span className="pubs-finder-label">Find a Publication</span>
            </div>
            <div className="pubs-finder-fields">
              <div className="pubs-finder-field">
                <label>Year</label>
                <select value={filterYear} onChange={handleYearChange}>
                  <option value="">--</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="pubs-finder-field">
                <label>Month</label>
                <select value={filterMonth} onChange={handleMonthChange}>
                  <option value="">--</option>
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <button className="pubs-view-btn" onClick={handleViewPublication} disabled={detailLoading}>
                <Eye size={18} /> View Publication
              </button>
            </div>
          </div>

          <div className="pubs-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by month & year (e.g. August 2025)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="pubs-main-layout">
          {/* ARCHIVE SIDEBAR */}
          <aside className="pubs-archive-panel">
            <div className="pubs-archive-title">
              <Layers size={16} /> Publication Archive
            </div>

            {searchQuery.trim() ? (
              <div className="pubs-search-results">
                {searching && <div className="pubs-empty-state">Searching…</div>}
                {!searching && searchResults && searchResults.length === 0 && (
                  <div className="pubs-empty-state">No publications match "{searchQuery}"</div>
                )}
                {!searching && searchResults && searchResults.map((pub) => (
                  <ArchiveItem key={pub.id} pub={pub} active={selected && selected.id === pub.id} onClick={() => openPublication(pub.id)} />
                ))}
              </div>
            ) : (
              <div className="pubs-window-list">
                {windowLoading && (
                  <div className="pubs-empty-state"><Loader2 size={16} className="pubs-spin" /> Loading archive…</div>
                )}
                {!windowLoading && windowItems.length === 0 && (
                  <div className="pubs-empty-state">Select a publication to see related issues here.</div>
                )}
                {!windowLoading && windowItems.map((pub) => (
                  <ArchiveItem
                    key={pub.id}
                    pub={pub}
                    active={selected && selected.id === pub.id}
                    onClick={() => openPublication(pub.id)}
                  />
                ))}
                {!windowLoading && windowItems.length > 0 && (
                  <a href="#" className="pubs-archive-view-all" onClick={(e) => e.preventDefault()}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Layers size={16}/> View All Publications</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            )}
          </aside>

          {/* MAIN VIEWER */}
          <main className="pubs-viewer-panel">
            {detailLoading && <div className="pubs-empty-state pubs-viewer-loading">Loading publication…</div>}
            {!detailLoading && !selected && (
              <div className="pubs-empty-state pubs-viewer-loading">
                {hasSearched
                  ? 'No publication is open. Please select Year and Month, then click "View Publication".'
                  : 'Please select Year and Month, then click "View Publication" to start reading — or choose an issue from the archive.'}
              </div>
            )}

            {!detailLoading && selected && (
              <>
                <div className="pubs-selected-header">
                  <img
                    className="pubs-selected-thumb"
                    src={getPublicationThumbnailUrl(selected.id)}
                    alt={`${selected.title} cover`}
                    onError={(e) => { e.target.style.visibility = 'hidden'; }}
                  />
                  <div className="pubs-selected-info">
                    <h2>{selected.title} – {selected.monthName} {selected.year}</h2>
                    <div className="pubs-selected-meta">
                      <span><Calendar size={13} /> Published: {formatPublishedDate(selected.publishedDate)}</span>
                      {selected.volume && <span>Volume {selected.volume}</span>}
                      {selected.issueNumber && <span>Issue {selected.issueNumber}</span>}
                      {selected.pageCount && <span><FileText size={13} /> {selected.pageCount} Pages</span>}
                    </div>
                  </div>
                  <div className="pubs-selected-actions">
                    <a
                      className="pubs-action-btn primary"
                      href={getPublicationFileUrl(selected.id, { download: true })}
                    >
                      <Download size={15} /> Download PDF
                    </a>
                    <button
                      type="button"
                      className="pubs-action-btn"
                      onClick={openInNewTab}
                      disabled={!pdfUrl}
                    >
                      <ExternalLink size={15} /> Open in New Tab
                    </button>
                  </div>
                </div>

                {pdfUrl && (
                  <PdfViewer
                    fileUrl={pdfUrl}
                    downloadUrl={getPublicationFileUrl(selected.id, { download: true })}
                    initialPageCount={selected.pageCount}
                  />
                )}
                {!pdfUrl && pdfError && <div className="pubs-alert">{pdfError}</div>}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ArchiveItem = ({ pub, active, onClick }) => (
  <div className={`pubs-archive-item ${active ? 'active' : ''}`} onClick={onClick}>
    <img
      src={getPublicationThumbnailUrl(pub.id)}
      alt={`${pub.title} cover`}
      onError={(e) => { e.target.style.visibility = 'hidden'; }}
    />
    <div className="pubs-archive-item-text">
      <strong>{pub.monthName} {pub.year}</strong>
      <span>{pub.title}</span>
      {pub.pageCount && <span className="pubs-archive-item-pages">{pub.pageCount} Pages</span>}
    </div>
    <FileText size={16} className="pubs-archive-item-icon" />
  </div>
);

export default PublicationsHub;
