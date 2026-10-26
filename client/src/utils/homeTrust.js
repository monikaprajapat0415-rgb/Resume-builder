import { useEffect, useState } from 'react'
import api from '../configs/api'

// One shared request for the home page trust sections (reviews, clients, live counts).
let cache = null
let inflight = null
export const useHomeTrust = () => {
  const [data, setData] = useState(cache)
  useEffect(() => {
    if (cache) return
    let live = true
    inflight ||= api.get('/api/home/trust').then(({ data }) => { cache = data; return data }).catch(() => ({ reviews: [], clients: [], stats: { users: 0, resumes: 0 } }))
    inflight.then((d) => { if (live) setData(d) })
    return () => { live = false }
  }, [])
  return data
}
export const invalidateHomeTrust = () => { cache = null; inflight = null }

// 1,234 -> "1,200+" ; 87 -> "80+". Rounds down so we never claim more than we have.
export const roundDown = (n) => {
  const step = n >= 10000 ? 1000 : n >= 1000 ? 100 : 10
  return Math.floor(n / step) * step
}
