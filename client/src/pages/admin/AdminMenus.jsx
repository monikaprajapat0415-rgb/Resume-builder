import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { invalidateMenu } from '../../utils/menu'
import { MENU_ICONS } from '../../utils/menuIcons'
import { LuEye, LuEyeOff, LuArrowUp, LuArrowDown, LuPencil, LuTrash2, LuCheck, LuX, LuRotateCcw } from 'react-icons/lu'

const LOCATIONS = [
  { id: 'header', label: 'Top menu', hint: 'The navigation bar at the top of every public page (and the mobile menu).' },
  { id: 'footer_product', label: 'Footer · Product', hint: 'First link column in the footer.' },
  { id: 'footer_resources', label: 'Footer · Resources', hint: 'Second link column in the footer.' },
  { id: 'footer_legal', label: 'Footer · Legal', hint: 'Third link column in the footer.' },
]
const PAGES = ['/', '/templates', '/products', '/blog', '/contact-us', '/privacy-policy', '/terms-and-conditions', '/#feature', '/#testimonials', '/#contact-us']
const input = 'px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'

const draftIsSub = (v) => Boolean(v.parent)

// Icon + one-line description, shown in the dropdown for a sub-menu link.
const IconFields = ({ v, set }) => (
  <div className='sm:col-span-3 grid sm:grid-cols-[auto_1fr] gap-2'>
    <select value={v.icon || ''} onChange={(e) => set({ ...v, icon: e.target.value })} className={input} aria-label='Icon'>
      <option value=''>No icon</option>
      {Object.keys(MENU_ICONS).map((k) => <option key={k} value={k}>Icon: {k}</option>)}
    </select>
    <input value={v.description || ''} onChange={(e) => set({ ...v, description: e.target.value })} maxLength={90} placeholder='Short description under the label (optional, 90 characters)' className={input} />
  </div>
)

const AdminMenus = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [loc, setLoc] = useState('header')
  const [menu, setMenu] = useState({})
  const [editing, setEditing] = useState(null) // { id, label, url, newTab, parent }
  const [draft, setDraft] = useState({ label: '', url: '', newTab: false, parent: '', icon: '', description: '' })

  const load = () => api.get('/api/admin/menu', headers)
    .then(({ data }) => setMenu(data.menu || {}))
    .catch((e) => toast.error(e.response?.data?.message || 'Could not load menu.'))
  useEffect(() => { load() }, [])

  // Show each sub-link right under its parent; moving up/down only swaps links that share a parent.
  const raw = menu[loc] || []
  const topLevel = raw.filter((i) => !i.parent || !raw.some((p) => p._id === i.parent))
  const kids = (id) => raw.filter((i) => i.parent === id)
  const items = topLevel.flatMap((t) => [t, ...kids(t._id)])
  const parentName = (id) => raw.find((p) => p._id === id)?.label
  const parentChoices = topLevel.filter((t) => loc === 'header')
  const info = LOCATIONS.find((l) => l.id === loc)

  const run = async (fn, okMsg) => {
    try { await fn(); invalidateMenu(); await load(); if (okMsg) toast.success(okMsg) }
    catch (e) { toast.error(e.response?.data?.message || 'Something went wrong.') }
  }

  const toggle = (item) => run(() => api.put(`/api/admin/menu/${item._id}`, { visible: !item.visible }, headers))
  const move = (index, dir) => {
    const item = items[index]
    const group = item.parent ? kids(item.parent) : topLevel
    const gi = group.findIndex((g) => g._id === item._id)
    const gj = gi + dir
    if (gj < 0 || gj >= group.length) return
    const swapped = [...group]
    ;[swapped[gi], swapped[gj]] = [swapped[gj], swapped[gi]]
    const top = item.parent ? topLevel : swapped
    const ids = top.flatMap((t) => [t._id, ...(item.parent === t._id ? swapped : kids(t._id)).filter((k) => k._id !== t._id).map((k) => k._id)])
    setMenu({ ...menu, [loc]: ids.map((id) => raw.find((r) => r._id === id)) }) // instant feedback, then persist
    run(() => api.put('/api/admin/menu/reorder', { location: loc, ids }, headers))
  }
  const remove = (item) => {
    if (!window.confirm(`Remove "${item.label}" from this menu?${item.key ? ' You can bring it back later with "Restore defaults".' : ''}`)) return
    run(() => api.delete(`/api/admin/menu/${item._id}`, headers), 'Removed.')
  }
  const saveEdit = () => run(async () => {
    await api.put(`/api/admin/menu/${editing.id}`, { label: editing.label, url: editing.url, newTab: editing.newTab, parent: editing.parent || null, icon: editing.icon || '', description: editing.description || '' }, headers)
    setEditing(null)
  }, 'Saved.')
  const add = (e) => {
    e.preventDefault()
    run(async () => {
      await api.post('/api/admin/menu', { ...draft, parent: draft.parent || null, location: loc }, headers)
      setDraft({ label: '', url: '', newTab: false, parent: '', icon: '', description: '' })
    }, 'Menu item added.')
  }
  const restore = () => run(async () => {
    const { data } = await api.post('/api/admin/menu/restore', {}, headers)
    toast(data.message)
  })

  return (
    <div className='max-w-3xl'>
      <div className='flex items-center justify-between mb-2 gap-3 flex-wrap'>
        <h1 className='text-2xl font-semibold text-slate-800'>Menus</h1>
        <button onClick={restore} className='inline-flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 rounded-full hover:bg-white transition'>
          <LuRotateCcw className='size-3.5' /> Restore defaults
        </button>
      </div>
      <p className='text-sm text-slate-500 mb-6'>
        Add links, reorder them, or hide/remove the ones you don't want visitors to see. Hiding a link only removes it from the menu — the page itself still exists at its address.
      </p>

      <div className='flex flex-wrap gap-2 mb-5'>
        {LOCATIONS.map((l) => (
          <button key={l.id} onClick={() => { setLoc(l.id); setEditing(null) }}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${loc === l.id ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'}`}>
            {l.label}
          </button>
        ))}
      </div>
      <p className='text-xs text-slate-400 mb-3'>{info.hint}</p>

      <div className='bg-white rounded-xl border border-slate-200 divide-y divide-slate-100'>
        {items.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>No links here. {loc !== 'header' ? 'This column is hidden on the site while it is empty.' : 'Add one below.'}</p>}
        {items.map((item, i) => (
          <div key={item._id} className={`px-4 py-3 ${item.visible ? '' : 'bg-slate-50'}`}>
            {editing?.id === item._id ? (
              <div className='grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-center'>
                <input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className={input} />
                <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} list='site-pages' className={input} />
                {loc === 'header' && !kids(editing.id).length && <select value={editing.parent} onChange={(e) => setEditing({ ...editing, parent: e.target.value })} className={input} aria-label='Show under'>
                  <option value=''>Top level (no dropdown)</option>
                  {parentChoices.filter((p) => p._id !== editing.id).map((p) => <option key={p._id} value={p._id}>Under: {p.label}</option>)}
                </select>}
                {(editing.parent || draftIsSub(editing)) && <IconFields v={editing} set={setEditing} />}
                <div className='flex items-center gap-1'>
                  <label className='text-xs text-slate-500 flex items-center gap-1 mr-1'><input type='checkbox' checked={editing.newTab} onChange={(e) => setEditing({ ...editing, newTab: e.target.checked })} /> New tab</label>
                  <button onClick={saveEdit} className='p-2 rounded-md hover:bg-slate-100' title='Save'><LuCheck className='size-4 text-brand-600' /></button>
                  <button onClick={() => setEditing(null)} className='p-2 rounded-md hover:bg-slate-100' title='Cancel'><LuX className='size-4 text-slate-500' /></button>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <div className={`flex-1 min-w-0 ${item.parent ? 'pl-6 border-l-2 border-slate-100' : ''} ${item.visible ? '' : 'opacity-50'}`}>
                  <p className='text-sm text-slate-800 truncate'>{item.icon && MENU_ICONS[item.icon] && React.createElement(MENU_ICONS[item.icon], { className: 'inline size-3.5 mr-1.5 -mt-0.5 text-brand-600' })}{item.label} {!item.visible && <span className='text-xs text-amber-600'>(hidden)</span>}</p>
                  <p className='text-xs text-slate-400 truncate'>{item.url}{item.parent ? ` · under ${parentName(item.parent) || 'a link'}` : ''}{item.newTab ? ' · new tab' : ''}{item.key ? ' · built-in' : ''}</p>
                </div>
                <button onClick={() => toggle(item)} className='p-2 rounded-md hover:bg-slate-100' title={item.visible ? 'Hide from visitors' : 'Show to visitors'}>
                  {item.visible ? <LuEye className='size-4 text-slate-600' /> : <LuEyeOff className='size-4 text-amber-600' />}
                </button>
                <button onClick={() => move(i, -1)} className='p-2 rounded-md hover:bg-slate-100 disabled:opacity-30' title='Move up'><LuArrowUp className='size-4 text-slate-500' /></button>
                <button onClick={() => move(i, 1)} className='p-2 rounded-md hover:bg-slate-100 disabled:opacity-30' title='Move down'><LuArrowDown className='size-4 text-slate-500' /></button>
                <button onClick={() => setEditing({ id: item._id, label: item.label, url: item.url, newTab: item.newTab, parent: item.parent || '', icon: item.icon || '', description: item.description || '' })} className='p-2 rounded-md hover:bg-slate-100' title='Edit'><LuPencil className='size-4 text-slate-600' /></button>
                <button onClick={() => remove(item)} className='p-2 rounded-md hover:bg-slate-100' title='Remove'><LuTrash2 className='size-4 text-red-500' /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={add} className='mt-5 bg-white rounded-xl border border-slate-200 p-4'>
        <p className='text-sm font-semibold text-slate-800 mb-3'>Add a link to “{info.label}”</p>
        <div className='grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-center'>
          <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder='Label, e.g. Pricing' required maxLength={40} className={input} />
          <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} list='site-pages' placeholder='/page or https://…' required className={input} />
          <button className='px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Add</button>
        </div>
        {loc === 'header' && <div className='mt-3 max-w-xs'><select value={draft.parent} onChange={(e) => setDraft({ ...draft, parent: e.target.value })} className={input} aria-label='Show under'>
                  <option value=''>Top level (no dropdown)</option>
                  {parentChoices.filter((p) => p._id !== draft.id).map((p) => <option key={p._id} value={p._id}>Under: {p.label}</option>)}
                </select></div>}
        {loc === 'header' && draft.parent && <div className='mt-3'><IconFields v={draft} set={setDraft} /></div>}
        <label className='mt-3 text-xs text-slate-500 flex items-center gap-1.5'><input type='checkbox' checked={draft.newTab} onChange={(e) => setDraft({ ...draft, newTab: e.target.checked })} /> Open in a new tab</label>
        <datalist id='site-pages'>{PAGES.map((p) => <option key={p} value={p} />)}</datalist>
        <p className='text-xs text-slate-400 mt-2'>Use <code>/page</code> for pages on this site (e.g. <code>/products/my-toolkit</code>), or a full <code>https://…</code> address for other sites.</p>
      </form>
    </div>
  )
}

export default AdminMenus
