import React from 'react'
import { LuCircleCheck, LuTriangleAlert, LuCircleAlert, LuInfo, LuLightbulb, LuFileText } from 'react-icons/lu'

const tone = (s) => (s >= 80 ? { text: 'text-green-600', bar: 'bg-green-500', ring: '#16a34a' } : s >= 60 ? { text: 'text-amber-600', bar: 'bg-amber-500', ring: '#d97706' } : { text: 'text-red-600', bar: 'bg-red-500', ring: '#dc2626' })

const SEV = {
  critical: { label: 'Critical', cls: 'bg-red-100 text-red-700', icon: LuCircleAlert },
  high: { label: 'High priority', cls: 'bg-red-50 text-red-600', icon: LuTriangleAlert },
  medium: { label: 'Medium', cls: 'bg-amber-50 text-amber-700', icon: LuTriangleAlert },
  low: { label: 'Nice to have', cls: 'bg-slate-100 text-slate-600', icon: LuInfo },
}

const ScoreRing = ({ score }) => {
  const r = 52, c = 2 * Math.PI * r, t = tone(score)
  return (
    <div className='relative size-36 shrink-0' role='img' aria-label={`ATS score ${score} out of 100`}>
      <svg viewBox='0 0 120 120' className='size-full -rotate-90'>
        <circle cx='60' cy='60' r={r} fill='none' stroke='#e2e8f0' strokeWidth='10' />
        <circle cx='60' cy='60' r={r} fill='none' stroke={t.ring} strokeWidth='10' strokeLinecap='round' strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className={`text-4xl font-bold ${t.text}`}>{score}</span>
        <span className='text-xs text-slate-400'>out of 100</span>
      </div>
    </div>
  )
}

const Card = ({ title, children, className = '' }) => (
  <section className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>
    <h3 className='text-sm font-semibold text-slate-800 mb-3'>{title}</h3>
    {children}
  </section>
)

const AtsReport = ({ report, fileName }) => {
  const { score, label, summary, categories, strengths, issues, keywords, sections, rewrites, stats, detectedRole, hasJobDescription } = report
  const t = tone(score)
  const fixFirst = issues.filter((i) => i.severity === 'critical' || i.severity === 'high').length

  return (
    <div className='space-y-4 text-left'>
      <div className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6'>
        <ScoreRing score={score} />
        <div className='text-center sm:text-left'>
          <p className={`text-xl font-semibold ${t.text}`}>{label}</p>
          {fileName && <p className='text-xs text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1'><LuFileText className='size-3.5' />{fileName}{detectedRole ? ` · reads as: ${detectedRole}` : ''}</p>}
          <p className='text-sm text-slate-600 mt-3 max-w-xl'>{summary}</p>
          {fixFirst > 0 && <p className='text-sm font-medium text-slate-800 mt-3'>{fixFirst} important {fixFirst === 1 ? 'fix' : 'fixes'} will raise your score the most. Start there.</p>}
        </div>
      </div>

      <Card title='Score breakdown'>
        <div className='grid sm:grid-cols-2 gap-x-8 gap-y-4'>
          {categories.map((c) => {
            const ct = tone(c.score)
            return (
              <div key={c.key}>
                <div className='flex justify-between text-sm mb-1'><span className='text-slate-700'>{c.label}</span><span className={`font-medium ${ct.text}`}>{c.score}</span></div>
                <div className='h-2 bg-slate-100 rounded-full overflow-hidden'><div className={`h-full rounded-full ${ct.bar}`} style={{ width: `${c.score}%` }} /></div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card title={`What to improve (${issues.length})`}>
        {issues.length === 0 ? <p className='text-sm text-slate-500'>No problems found. Nice work.</p> : (
          <ul className='space-y-3'>
            {issues.map((i, n) => {
              const s = SEV[i.severity] || SEV.medium, Icon = s.icon
              return (
                <li key={n} className='rounded-lg border border-slate-100 p-3.5'>
                  <div className='flex flex-wrap items-center gap-2 mb-1.5'>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-0.5 ${s.cls}`}><Icon className='size-3' />{s.label}</span>
                    <span className='text-xs text-slate-400'>{i.area}</span>
                  </div>
                  <p className='text-sm text-slate-800'>{i.problem}</p>
                  {i.fix && <p className='text-sm text-slate-600 mt-1.5'><span className='font-medium text-green-700'>How to fix: </span>{i.fix}</p>}
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <div className='grid md:grid-cols-2 gap-4'>
        <Card title='What is working well'>
          {strengths.length === 0 ? <p className='text-sm text-slate-500'>Nothing stands out yet - fix the items above first.</p> : (
            <ul className='space-y-2'>{strengths.map((s, i) => <li key={i} className='flex gap-2 text-sm text-slate-700'><LuCircleCheck className='size-4 text-green-600 shrink-0 mt-0.5' />{s}</li>)}</ul>
          )}
        </Card>
        <Card title='Resume sections'>
          <ul className='space-y-1.5'>
            {[...sections.found.map((s) => ({ ...s, ok: true })), ...sections.missing.map((s) => ({ ...s, ok: false }))].map((s) => (
              <li key={s.key} className='flex items-center gap-2 text-sm'>
                {s.ok ? <LuCircleCheck className='size-4 text-green-600' /> : <LuCircleAlert className={`size-4 ${s.required ? 'text-red-500' : 'text-slate-300'}`} />}
                <span className={s.ok ? 'text-slate-700' : s.required ? 'text-red-600' : 'text-slate-400'}>{s.label}{!s.ok && (s.required ? ' - missing' : ' - optional')}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {(keywords.found.length > 0 || keywords.missing.length > 0) && (
        <Card title={hasJobDescription ? 'Keywords: your resume vs the job description' : 'Keywords & skills'}>
          {keywords.found.length > 0 && <>
            <p className='text-xs text-slate-500 mb-2'>Found in your resume</p>
            <div className='flex flex-wrap gap-2 mb-4'>{keywords.found.map((k, i) => <span key={i} className='text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-200'>{k}</span>)}</div>
          </>}
          {keywords.missing.length > 0 && <>
            <p className='text-xs text-slate-500 mb-2'>Missing - add the ones that are true for you</p>
            <div className='flex flex-wrap gap-2'>{keywords.missing.map((k, i) => <span key={i} className='text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 ring-1 ring-red-200'>{k}</span>)}</div>
          </>}
        </Card>
      )}

      {rewrites.length > 0 && (
        <Card title='Example rewrites'>
          <div className='space-y-4'>
            {rewrites.map((r, i) => (
              <div key={i} className='text-sm'>
                <p className='text-slate-500 line-through decoration-slate-300'>{r.before}</p>
                <p className='text-slate-800 mt-1 flex gap-2'><LuLightbulb className='size-4 text-green-600 shrink-0 mt-0.5' />{r.after}</p>
              </div>
            ))}
          </div>
          <p className='text-xs text-slate-400 mt-3'>Replace [X] with your real numbers. Only claim what is true.</p>
        </Card>
      )}

      <p className='text-xs text-slate-400 text-center'>
        {stats.words} words{stats.pages ? ` · ${stats.pages} page${stats.pages > 1 ? 's' : ''}` : ''} · {stats.bullets} bullet points · {stats.quantifiedBullets} lines with numbers. Scores are an estimate: every company's ATS works a little differently.
      </p>
    </div>
  )
}

export default AtsReport
