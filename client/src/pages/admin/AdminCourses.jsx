import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuPencil, LuTrash2, LuExternalLink, LuListOrdered } from 'react-icons/lu'

const AdminCourses = () => {
  const { token } = useSelector((s) => s.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const auth = { headers: { Authorization: token } }

  useEffect(() => {
    api.get('/api/admin/learn/courses', auth)
      .then(({ data }) => setCourses(data.courses || []))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (c) => {
    if (!window.confirm(`Delete the course "${c.title}" and its ${c.lessonCount} lesson(s)? This can't be undone.`)) return
    try {
      await api.delete(`/api/admin/learn/courses/${c._id}`, auth)
      setCourses((prev) => prev.filter((x) => x._id !== c._id))
      toast.success('Course deleted.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete course.') }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-2 gap-3 flex-wrap'>
        <h1 className='text-2xl font-semibold text-slate-800'>Learn: courses</h1>
        <button onClick={() => navigate('/admin/learn/new')} className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
          <LuPlus className='size-4' /> New course
        </button>
      </div>
      <p className='text-sm text-slate-500 mb-6 max-w-2xl'>Each course is a tutorial series (for example "Angular Tutorial") made of ordered lessons. Visitors see published courses at <Link to='/learn' target='_blank' className='text-brand-600 hover:underline'>/learn</Link>. A course appears there once it is published and has at least one published lesson.</p>

      {loading ? <p className='text-slate-400'>Loading…</p> : courses.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 bg-white'>No courses yet. Create your first one, then add lessons to it.</div>
      ) : (
        <div className='grid gap-3'>
          {courses.map((c) => {
            const live = c.published && c.publishedLessons > 0
            return (
              <div key={c._id} className='bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 flex-wrap'>
                <span aria-hidden='true' className='size-11 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0'>{c.badge || c.title.slice(0, 2).toUpperCase()}</span>
                <div className='min-w-0 flex-1'>
                  <Link to={`/admin/learn/${c._id}`} className='font-semibold text-slate-800 hover:text-brand-700'>{c.title}</Link>
                  <p className='text-xs text-slate-500 mt-0.5'>/learn/{c.slug} · {c.level}{c.topic ? ` · ${c.topic}` : ''} · {c.publishedLessons}/{c.lessonCount} lessons published</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${live ? 'bg-brand-100 text-brand-700' : c.published ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  {live ? 'Live' : c.published ? 'Published, no lessons yet' : 'Draft'}
                </span>
                <div className='flex items-center gap-1'>
                  <Link to={`/admin/learn/${c._id}`} className='inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50'><LuListOrdered className='size-3.5' />Lessons</Link>
                  <Link to={`/admin/learn/${c._id}/edit`} className='p-2 rounded hover:bg-slate-100' title='Edit course'><LuPencil className='size-4 text-slate-500' /></Link>
                  {live && <a href={`/learn/${c.slug}`} target='_blank' rel='noopener noreferrer' className='p-2 rounded hover:bg-slate-100' title='View live'><LuExternalLink className='size-4 text-slate-500' /></a>}
                  <button onClick={() => remove(c)} className='p-2 rounded hover:bg-slate-100' title='Delete course'><LuTrash2 className='size-4 text-red-500' /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminCourses
