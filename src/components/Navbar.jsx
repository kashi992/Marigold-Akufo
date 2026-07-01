import { NavLink, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isGallery = location.pathname === '/paintings' || location.pathname === '/drawings'
  const isDark = true // always dark bg

  const links = [
    { to: '/about',   label: 'about' },
    { to: '/news',    label: 'news' },
    { to: '/contact', label: 'contact' },
  ]

  const linkClass = ({ isActive }) =>
    clsx(
      'text-[11px] tracking-[0.2em] transition-opacity duration-300',
      isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100',
    )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-[11px] tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity lowercase"
        >
          marigold akufo-addo
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1 opacity-60 hover:opacity-100 transition-opacity"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="menu"
        >
          <span className={clsx('block w-5 h-px bg-current transition-all duration-300', menuOpen && 'rotate-45 translate-y-[6px]')} />
          <span className={clsx('block w-5 h-px bg-current transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={clsx('block w-5 h-px bg-current transition-all duration-300', menuOpen && '-rotate-45 -translate-y-[6px]')} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div className={clsx(
        'fixed inset-0 z-40 bg-[#0e0c0b] flex flex-col items-center justify-center gap-12 transition-all duration-500 md:hidden',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}>
        <NavLink to="/paintings" className="text-2xl font-light tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">paintings</NavLink>
        <NavLink to="/drawings"  className="text-2xl font-light tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">drawings</NavLink>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className="text-2xl font-light tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">
            {l.label}
          </NavLink>
        ))}
      </div>
    </>
  )
}
