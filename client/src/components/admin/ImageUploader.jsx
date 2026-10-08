import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuUpload, LuX, LuArrowLeft } from 'react-icons/lu'

// Manages a list of image URLs: upload files (stored via ImageKit through
// /api/admin/upload) or paste an address. The first image is the cover.
const ImageUploader = ({ images, setImages }) => {
  const { token } = useSelector(state => state.auth)
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [url, setUrl] = useState('')

  const upload = async (files) => {
    setBusy(true)
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} is over 5 MB.`); continue }
        const fd = new FormData()
        fd.append('image', file)
        const { data } = await api.post('/api/admin/upload', fd, { headers: { Authorization: token } })
        setImages((prev) => [...prev, data.url])
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.')
    }
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const addUrl = () => {
    if (!/^https?:\/\//i.test(url.trim())) return toast.error('Image address must start with https://')
    setImages((prev) => [...prev, url.trim()])
    setUrl('')
  }

  const makeCover = (i) => setImages((prev) => [prev[i], ...prev.filter((_, j) => j !== i)])

  return (
    <div>
      <div className='flex flex-wrap gap-3 mb-3'>
        {images.map((src, i) => (
          <div key={src + i} className='relative size-24 rounded-lg overflow-hidden border border-slate-200 group'>
            <img src={src} alt='' className='w-full h-full object-cover' />
            {i === 0 && <span className='absolute bottom-0 inset-x-0 text-[10px] text-center bg-green-600 text-white'>Cover</span>}
            <button type='button' onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className='absolute top-1 right-1 bg-white/90 rounded-full p-0.5' title='Remove'><LuX className='size-3.5 text-red-500' /></button>
            {i > 0 && <button type='button' onClick={() => makeCover(i)} className='absolute top-1 left-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition' title='Make cover'><LuArrowLeft className='size-3.5 text-slate-600' /></button>}
          </div>
        ))}
        <button type='button' disabled={busy} onClick={() => fileRef.current?.click()} className='size-24 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-green-300 hover:text-green-600 flex flex-col items-center justify-center gap-1 text-xs transition disabled:opacity-60'>
          <LuUpload className='size-5' /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileRef} type='file' accept='image/*' multiple hidden onChange={(e) => e.target.files?.length && upload(e.target.files)} />
      </div>
      <div className='flex gap-2'>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder='…or paste an image address (https://)' className='flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300' />
        <button type='button' onClick={addUrl} className='px-3 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 transition'>Add</button>
      </div>
    </div>
  )
}

export default ImageUploader
