import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PdfViewer from '../../components/PdfViewer';
import {
  BookOpen, Plus, Pencil, RefreshCw, Trash2, Eye, Download, X, UploadCloud,
  FileText, AlertCircle, CheckCircle2, Loader2, Search
} from 'lucide-react';
import {
  fetchPublicationYears, fetchPublicationsByYear, fetchPublicationById,
  createPublication, updatePublicationMetadata, replacePublicationPdf, deletePublicationAdmin,
  fetchPublicationPdfBlob, getPublicationFileUrl, searchPublications, PUBLICATION_LANGUAGES
} from '../../api/publicationsApi';
import useScrollToTop from '../../hooks/useScrollToTop';
import { formatPublishedDate } from '../../utils/publicationDate';
import './AdminDashboard.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const LANGUAGE_BADGES = { English: 'EN', Telugu: 'TE', Hindi: 'HI' };

const LanguageBadge = ({ language }) => (
  <span className={`admin-pub-lang-badge admin-pub-lang-badge-${(language || '').toLowerCase()}`}>
    <span className="admin-pub-lang-badge-code">{LANGUAGE_BADGES[language] || language}</span>
    {language}
  </span>
);

const StatusBadge = ({ published }) => (
  <span className={`admin-pub-status-badge ${published ? 'published' : 'not-uploaded'}`}>
    <span className="admin-pub-status-dot" />
    {published ? 'Published' : 'Not uploaded'}
  </span>
);

const emptyAddForm = (year, month, language) => ({
  title: '',
  year: year || new Date().getFullYear(),
  month: month || '',
  language: language || 'English',
  languageLocked: Boolean(language),
  file: null,
});

/**
 * Admin-only publication management (see AdminPublicationController / SecurityConfig's
 * hasRole("ADMIN") matcher on /api/admin/publications/**). App.jsx only ever renders this for a
 * logged-in user whose role is ADMIN, but the backend is the real gate - every write here would
 * be rejected with 403 for anyone else regardless of what the frontend shows.
 */
const AdminDashboard = ({ onNavigate, isLoggedIn, user, onLogout }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [banner, setBanner] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyAddForm());
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  const [replacing, setReplacing] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [replaceSubmitting, setReplaceSubmitting] = useState(false);
  const [replaceError, setReplaceError] = useState('');

  const [deleting, setDeleting] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [viewing, setViewing] = useState(null);
  const [viewPdfUrl, setViewPdfUrl] = useState(null);
  const [viewError, setViewError] = useState('');
  const viewPdfUrlRef = useRef(null);

  useScrollToTop(selectedYear);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner((b) => (b && b.message === message ? null : b)), 4000);
  };

  const loadYears = useCallback(async () => {
    try {
      const data = await fetchPublicationYears();
      const sorted = (data || []).map((y) => y.year).sort((a, b) => b - a);
      setYears(sorted);
      setSelectedYear((prev) => (prev && sorted.includes(prev) ? prev : sorted[0] || new Date().getFullYear()));
      return sorted;
    } catch (e) {
      setLoadError(e.message || 'Failed to load publication years.');
      return [];
    }
  }, []);

  // Both the year list and search results only give id/title/monthName/pageCount/thumbnailUrl/
  // publishedDate (see PublicationSummaryDto) - fileSizeBytes only exists on the full detail
  // shape, so each summary is upgraded to its detail record. A year has at most 12 issues (and
  // search results are only ever whatever matches the query), so this stays a small number of
  // extra requests, run in parallel.
  const toDetails = async (summaries) => {
    const details = await Promise.all(
      summaries.map((s) => fetchPublicationById(s.id).catch(() => s))
    );
    return details;
  };

  const loadPublications = useCallback(async (year) => {
    if (!year) {
      setPublications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      const summaries = await fetchPublicationsByYear(year);
      const details = await toDetails(summaries);
      setPublications(details.sort((a, b) => b.month - a.month));
    } catch (e) {
      setLoadError(e.message || 'Failed to load publications.');
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadYears();
  }, [loadYears]);

  useEffect(() => {
    loadPublications(selectedYear);
  }, [selectedYear, loadPublications]);

  const runSearch = async (query) => {
    setSearching(true);
    try {
      const summaries = await searchPublications(query);
      const details = await toDetails(summaries);
      setSearchResults(details.sort((a, b) => (b.year - a.year) || (b.month - a.month)));
    } catch (e) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounced title search, independent of the selected year - a match reached from any year
  // takes over the table (see displayedPublications below) until the query is cleared.
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults(null);
      setSearching(false);
      return undefined;
    }
    setSearching(true);
    searchDebounceRef.current = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;
  const displayedPublications = isSearchActive ? (searchResults || []) : publications;

  // One group per month, each holding whichever of the three language editions actually exist -
  // the table always renders all three PUBLICATION_LANGUAGES rows per month (missing ones render
  // as "Not uploaded"), with the Year/Month cells spanning all three. Search results stay a flat
  // per-edition list instead (see the table body below), since a search match already picks out
  // one specific edition.
  const monthGroups = (() => {
    const byMonth = new Map();
    publications.forEach((pub) => {
      if (!byMonth.has(pub.month)) byMonth.set(pub.month, {});
      byMonth.get(pub.month)[pub.language] = pub;
    });
    return Array.from(byMonth.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([month, byLanguage]) => ({ month, byLanguage }));
  })();

  // Which languages already have an uploaded edition for a given year/month, so the Add modal can
  // grey those out - only known for the currently-loaded year (selectedYear); for any other year
  // typed into the modal this simply allows all three and leaves the duplicate check to the
  // backend, which enforces it regardless (see AdminPublicationController/PublicationServiceImpl).
  const languagesTakenFor = (year, month) => {
    if (!month || Number(year) !== selectedYear) return [];
    const group = monthGroups.find((g) => g.month === Number(month));
    return group ? PUBLICATION_LANGUAGES.filter((lang) => group.byLanguage[lang]) : [];
  };

  const refreshAfterChange = async (landOnYear) => {
    const sorted = await loadYears();
    const yearToShow = landOnYear && sorted.includes(landOnYear) ? landOnYear : selectedYear;
    setSelectedYear(yearToShow);
    loadPublications(yearToShow);
    if (isSearchActive) {
      runSearch(searchQuery.trim());
    }
  };

  // --- Add ---
  // `preset` lets the inline "Add {language}" action (shown in a month row when that edition is
  // missing) open this same modal pre-filled with the row's year/month/language, instead of the
  // admin having to re-pick them.
  const openAdd = (preset) => {
    setAddForm(emptyAddForm(preset?.year ?? selectedYear, preset?.month, preset?.language));
    setAddError('');
    setAddOpen(true);
  };

  // Whenever the modal's year/month lands on a combination where the currently-picked language
  // is already taken (or nothing is picked yet), jump to the first still-available language, so
  // the admin is never left with a disabled option selected. Skipped once a preset has locked the
  // language (the "+ Upload {Language}" entry point) - that choice is fixed on purpose.
  useEffect(() => {
    if (!addOpen || addForm.languageLocked) return;
    const taken = languagesTakenFor(addForm.year, addForm.month);
    if (taken.includes(addForm.language)) {
      const nextAvailable = PUBLICATION_LANGUAGES.find((lang) => !taken.includes(lang));
      if (nextAvailable) setAddForm((f) => ({ ...f, language: nextAvailable }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOpen, addForm.year, addForm.month, addForm.language, addForm.languageLocked, monthGroups]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.file) {
      setAddError('Please choose a PDF file.');
      return;
    }
    if (!addForm.month) {
      setAddError('Please select a month.');
      return;
    }
    setAddSubmitting(true);
    setAddError('');
    try {
      await createPublication(addForm);
      setAddOpen(false);
      showBanner('success', `${addForm.language} publication for ${MONTH_NAMES[addForm.month - 1]} ${addForm.year} added.`);
      await refreshAfterChange(Number(addForm.year));
    } catch (err) {
      setAddError(err.message || 'Failed to add publication.');
    } finally {
      setAddSubmitting(false);
    }
  };

  // --- Edit metadata ---
  const openEdit = (pub) => {
    setEditing(pub);
    setEditForm({ title: pub.title || '' });
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError('');
    try {
      await updatePublicationMetadata(editing.id, editForm);
      showBanner('success', `${editing.language} edition of ${editing.monthName} ${editing.year} updated.`);
      setEditing(null);
      await refreshAfterChange();
    } catch (err) {
      setEditError(err.message || 'Failed to update publication.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // --- Replace PDF ---
  const openReplace = (pub) => {
    setReplacing(pub);
    setReplaceFile(null);
    setReplaceError('');
  };

  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!replaceFile) {
      setReplaceError('Please choose a new PDF file.');
      return;
    }
    setReplaceSubmitting(true);
    setReplaceError('');
    try {
      await replacePublicationPdf(replacing.id, replaceFile);
      showBanner('success', `PDF replaced for the ${replacing.language} edition of ${replacing.monthName} ${replacing.year}.`);
      setReplacing(null);
      await refreshAfterChange();
    } catch (err) {
      setReplaceError(err.message || 'Failed to replace the PDF.');
    } finally {
      setReplaceSubmitting(false);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async () => {
    setDeleteSubmitting(true);
    try {
      await deletePublicationAdmin(deleting.id);
      showBanner('success', `${deleting.language} edition of ${deleting.monthName} ${deleting.year} deleted.`);
      const removedYear = deleting.year;
      setDeleting(null);
      await refreshAfterChange(publications.length === 1 ? undefined : removedYear);
    } catch (err) {
      showBanner('error', err.message || 'Failed to delete publication.');
      setDeleting(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // --- View ---
  // Fetches the PDF into an in-memory blob and hands react-pdf that blob URL instead of linking
  // straight to /file - opening /file directly leaves viewing at the mercy of the browser's own
  // "always download PDFs" setting, which is exactly what happened here (see PublicationsHub's
  // showPublication/fetchPublicationPdfBlob for the same pattern on the public reader page).
  const releaseViewPdf = () => {
    if (viewPdfUrlRef.current) {
      URL.revokeObjectURL(viewPdfUrlRef.current);
      viewPdfUrlRef.current = null;
    }
  };

  useEffect(() => releaseViewPdf, []);

  const openView = async (pub) => {
    releaseViewPdf();
    setViewPdfUrl(null);
    setViewError('');
    setViewing(pub);
    try {
      const blob = await fetchPublicationPdfBlob(pub.id);
      const objectUrl = URL.createObjectURL(blob);
      viewPdfUrlRef.current = objectUrl;
      setViewPdfUrl(objectUrl);
    } catch (err) {
      setViewError(err.message || 'The PDF for this issue could not be loaded.');
    }
  };

  const closeView = () => {
    releaseViewPdf();
    setViewPdfUrl(null);
    setViewError('');
    setViewing(null);
  };

  return (
    <div className="admin-pub-page">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} currentPage="admin-dashboard" />
      <div style={{ height: '86px', flexShrink: 0 }} />

      <div className="admin-pub-container">
        <div className="admin-pub-header">
          <div>
            <div className="admin-pub-eyebrow"><BookOpen size={14} /> ADMIN</div>
            <h1>Publication Management</h1>
            <p>Add, edit, replace or remove Feed World's monthly issues.</p>
          </div>
          <button type="button" className="admin-pub-btn primary" onClick={() => openAdd()}>
            <Plus size={16} /> Add Publication
          </button>
        </div>

        {banner && (
          <div className={`admin-pub-banner ${banner.type}`}>
            {banner.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {banner.message}
          </div>
        )}
        {loadError && (
          <div className="admin-pub-banner error"><AlertCircle size={16} /> {loadError}</div>
        )}

        <div className="admin-pub-toolbar">
          <label htmlFor="admin-pub-year">Year</label>
          <select
            id="admin-pub-year"
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={isSearchActive}
          >
            {years.length === 0 && <option value="">No publications yet</option>}
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="admin-pub-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="admin-pub-search-clear" onClick={() => setSearchQuery('')} title="Clear search">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="admin-pub-table-wrap">
          {(isSearchActive ? searching && !searchResults : loading) ? (
            <div className="admin-pub-empty"><Loader2 size={18} className="admin-pub-spin" /> {isSearchActive ? 'Searching…' : 'Loading publications…'}</div>
          ) : (isSearchActive ? displayedPublications.length === 0 : monthGroups.length === 0) ? (
            <div className="admin-pub-empty">
              {isSearchActive ? `No publications match "${searchQuery.trim()}".` : `No publications for ${selectedYear || 'this year'} yet.`}
            </div>
          ) : (
            <table className="admin-pub-table admin-pub-table-grouped">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Language</th>
                  <th>Title</th>
                  <th>Published</th>
                  <th>Pages</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isSearchActive ? (
                  // Search already resolved each row to one specific, uploaded edition.
                  displayedPublications.map((pub) => (
                    <tr key={pub.id}>
                      <td data-label="Year">{pub.year}</td>
                      <td data-label="Month">{pub.monthName}</td>
                      <td data-label="Language"><LanguageBadge language={pub.language} /></td>
                      <td data-label="Title">{pub.title}</td>
                      <td data-label="Published">{pub.publishedDate ? formatPublishedDate(pub.publishedDate) : '—'}</td>
                      <td data-label="Pages">{pub.pageCount ?? '—'}</td>
                      <td data-label="Size">{formatBytes(pub.fileSizeBytes)}</td>
                      <td data-label="Status"><StatusBadge published /></td>
                      <td className="admin-pub-actions" data-label="Actions">
                        <button type="button" className="admin-pub-icon-btn" title="View PDF" onClick={() => openView(pub)}>
                          <Eye size={15} />
                        </button>
                        <a className="admin-pub-icon-btn" href={getPublicationFileUrl(pub.id, { download: true })} title="Download PDF">
                          <Download size={15} />
                        </a>
                        <button type="button" className="admin-pub-icon-btn" title="Edit metadata" onClick={() => openEdit(pub)}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" className="admin-pub-icon-btn" title="Replace PDF" onClick={() => openReplace(pub)}>
                          <RefreshCw size={15} />
                        </button>
                        <button type="button" className="admin-pub-icon-btn danger" title="Delete" onClick={() => setDeleting(pub)}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Three rows per month - one per PUBLICATION_LANGUAGES entry, always in the same
                  // order - with Year/Month spanning all three via rowSpan instead of repeating.
                  // The rowSpan cells only exist in the DOM on the first row of each group, which
                  // reads fine on the desktop table but leaves rows 2-3 with no visible year/month
                  // once the responsive layout stacks every cell into its own block below 560px -
                  // this mobile-only header row (hidden on desktop) carries that context instead.
                  monthGroups.map(({ month, byLanguage }) => ([
                    <tr key={`${month}-mobile-header`} className="admin-pub-mobile-group-header">
                      <td colSpan={9}>{selectedYear} — {MONTH_NAMES[month - 1]}</td>
                    </tr>,
                    ...PUBLICATION_LANGUAGES.map((lang, i) => {
                      const pub = byLanguage[lang];
                      return (
                        <tr key={`${month}-${lang}`} className={i === 0 ? 'admin-pub-group-start' : undefined}>
                          {i === 0 && (
                            <>
                              <td rowSpan={3} className="admin-pub-group-cell" data-label="Year">{selectedYear}</td>
                              <td rowSpan={3} className="admin-pub-group-cell" data-label="Month">{MONTH_NAMES[month - 1]}</td>
                            </>
                          )}
                          <td data-label="Language"><LanguageBadge language={lang} /></td>
                          {pub ? (
                            <>
                              <td data-label="Title">{pub.title}</td>
                              <td data-label="Published">{pub.publishedDate ? formatPublishedDate(pub.publishedDate) : '—'}</td>
                              <td data-label="Pages">{pub.pageCount ?? '—'}</td>
                              <td data-label="Size">{formatBytes(pub.fileSizeBytes)}</td>
                              <td data-label="Status"><StatusBadge published /></td>
                              <td className="admin-pub-actions" data-label="Actions">
                                <button type="button" className="admin-pub-icon-btn" title="View PDF" onClick={() => openView(pub)}>
                                  <Eye size={15} />
                                </button>
                                <a className="admin-pub-icon-btn" href={getPublicationFileUrl(pub.id, { download: true })} title="Download PDF">
                                  <Download size={15} />
                                </a>
                                <button type="button" className="admin-pub-icon-btn" title="Edit metadata" onClick={() => openEdit(pub)}>
                                  <Pencil size={15} />
                                </button>
                                <button type="button" className="admin-pub-icon-btn" title="Replace PDF" onClick={() => openReplace(pub)}>
                                  <RefreshCw size={15} />
                                </button>
                                <button type="button" className="admin-pub-icon-btn danger" title="Delete" onClick={() => setDeleting(pub)}>
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td colSpan={4} className="admin-pub-empty-slot" data-label="Title">—</td>
                              <td data-label="Status"><StatusBadge published={false} /></td>
                              <td className="admin-pub-actions" data-label="Actions">
                                <button
                                  type="button"
                                  className="admin-pub-btn small"
                                  onClick={() => openAdd({ year: selectedYear, month, language: lang })}
                                >
                                  <Plus size={13} /> Upload {lang}
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    }),
                  ]))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {addOpen && (
        <div className="admin-pub-modal-backdrop" onClick={() => !addSubmitting && setAddOpen(false)}>
          <div className="admin-pub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pub-modal-header">
              <h3><UploadCloud size={18} /> Add Publication</h3>
              <button type="button" onClick={() => setAddOpen(false)} disabled={addSubmitting}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="admin-pub-form">
              {addError && <div className="admin-pub-form-error"><AlertCircle size={14} /> {addError}</div>}
              <label>
                Title <span className="optional">(optional, defaults to "Feed World")</span>
                <input type="text" value={addForm.title} onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <div className="admin-pub-form-row">
                <label>
                  Year
                  <input
                    type="number"
                    value={addForm.year}
                    onChange={(e) => setAddForm((f) => ({ ...f, year: e.target.value }))}
                    disabled={addForm.languageLocked}
                    required
                  />
                </label>
                <label>
                  Month
                  <select
                    value={addForm.month}
                    onChange={(e) => setAddForm((f) => ({ ...f, month: e.target.value }))}
                    disabled={addForm.languageLocked}
                    required
                  >
                    <option value="">Select month</option>
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="admin-pub-field-block">
                <span className="admin-pub-field-label">Language</span>
                {addForm.languageLocked ? (
                  <div className="admin-pub-lang-locked">
                    <LanguageBadge language={addForm.language} />
                    <span className="admin-pub-hint">Preselected from the row you opened this from.</span>
                  </div>
                ) : (
                  (() => {
                    const taken = languagesTakenFor(addForm.year, addForm.month);
                    return (
                      <div className="admin-pub-lang-picker">
                        {PUBLICATION_LANGUAGES.map((lang) => {
                          const isTaken = taken.includes(lang);
                          const isSelected = addForm.language === lang;
                          return (
                            <button
                              type="button"
                              key={lang}
                              className={`admin-pub-lang-option ${isSelected ? 'selected' : ''} ${isTaken ? 'taken' : ''}`}
                              disabled={isTaken}
                              onClick={() => setAddForm((f) => ({ ...f, language: lang }))}
                            >
                              <LanguageBadge language={lang} />
                              <span className="admin-pub-lang-option-note">
                                {isTaken ? '✓ Already uploaded' : '○ Available'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
              <label>
                PDF File
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setAddForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                  required
                />
              </label>
              <div className="admin-pub-form-actions">
                <button type="button" onClick={() => setAddOpen(false)} disabled={addSubmitting}>Cancel</button>
                <button type="submit" className="primary" disabled={addSubmitting}>
                  {addSubmitting ? (<><Loader2 size={14} className="admin-pub-spin" /> Adding…</>) : 'Add Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="admin-pub-modal-backdrop" onClick={() => !editSubmitting && setEditing(null)}>
          <div className="admin-pub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pub-modal-header">
              <h3><Pencil size={18} /> Edit {editing.language} — {editing.monthName} {editing.year}</h3>
              <button type="button" onClick={() => setEditing(null)} disabled={editSubmitting}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="admin-pub-form">
              {editError && <div className="admin-pub-form-error"><AlertCircle size={14} /> {editError}</div>}
              <label>
                Title
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
              </label>
              <p className="admin-pub-hint">Year, month and the PDF/thumbnail files stay as they are — use "Replace PDF" to change the file itself.</p>
              <div className="admin-pub-form-actions">
                <button type="button" onClick={() => setEditing(null)} disabled={editSubmitting}>Cancel</button>
                <button type="submit" className="primary" disabled={editSubmitting}>
                  {editSubmitting ? (<><Loader2 size={14} className="admin-pub-spin" /> Saving…</>) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {replacing && (
        <div className="admin-pub-modal-backdrop" onClick={() => !replaceSubmitting && setReplacing(null)}>
          <div className="admin-pub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pub-modal-header">
              <h3><RefreshCw size={18} /> Replace PDF</h3>
              <button type="button" onClick={() => setReplacing(null)} disabled={replaceSubmitting}><X size={18} /></button>
            </div>
            <form onSubmit={handleReplaceSubmit} className="admin-pub-form">
              {replaceError && <div className="admin-pub-form-error"><AlertCircle size={14} /> {replaceError}</div>}
              <div className="admin-pub-replace-summary">
                <div><span>Current Publication</span><strong>{replacing.language} — {replacing.monthName} {replacing.year}</strong></div>
                <div><span>Current PDF</span><strong>{replacing.pageCount ? `Available (${replacing.pageCount} pages)` : 'Available'}</strong></div>
              </div>
              <label>
                New PDF
                <input type="file" accept="application/pdf" onChange={(e) => setReplaceFile(e.target.files?.[0] || null)} required />
              </label>
              <p className="admin-pub-hint">
                <AlertCircle size={13} /> This replaces the existing PDF and regenerates its cover thumbnail. This cannot be undone.
              </p>
              <div className="admin-pub-form-actions">
                <button type="button" onClick={() => setReplacing(null)} disabled={replaceSubmitting}>Cancel</button>
                <button type="submit" className="primary" disabled={replaceSubmitting}>
                  {replaceSubmitting ? (<><Loader2 size={14} className="admin-pub-spin" /> Replacing…</>) : 'Replace PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="admin-pub-modal-backdrop" onClick={() => !deleteSubmitting && setDeleting(null)}>
          <div className="admin-pub-modal admin-pub-modal-narrow" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pub-modal-header">
              <h3><Trash2 size={18} /> Delete Publication?</h3>
              <button type="button" onClick={() => setDeleting(null)} disabled={deleteSubmitting}><X size={18} /></button>
            </div>
            <div className="admin-pub-form">
              <p>Delete the <strong>{deleting.language} edition of {deleting.monthName} {deleting.year}</strong>?</p>
              <p className="admin-pub-hint">This will permanently delete:</p>
              <ul className="admin-pub-delete-list">
                <li><FileText size={13} /> PDF</li>
                <li><FileText size={13} /> Thumbnail</li>
                <li><FileText size={13} /> Metadata</li>
              </ul>
              <div className="admin-pub-form-actions">
                <button type="button" onClick={() => setDeleting(null)} disabled={deleteSubmitting}>Cancel</button>
                <button type="button" className="danger" onClick={handleDeleteConfirm} disabled={deleteSubmitting}>
                  {deleteSubmitting ? (<><Loader2 size={14} className="admin-pub-spin" /> Deleting…</>) : (<><Trash2 size={14} /> Delete</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div className="admin-pub-modal-backdrop" onClick={closeView}>
          <div className="admin-pub-modal admin-pub-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-pub-modal-header">
              <h3><Eye size={18} /> {viewing.language} — {viewing.monthName} {viewing.year}</h3>
              <button type="button" onClick={closeView}><X size={18} /></button>
            </div>
            <div className="admin-pub-view-body">
              {!viewPdfUrl && !viewError && (
                <div className="admin-pub-empty"><Loader2 size={18} className="admin-pub-spin" /> Loading PDF…</div>
              )}
              {viewError && <div className="admin-pub-form-error"><AlertCircle size={14} /> {viewError}</div>}
              {viewPdfUrl && (
                <PdfViewer
                  fileUrl={viewPdfUrl}
                  downloadUrl={getPublicationFileUrl(viewing.id, { download: true })}
                  initialPageCount={viewing.pageCount}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
