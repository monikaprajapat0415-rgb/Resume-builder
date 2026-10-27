import { useEffect, useState } from 'react'
import api from '../configs/api'

// Which free tools the admin has switched on (Admin > Free tools). Read once per page load; everything counts as ON
// until the answer arrives or if it cannot be read, so a failed request never hides a working tool.
let cached = null, pending = null
export const invalidateToolSettings = () => { cached = null; pending = null }
const load = () => {
  if (cached) return Promise.resolve(cached)
  pending ||= api.get('/api/tools/settings').then(({ data }) => (cached = data)).catch(() => (cached = { imageEnhancer: true }))
  return pending
}
export const useToolSettings = () => {
  const [s, setS] = useState(cached || { imageEnhancer: true })
  const [loaded, setLoaded] = useState(Boolean(cached))
  useEffect(() => { let live = true; load().then((d) => { if (live) { setS(d); setLoaded(true) } }); return () => { live = false } }, [])
  return { ...s, loaded }
}
