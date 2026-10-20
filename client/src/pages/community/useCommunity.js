import { useCallback, useEffect, useState } from 'react'
import api from '../../configs/api'
import { dropServerJsonLd } from '../../utils/seoDom'

// Loads a community endpoint. state: loading | ok | missing | error. `reload` refetches (after a submission).
export const useCommunity = (url) => {
  const [state, setState] = useState('loading')
  const [data, setData] = useState(null)
  const load = useCallback(() => {
    let live = true
    api.get(url)
      .then(({ data: d }) => { if (live) { setData(d); setState('ok') } })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [url])
  useEffect(() => { setState('loading'); return load() }, [load])
  useEffect(() => { if (state !== 'loading') dropServerJsonLd() }, [state])
  return { state, data, reload: load }
}

export const timeAgo = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
