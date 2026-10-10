import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuRefreshCw, LuCopy, LuExternalLink, LuChevronDown, LuCircleCheck, LuTriangleAlert } from 'react-icons/lu'
import api from '../../configs/api'

const tone = {
  good: { pill: 'bg-green-100 text-green-700', bar: 'bg-green-500', label: 'Good' },
  fair: { pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', label: 'Needs work' },
  poor: { pill: 'bg-red-100 text-red-700', bar: 'bg-red-500', label: 'Poor' },
}

const Card = ({ title, children, right, className = '' }) => (
  <section className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>
    {(title || right) && (
      <div className='flex items-center justify-between gap-3 mb-3'>
        <h2 className='text-sm font-semibold text-slate-800'>{title}</h2>{right}
      </div>
    )}
    {children}
  </section>
)

const Meter = ({ label, value }) => (
  <div>
    <div className='flex justify-between text-xs mb-1'><span className='text-slate-600'>{label}</span><span className='text-slate-500'>{value}%</span></div>
    <div className='h-2 rounded-full bg-slate-100 overflow-hidden' role='img' aria-label={`${label}: ${value} percent of posts`}>
      <div className={`h-full rounded-full ${value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${value}%` }} />
    </div>
  </div>
)

const Score = ({ score, status }) => (
  <div className='flex items-center gap-2 min-w-28'>
    <div className='h-1.5 w-14 rounded-full bg-slate-100 overflow-hidden'><div className={`h-full ${tone[status].bar}`} style={{ width: `${score}%` }} /></div>
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tone[status].pill}`}>{score}</span>
  </div>
)

const AdminSeo = () => {
  const { token } = useSelector(state => state.auth)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const [reloadKey, setReloadKey] = useState(0)
  useEffect(() => {
    let live = true
    api.get('/api/admin/seo-audit', { headers: { Authorization: token } })
      .then(({ data }) => { if (live) setData(data) })
      .catch((e) => { if (live) toast.error(e.response?.data?.message || 'Could not load the SEO audit.') })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [token, reloadKey])
  const load = () => { setLoading(true); setReloadKey((k) => k + 1) }

  const rows = useMemo(() => {
    if (!data) return []
    return data.posts.filter((p) => {
      if (filter === 'drafts') { if (p.published) return false } else if (!p.published) return false
      if (['good', 'fair', 'poor'].includes(filter) && p.status !== filter) return false
      return !q || p.title.toLowerCase().includes(q.toLowerCase())
    })
  }, [data, filter, q])

  const copy = (text) => navigator.clipboard?.writeText(text).then(() => toast.success('Copied.')).catch(() => toast.error('Could not copy.'))

  if (loading && !data) return <p className='text-slate-400'>Running SEO audit…</p>
  if (!data) return <p className='text-slate-500'>Could not load the audit. <button onClick={load} className='text-brand-600 underline'>Try again</button></p>

  const { summary: s, urls } = data
  const hasDupes = data.duplicateTitles.length + data.duplicateDescriptions.length > 0
  const tools = [
    { label: 'Google Search Console', href: 'https://search.google.com/search-console', hint: 'Submit sitemaps, inspect URLs' },
    { label: 'Rich Results Test', href: `https://search.google.com/test/rich-results?url=${encodeURIComponent(urls.site)}`, hint: 'Check structured data' },
    { label: 'PageSpeed Insights', href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(urls.site)}`, hint: 'Speed and Core Web Vitals' },
    { label: 'Schema validator', href: 'https://validator.schema.org/', hint: 'Validate JSON-LD' },
  ]
  const files = [['Sitemap', urls.sitemap], ['Blog sitemap', urls.blogSitemap], ['robots.txt', urls.robots], ['llms.txt', urls.llms], ['RSS feed', urls.rss]]

  return (
    <div className='space-y-4'>
      <div className='flex items-start justify-between gap-3 flex-wrap'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-800'>SEO &amp; AI visibility</h1>
          <p className='text-sm text-slate-500 mt-1'>How well your blog posts are set up for Google and for AI answer engines.</p>
        </div>
        <button onClick={load} disabled={loading} className='inline-flex items-center gap-2 text-sm px-3 py-2 border border-slate-200 rounded-md hover:bg-white disabled:opacity-60'>
          <LuRefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Re-run audit
        </button>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <p className='text-xs text-slate-500'>Average score</p>
          <p className={`text-3xl font-semibold mt-1 ${s.avgScore >= 80 ? 'text-green-600' : s.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{s.avgScore}<span className='text-base text-slate-400'>/100</span></p>
          <p className='text-xs text-slate-400 mt-1'>{s.published} published posts</p>
        </div>
        {['good', 'fair', 'poor'].map((k) => (
          <button key={k} onClick={() => setFilter(k)} className='text-left bg-white rounded-xl border border-slate-200 p-4 hover:ring-1 hover:ring-brand-300'>
            <p className='text-xs text-slate-500'>{tone[k].label}</p>
            <p className='text-3xl font-semibold text-slate-800 mt-1'>{s[k]}</p>
            <p className='text-xs text-slate-400 mt-1'>{k === 'good' ? 'score 80+' : k === 'fair' ? 'score 50-79' : 'score under 50'}</p>
          </button>
        ))}
      </div>

      <div className='grid lg:grid-cols-2 gap-4'>
        <Card title='AI answer-engine readiness' right={<span className='text-xs text-slate-400'>% of published posts</span>}>
          <div className='space-y-3'>
            <Meter label='Has FAQ (2+ questions)' value={s.geo.faq} />
            <Meter label='Has key takeaways' value={s.geo.takeaways} />
            <Meter label='Cites sources' value={s.geo.sources} />
            <Meter label='Cover image with alt text' value={s.geo.cover} />
          </div>
        </Card>
        <Card title='Fix these first'>
          {data.topIssues.length === 0 ? (
            <p className='text-sm text-green-700 flex items-center gap-2'><LuCircleCheck className='size-4' /> No open issues. Nice work.</p>
          ) : (
            <ul className='space-y-2.5'>
              {data.topIssues.slice(0, 5).map((i) => (
                <li key={i.key} className='text-sm'>
                  <p className='text-slate-800'><span className='font-medium'>{i.count}</span> {i.count === 1 ? 'post' : 'posts'}: {i.label.toLowerCase()} missing</p>
                  <p className='text-xs text-slate-400'>{i.fix}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {hasDupes && (
        <Card title='Duplicate titles or descriptions'>
          <p className='text-xs text-slate-500 mb-2 flex items-center gap-1.5'><LuTriangleAlert className='size-3.5 text-amber-500' /> Search engines may treat these as competing pages. Make each one unique.</p>
          <ul className='text-sm space-y-1'>
            {[...data.duplicateTitles.map((g) => ['Title', g]), ...data.duplicateDescriptions.map((g) => ['Description', g])].map(([kind, g], i) => (
              <li key={i} className='text-slate-700'><span className='text-slate-400'>{kind}: </span>{g.map((p, j) => <span key={p._id}>{j > 0 && ' and '}<Link className='text-brand-700 hover:underline' to={`/admin/blogs/${p._id}/edit`}>{p.title}</Link></span>)}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card title='Posts'>
        <div className='flex flex-wrap items-center gap-2 mb-3'>
          {[['all', 'Published'], ['poor', 'Poor'], ['fair', 'Needs work'], ['good', 'Good'], ['drafts', `Drafts (${s.drafts})`]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === k ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search posts…' aria-label='Search posts' className='ml-auto w-full sm:w-52 px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300' />
        </div>
        {rows.length === 0 ? <p className='text-sm text-slate-400 py-6 text-center'>No posts match.</p> : (
          <ul className='divide-y divide-slate-100'>
            {rows.map((p) => (
              <li key={p._id} className='py-3'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <button onClick={() => setOpen(open === p._id ? null : p._id)} aria-expanded={open === p._id} className='flex items-center gap-2 text-left min-w-0 flex-1 basis-60'>
                    <LuChevronDown className={`size-4 shrink-0 text-slate-400 transition ${open === p._id ? 'rotate-180' : ''}`} />
                    <span className='text-sm text-slate-800 truncate'>{p.title}</span>
                    {p.noindex && <span className='text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0'>noindex</span>}
                  </button>
                  <Score score={p.score} status={p.status} />
                  <span className='text-xs text-slate-400 w-16 hidden sm:block'>{p.words} {p.words === 1 ? 'word' : 'words'}</span>
                  <div className='flex items-center gap-1 text-xs'>
                    <Link to={`/admin/blogs/${p._id}/edit`} className='px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50'>Edit</Link>
                    {p.published && <a href={`/blog/${p.slug}`} target='_blank' rel='noreferrer' className='p-1.5 rounded-md hover:bg-slate-100' title='View post'><LuExternalLink className='size-3.5 text-slate-500' /></a>}
                  </div>
                </div>
                {open === p._id && (
                  <div className='mt-3 ml-6 text-sm'>
                    {p.issues.length === 0 ? <p className='text-green-700'>All checks passed.</p> : (
                      <ul className='space-y-1.5'>
                        {p.issues.map((i) => <li key={i.key} className='text-slate-600'><span className='text-red-500'>●</span> <span className='font-medium text-slate-700'>{i.label}.</span> {i.fix}</li>)}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className='grid lg:grid-cols-2 gap-4'>
        <Card title='Your SEO files'>
          <ul className='space-y-2'>
            {files.map(([label, url]) => (
              <li key={label} className='flex items-center justify-between gap-2 text-sm'>
                <a href={url} target='_blank' rel='noreferrer' className='text-slate-700 hover:text-brand-600 truncate'>{label}</a>
                <button onClick={() => copy(url)} className='p-1.5 rounded hover:bg-slate-100 shrink-0' title='Copy URL' aria-label={`Copy ${label} URL`}><LuCopy className='size-3.5 text-slate-500' /></button>
              </li>
            ))}
          </ul>
          <p className='text-xs text-slate-400 mt-3'>Submit the two sitemaps in Search Console under Sitemaps.</p>
        </Card>
        <Card title='Free tools'>
          <ul className='space-y-2.5'>
            {tools.map((t) => (
              <li key={t.label}>
                <a href={t.href} target='_blank' rel='noreferrer' className='text-sm text-brand-700 hover:underline inline-flex items-center gap-1.5'>{t.label} <LuExternalLink className='size-3' /></a>
                <p className='text-xs text-slate-400'>{t.hint}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default AdminSeo
