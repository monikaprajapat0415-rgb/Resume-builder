import React, { useState } from 'react'
import { LuCheck, LuX, LuRotateCcw } from 'react-icons/lu'
import { renderInline } from '../utils/inlineText'

// End-of-lesson practice quiz. Answers are checked in the browser and nothing is sent anywhere:
// it is a self-check, not an exam. Passing (60% or more) marks the lesson done once.
const PASS = 0.6

const LessonQuiz = ({ quiz, onPass, alreadyDone }) => {
  const [picked, setPicked] = useState({})       // question index -> option index
  const [checked, setChecked] = useState(false)
  if (!Array.isArray(quiz) || quiz.length === 0) return null

  const total = quiz.length
  const answered = Object.keys(picked).length
  const score = quiz.reduce((n, q, i) => n + (picked[i] === q.answer ? 1 : 0), 0)
  const passed = score / total >= PASS

  const check = () => {
    setChecked(true)
    if (score / total >= PASS && !alreadyDone && onPass) onPass()
  }
  const retry = () => { setPicked({}); setChecked(false) }

  return (
    <section aria-label='Quick quiz' className='mt-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6' data-no-i18n>
      <h2 className='text-xl font-semibold text-slate-900'>Check what you learned</h2>
      <p className='text-sm text-slate-500 mt-1'>{total} quick question{total > 1 ? 's' : ''}. This is just for practice. Nothing is saved or sent.</p>

      <div className='mt-5 space-y-6'>
        {quiz.map((q, i) => (
          <fieldset key={i} disabled={checked} className='min-w-0'>
            <legend className='font-medium text-slate-800'><span className='text-slate-400 mr-1'>{i + 1}.</span>{renderInline(q.q)}</legend>
            <div className='mt-2 space-y-2'>
              {q.options.map((o, j) => {
                const isPicked = picked[i] === j
                const isRight = checked && j === q.answer
                const isWrong = checked && isPicked && j !== q.answer
                return (
                  <label key={j} className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition ${isRight ? 'border-emerald-400 bg-emerald-50' : isWrong ? 'border-red-300 bg-red-50' : isPicked ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'} ${checked ? 'cursor-default' : ''}`}>
                    <input type='radio' name={`q${i}`} checked={isPicked} onChange={() => setPicked((p) => ({ ...p, [i]: j }))} className='mt-0.5 accent-brand-600' />
                    <span className='min-w-0 break-words text-slate-700'>{renderInline(o)}</span>
                    {isRight && <LuCheck className='size-4 text-emerald-600 shrink-0 ml-auto mt-0.5' aria-label='Correct answer' />}
                    {isWrong && <LuX className='size-4 text-red-500 shrink-0 ml-auto mt-0.5' aria-label='Your answer, not correct' />}
                  </label>
                )
              })}
            </div>
            {checked && q.explain && <p className='mt-2 text-sm text-slate-600'><span className='font-medium text-slate-700'>{picked[i] === q.answer ? 'Right. ' : 'Not quite. '}</span>{renderInline(q.explain)}</p>}
          </fieldset>
        ))}
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-3' aria-live='polite'>
        {!checked ? (
          <>
            <button type='button' onClick={check} disabled={answered < total} className='rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed'>Check answers</button>
            {answered < total && <span className='text-xs text-slate-500'>{total - answered} left to answer</span>}
          </>
        ) : (
          <>
            <p className={`text-sm font-semibold ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>You got {score} of {total}. {passed ? (alreadyDone ? 'Nice work.' : 'Nice work, this lesson is marked done.') : 'Check the green answers, then try again.'}</p>
            <button type='button' onClick={retry} className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'><LuRotateCcw className='size-4' aria-hidden='true' />Try again</button>
          </>
        )}
      </div>
    </section>
  )
}

export default LessonQuiz
