import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../app/features/authSlice';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuLink from './MenuLink';
import { useMenu } from '../../utils/menu';
import PageNav from '../PageNav';
import { MENU_ICONS } from '../../utils/menuIcons';
import { useToolSettings } from '../../utils/toolSettings';
import { hiddenToolPaths } from '../../content/toolsHub';
import { useI18n } from '../../i18n/I18nProvider';
import CountrySelect from '../../i18n/CountrySelect';
import FullscreenButton from '../FullscreenButton';

// Dropdown row: optional icon tile, label and one-line description.
const SubLabel = ({ c, dark, compact }) => {
    const Icon = MENU_ICONS[c.icon];
    return (
        <span className={`flex gap-3 ${compact ? "items-center" : "items-start"}`}>
            {Icon && <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${dark ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-600'}`}><Icon className="size-5" aria-hidden="true" /></span>}
            <span className="min-w-0 flex-1">
                <span className="block font-medium break-words">{c.label}</span>
                {c.description && !compact && <span className={`block text-xs font-normal whitespace-normal ${dark ? 'text-white/70' : 'text-slate-500'}`}>{c.description}</span>}
            </span>
        </span>
    );
};

export default function NavBar() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    // Translated labels are longer, so outside English the full menu bar only shows on very wide screens (the menu button covers the rest).
    const { lang } = useI18n();
    const wide = lang !== 'en';

    // Links come from the admin-managed menu (Admin > Menus). Section links like
    // /#feature are handled inside MenuLink.
    const { header: rawHeader } = useMenu();
    // A tool the admin switched off (Admin > Free tools) also leaves the menu.
    const toolSettings = useToolSettings();
    const hiddenPaths = hiddenToolPaths(toolSettings);
    const header = rawHeader.map((it) => (it.children?.length ? { ...it, children: it.children.filter((c) => !hiddenPaths.includes(c.url)) } : it));
    const { pathname } = useLocation();
    // which dropdown is open (click/tap or keyboard); hover and focus also open it on desktop via CSS
    const [openId, setOpenId] = useState(null);
    useEffect(() => { setOpenId(null); setMenuOpen(false); }, [pathname]);


    return (
        <>

            <nav className="site-w z-50 flex items-center justify-between gap-4 py-4 text-sm">
                <a href="/" className="flex items-center gap-2">
                    <Logo className='h-11 w-auto' />
                </a>

                <div className={`${wide ? 'hidden 2xl:flex items-center gap-3 2xl:gap-4 text-sm' : 'hidden xl:flex items-center gap-3 2xl:gap-8 text-sm 2xl:text-base'} whitespace-nowrap transition duration-500 text-slate-800`}>
                    {header.map((item) => item.children?.length ? (
                        <div key={item._id} className="relative group" onMouseLeave={() => setOpenId(null)}
                            onKeyDown={(e) => { if (e.key === 'Escape') { setOpenId(null); document.activeElement?.blur?.() } }}>
                            <button type="button" aria-haspopup="true" aria-expanded={openId === item._id}
                                onClick={() => setOpenId(openId === item._id ? null : item._id)}
                                className="inline-flex items-center gap-1 hover:text-brand-600 transition">
                                {item.label}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                            <div className={`absolute start-0 top-full pt-2 z-50 ${item.children.length > 8 ? 'w-[44rem]' : 'w-72'} max-w-[calc(100vw-2rem)] ${openId === item._id ? 'block' : 'hidden group-hover:block group-focus-within:block'}`}>
                                <ul className={`rounded-xl border border-slate-200 bg-white shadow-lg py-2 ${item.children.length > 8 ? 'grid grid-cols-2 gap-x-1 px-2' : ''}`}>
                                    {item.children.map((c) => (
                                        <li key={c._id}><MenuLink item={c} onNavigate={() => setOpenId(null)} className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600 whitespace-normal break-words"><SubLabel c={c} compact /></MenuLink></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <MenuLink key={item._id} item={item} className="hover:text-brand-600 transition" />
                    ))}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 whitespace-nowrap ml-3">
                  <div className="flex gap-2">
                    <Link to='/app?state=register' className={`${wide ? 'hidden 2xl:block' : 'hidden xl:block'} px-6 py-2 bg-brand-500 hover:bg-brand-700 active:scale-95 transition-all rounded-full text-white`}
                        hidden={user}>
                        Get started
                    </Link>
                    <Link to='/app?state=login' className={`${wide ? 'hidden 2xl:block' : 'hidden xl:block'} px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900`}
                        hidden={user}>
                        Login
                    </Link>
                    <Link to='/app/' className={`${wide ? 'hidden 2xl:block' : 'hidden xl:block'} px-8 py-2 bg-brand-500 hover:bg-brand-700 active:scale-95 transition-all rounded-full text-white`}
                        hidden={!user}>
                        Dashboard
                    </Link>
                    {/* Logout button shown when user is logged in */}
                    <button onClick={() => { dispatch(logout()); navigate('/'); }} className={`${wide ? 'hidden 2xl:block' : 'hidden xl:block'} px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900`} hidden={!user}>
                        Logout
                    </button>
                  </div>
                  {/* Country and language: right under the Login / Dashboard buttons (on small screens it is inside the menu) */}
                  <div className={`${wide ? 'hidden 2xl:flex' : 'hidden xl:flex'} items-center justify-end gap-2`}>
                    <FullscreenButton className="!inline-flex" />
                    <CountrySelect />
                  </div>
                </div>

                <button onClick={() => setMenuOpen(prev => !prev)} className={`${wide ? '2xl:hidden' : 'xl:hidden'} active:scale-90 transition`} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                        <path d="M4 5h16M4 12h16M4 19h16" />
                    </svg>
                </button>

            </nav>
            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-start text-lg gap-6 pt-4 pb-10 overflow-y-auto ${wide ? '2xl:hidden' : 'xl:hidden'} transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="self-end mr-5 shrink-0 active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-brand-600 hover:bg-brand-700 transition text-white rounded-md flex" >
                    X
                </button>
                {header.map((item) => item.children?.length ? (
                    <div key={item._id} className="flex flex-col items-center gap-3 w-full px-6">
                        <span className="text-white">{item.label}</span>
                        <ul className="flex flex-col items-stretch gap-3 text-base w-72 max-w-full">
                            {item.children.map((c) => (
                                <li key={c._id}><MenuLink item={c} className="text-white/90 block break-words" onNavigate={() => setMenuOpen(false)}>{c.icon || c.description ? <SubLabel c={c} dark /> : c.label}</MenuLink></li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <MenuLink key={item._id} item={item} className="text-white" onNavigate={() => setMenuOpen(false)} />
                ))}
                <div className="w-72 max-w-full bg-white rounded-xl p-3 text-slate-800 text-sm"><p className="text-xs text-slate-500 mb-2">Country and language</p><CountrySelect className="[&>div]:w-full" /><FullscreenButton className="!inline-flex mt-3" /></div>
                <Link
                    to="/app?state=login"
                    className="text-white"
                    hidden={user}
                >
                    Login
                </Link>

                <Link
                    to="/app/"
                    className="text-white"
                    hidden={!user}
                >
                    Dashboard
                </Link>

                <button
                    onClick={() => { dispatch(logout()); navigate('/'); }}
                    className="text-white"
                    hidden={!user}
                >
                    Logout
                </button>


            </div>
            <PageNav />
        </>


    );
}