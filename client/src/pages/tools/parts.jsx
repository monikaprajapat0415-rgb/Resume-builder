import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuArrowRight, LuSparkles, LuLock } from 'react-icons/lu'
import { GROUPS } from '../../content/toolsHub'

// Shared pieces for the tools hub (/products) and the individual tool pages.
export const groupOf = (id) => GROUPS.find((g) => g.id === id) || GROUPS[0]

export const IconTile = ({ tool, size = 'size-11', icon = 'size-5' }) => {
  const g = groupOf(tool.group)
  const Icon = tool.icon
  return <span className={`${size} shrink-0 rounded-xl flex items-center justify-center ${g.tile}`} aria-hidden><Icon className={icon} /></span>
}

export const Badges = ({ tool }) => (
  <span className='flex flex-wrap gap-1.5'>
    <span className='text-[11px] font-medium rounded-full bg-slate-100 text-slate-600 px-2 py-0.5'>{tool.access}</span>
    {tool.ai && <span className='inline-flex items-center gap-1 text-[11px] font-medium rounded-full bg-brand-50 text-brand-700 px-2 py-0.5'><LuSparkles className='size-3' />AI-written</span>}
  </span>
)

export const ToolCard = ({ tool }) => (
  <Link to={tool.path} className={`group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md ${groupOf(tool.group).ring} transition`}>
    <IconTile tool={tool} />
    <h3 className='mt-4 font-semibold text-slate-800 group-hover:text-brand-700 transition'>{tool.name}</h3>
    <p className='mt-1.5 text-sm text-slate-600 leading-relaxed flex-1'>{tool.tagline}</p>
    <div className='mt-4 flex items-center justify-between gap-2'>
      <Badges tool={tool} />
      <LuArrowRight className='size-4 shrink-0 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition' aria-hidden />
    </div>
  </Link>
)

// Every tool needs a free account. Wrap the working part of a tool page in this;
// the explanatory copy around it stays public so search engines can read it.
export const ToolGate = ({ path, note = 'It is free. An account keeps the daily limit fair for everyone.', children }) => {
  const { token, loading } = useSelector((st) => st.auth)
  if (token) return children
  if (loading) return <div className='h-40 rounded-2xl bg-slate-100 animate-pulse max-w-2xl mx-auto' aria-hidden />
  const btn = 'rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-6 py-3'
  return (
    <div className='rounded-2xl border border-brand-200 bg-brand-50/50 p-8 max-w-2xl mx-auto text-center'>
      <span className='mx-auto size-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center'><LuLock className='size-5' aria-hidden /></span>
      <h2 className='font-semibold text-slate-800 text-lg mt-4'>Sign in to use this free tool</h2>
      <p className='text-sm text-slate-600 mt-1.5'>{note}</p>
      <p className='mt-5 flex flex-wrap justify-center gap-3'>
        <Link to={`/app?state=register&next=${encodeURIComponent(path)}`} className={btn}>Create a free account</Link>
        <Link to={`/app?state=login&next=${encodeURIComponent(path)}`} className='rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 px-6 py-3'>Log in</Link>
      </p>
    </div>
  )
}
