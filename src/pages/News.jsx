import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { useSite } from '../context/SiteContext'

const newsItems = [
  {
    title: 'The Gaze Returned',
    subtitle: 'Group Exhibition',
    venue: 'October Gallery, London',
    date: '2018',
    description: 'A survey of West African artists working with figuration and identity.',
    link: null,
  },
  {
    title: 'Colour and Form in Ghanaian Art',
    subtitle: 'Group Exhibition',
    venue: 'National Museum of Ghana, Accra',
    date: '2012',
    description: 'Celebrating five decades of painting in Ghana.',
    link: null,
  },
  {
    title: 'Women of the African Avant-Garde',
    subtitle: 'Group Exhibition',
    venue: 'Serpentine Gallery, London',
    date: '2009',
    description: 'A landmark exhibition reconsidering the contributions of African women artists to modernism.',
    link: null,
  },
  {
    title: 'Roots and Routes',
    subtitle: 'Solo Exhibition',
    venue: 'Ghanatta Gallery, Accra',
    date: '1995',
    description: 'A career retrospective spanning three decades of painting and printmaking.',
    link: null,
  },
  {
    title: 'Commonwealth Artists',
    subtitle: 'Group Exhibition',
    venue: 'Commonwealth Institute, London',
    date: '1971',
    description: 'One of her earliest international showings, alongside artists from across the Commonwealth.',
    link: null,
  },
]

export default function News() {
  const { addClass, removeClass } = useSite()
  const [animated, setAnimated] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    addClass('is-white')
    removeClass('is-peintures')
    removeClass('is-sculptures')
    removeClass('is-section')
    removeClass('is-contact')

    const t = setTimeout(() => setAnimated(true), 200)
    return () => {
      clearTimeout(t)
      removeClass('is-white')
    }
  }, [addClass, removeClass])

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
    <section className={`page page-actualites${animated ? ' animateIn' : ''}`}>
      <div ref={contentRef} className={`page--content ui-content lenis-wrapper${animated ? ' animateIn' : ''}`}>
        <div>
        <ul className="news-title ui-list">
          <li className="separator">
            <span className="news_subtitle">Exhibitions</span>
          </li>

          {newsItems.map((item, i) => (
            <li
              key={i}
              className={activeIndex === i ? 'is-active' : ''}
              onClick={() => setActiveIndex(i)}
            >
              <a style={{ cursor: 'none' }}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side info panels */}
        <ul className="news-infos">
          {newsItems.map((item, i) => (
            <li key={i} className={activeIndex === i ? 'is-active' : ''}>
              <p>{item.venue}</p>
              <p>{item.date}</p>
              <p>{item.description}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  View more
                </a>
              )}
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  )
}
