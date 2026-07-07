import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function Cursor() {
  const dotRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const zoomRef = useRef(null)
  const location = useLocation()

  const isGalleryPage = location.pathname === '/paintings' || location.pathname === '/drawings'
  const isDetailPage =
    location.pathname.startsWith('/paintings/') || location.pathname.startsWith('/drawings/')

  // Mouse tracking + prev/next detection
  useEffect(() => {
    const mouse = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    const lerp = (a, b, t) => a + (b - a) * t
    let raf

    const b = document.body
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      if (isDetailPage) {
        if (e.target.closest('.work-zone--prev')) {
          b.classList.add('is-prev-over'); b.classList.remove('is-next-over')
        } else if (e.target.closest('.work-zone--next')) {
          b.classList.add('is-next-over'); b.classList.remove('is-prev-over')
        } else {
          b.classList.remove('is-prev-over'); b.classList.remove('is-next-over')
        }
      } else {
        b.classList.remove('is-prev-over')
        b.classList.remove('is-next-over')
      }
    }

    const render = () => {
      // Lerp cursor towards mouse — 0.12 = smooth lag, increase for faster
      pos.x = lerp(pos.x, mouse.x, 0.12)
      pos.y = lerp(pos.y, mouse.y, 0.12)

      const px = pos.x + 'px'
      const py = pos.y + 'px'
      if (dotRef.current) {
        dotRef.current.style.left = px
        dotRef.current.style.top = py
      }
      if (prevRef.current) {
        prevRef.current.style.left = px
        prevRef.current.style.top = py
      }
      if (nextRef.current) {
        nextRef.current.style.left = px
        nextRef.current.style.top = py
      }
      if (zoomRef.current) {
        zoomRef.current.style.left = px
        zoomRef.current.style.top = py
      }
      raf = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(render)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isDetailPage])

  // Link hover detection via mousemove + elementFromPoint — checks exactly what's under cursor
  useEffect(() => {
    const b = document.body
    const onMove = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return
      if (el.closest('[data-cursor="works-cross"]')) {
        b.classList.add('is-works-cross-over')
        b.classList.remove('is-link-over')
        b.classList.remove('is-cross-in-over')
      } else if (el.closest('.works-close')) {
        b.classList.remove('is-works-cross-over')
        b.classList.add('is-cross-in-over')
        b.classList.remove('is-link-over')
      } else if (el.closest('nav.primary-nav a, nav.mobile-menu a, footer a, .contact-link')) {
        // Nav items and social icons — show OS pointer + keep ring visible
        b.classList.remove('is-no-cursor')
        b.classList.remove('is-link-over')
        b.classList.remove('is-cross-in-over')
        b.classList.remove('is-works-cross-over')
      } else if (el.closest('a, button, [data-cursor="link"]')) {
        b.classList.remove('is-no-cursor')
        b.classList.add('is-link-over')
        b.classList.remove('is-cross-in-over')
        b.classList.remove('is-works-cross-over')
      } else {
        b.classList.remove('is-no-cursor')
        b.classList.remove('is-link-over')
        b.classList.remove('is-cross-in-over')
        b.classList.remove('is-works-cross-over')
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  // Zoom cursor
  useEffect(() => {
    if (isDetailPage) return
    const b = document.body
    const onOver = (e) => { if (e.target.closest('.work-single .img-container img')) b.classList.add('is-zoom-over') }
    const onOut = (e) => { if (e.target.closest('.work-single .img-container img')) b.classList.remove('is-zoom-over') }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [isDetailPage])

  // Clean up on page change
  useEffect(() => {
    const b = document.body
    b.classList.remove('is-prev-over', 'is-next-over', 'is-zoom-over', 'is-cross-in-over', 'is-link-over', 'is-no-cursor', 'is-works-cross-over')
  }, [location.pathname])

  return (
    <div className="cursor-container" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot">
        <div className="cross-h" />
        <div className="cross-v" />
      </div>
      <div ref={prevRef} className="cursor-prev-word">prev</div>
      <div ref={nextRef} className="cursor-next-word">next</div>
      <div ref={zoomRef} className="cursor-zoom">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M49.998,0L27,36.498l46,0.004L49.998,0z M50.004,100L73,63.502l-46-0.004L50.004,100z" />
        </svg>
      </div>
    </div>
  )
}
