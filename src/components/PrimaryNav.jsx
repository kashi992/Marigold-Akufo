import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

// Splits text into individual character spans for stagger animation
function SplitText({ text }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} className="nav-char" style={{ '--i': i }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

export default function PrimaryNav({ navigateTo, navigateToWorks }) {
  const { addClass, removeClass, toggleClass, bodyClasses } = useSite()
  const location = useLocation()

  const isMenuOpen = bodyClasses.has('is-menu-open')
  const isWhite = bodyClasses.has('is-white')

  const handleBurger = useCallback(() => {
    toggleClass('is-menu-open', !isMenuOpen)
  }, [isMenuOpen, toggleClass])

  const handleNavLink = useCallback((path) => {
    if (isMenuOpen) {
      removeClass('is-menu-open')
    }
    navigateTo(path)
  }, [isMenuOpen, navigateTo, removeClass])

  return (
    <>
      {/* Main logo — hidden on home page */}
      <div className="logo-main" style={{ display: location.pathname === '/' ? 'none' : 'flex' }}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavLink('/')}
        >
          Marigold
        </span>
      </div>

      {/* Desktop nav */}
      <nav className={`primary-nav${isWhite ? ' is-white-nav' : ''}`}>
        <ul>
          <li style={{ cursor: 'pointer' }}>
            <a onClick={() => handleNavLink('/')} style={{ cursor: 'pointer' }}>
              <SplitText text="Home" />
            </a>
          </li>
          <li style={{ cursor: 'pointer' }}>
            <a onClick={() => { if (isMenuOpen) removeClass('is-menu-open'); navigateToWorks() }} style={{ cursor: 'pointer' }}>
              <SplitText text="Selected Work" />
            </a>
          </li>
          {[[ '/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
            <li key={path} style={{ cursor: 'pointer' }}>
              <a onClick={() => handleNavLink(path)} style={{ cursor: 'pointer' }}>
                <SplitText text={label} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Burger button (mobile) */}
      <div className="burger-menu" onClick={handleBurger} aria-label="Menu">
        <div />
        <div />
        <div />
      </div>

      {/* Mobile fullscreen menu */}
      <nav className="mobile-menu">
        <ul>
          <li><a onClick={() => handleNavLink('/')} style={{ cursor: 'pointer' }}>Home</a></li>
          <li><a onClick={() => { removeClass('is-menu-open'); navigateToWorks() }} style={{ cursor: 'pointer' }}>Selected Works</a></li>
          <li><a onClick={() => handleNavLink('/about')} style={{ cursor: 'pointer' }}>About</a></li>
          <li><a onClick={() => handleNavLink('/contact')} style={{ cursor: 'pointer' }}>Contact</a></li>
        </ul>
      </nav>
    </>
  )
}
