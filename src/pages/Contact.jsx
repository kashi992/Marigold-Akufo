import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
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
  const copyrightRef = useRef(null)
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
      { y: '0%', duration: 1.6, ease: 'power4.out', stagger: 0.12, delay: 0.2 }
    )
  }, [ready])

  return (
    <section className="page page-contact">
      <div className="contact">
        <h2 ref={h2Ref}>
          <SplitWords text="Feel free to" />
          {' '}
          <span className="word-clip">
            <a 
            href='mailto:marigoldakufoaddo@gmail.com'
              className="word-inner contact-link"
              role="link"
              tabIndex={0}
              data-cursor="link"
              style={{ cursor: 'default' }}
              onTouchEnd={(e) => { e.preventDefault(); window.location.href = 'mailto:marigoldakufoaddo@gmail.com' }}
              onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = 'mailto:marigoldakufoaddo@gmail.com' }}
            >
              get in touch
            </a>
          </span>
          {',\u00A0'}
          <br />
          <SplitWords text="for any enquiry or information." />
        </h2>
      </div>
      <div ref={copyrightRef} className="copyright">
        <p>&copy; {new Date().getFullYear()} Marigold Akufo-Addo. All rights reserved.</p>
      </div>
    </section>
  )
}
