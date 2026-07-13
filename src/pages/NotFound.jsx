import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useSite } from '../context/SiteContext'

// Splits text into word spans, each wrapped in an overflow:hidden clip (site convention)
function SplitWords({ text }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="word-clip">
          <span className="word-inner">{word}</span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

export default function NotFound({ navigateTo }) {
  const { addClass, removeClass } = useSite()
  const [ready, setReady] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    addClass('is-white')
    removeClass('is-peintures')
    removeClass('is-sculptures')
    removeClass('is-section')
    removeClass('is-contact')

    const t = setTimeout(() => setReady(true), 100)
    return () => {
      clearTimeout(t)
      removeClass('is-white')
    }
  }, [addClass, removeClass])

  // GSAP word reveal
  useEffect(() => {
    if (!ready || !headingRef.current) return
    const words = headingRef.current.querySelectorAll('.word-inner')
    gsap.fromTo(
      words,
      { y: '130%' },
      { y: '0%', duration: 1.4, ease: 'power4.out', stagger: 0.08, delay: 0.2,
        onComplete: () => gsap.set(words, { clearProps: 'transform' }) }
    )
  }, [ready])

  const goHome = () => {
    if (navigateTo) navigateTo('/')
  }

  return (
    <section className={`page page-notfound${ready ? ' animateIn' : ''}`}>
      <div className="notfound">
        <p className="notfound-code">404</p>
        <h2 ref={headingRef} className="notfound-heading">
          <SplitWords text="This page could not be found." />
        </h2>
        <button type="button" className="notfound-link" onClick={goHome}>
          Return home
        </button>
      </div>
    </section>
  )
}