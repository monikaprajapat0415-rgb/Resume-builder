import { useEffect, useState } from 'react'
import api from '../configs/api'
import toast from 'react-hot-toast'

// The paid plan is switched on and off by an admin. While it is off (the default, and on any error) the site is free.
let cached = null, inflight = null
export const loadPlan = () => {
  if (cached) return Promise.resolve(cached)
  if (!inflight) inflight = api.get('/api/plan').then((r) => (cached = r.data?.plan || { enabled: false })).catch(() => ({ enabled: false })).finally(() => { inflight = null })
  return inflight
}
export const invalidatePlan = () => { cached = null }
export const usePlan = () => {
  const [plan, setPlan] = useState(cached)
  useEffect(() => { let live = true; loadPlan().then((p) => { if (live) setPlan(p) }); return () => { live = false } }, [])
  return plan // null while loading
}
export const isPaid = (user) => Boolean(user && (user.role === 'admin' || (user.planUntil && new Date(user.planUntil) > new Date())))

// Call from a catch block. Returns true if the error was "this needs the paid plan" and has been shown.
export const handlePlanError = (error) => {
  if (error?.response?.status !== 402 || error.response?.data?.code !== 'PLAN_REQUIRED') return false
  toast.error((t) => (
    <span>{error.response.data.message} <a href='/pricing' className='underline font-medium' onClick={() => toast.dismiss(t.id)}>See the plan</a></span>
  ), { duration: 7000 })
  return true
}
