import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuTrash2, LuArrowUp, LuArrowDown, LuLink, LuBold } from 'react-icons/lu'
import { isSafeUrl } from '../../utils/inlineText'

const isListType = (t) => t === 'list' || t === 'olist'
export const emptyBlock = (type) => {
  if (isListType(type)) return { type, items: [''] }
  if (type === 'image') return { type, url: '', alt: '', caption: '' }
  if (type === 'code') return { type, lang: '', text: '' }
  return { type, text: '' }
}

const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'

// Shared content editor for blog posts and products. Paragraphs and list items can
// contain links written as [text](url) and **bold**; the toolbar inserts that syntax
// around whatever text is selected, so nobody has to type it by hand.
const BlockEditor = ({ blocks, setBlocks, rich = false, tutorial = false }) => {
  const { token } = useSelector(state => state.auth)
  const [uploading, setUploading] = useState(null)
  const types = tutorial ? ['heading', 'paragraph', 'code', 'note', 'list', 'olist', 'image'] : rich ? ['heading', 'paragraph', 'list', 'olist', 'image'] : ['heading', 'paragraph', 'list']
  const uploadImage = async (index, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image is over 5 MB.')
    setUploading(index)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/api/admin/upload', fd, { headers: { Authorization: token } })
      update(index, { url: data.url })
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed.') }
    setUploading(null)
  }
  const refs = useRef({})
  const [linkBox, setLinkBox] = useState(null) // { index, start, end, label, url }

  const update = (index, patch) => setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)))
  const add = (type) => setBlocks((prev) => [...prev, emptyBlock(type)])
  const remove = (index) => { setLinkBox(null); setBlocks((prev) => prev.filter((_, i) => i !== index)) }
  const move = (index, dir) => {
    setLinkBox(null)
    setBlocks((prev) => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const valueOf = (block) => (isListType(block.type) ? (block.items || []).join('\n') : block.text || '')
  const writeValue = (index, block, value) =>
    update(index, isListType(block.type) ? { items: value.split('\n') } : { text: value })

  const wrapSelection = (index, block, before, after) => {
    const el = refs.current[index]
    if (!el) return
    const value = valueOf(block)
    const { selectionStart: s, selectionEnd: e } = el
    const selected = value.slice(s, e) || 'bold text'
    writeValue(index, block, value.slice(0, s) + before + selected + after + value.slice(e))
  }

  const openLink = (index, block) => {
    const el = refs.current[index]
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    setLinkBox({ index, start, end, label: valueOf(block).slice(start, end), url: 'https://' })
  }

  const applyLink = (block) => {
    const { index, start, end, label, url } = linkBox
    if (!label.trim() || !isSafeUrl(url) || url.trim() === 'https://') return
    const value = valueOf(block)
    writeValue(index, block, `${value.slice(0, start)}[${label.trim()}](${url.trim()})${value.slice(end)}`)
    setLinkBox(null)
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
        <h2 className='text-sm font-semibold text-slate-800'>Content</h2>
        <div className='flex items-center gap-2'>
          {types.map((t) => (
            <button key={t} type='button' onClick={() => add(t)} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition'>+ {t === 'olist' ? 'numbered list' : t}</button>
          ))}
        </div>
      </div>
      <p className='text-xs text-slate-400 mb-4'>
        Select text in a paragraph or list, then click <strong>Link</strong> to turn it into a hyperlink. Use <code>/templates</code> for pages on this site, or a full <code>https://…</code> address for other sites.
      </p>

      <div className='space-y-4'>
        {blocks.map((block, i) => (
          <div key={i} className='border border-slate-100 rounded-lg p-3'>
            <div className='flex items-center justify-between mb-2 gap-2 flex-wrap'>
              <span className='text-xs font-medium uppercase text-slate-400'>{block.type === 'olist' ? 'numbered list' : block.type}</span>
              <div className='flex items-center gap-1'>
                {block.type !== 'heading' && block.type !== 'image' && block.type !== 'code' && (
                  <>
                    <button type='button' onClick={() => openLink(i, block)} className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-slate-100 text-slate-600 transition' title='Turn the selected text into a link'>
                      <LuLink className='size-3.5' /> Link
                    </button>
                    <button type='button' onClick={() => wrapSelection(i, block, '**', '**')} className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-slate-100 text-slate-600 transition' title='Bold'>
                      <LuBold className='size-3.5' /> Bold
                    </button>
                  </>
                )}
                <button type='button' onClick={() => move(i, -1)} className='p-1.5 rounded hover:bg-slate-100 transition' title='Move up'><LuArrowUp className='size-3.5 text-slate-500' /></button>
                <button type='button' onClick={() => move(i, 1)} className='p-1.5 rounded hover:bg-slate-100 transition' title='Move down'><LuArrowDown className='size-3.5 text-slate-500' /></button>
                <button type='button' onClick={() => remove(i)} className='p-1.5 rounded hover:bg-slate-100 transition' title='Remove'><LuTrash2 className='size-3.5 text-red-500' /></button>
              </div>
            </div>

            {block.type === 'heading' ? (
              <input value={block.text} onChange={(e) => update(i, { text: e.target.value })} placeholder='Section heading' className={inputClass} />
            ) : block.type === 'code' ? (
              <div className='space-y-2'>
                <input value={block.lang || ''} onChange={(e) => update(i, { lang: e.target.value })} placeholder='Language, e.g. typescript, html, bash, python' list='code-langs' className={inputClass} />
                <textarea
                  value={block.text || ''}
                  onChange={(e) => update(i, { text: e.target.value })}
                  placeholder='Paste the code here. Spaces and line breaks are kept exactly as typed.'
                  rows={8} spellCheck={false} wrap='off'
                  className={`${inputClass} font-mono text-[13px] whitespace-pre overflow-x-auto bg-slate-50`}
                />
                <datalist id='code-langs'>{['typescript', 'javascript', 'html', 'css', 'bash', 'json', 'python', 'java', 'csharp', 'sql', 'yaml', 'go', 'rust', 'php'].map((l) => <option key={l} value={l} />)}</datalist>
              </div>
            ) : block.type === 'image' ? (
              <div className='space-y-2'>
                {block.url && <img src={block.url} alt={block.alt || ''} className='max-h-40 rounded border border-slate-200' />}
                <div className='flex gap-2'>
                  <input value={block.url || ''} onChange={(e) => update(i, { url: e.target.value })} placeholder='Image address (https://…) or upload' className={inputClass} />
                  <label className='px-3 py-2 border border-slate-200 rounded-md text-xs hover:bg-slate-50 cursor-pointer whitespace-nowrap'>
                    {uploading === i ? 'Uploading…' : 'Upload'}
                    <input type='file' accept='image/*' hidden onChange={(e) => { uploadImage(i, e.target.files?.[0]); e.target.value = '' }} />
                  </label>
                </div>
                <input value={block.alt || ''} onChange={(e) => update(i, { alt: e.target.value })} placeholder='Alt text (describe the image, required for SEO and accessibility)' className={inputClass} />
                <input value={block.caption || ''} onChange={(e) => update(i, { caption: e.target.value })} placeholder='Caption (optional)' className={inputClass} />
              </div>
            ) : (
              <textarea
                ref={(el) => { refs.current[i] = el }}
                value={valueOf(block)}
                onChange={(e) => writeValue(i, block, e.target.value)}
                placeholder={isListType(block.type) ? 'One list item per line' : block.type === 'note' ? 'Tip, warning or extra detail shown in a highlighted box' : 'Paragraph text'}
                rows={4}
                className={inputClass}
              />
            )}

            {linkBox?.index === i && (
              <div className='mt-2 p-3 rounded-md bg-slate-50 border border-slate-200 grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-end'>
                <div>
                  <label className='block text-xs text-slate-500 mb-1'>Link text</label>
                  <input value={linkBox.label} onChange={(e) => setLinkBox({ ...linkBox, label: e.target.value })} className={inputClass} placeholder='Select text first, or type it' />
                </div>
                <div>
                  <label className='block text-xs text-slate-500 mb-1'>Web address</label>
                  <input value={linkBox.url} onChange={(e) => setLinkBox({ ...linkBox, url: e.target.value })} className={inputClass} placeholder='https://… or /templates' autoFocus />
                </div>
                <div className='flex gap-2'>
                  <button type='button' onClick={() => applyLink(block)} className='px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-xs transition'>Add link</button>
                  <button type='button' onClick={() => setLinkBox(null)} className='px-3 py-2 border border-slate-200 rounded-md text-xs hover:bg-white transition'>Cancel</button>
                </div>
                {linkBox.url && !isSafeUrl(linkBox.url) && <p className='sm:col-span-3 text-xs text-red-500'>Address must start with https://, http://, mailto:, tel: or /</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlockEditor
