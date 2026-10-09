import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuTrash2 } from 'react-icons/lu'

const AdminUsers = () => {
  const { token, user: me } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [data, setData] = useState({ users: [], total: 0, page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      api.get('/api/admin/users', { ...headers, params: { search, role, page } })
        .then(({ data }) => setData(data))
        .catch((e) => toast.error(e.response?.data?.message || 'Could not load users.'))
        .finally(() => setLoading(false))
    }, 250) // debounce typing in the search box
    return () => clearTimeout(t)
  }, [search, role, page])

  const changeRole = async (u, next) => {
    const verb = next === 'admin' ? `Make ${u.email} an admin? They will be able to edit all blog posts, products and users.` : `Remove admin access from ${u.email}?`
    if (!window.confirm(verb)) return
    try {
      await api.patch(`/api/admin/users/${u._id}/role`, { role: next }, headers)
      setData((d) => ({ ...d, users: d.users.map((x) => (x._id === u._id ? { ...x, role: next } : x)) }))
      toast.success('Role updated.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update role.') }
  }

  const removeUser = async (u) => {
    if (!window.confirm(`Permanently delete ${u.email}?\n\nTheir account, all their resumes and ATS reports will be removed. This cannot be undone.`)) return
    try {
      const { data } = await api.delete(`/api/admin/users/${u._id}`, headers)
      setData((d) => ({ ...d, total: d.total - 1, users: d.users.filter((x) => x._id !== u._id) }))
      toast.success(`User deleted (${data.resumesDeleted} resumes removed).`)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete the user.') }
  }

  const giveChecks = async (u) => {
    const input = window.prompt(`Add ATS checks for ${u.email}.\nEnter a number (use a negative number to take checks away):`, '1')
    if (input === null) return
    const n = parseInt(input, 10)
    if (!Number.isFinite(n) || n === 0) return toast.error('Enter a whole number such as 1 or 5.')
    try {
      const { data } = await api.post(`/api/admin/users/${u._id}/ats-credits`, { credits: n }, headers)
      setData((d) => ({ ...d, users: d.users.map((x) => (x._id === u._id ? { ...x, ats: data.ats } : x)) }))
      toast.success('ATS checks updated.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }

  const toggleAts = async (u) => {
    const off = !u.ats?.disabled
    if (off && !window.confirm(`Turn the ATS checker off for ${u.email}? They will see a message that it is switched off.`)) return
    try {
      const { data } = await api.patch(`/api/admin/users/${u._id}/ats-disabled`, { disabled: off }, headers)
      setData((d) => ({ ...d, users: d.users.map((x) => (x._id === u._id ? { ...x, ats: data.ats } : x)) }))
      toast.success(off ? 'ATS checker turned off for this user.' : 'ATS checker turned on for this user.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>Users <span className='text-base font-normal text-slate-400'>({data.total})</span></h1>
      <div className='flex flex-wrap gap-2 mb-4'>
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder='Search name or email…' className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-300' />
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white'>
          <option value=''>All roles</option><option value='admin'>Admins</option><option value='user'>Users</option>
        </select>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-50 text-slate-500 text-left'>
            <tr>
              <th className='px-4 py-3 font-medium'>User</th>
              <th className='px-4 py-3 font-medium'>Sign-in</th>
              <th className='px-4 py-3 font-medium'>Verified</th>
              <th className='px-4 py-3 font-medium'>Joined</th>
              <th className='px-4 py-3 font-medium'>ATS checks</th>
              <th className='px-4 py-3 font-medium'>Role</th>
              <th className='px-4 py-3 font-medium'><span className='sr-only'>Actions</span></th>
            </tr>
          </thead>
          <tbody className={loading ? 'opacity-50' : ''}>
            {data.users.map((u) => (
              <tr key={u._id} className='border-t border-slate-100'>
                <td className='px-4 py-3'>
                  <p className='text-slate-800'>{u.name || '—'}</p>
                  <p className='text-xs text-slate-400'>{u.email}</p>
                </td>
                <td className='px-4 py-3 text-slate-500 capitalize'>{u.authProvider}</td>
                <td className='px-4 py-3'>{u.isVerified ? <span className='text-green-600'>Yes</span> : <span className='text-amber-600'>No</span>}</td>
                <td className='px-4 py-3 text-slate-500 whitespace-nowrap'>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <span className='text-slate-600'>{u.ats?.used || 0} used</span>
                  {u.ats?.credits > 0 && <span className='text-green-700'> · {u.ats.credits} extra</span>}
                  {u.ats?.disabled
                    ? <span className='ml-2 text-[10px] uppercase bg-red-100 text-red-700 rounded px-1.5 py-0.5'>Off</span>
                    : (u.ats?.freeUsed || 0) >= 5 && !(u.ats?.credits > 0) && <span className='ml-2 text-[10px] uppercase bg-amber-100 text-amber-700 rounded px-1.5 py-0.5'>Limit reached</span>}
                  <button onClick={() => giveChecks(u)} className='ml-2 text-xs text-green-700 hover:underline' title='Give or remove extra ATS checks'>+ add</button>
                  <button onClick={() => toggleAts(u)} className='ml-2 text-xs text-slate-500 hover:underline' title='Turn the ATS checker on or off for this user'>{u.ats?.disabled ? 'turn on' : 'turn off'}</button>
                </td>
                <td className='px-4 py-3'>
                  {String(u._id) === String(me?._id) ? (
                    <span className='text-xs text-slate-400'>{u.role} (you)</span>
                  ) : u.role === 'admin' ? (
                    <button onClick={() => changeRole(u, 'user')} className='px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600 transition' title='Remove admin'>admin ✕</button>
                  ) : (
                    <button onClick={() => changeRole(u, 'admin')} className='px-2.5 py-1 rounded-full text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition'>Make admin</button>
                  )}
                </td>
                <td className='px-4 py-3 text-right'>
                  {String(u._id) !== String(me?._id) && (
                    u.role === 'admin'
                      ? <span className='text-[11px] text-slate-300' title='Remove admin access before deleting'>—</span>
                      : <button onClick={() => removeUser(u)} className='p-2 rounded-md hover:bg-red-50' title='Delete user' aria-label={`Delete ${u.email}`}><LuTrash2 className='size-4 text-red-500' /></button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && data.users.length === 0 && <tr><td colSpan={7} className='px-4 py-8 text-center text-slate-400'>No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      {data.pages > 1 && (
        <div className='flex items-center justify-center gap-3 mt-4 text-sm'>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-white'>Previous</button>
          <span className='text-slate-500'>Page {data.page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='px-3 py-1.5 border border-slate-200 rounded-md disabled:opacity-40 hover:bg-white'>Next</button>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
