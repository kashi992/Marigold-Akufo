import { useCallback } from 'react'
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

export default function PrimaryNav({ navigateTo }) {
  const { addClass, removeClass, toggleClass, bodyClasses } = useSite()

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
      {/* Small logo — visible only on light (is-white) pages via CSS */}
      <div className="logo-small">
        <span
          style={{ cursor: 'none' }}
          onClick={() => handleNavLink('/')}
        >
          M. Akufo-Addo
        </span>
      </div>

      {/* Desktop nav */}
      <nav className={`primary-nav${isWhite ? ' is-white-nav' : ''}`}>
        <ul>
          {[['/', 'Home'], ['/about', 'About'], ['/news', 'News'], ['/contact', 'Contacts']].map(([path, label]) => (
            <li key={path}>
              <a onClick={() => handleNavLink(path)}>
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
      <nav className="mobile-menu" style={{ display: isMenuOpen ? 'table' : 'none' }}>
        <ul>
          <li><a onClick={() => handleNavLink('/')} style={{ cursor: 'none' }}>Home</a></li>
          <li><a onClick={() => handleNavLink('/paintings')} style={{ cursor: 'none' }}>Paintings</a></li>
          <li><a onClick={() => handleNavLink('/drawings')} style={{ cursor: 'none' }}>Drawings</a></li>
          <li><a onClick={() => handleNavLink('/about')} style={{ cursor: 'none' }}>About</a></li>
          <li><a onClick={() => handleNavLink('/news')} style={{ cursor: 'none' }}>News</a></li>
          <li><a onClick={() => handleNavLink('/contact')} style={{ cursor: 'none' }}>Contact</a></li>
        </ul>
      </nav>
    </>
  )
}
