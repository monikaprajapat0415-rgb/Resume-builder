import { useEffect } from 'react'

// Warns before a refresh, tab close or in-app link click while a form has unsaved changes.
// (The app uses the classic router, so the Back button is only covered by the browser's own prompt.)
export default function useUnsavedWarning(dirty) {
  useEffect(() => {
    if (!dirty) return undefined
    const beforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest && e.target.closest('a[href]')
      if (!a || a.target === '_blank' || !a.getAttribute('href').startsWith('/')) return
      if (!window.confirm('You have unsaved changes. Leave this page without saving?')) { e.preventDefault(); e.stopPropagation() }
    }
    window.addEventListener('beforeunload', beforeUnload)
    document.addEventListener('click', onClick, true)
    return () => { window.removeEventListener('beforeunload', beforeUnload); document.removeEventListener('click', onClick, true) }
  }, [dirty])
}
