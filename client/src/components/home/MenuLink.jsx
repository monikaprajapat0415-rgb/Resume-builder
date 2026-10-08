import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// One menu entry, rendered the right way for where it points:
//   /#section   -> scroll on the home page (or go there first, then scroll)
//   /page       -> client-side navigation (a new tab if the admin ticked "open in new tab")
//   https://…   -> normal link, new tab if ticked; mailto:/tel: work as-is
const MenuLink = ({ item, className, onNavigate }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { label, url, newTab } = item

  const hash = url.match(/^\/#(.+)$/)
  if (hash) {
    const id = hash[1]
    const go = (e) => {
      e.preventDefault()
      onNavigate?.()
      if (location.pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      else navigate(`/#${id}`)
    }
    return <a href={url} onClick={go} className={className}>{label}</a>
  }

  if (/^\/(?!\/)/.test(url) && !newTab) {
    return <Link to={url} onClick={onNavigate} className={className}>{label}</Link>
  }

  return (
    <a href={url} onClick={onNavigate} className={className}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {label}
    </a>
  )
}

export default MenuLink
