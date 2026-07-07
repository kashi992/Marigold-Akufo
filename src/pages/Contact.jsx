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

  // Lenis smooth scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild,
      duration: 5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.4,
      touchMultiplier: 0.8,
    })
    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

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
