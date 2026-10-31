import React from 'react'
import { Link } from 'react-router-dom'
import { LuArrowRight, LuSparkles } from 'react-icons/lu'
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
