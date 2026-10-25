const TOKEN_KEY = 'jt_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method, headers, signal, body: body !== undefined ? JSON.stringify(body) : undefined });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // An expired or invalid token: tell the app so it can sign the person out. (Not for login itself.)
    if (res.status === 401 && token && !path.startsWith('/auth/login')) window.dispatchEvent(new Event('jt:unauthorized'));
    throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data?.details);
  }
  return data;
}
