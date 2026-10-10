import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuInbox, LuSearch, LuFileText, LuCircleCheck, LuTriangleAlert } from 'react-icons/lu'

const Stat = ({ label, value, sub }) => (
  <div className='bg-white rounded-xl border border-slate-200 p-4'>
    <p className='text-xs text-slate-500'>{label}</p>
    <p className='text-2xl font-semibold text-slate-800 mt-1'>{value}</p>
    {sub && <p className='text-xs text-slate-400 mt-1'>{sub}</p>}
  </div>
)

const Action = ({ to, icon: Icon, children }) => (
  <Link to={to} className='inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700 transition'>
    <Icon className='size-4' /> {children}
  </Link>
)

const AdminOverview = () => {
  const { token, user } = useSelector(state => state.auth)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/admin/stats', { headers: { Authorization: token } })
      .then(({ data }) => setStats(data))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load stats.'))
  }, [])

  if (!stats) return <p className='text-slate-400'>Loading…</p>

  const max = Math.max(1, ...stats.signupsByDay.map((d) => d.count))
  const total14 = stats.signupsByDay.reduce((n, d) => n + d.count, 0)

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const seo = stats.seo || { avgScore: 0, poor: 0, fair: 0, good: 0, worst: [] }
  const todo = [
    stats.messages?.unread > 0 && { to: '/admin/messages', icon: LuInbox, text: `${stats.messages.unread} unread ${stats.messages.unread === 1 ? 'message' : 'messages'}` },
    seo.poor > 0 && { to: '/admin/seo', icon: LuSearch, text: `${seo.poor} ${seo.poor === 1 ? 'post has' : 'posts have'} a poor SEO score` },
    stats.blogs.drafts > 0 && { to: '/admin/blogs', icon: LuFileText, text: `${stats.blogs.drafts} unpublished ${stats.blogs.drafts === 1 ? 'draft' : 'drafts'}` },
  ].filter(Boolean)

  return (
    <div>
      <div className='flex items-start justify-between gap-3 flex-wrap mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-800'>{greet}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className='text-sm text-slate-500 mt-1'>Here is how Prime Resume AI is doing.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Action to='/admin/blogs/new' icon={LuPlus}>New post</Action>
          <Action to='/admin/products/new' icon={LuPlus}>New product</Action>
          <Action to='/admin/seo' icon={LuSearch}>SEO audit</Action>
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-4 mb-4'>
        <div className='md:col-span-2 bg-white rounded-xl border border-slate-200 p-5'>
          <p className='text-sm font-semibold text-slate-800 mb-3'>Needs your attention</p>
          {todo.length === 0 ? (
            <p className='text-sm text-green-700 flex items-center gap-2'><LuCircleCheck className='size-4' /> You are all caught up.</p>
          ) : (
            <ul className='space-y-1'>
              {todo.map((t) => (
                <li key={t.to + t.text}>
                  <Link to={t.to} className='flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-50 text-sm text-slate-700'>
                    <t.icon className='size-4 text-amber-500 shrink-0' /> {t.text} <span className='ml-auto text-xs text-brand-600'>Open</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link to='/admin/seo' className='block bg-white rounded-xl border border-slate-200 p-5 hover:ring-1 hover:ring-brand-300'>
          <p className='text-sm font-semibold text-slate-800'>SEO health</p>
          <p className={`text-3xl font-semibold mt-2 ${seo.avgScore >= 80 ? 'text-green-600' : seo.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{seo.avgScore}<span className='text-base text-slate-400'>/100</span></p>
          <p className='text-xs text-slate-400 mt-1'>{seo.good} good · {seo.fair} fair · {seo.poor} poor</p>
          {seo.worst?.length > 0 && <p className='text-xs text-slate-500 mt-3 flex items-start gap-1.5'><LuTriangleAlert className='size-3.5 text-amber-500 mt-0.5 shrink-0' /><span className='truncate'>Lowest: {seo.worst[0].title}</span></p>}
        </Link>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-5 gap-4'>
        <Stat label='Users' value={stats.users.total} sub={`${stats.users.new7d} new this week`} />
        <Stat label='Resumes created' value={stats.resumes} />
        <Stat label='Blog posts' value={stats.blogs.published} sub={`${stats.blogs.drafts} drafts · ${stats.blogs.views} views`} />
        <Stat label='Products' value={stats.products.published} sub={`${stats.products.clicks} buy clicks · ${stats.products.views} views`} />
        <Link to='/admin/messages' className='block hover:ring-1 hover:ring-brand-300 rounded-xl'>
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
                <div className='w-full rounded-t bg-brand-500/80 group-hover:bg-brand-600 transition' style={{ height: `${Math.max(d.count ? 8 : 2, (d.count / max) * 100)}%` }} />
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
        <div className='bg-white rounded-xl border border-slate-200 p-5 min-w-0'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm font-semibold text-slate-800'>Top blog posts</p>
            <Link to='/admin/blogs/new' className='text-xs text-brand-600 hover:underline'>+ New post</Link>
          </div>
          {stats.topPosts.length === 0 ? <p className='text-sm text-slate-400'>No posts yet.</p> : (
            <ul className='space-y-2'>
              {stats.topPosts.map((p) => (
                <li key={p._id} className='flex justify-between gap-3 text-sm'>
                  <a href={`/blog/${p.slug}`} target='_blank' rel='noreferrer' className='text-slate-700 hover:text-brand-600 truncate min-w-0'>{p.title}</a>
                  <span className='text-slate-400 shrink-0'>{p.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='bg-white rounded-xl border border-slate-200 p-5 min-w-0'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm font-semibold text-slate-800'>Top products</p>
            <Link to='/admin/products/new' className='text-xs text-brand-600 hover:underline'>+ New product</Link>
          </div>
          {stats.topProducts.length === 0 ? <p className='text-sm text-slate-400'>No products yet.</p> : (
            <ul className='space-y-2'>
              {stats.topProducts.map((p) => (
                <li key={p._id} className='flex justify-between gap-3 text-sm'>
                  <Link to={`/admin/products`} className='text-slate-700 hover:text-brand-600 truncate min-w-0'>{p.title}{!p.published && <span className='text-amber-600'> (draft)</span>}</Link>
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
