import React, { useEffect, useState } from 'react'
import SEO from './SEO'
import api from '../configs/api'
import BlockRenderer from './BlockRenderer'

// Renders a page whose text is managed from the admin panel. If the API can't be
// reached, `fallback` (the original hard-coded page) is shown instead, so these
// pages never go blank.
const CmsPage = ({ slug, fallback, seoPath, onMissing }) => {
  const [state, setState] = useState({ status: 'loading', page: null })

  useEffect(() => {
    let live = true
    setState({ status: 'loading', page: null })
    api.get(`/api/pages/${slug}`, { timeout: 8000 })
      .then(({ data }) => live && setState({ status: 'ok', page: data.page }))
      .catch((e) => live && setState({ status: e.response?.status === 404 ? 'missing' : 'error', page: null }))
    return () => { live = false }
  }, [slug])

  if (state.status === 'loading') return fallback ? null : <p className='text-center text-slate-400 py-24'>Loading…</p>
  if (state.status === 'error' && fallback) return fallback
  if (state.status !== 'ok') return onMissing || (fallback ?? null)

  const { page } = state
  const updated = page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null
  return (
    <section className='bg-gray-50 py-14 px-4 min-h-[60vh]'>
      <SEO title={page.title} description={page.description || undefined} path={seoPath || `/p/${page.slug}`} />
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-2'>
        <h1 className='text-3xl font-bold text-center'>{page.title}</h1>
        {updated && <p className='text-gray-500 text-sm text-center mb-4'>Last updated: {updated}</p>}
        <BlockRenderer blocks={page.content || []} variant='page' />
      </div>
    </section>
  )
}

export default CmsPage
