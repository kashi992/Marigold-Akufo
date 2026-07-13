import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lenis from '@studio-freight/lenis'
import { useSite } from '../context/SiteContext'

// Splits text into word spans, each wrapped in an overflow:hidden clip
function SplitWords({ text }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word-clip">
          <span className="word-inner">{word}</span>
          {i < text.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

export default function Contact() {
  const { addClass, removeClass } = useSite()
  const h2Ref = useRef(null)
  const scrollRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    addClass('is-white')
    addClass('is-contact')
    removeClass('is-peintures')
    removeClass('is-sculptures')
    removeClass('is-section')

    const t = setTimeout(() => setReady(true), 100)
    return () => {
      clearTimeout(t)
      removeClass('is-white')
      removeClass('is-contact')
    }
  }, [addClass, removeClass])

  // GSAP word reveal once mounted
  useEffect(() => {
    if (!ready || !h2Ref.current) return
    const words = h2Ref.current.querySelectorAll('.word-inner')
    gsap.fromTo(
      words,
      { y: '130%' },
      { y: '0%', duration: 1.6, ease: 'power4.out', stagger: 0.12, delay: 0.2, onComplete: () => gsap.set(words, { clearProps: 'transform' }) }
    )
  }, [ready])

  // Lenis smooth scroll — initialise only AFTER the page is ready and fonts are
  // loaded, so Lenis measures a stable, final content height. Initialising while the
  // transition overlay covers the page / the heading is still animating / fonts are
  // swapping causes Lenis to capture a too-short height and lock scrolling (the
  // intermittent "can't scroll" bug).
  useEffect(() => {
    if (!ready) return
    const el = scrollRef.current
    if (!el) return

    let lenis
    let rafId
    let ro
    let cancelled = false

    const start = () => {
      if (cancelled) return
      lenis = new Lenis({
        wrapper: el,
        content: el.firstElementChild,
        duration: 5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.4,
        touchMultiplier: 0.8,
      })
      const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)

      // Force Lenis to re-measure on the next several frames. Lenis can lock scrolling
      // if it captures a too-short content height on init (before layout/fonts fully
      // settle); once it owns the wheel it blocks native scroll, so we must make sure
      // it re-measures until it sees the real, scrollable height.
      let frame = 0
      const nudge = () => {
        if (cancelled || !lenis) return
        lenis.resize()
        frame += 1
        // Keep nudging for ~30 frames (~0.5s) — cheap, and guarantees a correct measure.
        if (frame < 30) requestAnimationFrame(nudge)
      }
      requestAnimationFrame(nudge)

      // Keep Lenis in sync whenever the content box actually changes size.
      const resize = () => lenis && lenis.resize()
      ro = new ResizeObserver(resize)
      if (el.firstElementChild) ro.observe(el.firstElementChild)
      window.addEventListener('resize', resize)
      lenis.__cleanupResize = () => window.removeEventListener('resize', resize)
    }

    // Wait for fonts (portrait/serif) so line-wrapping — and therefore height — is final.
    const fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve()
    // Two rAFs guarantee the page has painted at its real position (overlay lifted).
    fontsReady.then(() => requestAnimationFrame(() => requestAnimationFrame(start)))

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      if (ro) ro.disconnect()
      if (lenis) { lenis.__cleanupResize && lenis.__cleanupResize(); lenis.destroy() }
    }
  }, [ready])

  return (
    <section className="page page-contact">
      <div ref={scrollRef} className="contact-scroll-wrapper">
        <div className="contact">
          <p className="contact-eyebrow">Artworks Consultation</p>
          <h2 ref={h2Ref}>
            <SplitWords text="If you would like to make a general enquiry or book an appointment, please fill in the form below and we will be in touch." />
          </h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="contact-form-row">
              <input type="text" placeholder="First Name" className="contact-input" required />
              <input type="text" placeholder="Last Name" className="contact-input" required />
            </div>
            <div className="contact-form-row">
              <input type="email" placeholder="Email" className="contact-input" required />
              <input type="tel" placeholder="Phone" className="contact-input" />
            </div>
            <select className="contact-input contact-select" defaultValue="">
              <option value="" disabled>Preferred Consultation Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
            <select className="contact-input contact-select" defaultValue="">
              <option value="" disabled>Select Preferred Location</option>
              <option value="accra">Accra</option>
              <option value="london">London</option>
            </select>
            <textarea placeholder="Message" className="contact-input contact-textarea" rows={5} required />
            <p className="contact-privacy">We respect your privacy and will only use your information to respond to your enquiry.</p>
            <hr className="contact-divider" />
            <button type="submit" className="contact-submit">Book Bespoke Consultation</button>
          </form>
        </div>
      </div>
    </section>
  )
}