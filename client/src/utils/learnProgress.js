import { useCallback, useSyncExternalStore } from 'react'

// Learning progress, kept in this browser only (no account needed, nothing is sent to a server).
// Shape per course: { done: [lessonSlug], marks: [lessonSlug], last: lessonSlug, lastAt: ms }
const KEY = 'prime_learn'
const listeners = new Set()
let cache = null

const readAll = () => {
  if (cache) return cache
  try { cache = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch { cache = {} }
  return cache
}
const writeAll = (all) => {
  cache = all
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* private mode: progress lasts for this visit only */ }
  listeners.forEach((l) => l())
}
const subscribe = (cb) => {
  listeners.add(cb)
  const onStorage = (e) => { if (e.key === KEY) { cache = null; cb() } }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage) }
}
const EMPTY = { done: [], marks: [], last: '', lastAt: 0 }
const get = (course) => readAll()[course] || EMPTY
const patch = (course, fn) => { const all = { ...readAll() }; all[course] = fn({ ...EMPTY, ...(all[course] || {}) }); writeAll(all) }
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export function useCourseProgress(course) {
  const p = useSyncExternalStore(subscribe, () => get(course), () => EMPTY)
  return {
    done: p.done, marks: p.marks, last: p.last,
    toggleDone: useCallback((lesson) => patch(course, (c) => ({ ...c, done: toggle(c.done, lesson) })), [course]),
    toggleMark: useCallback((lesson) => patch(course, (c) => ({ ...c, marks: toggle(c.marks, lesson) })), [course]),
    visit: useCallback((lesson) => { if (get(course).last !== lesson) patch(course, (c) => ({ ...c, last: lesson, lastAt: Date.now() })) }, [course]),
    resetAll: useCallback(() => patch(course, () => ({ ...EMPTY })), [course]),
  }
}

// Only count lessons that still exist in the course (a lesson may be removed or renamed later).
export const countDone = (done, allSlugs) => allSlugs.filter((s) => done.includes(s)).length
