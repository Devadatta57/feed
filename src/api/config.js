// Central place for the backend origin so it's never hardcoded in more than one spot.
// Matches the pattern already used for auth calls in App.jsx.
export const API_BASE_URL = `http://${window.location.hostname}:8080`;
