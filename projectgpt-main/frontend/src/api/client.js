// In production (single Vercel deployment), frontend and backend share the
// same origin, so requests to /api/* work without needing an absolute URL.
// VITE_API_URL can still be set to point at a separately-deployed backend.
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

export const api = async (path, options = {}) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token missing/expired/invalid - clear stale session and send the
      // user back to login rather than showing a confusing error state.
      localStorage.removeItem('token');
      localStorage.removeItem('company');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
};
