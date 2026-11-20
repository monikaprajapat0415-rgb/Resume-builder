// Where the sign-in token is kept. Admin > Appearance > "Sign-in lasts" chooses the mode:
//   'tab'      the token lives in sessionStorage, so it is gone when the tab or window is closed.
//   'remember' the token lives in localStorage, so it stays until it expires (7 days) or the person logs out.
// Reading checks both places, so people who signed in before the setting existed are not logged out by a deploy.
const safe = (fn, fallback = null) => { try { return fn() } catch { return fallback } }

export const getToken = () => safe(() => sessionStorage.getItem('token') || localStorage.getItem('token'))

export const saveToken = (token, mode) => safe(() => {
  if (mode === 'remember') { localStorage.setItem('token', token); sessionStorage.removeItem('token') }
  else { sessionStorage.setItem('token', token); localStorage.removeItem('token') }
})

export const clearToken = () => safe(() => { sessionStorage.removeItem('token'); localStorage.removeItem('token') })

// When the mode is 'tab', a token left in localStorage by an earlier visit is moved to this tab only.
export const enforceMode = (mode) => safe(() => {
  if (mode !== 'tab') return
  const t = localStorage.getItem('token')
  if (!t) return
  if (!sessionStorage.getItem('token')) sessionStorage.setItem('token', t)
  localStorage.removeItem('token')
})
