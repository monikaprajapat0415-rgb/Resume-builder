import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuArrowLeft, LuLayoutDashboard, LuFileText, LuTags, LuShoppingBag, LuUsers, LuMenu, LuInbox, LuFilePen, LuType } from 'react-icons/lu'
import SEO from '../../components/SEO'
import Loader from '../../components/Loader'
import api from '../../configs/api'

const links = [
  { to: '/admin', label: 'Overview', icon: LuLayoutDashboard, end: true },
  { to: '/admin/blogs', label: 'Blog Posts', icon: LuFileText },
  { to: '/admin/products', label: 'Products', icon: LuShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: LuTags },
  { to: '/admin/messages', label: 'Messages', icon: LuInbox, badge: true },
  { to: '/admin/pages', label: 'Pages', icon: LuFilePen },
  { to: '/admin/site-content', label: 'Homepage text', icon: LuType },
  { to: '/admin/menus', label: 'Menus', icon: LuMenu },
  { to: '/admin/users', label: 'Users', icon: LuUsers },
]

const AdminLayout = () => {
  const { user, loading, token } = useSelector(state => state.auth)
  const [unread, setUnread] = useState(0)
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

  if (loading) return <Loader />
  if (!user) return <Navigate to='/app?state=login' replace />
  // Logged in but not an admin - quietly redirect rather than show a 403 page.
  if (user.role !== 'admin') return <Navigate to='/app' replace />

  const itemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm whitespace-nowrap transition ${isActive ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`

  return (
    <div className='min-h-screen bg-slate-50 md:flex'>
      <SEO title='Admin' noindex />
      <aside className='md:w-56 md:shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 md:min-h-screen md:sticky md:top-0 md:self-start'>
        <div className='px-4 py-4 flex items-center justify-between md:block'>
          <p className='font-semibold text-slate-800'>Admin</p>
          <Link to='/app' className='md:mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition'>
            <LuArrowLeft className='size-3.5' /> Back to app
          </Link>
        </div>
        <nav className='px-2 pb-2 md:pb-4 flex md:flex-col gap-1 overflow-x-auto'>
          {links.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink key={to} to={to} end={end} className={itemClass}>
              <Icon className='size-4' /> {label}
              {badge && unread > 0 && <span className='ml-auto bg-green-600 text-white text-[10px] font-semibold rounded-full px-1.5 min-w-4 text-center'>{unread > 99 ? '99+' : unread}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className='flex-1 min-w-0 px-4 py-8 md:px-8'>
        <div className='max-w-5xl mx-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
