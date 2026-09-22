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
  fetchPublicationPdfBlob, getPublicationFileUrl, searchPublications
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

const emptyAddForm = (year) => ({ title: '', year: year || new Date().getFullYear(), month: '', file: null });

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
  const openAdd = () => {
    setAddForm(emptyAddForm(selectedYear));
    setAddError('');
    setAddOpen(true);
  };

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
      showBanner('success', `Publication for ${MONTH_NAMES[addForm.month - 1]} ${addForm.year} added.`);
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
      showBanner('success', `${editing.monthName} ${editing.year} updated.`);
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
      showBanner('success', `PDF replaced for ${replacing.monthName} ${replacing.year}.`);
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
      showBanner('success', `${deleting.monthName} ${deleting.year} deleted.`);
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
          <button type="button" className="admin-pub-btn primary" onClick={openAdd}>
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
          ) : displayedPublications.length === 0 ? (
            <div className="admin-pub-empty">
              {isSearchActive ? `No publications match "${searchQuery.trim()}".` : `No publications for ${selectedYear || 'this year'} yet.`}
            </div>
          ) : (
            <table className="admin-pub-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Title</th>
                  <th>Published</th>
                  <th>Pages</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedPublications.map((pub) => (
                  <tr key={pub.id}>
                    <td>{pub.year}</td>
                    <td>{pub.monthName}</td>
                    <td>{pub.title}</td>
                    <td>{pub.publishedDate ? formatPublishedDate(pub.publishedDate) : '—'}</td>
                    <td>{pub.pageCount ?? '—'}</td>
                    <td>{formatBytes(pub.fileSizeBytes)}</td>
                    <td className="admin-pub-actions">
                      <button
                        type="button"
                        className="admin-pub-icon-btn"
                        title="View PDF"
                        onClick={() => openView(pub)}
                      >
                        <Eye size={15} />
                      </button>
                      <a
                        className="admin-pub-icon-btn"
                        href={getPublicationFileUrl(pub.id, { download: true })}
                        title="Download PDF"
                      >
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
                ))}
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
                  <input type="number" value={addForm.year} onChange={(e) => setAddForm((f) => ({ ...f, year: e.target.value }))} required />
                </label>
                <label>
                  Month
                  <select value={addForm.month} onChange={(e) => setAddForm((f) => ({ ...f, month: e.target.value }))} required>
                    <option value="">Select month</option>
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </label>
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
              <h3><Pencil size={18} /> Edit {editing.monthName} {editing.year}</h3>
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
                <div><span>Current Publication</span><strong>{replacing.monthName} {replacing.year}</strong></div>
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
              <p>Delete the <strong>{deleting.monthName} {deleting.year}</strong> publication?</p>
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
              <h3><Eye size={18} /> {viewing.monthName} {viewing.year}</h3>
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
