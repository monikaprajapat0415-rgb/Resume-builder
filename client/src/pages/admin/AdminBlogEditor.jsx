import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'
import ImageUploader from '../../components/admin/ImageUploader'

const plain = (t = '') => t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '')
const Counter = ({ n, min, max }) => (
  <span className={`text-xs ml-2 ${n === 0 ? 'text-slate-400' : n > max || n < min ? 'text-amber-600' : 'text-green-600'}`}>{n} chars (aim {min}-{max})</span>
)

const todayStr = () => new Date().toISOString().slice(0, 10)

const AdminBlogEditor = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [readTime, setReadTime] = useState('')
  const [date, setDate] = useState(todayStr)
  const [published, setPublished] = useState(true)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [blocks, setBlocks] = useState([{ type: 'paragraph', text: '' }])
  const [metaTitle, setMetaTitle] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverAlt, setCoverAlt] = useState('')
  const [takeaways, setTakeaways] = useState([''])
  const [faqs, setFaqs] = useState([])
  const [sources, setSources] = useState([])
  const [tags, setTags] = useState('')
  const [author, setAuthor] = useState('')
  const [authorBio, setAuthorBio] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [noindex, setNoindex] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/admin/categories?type=blog', { headers: { Authorization: token } })
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const { data } = await api.get(`/api/admin/blogs/${id}`, { headers: { Authorization: token } })
        const post = data.post
        setTitle(post.title || '')
        setSlug(post.slug || '')
        setDescription(post.description || '')
        setKeywords(post.keywords || '')
        setExcerpt(post.excerpt || '')
        setReadTime(post.readTime || '')
        setDate(post.date ? new Date(post.date).toISOString().slice(0, 10) : todayStr())
        setPublished(post.published !== false)
        setCategory(post.category || '')
        setMetaTitle(post.metaTitle || '')
        setFocusKeyword(post.focusKeyword || '')
        setCoverImage(post.coverImage || '')
        setCoverAlt(post.coverAlt || '')
        setTakeaways(post.takeaways?.length ? post.takeaways : [''])
        setFaqs(post.faqs || [])
        setSources(post.sources || [])
        setTags((post.tags || []).join(', '))
        setAuthor(post.author || '')
        setAuthorBio(post.authorBio || '')
        setCanonicalUrl(post.canonicalUrl || '')
        setNoindex(Boolean(post.noindex))
        setBlocks(post.content && post.content.length > 0 ? post.content : [{ type: 'paragraph', text: '' }])
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Could not load post.')
        navigate('/admin/blogs')
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const content = blocks
        .map((b) => {
          if (b.type === 'list' || b.type === 'olist') return { type: b.type, items: (b.items || []).map((x) => x.trim()).filter(Boolean) }
          if (b.type === 'image') return { type: 'image', url: (b.url || '').trim(), alt: (b.alt || '').trim(), caption: (b.caption || '').trim() }
          return { type: b.type, text: (b.text || '').trim() }
        })
        .filter((b) => (b.items ? b.items.length > 0 : b.type === 'image' ? b.url : b.text.length > 0))

      const payload = {
        title, slug, description, keywords, excerpt, readTime, date, published, category, content,
        metaTitle, focusKeyword, coverImage, coverAlt, author, authorBio, canonicalUrl, noindex,
        takeaways: takeaways.map((t) => t.trim()).filter(Boolean),
        faqs: faqs.map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a),
        sources: sources.map((x) => ({ title: x.title.trim(), url: x.url.trim() })).filter((x) => x.url),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      }

      if (isEdit) {
        await api.put(`/api/admin/blogs/${id}`, payload, { headers: { Authorization: token } })
        toast.success('Post updated.')
      } else {
        await api.post('/api/admin/blogs', payload, { headers: { Authorization: token } })
        toast.success('Post created.')
      }
      navigate('/admin/blogs')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not save post.')
    }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>

  const text = blocks.map((b) => b.text || (b.items || []).join(' ')).join(' ')
  const lower = (v) => plain(v).toLowerCase()
  const kw = focusKeyword.trim().toLowerCase()
  const headings = blocks.filter((b) => b.type === 'heading')
  const firstPara = blocks.find((b) => b.type === 'paragraph')?.text || ''
  const words = plain(text).split(/\s+/).filter(Boolean).length
  const linkText = blocks.map((b) => b.text || (b.items || []).join(' ')).join(' ')
  const internalLinks = (linkText.match(/\]\(\//g) || []).length
  const externalLinks = (linkText.match(/\]\(https?:/g) || []).length
  const effTitle = metaTitle || title
  const checks = [
    ['Focus keyword set', Boolean(kw)],
    ['Keyword in title', kw && lower(effTitle).includes(kw)],
    ['Keyword in meta description', kw && lower(description).includes(kw)],
    ['Keyword in first paragraph', kw && lower(firstPara).includes(kw)],
    ['Keyword in a subheading', kw && headings.some((h) => lower(h.text).includes(kw))],
    ['Keyword in URL slug', kw && (slug || '').includes(kw.replace(/\s+/g, '-'))],
    ['Title 30-60 characters', effTitle.length >= 30 && effTitle.length <= 60],
    ['Meta description 110-160 characters', description.length >= 110 && description.length <= 160],
    ['At least 600 words', words >= 600],
    ['3+ subheadings', headings.length >= 3],
    ['Internal link to another page', internalLinks > 0],
    ['External link to a source', externalLinks > 0 || sources.some((x) => x.url.trim())],
    ['Cover image with alt text', Boolean(coverImage && coverAlt.trim())],
    ['Key takeaways (helps AI answers)', takeaways.some((t) => t.trim())],
    ['FAQ with 2+ questions (helps AI answers)', faqs.filter((f) => f.q.trim() && f.a.trim()).length >= 2],
    ['Sources cited (helps AI trust)', sources.some((x) => x.url.trim())],
    ['Category chosen', Boolean(category)],
  ].map(([label, ok]) => [label, Boolean(ok)])
  const score = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100)
  const serpUrl = `primeresumeai.com › blog › ${slug || 'your-post'}`
  const listSetter = (setter) => ({
    set: (i, patch) => setter((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x))),
    del: (i) => setter((prev) => prev.filter((_, j) => j !== i)),
  })
  const faqOps = listSetter(setFaqs)
  const srcOps = listSetter(setSources)

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-400'

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isEdit ? 'Edit Post' : 'New Post'}</h1>

      <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl'>
        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              URL slug <span className='text-slate-400 font-normal'>(leave blank to auto-generate from the title)</span>
            </label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder='e.g. how-to-write-a-resume-summary' className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Meta description <span className='text-slate-400 font-normal'>(shown in Google search results)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Excerpt <span className='text-slate-400 font-normal'>(shown on the blog listing page)</span></label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className='grid sm:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Keywords</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder='comma, separated, keywords' className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Read time</label>
              <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder='6 min read' className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Published date</label>
              <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Category <span className='text-slate-400 font-normal'>(<Link to='/admin/categories' className='text-green-600 hover:underline'>manage categories</Link>)</span>
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option value=''>Uncategorised</option>
              {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={published} onChange={(e) => setPublished(e.target.checked)} className='rounded border-slate-300' />
            Published <span className='text-slate-400'>(unpublished posts are saved as drafts and won't appear on the public blog)</span>
          </label>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <BlockEditor blocks={blocks} setBlocks={setBlocks} rich />
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-semibold text-slate-800'>SEO &amp; Google preview</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>Score {score}/100</span>
          </div>
          <div className='border border-slate-200 rounded-lg p-3 bg-slate-50'>
            <p className='text-xs text-slate-500 truncate'>{serpUrl}</p>
            <p className='text-blue-700 text-base leading-snug truncate'>{(effTitle || 'Post title') + ' | Prime Resume AI'}</p>
            <p className='text-xs text-slate-600 line-clamp-2'>{description || 'Your meta description will appear here.'}</p>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>SEO title <span className='text-slate-400 font-normal'>(blank = use post title)</span><Counter n={metaTitle.length} min={30} max={60} /></label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Meta description length<Counter n={description.length} min={110} max={160} /></label>
            <p className='text-xs text-slate-400'>Edit the meta description in the field above.</p>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Focus keyword</label>
            <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder='e.g. resume summary examples' className={inputClass} />
          </div>
          <ul className='grid sm:grid-cols-2 gap-x-4 gap-y-1'>
            {checks.map(([label, ok]) => (
              <li key={label} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-green-700' : 'text-slate-500'}`}><span>{ok ? '✓' : '○'}</span>{label}</li>
            ))}
          </ul>
          <p className='text-xs text-slate-400'>{words} words in the body.</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>Cover image</h2>
          <ImageUploader images={coverImage ? [coverImage] : []} setImages={(upd) => {
            const next = typeof upd === 'function' ? upd(coverImage ? [coverImage] : []) : upd
            setCoverImage(next[next.length - 1] || '')
          }} />
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Cover alt text</label>
            <input value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} placeholder='Describe the image in a sentence' className={inputClass} />
          </div>
          <p className='text-xs text-slate-400'>Best size 1200 x 630. Used on the post, blog cards, and when shared on social media.</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>AI &amp; answer-engine content (GEO)</h2>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Key takeaways <span className='text-slate-400 font-normal'>(3-5 short, self-contained points near the top)</span></label>
            {takeaways.map((t, i) => (
              <div key={i} className='flex gap-2 mb-2'>
                <input value={t} onChange={(e) => setTakeaways((p) => p.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
                <button type='button' onClick={() => setTakeaways((p) => (p.length > 1 ? p.filter((_, j) => j !== i) : ['']))} className='px-2 text-red-500 text-sm'>✕</button>
              </div>
            ))}
            <button type='button' onClick={() => setTakeaways((p) => [...p, ''])} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>+ takeaway</button>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>FAQ <span className='text-slate-400 font-normal'>(real questions people ask, answered in 1-3 sentences; adds FAQ schema)</span></label>
            {faqs.map((f, i) => (
              <div key={i} className='border border-slate-100 rounded-lg p-3 mb-2 space-y-2'>
                <input value={f.q} onChange={(e) => faqOps.set(i, { q: e.target.value })} placeholder='Question' className={inputClass} />
                <textarea value={f.a} onChange={(e) => faqOps.set(i, { a: e.target.value })} placeholder='Answer' rows={2} className={inputClass} />
                <button type='button' onClick={() => faqOps.del(i)} className='text-xs text-red-500'>Remove</button>
              </div>
            ))}
            <button type='button' onClick={() => setFaqs((p) => [...p, { q: '', a: '' }])} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>+ question</button>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Sources &amp; references <span className='text-slate-400 font-normal'>(cited pages build trust with AI engines)</span></label>
            {sources.map((x, i) => (
              <div key={i} className='grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 mb-2'>
                <input value={x.title} onChange={(e) => srcOps.set(i, { title: e.target.value })} placeholder='Title' className={inputClass} />
                <input value={x.url} onChange={(e) => srcOps.set(i, { url: e.target.value })} placeholder='https://…' className={inputClass} />
                <button type='button' onClick={() => srcOps.del(i)} className='px-2 text-red-500 text-sm'>✕</button>
              </div>
            ))}
            <button type='button' onClick={() => setSources((p) => [...p, { title: '', url: '' }])} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>+ source</button>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>Author, tags &amp; advanced</h2>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Author <span className='text-slate-400 font-normal'>(a person's name gives stronger E-E-A-T)</span></label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder='Prime Resume AI Team' className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Tags</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder='ats, cover letter, interview' className={inputClass} />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Author bio <span className='text-slate-400 font-normal'>(credentials, experience)</span></label>
            <textarea value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Canonical URL <span className='text-slate-400 font-normal'>(leave blank unless the post was first published elsewhere)</span></label>
            <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder='https://…' className={inputClass} />
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className='rounded border-slate-300' />
            Hide from search engines (noindex; also removed from sitemap, RSS and llms.txt)
          </label>
        </div>

        <div className='flex items-center gap-3'>
          <button type='submit' disabled={saving} className='px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60'>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create post'}
          </button>
          <button type='button' onClick={() => navigate('/admin/blogs')} className='px-5 py-2.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminBlogEditor
