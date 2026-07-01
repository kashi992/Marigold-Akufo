import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Hammer from 'hammerjs'
import { gsap } from 'gsap'
import { useSite } from '../context/SiteContext'
import { paintings, drawings } from '../data/artworks'

const allWorks = [
  ...paintings.map(w => ({ ...w, collection: 'paintings' })),
  ...drawings.map(w => ({ ...w, collection: 'drawings' })),
]

export default function Works({ collection, navigateTo }) {
  const { id } = useParams()
  const { addClass, removeClass } = useSite()
  const containerRef = useRef(null)
  const exitingRef = useRef(false)
  const [animated, setAnimated] = useState(false)

  const bodyGalleryClass = collection === 'paintings' ? 'is-peintures' : 'is-sculptures'

  const currentIndex = allWorks.findIndex(w => w.slug === id && w.collection === collection)
  const work = allWorks[currentIndex]
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null

  // Body classes
  useEffect(() => {
    addClass('is-section')
    addClass('is-white')
    addClass(bodyGalleryClass)
    removeClass('is-contact')
    return () => {
      removeClass('is-section')
      removeClass('is-white')
      removeClass(bodyGalleryClass)
    }
  }, [addClass, removeClass, bodyGalleryClass])

  // GSAP enter animation — runs every time id changes
  useEffect(() => {
    if (!containerRef.current) return
    exitingRef.current = false
    setAnimated(true)

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', clearProps: 'all' }
    )
  }, [id])

  // Navigate to prev/next with GSAP exit → onComplete navigates
  const goTo = useCallback((w, dir) => {
    if (!w || exitingRef.current) return
    exitingRef.current = true
    navigateTo(`/${w.collection}/${w.slug}`)
  }, [navigateTo])

  // Close → GSAP fade out → onComplete navigates
  const handleClose = useCallback(() => {
    navigateTo('/?works=1')
  }, [navigateTo])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo(prevWork, 'prev')
      if (e.key === 'ArrowRight') goTo(nextWork, 'next')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prevWork, nextWork, goTo])

  // Hammer swipe
  useEffect(() => {
    if (!containerRef.current) return
    const hammer = new Hammer(containerRef.current)
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10, velocity: 0.3 })
    hammer.on('swipeleft', () => goTo(nextWork, 'next'))
    hammer.on('swiperight', () => goTo(prevWork, 'prev'))
    return () => hammer.destroy()
  }, [prevWork, nextWork, goTo])

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 2) goTo(prevWork, 'prev')
    else goTo(nextWork, 'next')
  }

  if (!work) return null

  return (
    <section className="page">
      {/* Close — fixed, always on top */}
      <a
        className="works-close"
        onClick={handleClose}
        aria-label="Back to Our Work"
        style={{ cursor: 'none' }}
      >
        <div className="cross"><div /><div /></div>
      </a>

      <div className="page--content--center animateIn" ref={containerRef} style={{ opacity: 0 }}>
        <div className="work-single">
          {/* Prev zone — left of image */}
          <div
            className="work-zone work-zone--prev"
            onClick={() => goTo(prevWork, 'prev')}
            style={{ cursor: 'none', pointerEvents: prevWork ? 'auto' : 'none' }}
          />
          <div className="img-container">
            <img
              src={work.src}
              alt={work.title}
              draggable="false"
            />
          </div>
          {/* Next zone — right of image */}
          <div
            className="work-zone work-zone--next"
            onClick={() => goTo(nextWork, 'next')}
            style={{ cursor: 'none', pointerEvents: nextWork ? 'auto' : 'none' }}
          />

          {/* Bottom info */}
          <div className="info-nav">
            <div style={{ flex: 1 }}>
              {prevWork && (
                <a className="ui-prev" onClick={() => goTo(prevWork, 'prev')} style={{ cursor: 'none' }}>prev</a>
              )}
            </div>
            <div style={{ textAlign: 'center', flex: 2 }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7 }}>
                {work.title} — {work.medium}, {work.year}
                {work.dimensions ? ` — ${work.dimensions}` : ''}
              </span>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              {nextWork && (
                <a className="ui-next" onClick={() => goTo(nextWork, 'next')} style={{ cursor: 'none' }}>next</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
