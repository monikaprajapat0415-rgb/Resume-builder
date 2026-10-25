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

const authHeader = () => (getToken() ? { Authorization: `Bearer ${getToken()}` } : {});

async function fail(res, path) {
  const data = await res.json().catch(() => null);
  if (res.status === 401 && getToken() && !path.startsWith('/auth/login')) window.dispatchEvent(new Event('jt:unauthorized'));
  throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data?.details);
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const headers = { ...authHeader() };
  let payload;
  if (body instanceof FormData) {
    payload = body; // the browser adds the multipart Content-Type (with its boundary) itself. Do not set it.
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, { method, headers, signal, body: payload });
  if (res.status === 204) return null;
  if (!res.ok) await fail(res, path);
  return res.json();
}

// A plain <a href> cannot send our Authorization header, so fetch the file and save it from memory.
export async function downloadFile(path, filename) {
  const res = await fetch(`/api${path}`, { headers: authHeader() });
  if (!res.ok) await fail(res, path);
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
