import React from 'react'

// Inline version of assets/logo.svg so it follows the theme colour chosen in Admin > Appearance.
// Inline style so the site-wide font rule in index.css does not change the logo's lettering.
const FONT = { fontFamily: 'Inter, Arial, sans-serif' }

const Logo = ({ className = '' }) => (
  <svg width='340' height='80' viewBox='0 0 340 80' xmlns='http://www.w3.org/2000/svg' fill='none' role='img' aria-label='Prime Resume AI' className={`min-w-0 max-w-full shrink ${className}`}>
    <rect x='0' y='12' width='60' height='60' rx='16' className='fill-brand-500' />
    <rect x='16' y='22' width='30' height='34' rx='5' fill='white' />
    <rect x='20' y='28' width='22' height='3' rx='1.5' className='fill-brand-600' />
    <rect x='20' y='34' width='18' height='2.5' rx='1.2' className='fill-brand-300' />
    <rect x='20' y='39' width='20' height='2.5' rx='1.2' className='fill-brand-300' />
    <rect x='20' y='44' width='14' height='2.5' rx='1.2' className='fill-brand-300' />
    <circle cx='50' cy='20' r='3' className='fill-brand-600' />
    <circle cx='54' cy='14' r='1.5' className='fill-brand-600' />
    <circle cx='46' cy='14' r='1.5' className='fill-brand-600' />
    <text x='75' y='48' style={FONT} fontSize='24' fontWeight='600' fill='#111827'>Prime Resume</text>
    <text x='240' y='48' style={FONT} fontSize='24' fontWeight='800' className='fill-brand-500'>AI</text>
  </svg>
)

export default Logo
