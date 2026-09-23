import { API_BASE_URL } from './config';

// Publications require a logged-in user (see SecurityConfig#filterChain), so every call here
// needs the same JWT the rest of the app keeps in localStorage.
const authToken = () => localStorage.getItem('jwt');

async function getJson(path) {
  const token = authToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) {
      // response had no JSON body - keep the generic message
    }
    throw new Error(message);
  }
  return res.json();
}

// Shared by the admin write endpoints below (POST/PUT/DELETE on /api/admin/publications/**),
// which additionally require the logged-in user to hold the ADMIN role - see SecurityConfig's
// hasRole("ADMIN") matcher. A non-admin JWT gets a 403 with this same {status, error} JSON shape.
async function authFetch(path, options = {}) {
  const token = authToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) {
      // response had no JSON body - keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

// Archive sidebar: up to `count` issues after year/month, oldest first, capped at December of
// that same year.
export const fetchPublicationsWindow = (year, month, count = 12) =>
  getJson(`/api/publications/window?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}&count=${encodeURIComponent(count)}`);

// Full detail for one issue, used to populate the viewer.
export const fetchPublicationById = (id) => getJson(`/api/publications/${id}`);

// Powers the "Find a Publication" year + month lookup.
export const fetchPublicationByYearMonth = (year, month) =>
  getJson(`/api/publications/lookup?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`);

// Used to open the page on the most recent issue by default.
export const fetchLatestPublication = () => getJson('/api/publications/latest');

export const searchPublications = (query) =>
  getJson(`/api/publications/search?q=${encodeURIComponent(query)}`);

// Hits /stream (not /file): /file is typed application/pdf and gets intercepted by download
// managers / "always download PDFs" browser settings before the viewer's own fetch completes.
export async function fetchPublicationPdfBlob(id) {
  const token = authToken();
  const res = await fetch(`${API_BASE_URL}/api/publications/${id}/stream`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? 'The publication stream endpoint was not found (HTTP 404) - the backend may need to be restarted to pick it up.'
        : `The PDF for this issue could not be loaded (HTTP ${res.status}).`
    );
  }
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('json') || contentType.includes('html')) {
    // An error page or a JSON body here means the request never actually reached the bytes -
    // say so, rather than handing the viewer something it will fail to parse.
    throw new Error(`Expected publication bytes but the server returned "${contentType}".`);
  }
  // Re-label as a PDF for the viewer. The bytes are unchanged; only the type the page attaches
  // to them differs, and that label never crosses the network.
  const buffer = await res.arrayBuffer();
  return new Blob([buffer], { type: 'application/pdf' });
}

// These two are consumed as plain URLs (react-pdf's <Document file=...>, <img src>, <a href>),
// which can't attach an Authorization header, so the JWT rides along as a query param instead -
// see JwtAuthenticationFilter's query-parameter fallback for these two routes specifically.
export const getPublicationFileUrl = (id, { download = false } = {}) => {
  const params = new URLSearchParams();
  if (download) params.set('download', 'true');
  const token = authToken();
  if (token) params.set('token', token);
  const qs = params.toString();
  return `${API_BASE_URL}/api/publications/${id}/file${qs ? `?${qs}` : ''}`;
};

export const getPublicationThumbnailUrl = (id) => {
  const token = authToken();
  return `${API_BASE_URL}/api/publications/${id}/thumbnail${token ? `?token=${encodeURIComponent(token)}` : ''}`;
};

// Every year that has at least one uploaded issue, newest first - drives the reader's "Find a
// Publication" year dropdown and the admin dashboard's year selector, so neither has to be
// hand-updated in code every January.
export const fetchPublicationYears = () => getJson('/api/publications/years');

// A whole year's worth of issues (summary shape) - used by the admin dashboard's publication
// table for the selected year.
export const fetchPublicationsByYear = (year) =>
  getJson(`/api/publications?year=${encodeURIComponent(year)}`);

// --- Admin only (requires the ADMIN role - see AdminPublicationController) -------------------

// Every issue is published separately in each of these languages - one PDF per (year, month,
// language), not one PDF per month. Values must match PublicationLanguage's exact casing (the
// backend enum round-trips via @Enumerated(EnumType.STRING), so "english" or "ENGLISH" would
// fail Spring's enum binding).
export const PUBLICATION_LANGUAGES = ['English', 'Telugu', 'Hindi'];

// `fields` is { file, title, year, month, language, volume, issueNumber }. The backend derives
// the UUID filenames, page count, file size and timestamps itself - none of those are sent here.
export const createPublication = ({ file, title, year, month, language, volume, issueNumber }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  formData.append('year', year);
  formData.append('month', month);
  formData.append('language', language || 'English');
  if (volume !== undefined && volume !== null && volume !== '') formData.append('volume', volume);
  if (issueNumber !== undefined && issueNumber !== null && issueNumber !== '') {
    formData.append('issueNumber', issueNumber);
  }
  return authFetch('/api/admin/publications', { method: 'POST', body: formData });
};

export const updatePublicationMetadata = (id, { title, volume, issueNumber } = {}) => {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (volume !== undefined && volume !== null && volume !== '') params.set('volume', volume);
  if (issueNumber !== undefined && issueNumber !== null && issueNumber !== '') {
    params.set('issueNumber', issueNumber);
  }
  const qs = params.toString();
  return authFetch(`/api/admin/publications/${id}${qs ? `?${qs}` : ''}`, { method: 'PUT' });
};

// Swaps the PDF (and regenerates its thumbnail/page count) without changing the issue's id,
// title, volume or issue number.
export const replacePublicationPdf = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return authFetch(`/api/admin/publications/${id}/pdf`, { method: 'PUT', body: formData });
};

// Removes the PDF, thumbnail and database row for that issue/language.
export const deletePublicationAdmin = (id) =>
  authFetch(`/api/admin/publications/${id}`, { method: 'DELETE' });
