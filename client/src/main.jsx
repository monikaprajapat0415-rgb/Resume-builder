import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from './i18n/I18nProvider'

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
