import { useEffect, useRef } from 'react'
import { useSite } from '../context/SiteContext'
import { useLocation } from 'react-router-dom'

export default function Cursor() {
  const dotRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const zoomRef = useRef(null)
  const { addClass, removeClass } = useSite()
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

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      if (isGalleryPage) {
        if (e.clientX < window.innerWidth / 2) {
          addClass('is-prev-over'); removeClass('is-next-over')
        } else {
          addClass('is-next-over'); removeClass('is-prev-over')
        }
      } else if (isDetailPage) {
        // Three zones on image: left third = prev, middle = default dot, right third = next
        const imgEl = e.target.closest('.work-single .img-container img')
        const imgContainer = e.target.closest('.work-single .img-container')
        if (imgEl && imgContainer) {
          const hasPrev = imgContainer.dataset.hasPrev === 'true'
          const hasNext = imgContainer.dataset.hasNext === 'true'
          const rect = imgEl.getBoundingClientRect()
          const x = e.clientX - rect.left
          const third = rect.width / 3
          if (x < third && hasPrev) {
            addClass('is-prev-over'); removeClass('is-next-over')
          } else if (x > third * 2 && hasNext) {
            addClass('is-next-over'); removeClass('is-prev-over')
          } else {
            removeClass('is-prev-over'); removeClass('is-next-over')
          }
        } else {
          removeClass('is-prev-over'); removeClass('is-next-over')
        }
      } else {
        removeClass('is-prev-over')
        removeClass('is-next-over')
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
  }, [isGalleryPage, isDetailPage, addClass, removeClass])

  // Link hover detection
  useEffect(() => {
    const onOver = (e) => {
      const el = e.target
      if (el.closest('a, button, [data-cursor="link"]')) {
        if (el.closest('.overlay-in')) {
          addClass('is-cross-in-over')
          removeClass('is-link-over')
        } else {
          addClass('is-link-over')
          removeClass('is-cross-in-over')
        }
      }
    }
    const onOut = (e) => {
      const el = e.target
      if (el.closest('a, button, [data-cursor="link"]')) {
        removeClass('is-link-over')
        removeClass('is-cross-in-over')
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [addClass, removeClass])

  // Zoom cursor — only on gallery list pages, not on detail/lightbox
  useEffect(() => {
    if (isDetailPage) return
    const onOver = (e) => {
      if (e.target.closest('.work-single .img-container img')) addClass('is-zoom-over')
    }
    const onOut = (e) => {
      if (e.target.closest('.work-single .img-container img')) removeClass('is-zoom-over')
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [isDetailPage, addClass, removeClass])

  // Clean up on page change
  useEffect(() => {
    if (!isGalleryPage && !isDetailPage) {
      removeClass('is-prev-over')
      removeClass('is-next-over')
    }
    removeClass('is-zoom-over')
    removeClass('is-cross-in-over')
  }, [location.pathname, isGalleryPage, isDetailPage, removeClass])

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
