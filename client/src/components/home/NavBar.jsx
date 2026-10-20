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

export default function NavBar() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Links come from the admin-managed menu (Admin > Menus). Section links like
    // /#feature are handled inside MenuLink.
    const { header } = useMenu();
    const { pathname } = useLocation();
    // which dropdown is open (click/tap or keyboard); hover and focus also open it on desktop via CSS
    const [openId, setOpenId] = useState(null);
    useEffect(() => { setOpenId(null); setMenuOpen(false); }, [pathname]);


    return (
        <>

            <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
                <a href="/" className="flex items-center gap-2">
                    <Logo className='h-11 w-auto' />
                </a>

                <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                    {header.map((item) => item.children?.length ? (
                        <div key={item._id} className="relative group" onMouseLeave={() => setOpenId(null)}
                            onKeyDown={(e) => { if (e.key === 'Escape') { setOpenId(null); document.activeElement?.blur?.() } }}>
                            <button type="button" aria-haspopup="true" aria-expanded={openId === item._id}
                                onClick={() => setOpenId(openId === item._id ? null : item._id)}
                                className="inline-flex items-center gap-1 hover:text-brand-600 transition">
                                {item.label}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                            </button>
                            <div className={`absolute left-0 top-full pt-2 z-50 min-w-52 ${openId === item._id ? 'block' : 'hidden group-hover:block group-focus-within:block'}`}>
                                <ul className="rounded-xl border border-slate-200 bg-white shadow-lg py-2">
                                    {item.children.map((c) => (
                                        <li key={c._id}><MenuLink item={c} onNavigate={() => setOpenId(null)} className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600 whitespace-nowrap" /></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <MenuLink key={item._id} item={item} className="hover:text-brand-600 transition" />
                    ))}
                </div>

                <div className="flex gap-2">
                    <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-brand-500 hover:bg-brand-700 active:scale-95 transition-all rounded-full text-white"
                        hidden={user}>
                        Get started
                    </Link>
                    <Link to='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
                        hidden={user}>
                        Login
                    </Link>
                    <Link to='/app/' className="hidden md:block px-8 py-2 bg-brand-500 hover:bg-brand-700 active:scale-95 transition-all rounded-full text-white"
                        hidden={!user}>
                        Dashboard
                    </Link>
                    {/* Logout button shown when user is logged in */}
                    <button onClick={() => { dispatch(logout()); navigate('/'); }} className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" hidden={!user}>
                        Logout
                    </button>

                </div>

                <button onClick={() => setMenuOpen(prev => !prev)} className="md:hidden active:scale-90 transition" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                        <path d="M4 5h16M4 12h16M4 19h16" />
                    </svg>
                </button>

            </nav>
            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-start text-lg gap-6 pt-4 pb-10 overflow-y-auto md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="self-end mr-5 shrink-0 active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-brand-600 hover:bg-brand-700 transition text-white rounded-md flex" >
                    X
                </button>
                {header.map((item) => item.children?.length ? (
                    <div key={item._id} className="flex flex-col items-center gap-3">
                        <span className="text-white">{item.label}</span>
                        <ul className="flex flex-col items-center gap-2 text-base">
                            {item.children.map((c) => (
                                <li key={c._id}><MenuLink item={c} className="text-white/80" onNavigate={() => setMenuOpen(false)} /></li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <MenuLink key={item._id} item={item} className="text-white" onNavigate={() => setMenuOpen(false)} />
                ))}
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