import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

const Stat = ({ label, value, sub }) => (
  <div className='bg-white rounded-xl border border-slate-200 p-4'>
    <p className='text-xs text-slate-500'>{label}</p>
    <p className='text-2xl font-semibold text-slate-800 mt-1'>{value}</p>
    {sub && <p className='text-xs text-slate-400 mt-1'>{sub}</p>}
  </div>
)

const AdminOverview = () => {
  const { token } = useSelector(state => state.auth)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/admin/stats', { headers: { Authorization: token } })
      .then(({ data }) => setStats(data))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load stats.'))
  }, [])

  if (!stats) return <p className='text-slate-400'>Loading…</p>

  const max = Math.max(1, ...stats.signupsByDay.map((d) => d.count))
  const total14 = stats.signupsByDay.reduce((n, d) => n + d.count, 0)

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>Overview</h1>

      <div className='grid grid-cols-2 lg:grid-cols-5 gap-4'>
        <Stat label='Users' value={stats.users.total} sub={`${stats.users.new7d} new this week`} />
        <Stat label='Resumes created' value={stats.resumes} />
        <Stat label='Blog posts' value={stats.blogs.published} sub={`${stats.blogs.drafts} drafts · ${stats.blogs.views} views`} />
        <Stat label='Products' value={stats.products.published} sub={`${stats.products.clicks} buy clicks · ${stats.products.views} views`} />
        <Link to='/admin/messages' className='block hover:ring-1 hover:ring-green-300 rounded-xl'>
          <Stat label='Messages' value={stats.messages?.unread ?? 0} sub={`unread · ${stats.messages?.total ?? 0} in total`} />
        </Link>
      </div>

      <div className='grid lg:grid-cols-3 gap-4 mt-4'>
        <div className='lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5'>
          <div className='flex items-baseline justify-between'>
            <p className='text-sm font-semibold text-slate-800'>Sign-ups, last 14 days</p>
            <p className='text-xs text-slate-400'>{total14} total</p>
          </div>
          <div className='flex items-end gap-1.5 h-32 mt-5' role='img' aria-label={`Daily sign-ups for the last 14 days, ${total14} in total`}>
            {stats.signupsByDay.map((d) => (
              <div key={d.date} className='flex-1 flex flex-col items-center justify-end h-full group' title={`${d.date}: ${d.count}`}>
                <span className='text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100'>{d.count}</span>
                <div className='w-full rounded-t bg-green-500/80 group-hover:bg-green-600 transition' style={{ height: `${Math.max(d.count ? 8 : 2, (d.count / max) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className='flex justify-between text-[10px] text-slate-400 mt-1.5'>
            <span>{stats.signupsByDay[0].date.slice(5)}</span><span>{stats.signupsByDay[13].date.slice(5)}</span>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <p className='text-sm font-semibold text-slate-800 mb-3'>Accounts</p>
          <dl className='text-sm space-y-2'>
            <div className='flex justify-between'><dt className='text-slate-500'>Verified</dt><dd className='text-slate-800'>{stats.users.verified} / {stats.users.total}</dd></div>
            <div className='flex justify-between'><dt className='text-slate-500'>Admins</dt><dd className='text-slate-800'>{stats.users.admins}</dd></div>
          </dl>
          <p className='text-sm font-semibold text-slate-800 mt-5 mb-2'>Latest sign-ups</p>
          <ul className='space-y-2'>
            {stats.recentUsers.map((u) => (
              <li key={u._id} className='text-sm'>
                <p className='text-slate-800 truncate'>{u.name || u.email}</p>
                <p className='text-xs text-slate-400 truncate'>{u.email} · {new Date(u.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-4 mt-4'>
        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm font-semibold text-slate-800'>Top blog posts</p>
            <Link to='/admin/blogs/new' className='text-xs text-green-600 hover:underline'>+ New post</Link>
          </div>
          {stats.topPosts.length === 0 ? <p className='text-sm text-slate-400'>No posts yet.</p> : (
            <ul className='space-y-2'>
              {stats.topPosts.map((p) => (
                <li key={p._id} className='flex justify-between gap-3 text-sm'>
                  <a href={`/blog/${p.slug}`} target='_blank' rel='noreferrer' className='text-slate-700 hover:text-green-600 truncate'>{p.title}</a>
                  <span className='text-slate-400 shrink-0'>{p.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm font-semibold text-slate-800'>Top products</p>
            <Link to='/admin/products/new' className='text-xs text-green-600 hover:underline'>+ New product</Link>
          </div>
          {stats.topProducts.length === 0 ? <p className='text-sm text-slate-400'>No products yet.</p> : (
            <ul className='space-y-2'>
              {stats.topProducts.map((p) => (
                <li key={p._id} className='flex justify-between gap-3 text-sm'>
                  <Link to={`/admin/products`} className='text-slate-700 hover:text-green-600 truncate'>{p.title}{!p.published && <span className='text-amber-600'> (draft)</span>}</Link>
                  <span className='text-slate-400 shrink-0'>{p.clicks} clicks · {p.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
