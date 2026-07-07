import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lenis from '@studio-freight/lenis'
import { useSite } from '../context/SiteContext'

function SplitWords({ text }) {
  return (
    <>
      {text.split(' ').map((word, i, arr) => (
        <span key={i} className="word-clip">
          <span className="word-inner">{word}</span>
          {i < arr.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

const paragraphs = [
  'Marigold Akufo-Addo has been painting since a very early age. Her art exhibition in 1968, her debut was sensational as only men were exhibiting at that time. The daily graphic in 1980 described her as a trail layer!',
  'She went to the Central School of Art and Design London, and then to Slade School of Fine Art, University Coll. London.',
  'She believes that "Fine Art" is the engine of growth and has directives to fuel development. She upholds that "it is the Artist that can delve into the past and harness it with the present to create a vision for the future".',
  'As a visionary painter, she uses mixed media, acrylic, and oil. She is recognised for building up her canvas in one eight of an inch square. She has worked at Ghana Museum and Monuments. She has exhibited in spaces including Africa House in Convent gardens, Event Participation at Cochrane Gallery, Bintumani Hotel, Sierra Leone, Signature Gallery, Omanye House, The Museum Parliament House, Cape Town, The Dei Centre. Marigold Akufo-Addo served on the Commission of Culture from 2003–2007. She established Lamra Studios and Lamra Galleries in 1975.',
  'At present Marigold Akufo-Addo is the chairperson of the "Creative Industries Project Ghana" a think tank that advocates the creative sector\'s crucial role in the nation\'s development.',
  'She founded \'Kasa Fie\' in 2012. A foundation that uses art as a therapeutic and transformative force for children living with autism and the physically challenged.',
  'She is a member of the Black Stars – Art District. Marigold Akufo-Addo is currently cultivating a monumental and multidisciplinary Art Installation "Kasa".',
  'On 17th August 2023, Oseadeeyo Nana Kwesi Akuffo III enstooled Marigold Akufo-Addo as a queen titled "Oyententu" Nana Abena Oye Okoboahene Dehye, Okuapeman (Royal Envoy, Plenipotentiary).',
]

export default function About() {
  const { addClass, removeClass } = useSite()
  const [ready, setReady] = useState(false)
  const contentRef = useRef(null)
  const textRef = useRef(null)
  const imgRef = useRef(null)
  const sigRef = useRef(null)

  useEffect(() => {
    addClass('is-white')
    removeClass('is-peintures')
    removeClass('is-sculptures')
    removeClass('is-section')
    removeClass('is-contact')

    const t = setTimeout(() => setReady(true), 200)
    return () => {
      clearTimeout(t)
      removeClass('is-white')
    }
  }, [addClass, removeClass])

  // GSAP word reveal + signature after text settles
  useEffect(() => {
    if (!ready || !textRef.current) return
    const words = textRef.current.querySelectorAll('.word-inner')
    gsap.fromTo(
      words,
      { y: '130%' },
      { y: '0%', duration: 1.0, ease: 'power4.out', stagger: 0.01, delay: 0.2,
        onComplete: () => {
          if (!sigRef.current) return
          gsap.fromTo(
            sigRef.current,
            { opacity: 0, y: 16, scaleX: 0.85, transformOrigin: 'left center' },
            { opacity: 1, y: 0, scaleX: 1, duration: 1.4, ease: 'power3.out', delay: 0.2 }
          )
        }
      }
    )
  }, [ready])

  // GSAP image reveal
  useEffect(() => {
    if (!ready || !imgRef.current) return
    gsap.fromTo(
      imgRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.6 }
    )
  }, [ready])

  // Lenis smooth scroll
  useEffect(() => {
    const el = contentRef.current
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
    <section className={`page page-a-propos${ready ? ' animateIn' : ''}`}>
      <div ref={contentRef} className={`page--content ui-content lenis-wrapper${ready ? ' animateIn' : ''}`}>
        <div className="about-layout">
          {/* Left — bio text */}
          <div className="about-text-col">
            <p ref={textRef} className="about-bio is-black">
              {paragraphs.map((para, i) => (
                <span key={i} className="about-para">
                  <SplitWords text={para} />
                  {i < paragraphs.length - 1 && <><br /><br /></>}
                </span>
              ))}
            </p>
            <div ref={sigRef} className="about-signature" style={{ opacity: 0 }}>
              <img src="/images/signature.jpeg" alt="Marigold Akufo-Addo signature" draggable="false" />
            </div>
          </div>

          {/* Right — artist photo */}
          <div className="about-photo-col">
            <div ref={imgRef} className="about-photo-wrap" style={{ opacity: 0 }}>
              <img src="/images/Marigold.jpeg" alt="Marigold Akufo-Addo" className="about-photo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
