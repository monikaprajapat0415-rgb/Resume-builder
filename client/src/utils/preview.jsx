import React from 'react'

// Draft preview: an admin opens a public URL with ?preview=1 and the page sends their token so the server
// can return the unpublished item. Nothing changes for other visitors.
export const previewConfig = () => {
  try {
    if (new URLSearchParams(window.location.search).get('preview') !== '1') return {}
    const t = localStorage.getItem('token')
    return t ? { params: { preview: 1 }, headers: { Authorization: t } } : {}
  } catch { return {} }
}

export const PreviewBanner = ({ show }) => show ? (
  <div role='status' className='sticky top-0 z-50 bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900'>
    Draft preview. Only signed-in admins see this page; visitors and search engines cannot reach it until it is published.
  </div>
) : null
