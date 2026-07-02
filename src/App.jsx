import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

import { SiteProvider, useSite } from './context/SiteContext'
import CursorHider from './components/CursorHider'
import Cursor from './components/Cursor'
import PrimaryNav from './components/PrimaryNav'
import CenterNav from './components/CenterNav'
import CrossNav from './components/CrossNav'
import Footer from './components/Footer'

import Home from './pages/Home'
import Paintings from './pages/Paintings'
import Drawings from './pages/Drawings'
import Works from './pages/Works'
import About from './pages/About'
import Contact from './pages/Contact'

function AppInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addClass, removeClass, scrollToTopRef } = useSite()
  const transitioning = useRef(false)
  const overlayRef = useRef(null)

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const navigateTo = useCallback((path) => {
    if (transitioning.current) return
    // Same page — call the page's registered handler, or fallback to window scroll
    if (path === location.pathname) {
      if (scrollToTopRef.current) {
        scrollToTopRef.current()
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
    transitioning.current = true

    // Pre-apply is-white instantly (no CSS transition) so .overlay is already
    // in its final position when the GSAP overlay lifts — prevents double-animation
    const isWhiteDest = path === '/about' || path === '/contact'
    if (isWhiteDest) {
      addClass('no-overlay-transition')
      addClass('is-white')
    }

    const el = overlayRef.current
    if (!el) { navigate(path); transitioning.current = false; return }

    // Slide overlay IN to cover screen
    gsap.fromTo(el,
      { y: '-100%' },
      {
        y: '0%',
        duration: 1.4,
        ease: 'power3.inOut',
        onComplete: () => {
          navigate(path)
          // Two rAFs so new page paints under the overlay before we lift it
          requestAnimationFrame(() => requestAnimationFrame(() => {
            gsap.to(el, {
              y: '-100%',
              duration: 1.4,
              ease: 'power3.inOut',
              onComplete: () => {
                transitioning.current = false
                removeClass('no-overlay-transition')
              }
            })
          }))
        }
      }
    )
  }, [navigate, location.pathname])

  return (
    <div className="page-view">
      <CursorHider />
      {/* Static background overlay — driven by body.is-white class for about/contact pages */}
      <div className="overlay" />
      {/* App-level GSAP overlay — persists across all page transitions */}
      <div ref={overlayRef} className="app-overlay" />

      <Cursor />
      <PrimaryNav navigateTo={navigateTo} />
      <CenterNav navigateTo={navigateTo} />
      <CrossNav navigateTo={navigateTo} />
      <Footer />

      <Routes>
        <Route path="/" element={<Home navigateTo={navigateTo} />} />
        <Route path="/paintings" element={<Paintings navigateTo={navigateTo} />} />
        <Route path="/paintings/:id" element={<Works collection="paintings" navigateTo={navigateTo} />} />
        <Route path="/drawings" element={<Drawings navigateTo={navigateTo} />} />
        <Route path="/drawings/:id" element={<Works collection="drawings" navigateTo={navigateTo} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AppInner />
    </SiteProvider>
  )
}
