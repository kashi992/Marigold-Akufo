import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { useSite } from '../context/SiteContext'

export default function Gallery({ works, type, navigateTo }) {
  const { addClass, removeClass } = useSite()
  const [animated, setAnimated] = useState(false)
  const [exiting, setExiting] = useState(false)
  const contentRef = useRef(null)

  const isPeint = type === 'peintures'
  const pageClass = isPeint ? 'page-peintures' : 'page-sculptures'
  const contentClass = isPeint ? 'peintures-content' : 'sculptures-content'
  const bodyClass = isPeint ? 'is-peintures' : 'is-sculptures'
  const basePath = isPeint ? '/paintings' : '/drawings'

  useEffect(() => {
    addClass(bodyClass)
    removeClass('is-white')
    removeClass('is-section')
    removeClass('is-contact')
    removeClass(isPeint ? 'is-sculptures' : 'is-peintures')
    const t = setTimeout(() => setAnimated(true), 200)
    return () => {
      clearTimeout(t)
      removeClass(bodyClass)
      removeClass('is-exit')
    }
  }, [addClass, removeClass, bodyClass, isPeint])

  const handleItemClick = (work) => {
    if (exiting) return
    setExiting(true)

    // Step 1: hide letters + items exit (stagger via CSS)
    addClass('is-exit')

    // Step 2: after items exit, white overlay covers screen
    setTimeout(() => {
      addClass('is-transition')

      // Step 3: navigate once overlay has covered screen
      setTimeout(() => {
        navigateTo(`${basePath}/${work.slug}`)
        setTimeout(() => {
          removeClass('is-transition')
          removeClass('is-exit')
        }, 500)
      }, 2000)
    }, 800)
  }

  // Lenis smooth scroll
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild,
      duration: 3.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  return (
    <section className={`page ${pageClass}${animated ? ' animateIn' : ''}${exiting ? ' exit' : ''}`}>
      <div className={`page--content ui-content lenis-wrapper${animated ? ' animateIn' : ''}`} ref={contentRef}>
        <div className={contentClass}>
          {works.map((work) => (
            <a key={work.slug} onClick={() => handleItemClick(work)} style={{ cursor: 'none' }}>
              <div className="ui-viewport">
                <div className="img-content">
                  <div className="img-container" style={{ backgroundImage: `url(${work.src})` }} />
                </div>
                <span className="title-art">{work.title} — {work.dimensions}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
