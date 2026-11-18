import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

const AdminBackup = () => {
  const { token } = useSelector((s) => s.auth)
  const [busy, setBusy] = useState(false)
  const download = async () => {
    setBusy(true)
    try {
      const { data } = await api.get('/api/admin/backup', { headers: { Authorization: token }, responseType: 'blob', timeout: 120000 })
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url; a.download = `prime-resume-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      toast.success('Backup downloaded.')
    } catch (e) { toast.error('Could not create the backup.') }
    setBusy(false)
  }
  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Backup</h1>
      <p className='text-sm text-slate-500 mb-6'>Download one file with your site settings and the content you write. Keep a copy before big changes, such as importing a course or editing many questions at once.</p>
      <section className='rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='font-semibold text-slate-800'>What is in the file</h2>
        <p className='mt-2 text-sm text-slate-600'>Settings (ads, sign-up prompt, homepage text and theme, free tools), menus, reviews and clients, categories, pages, products, blog posts, courses and lessons, roadmaps, interview questions and the Search Console checklist.</p>
        <h2 className='mt-4 font-semibold text-slate-800'>What is not in it</h2>
        <p className='mt-2 text-sm text-slate-600'>Users, resumes, messages, payments, community answers, salaries and reviews, and logs. Those hold personal data.</p>
        <button type='button' disabled={busy} onClick={download} className='mt-5 rounded-md bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60'>{busy ? 'Preparing… this can take a minute' : 'Download backup'}</button>
        <p className='mt-4 text-xs text-slate-500'>This is a copy for reading and manual recovery. It is not a full database backup and this page cannot restore it. For a full backup, run <code className='rounded bg-slate-100 px-1'>mongodump</code> on the server (or use your database host's backup).</p>
      </section>
    </div>
  )
}
export default AdminBackup
