import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

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
              <th className='px-4 py-3 font-medium'>Role</th>
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
                <td className='px-4 py-3'>
                  {String(u._id) === String(me?._id) ? (
                    <span className='text-xs text-slate-400'>{u.role} (you)</span>
                  ) : u.role === 'admin' ? (
                    <button onClick={() => changeRole(u, 'user')} className='px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600 transition' title='Remove admin'>admin ✕</button>
                  ) : (
                    <button onClick={() => changeRole(u, 'admin')} className='px-2.5 py-1 rounded-full text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition'>Make admin</button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && data.users.length === 0 && <tr><td colSpan={5} className='px-4 py-8 text-center text-slate-400'>No users found.</td></tr>}
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
