import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useRef } from 'react'
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
import News from './pages/News'
import Contact from './pages/Contact'

function AppInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addClass, removeClass } = useSite()
  const transitioning = useRef(false)
  const overlayRef = useRef(null)

  const navigateTo = useCallback((path) => {
    if (transitioning.current) return
    if (path === location.pathname) return
    transitioning.current = true

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
              onComplete: () => { transitioning.current = false }
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
        <Route path="/news" element={<News />} />
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
