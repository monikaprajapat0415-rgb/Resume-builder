import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, NavLink, Link, useLocation } from 'react-router-dom'
import PageNav from '../../components/PageNav'
import { useSelector } from 'react-redux'
import { LuArrowLeft, LuLayoutDashboard, LuFileText, LuTags, LuShoppingBag, LuUsers, LuMenu, LuInbox, LuFilePen, LuType, LuSearch, LuPalette, LuGraduationCap, LuMessageSquare, LuBriefcase, LuHandshake, LuRoute, LuUsersRound, LuChevronDown, LuShieldCheck } from 'react-icons/lu'
import SEO from '../../components/SEO'
import Loader from '../../components/Loader'
import api from '../../configs/api'

const groups = [
  { id: 'home', title: null, items: [{ to: '/admin', label: 'Overview', icon: LuLayoutDashboard, end: true }] },
  { id: 'inbox', title: 'Needs review', items: [
    { to: '/admin/inbox', label: 'Moderation inbox', icon: LuShieldCheck, badge: 'moderation' },
    { to: '/admin/messages', label: 'Messages', icon: LuInbox, badge: 'messages' },
    { to: '/admin/hiring', label: 'Hiring', icon: LuHandshake },
  ] },
  { id: 'content', title: 'Content', items: [
    { to: '/admin/blogs', label: 'Blog Posts', icon: LuFileText },
    { to: '/admin/learn', label: 'Learn (tutorials)', icon: LuGraduationCap },
    { to: '/admin/roadmaps', label: 'Career roadmaps', icon: LuRoute },
    { to: '/admin/pages', label: 'Pages', icon: LuFilePen },
    { to: '/admin/products', label: 'Products', icon: LuShoppingBag },
    { to: '/admin/categories', label: 'Categories', icon: LuTags },
  ] },
  { id: 'jobs', title: 'Jobs and community', items: [
    { to: '/admin/jobs', label: 'Jobs', icon: LuBriefcase },
    { to: '/admin/community', label: 'Interview questions and lists', icon: LuUsersRound },
    { to: '/admin/feedback', label: 'Lesson feedback', icon: LuMessageSquare },
  ] },
  { id: 'site', title: 'Site and growth', items: [
    { to: '/admin/seo', label: 'SEO & AI visibility', icon: LuSearch },
    { to: '/admin/site-content', label: 'Homepage text', icon: LuType },
    { to: '/admin/trust', label: 'Reviews and clients', icon: LuMessageSquare },
    { to: '/admin/menus', label: 'Menus', icon: LuMenu },
    { to: '/admin/appearance', label: 'Appearance', icon: LuPalette },
    { to: '/admin/users', label: 'Users', icon: LuUsers },
  ] },
]

const OPEN_KEY = 'admin-nav-open'
const readOpen = () => { try { return JSON.parse(localStorage.getItem(OPEN_KEY)) || null } catch { return null } }
const saveOpen = (o) => { try { localStorage.setItem(OPEN_KEY, JSON.stringify(o)) } catch { /* private mode */ } }

const AdminLayout = () => {
  const { user, loading, token } = useSelector(state => state.auth)
  const { pathname } = useLocation()
  const [unread, setUnread] = useState(0)
  const [review, setReview] = useState(0)
  const [find, setFind] = useState('')
  const [open, setOpen] = useState(() => readOpen() || { inbox: true, content: true })
  const isAdmin = user?.role === 'admin'

  // Unread-message badge: refresh on mount, every minute, and whenever the inbox changes.
  useEffect(() => {
    if (!isAdmin) return
    const fetchUnread = () => api.get('/api/admin/messages/unread-count', { headers: { Authorization: token } })
      .then(({ data }) => setUnread(data.unread || 0)).catch(() => {})
    fetchUnread()
    const t = setInterval(fetchUnread, 60000)
    window.addEventListener('admin-messages-changed', fetchUnread)
    return () => { clearInterval(t); window.removeEventListener('admin-messages-changed', fetchUnread) }
  }, [isAdmin, token])

  // Items waiting for moderation (pending or reported), for the sidebar badge.
  useEffect(() => {
    if (!isAdmin) return
    const fetchReview = () => api.get('/api/admin/community/summary', { headers: { Authorization: token } })
      .then(({ data }) => setReview(Object.values(data.pending || {}).reduce((a, b) => a + b, 0) + Object.values(data.reported || {}).reduce((a, b) => a + b, 0))).catch(() => {})
    fetchReview()
    const t = setInterval(fetchReview, 60000)
    window.addEventListener('admin-review-changed', fetchReview)
    return () => { clearInterval(t); window.removeEventListener('admin-review-changed', fetchReview) }
  }, [isAdmin, token])

  if (loading) return <Loader />
  if (!user) return <Navigate to='/app?state=login' replace />
  // Logged in but not an admin - quietly redirect rather than show a 403 page.
  if (user.role !== 'admin') return <Navigate to='/app' replace />

  const itemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm whitespace-nowrap transition ${isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`

  return (
    <div className='min-h-screen bg-slate-50 md:flex'>
      <SEO title='Admin' noindex />
      <aside className='md:w-60 md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 md:min-h-screen md:sticky md:top-0 md:self-start'>
        <div className='px-4 py-4 flex items-center justify-between md:block'>
          <p className='font-semibold text-slate-800'>Admin</p>
          <Link to='/app' className='md:mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition'>
            <LuArrowLeft className='size-3.5' /> Back to app
          </Link>
        </div>
        <div className='hidden md:block px-3 pb-2'>
          <label htmlFor='admin-find' className='sr-only'>Find an admin page</label>
          <input id='admin-find' value={find} onChange={(e) => setFind(e.target.value)} placeholder='Find a page…' className='w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300' />
        </div>
        <nav aria-label='Admin sections' className='px-2 pb-2 md:pb-4 flex md:flex-col gap-1 overflow-x-auto'>
          {groups.map((g) => {
            const q = find.trim().toLowerCase()
            const items = q ? g.items.filter((it) => it.label.toLowerCase().includes(q)) : g.items
            if (!items.length) return null
            const hasActive = g.items.some((it) => (it.end ? pathname === it.to : pathname.startsWith(it.to)))
            const isOpen = !g.title || Boolean(q) || hasActive || Boolean(open[g.id])
            const toggle = () => { const n = { ...open, [g.id]: !isOpen }; setOpen(n); saveOpen(n) }
            const count = (b) => (b === 'messages' ? unread : b === 'moderation' ? review : 0)
            const groupBadge = g.items.reduce((n, it) => n + count(it.badge), 0)
            return (
              <React.Fragment key={g.id}>
                {g.title && (
                  <button type='button' onClick={toggle} aria-expanded={isOpen} className='hidden md:flex items-center gap-1 w-full px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600'>
                    <LuChevronDown className={`size-3.5 transition ${isOpen ? '' : '-rotate-90'}`} /> {g.title}
                    {!isOpen && groupBadge > 0 && <span className='ml-auto bg-brand-600 text-white text-[10px] rounded-full px-1.5 normal-case'>{groupBadge > 99 ? '99+' : groupBadge}</span>}
                  </button>
                )}
                <div className={isOpen ? 'contents' : 'contents md:hidden'}>
                  {items.map(({ to, label, icon: Icon, end, badge }) => (
                    <NavLink key={to} to={to} end={end} className={itemClass}>
                      <Icon className='size-4 shrink-0' /> {label}
                      {badge && count(badge) > 0 && <span className='ml-auto bg-brand-600 text-white text-[10px] font-semibold rounded-full px-1.5 min-w-4 text-center'>{count(badge) > 99 ? '99+' : count(badge)}</span>}
                    </NavLink>
                  ))}
                </div>
              </React.Fragment>
            )
          })}
        </nav>
      </aside>
      <main className='flex-1 min-w-0 px-4 py-8 md:px-8'>
        <div className='max-w-5xl mx-auto'>
          <PageNav className='!px-0 !max-w-none mb-4' />
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
