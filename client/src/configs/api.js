import axios from "axios";

// Some .env editors or users may add quotes around the URL value (e.g. VITE_BASE_URL="http://localhost:3000").
// Strip surrounding quotes if present to avoid creating an invalid baseURL for axios.
const rawBase = import.meta.env.VITE_BASE_URL || "";
const base = rawBase.replace(/^\"|\"$/g, "").replace(/^\'|\'$/g, "");

const api = axios.create({
  baseURL: base || undefined,
});

// Dev helper: print the base used by axios so we can debug invalid URL issues in the browser
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.debug('[api] axios baseURL =', base);
}

export default api;