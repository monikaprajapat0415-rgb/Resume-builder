import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from './i18n/I18nProvider'

// After a deploy the file names change. A tab opened before the deploy then asks for a page file that no longer exists
// ("Failed to fetch dynamically imported module"). Reload once to pick up the new version; never loop.
const reloadOnce = () => {
  try {
    const last = Number(sessionStorage.getItem('chunk_reload') || 0)
    if (Date.now() - last < 60000) return
    sessionStorage.setItem('chunk_reload', String(Date.now()))
  } catch { /* storage blocked: still reload once per page load below */ }
  window.location.reload()
}
window.addEventListener('vite:preloadError', (e) => { e.preventDefault(); reloadOnce() })
window.addEventListener('unhandledrejection', (e) => {
  if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(String(e.reason?.message || e.reason))) reloadOnce()
})

const rootEl = document.getElementById('root')
// Keep a copy of any server-rendered page text so it can stay on screen while the page's code loads (see App.jsx).
window.__ssrHtml = rootEl.innerHTML

createRoot(rootEl).render(
  <BrowserRouter>
    <HelmetProvider>
      <Provider store={store}>
          <I18nProvider>
            <App />
          </I18nProvider>
      </Provider>
    </HelmetProvider>
  </BrowserRouter>
)
