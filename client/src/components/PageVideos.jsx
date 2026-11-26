import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { LuPlay } from 'react-icons/lu'
import api from '../configs/api'

// YouTube videos for the current page, chosen in Admin > Videos (matched by the page address).
// The embed loads only after a click, so the page stays fast and YouTube sets nothing until the visitor asks for it.
// The video markup (VideoObject) is added for search engines; it comes from the same admin record.
const cache = new Map()
const norm = (p) => { const x = (p || '/').toLowerCase().replace(/\/+$/, ''); return x || '/' }
export const clearVideoCache = () => cache.clear()

const load = (path) => {
  if (!cache.has(path)) {
    cache.set(path, api.get('/api/videos', { params: { path } }).then(({ data }) => data.videos || []).catch(() => []))
  }
  return cache.get(path)
}

const isoDuration = (s) => {
  if (!s) return undefined
  const m = Math.floor(s / 60), r = s % 60
  return `PT${m ? `${m}M` : ''}${r || !m ? `${r}S` : ''}`
}

const Video = ({ v }) => {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
  return (
    <figure className='rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm'>
      <div className='relative aspect-video bg-slate-900'>
        {playing ? (
          <iframe className='absolute inset-0 w-full h-full' src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`} title={v.title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen' allowFullScreen referrerPolicy='strict-origin-when-cross-origin' />
        ) : (
          <button type='button' onClick={() => setPlaying(true)} className='group absolute inset-0 w-full h-full' aria-label={`Play video: ${v.title}`}>
            <img src={thumb} alt='' loading='lazy' width='480' height='360' className='absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition' />
            <span className='absolute inset-0 grid place-items-center'>
              <span className='size-16 rounded-full bg-brand-600 text-white grid place-items-center shadow-lg group-hover:scale-105 transition'><LuPlay className='size-7 ml-1' aria-hidden='true' /></span>
            </span>
          </button>
        )}
      </div>
      <figcaption className='p-5'>
        <h3 className='text-base font-semibold text-slate-800'>{v.title}</h3>
        <p className='text-sm text-slate-500 mt-1'>{v.description}</p>
      </figcaption>
    </figure>
  )
}

const PageVideos = () => {
  const path = norm(useLocation().pathname)
  const [videos, setVideos] = useState([])
  useEffect(() => { let off = false; setVideos([]); load(path).then((v) => { if (!off) setVideos(v) }); return () => { off = true } }, [path])
  if (!videos.length) return null

  const ld = videos.map((v) => ({
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: v.title, description: v.description, uploadDate: new Date(v.uploadDate).toISOString(),
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`],
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    ...(v.durationSec ? { duration: isoDuration(v.durationSec) } : {}),
  }))

  return (
    <section aria-label='Videos' className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <Helmet>{ld.map((d, i) => <script key={i} type='application/ld+json'>{JSON.stringify(d)}</script>)}</Helmet>
      <div className={`max-w-4xl mx-auto grid gap-6 ${videos.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {videos.map((v) => <Video key={v.id} v={v} />)}
      </div>
    </section>
  )
}

export default PageVideos
