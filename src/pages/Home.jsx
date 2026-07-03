import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Hammer from 'hammerjs'
import Lenis from '@studio-freight/lenis'
import { useSite } from '../context/SiteContext'
import { paintings, drawings } from '../data/artworks'

const allWorks = [
  ...paintings.map(w => ({ ...w, collection: 'paintings' })),
  ...drawings.map(w => ({ ...w, collection: 'drawings' })),
]

function SplitChars({ text }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} className="nav-char" style={{ '--i': i }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

// Phases: 'hero' | 'exiting' | 'works' | 'returning'
export default function Home({ navigateTo }) {
  const { addClass, removeClass, scrollToTopRef, goToWorksRef } = useSite()
  const location = useLocation()
  const startOnWorks = new URLSearchParams(location.search).get('works') === '1'
  const initialPhase = startOnWorks ? 'works' : 'hero'
  const [phase, setPhase] = useState(initialPhase)
  const phaseRef = useRef(initialPhase)
  const heroRef = useRef(null)
  const worksWrapRef = useRef(null)
  const lenisRef = useRef(null)
  const worksScrollY = useRef(0)
  const exitTimerRef = useRef(null)

  // Local overlay state — true = covering, false = lifted
  const [covering, setCovering] = useState(false)
  // Direction ref so onTransitionEnd knows what just finished
  const coverDirectionRef = useRef(null) // 'covering' | 'lifting'
  // Callback to run once overlay fully covers
  const onCoveredCallbackRef = useRef(null)

  const setPhaseSync = (p) => { phaseRef.current = p; setPhase(p) }

  useEffect(() => {
    removeClass('is-peintures')
    removeClass('is-sculptures')
    removeClass('is-white')
    removeClass('is-section')
    removeClass('is-contact')
    removeClass('is-hero-exiting')
    addClass('is-home')

    if (startOnWorks) {
      addClass('is-home-works')
    } else {
      removeClass('is-home-works')
    }

    const t1 = setTimeout(() => addClass('is-on'), 50)
    const t2 = setTimeout(() => addClass('is-loaded'), 300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      removeClass('is-home')
      removeClass('is-hero-exiting')
      removeClass('is-home-works')
    }
  }, [addClass, removeClass])

  // Called when local overlay's CSS transition ends
  const handleCoverTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'transform') return

    if (coverDirectionRef.current === 'covering') {
      // Overlay has FULLY covered the screen — safe to swap content
      coverDirectionRef.current = 'lifting'
      if (onCoveredCallbackRef.current) {
        onCoveredCallbackRef.current()
        onCoveredCallbackRef.current = null
      }
      // Lift the overlay
      setCovering(false)
    }
    // 'lifting' end — nothing to do
  }, [])

  // Trigger the local overlay to cover, run callback when fully covered
  const coverScreen = useCallback((onCovered) => {
    onCoveredCallbackRef.current = onCovered
    coverDirectionRef.current = 'covering'
    setCovering(true)
  }, [])

  // ── FORWARD: hero → works ──
  const startExit = useCallback(() => {
    if (phaseRef.current !== 'hero') return
    setPhaseSync('exiting')

    // Step 1: chars fade out
    addClass('is-hero-exiting')

    // Step 2: once chars are gone, cover screen then swap
    exitTimerRef.current = setTimeout(() => {
      exitTimerRef.current = null
      coverScreen(() => {
        // Runs exactly when overlay fully covers — swap content underneath
        setPhaseSync('works')
        addClass('is-home-works')
        removeClass('is-hero-exiting')
        if (worksWrapRef.current) worksWrapRef.current.scrollTop = 0
      })
    }, 2800)

    return () => { clearTimeout(exitTimerRef.current); exitTimerRef.current = null }
  }, [addClass, removeClass, coverScreen])

  // ── CANCEL: exiting → hero (scroll up during text fade) ──
  const cancelExit = useCallback(() => {
    if (phaseRef.current !== 'exiting') return
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current)
      exitTimerRef.current = null
    }
    removeClass('is-hero-exiting')
    setPhaseSync('hero')
  }, [removeClass])

  // ── REVERSE: works → hero ──
  const startReturn = useCallback(() => {
    if (phaseRef.current !== 'works') return
    setPhaseSync('returning')

    coverScreen(() => {
      // Runs exactly when overlay fully covers — restore hero underneath
      setPhaseSync('hero')
      removeClass('is-home-works')
      // Reset line + chars to hidden state so they can animate back in
      addClass('is-hero-exiting')
      removeClass('is-loaded')

      // One rAF so browser paints the reset, then animate everything back in
      requestAnimationFrame(() => requestAnimationFrame(() => {
        addClass('is-loaded')
        setTimeout(() => removeClass('is-hero-exiting'), 600)
      }))
    })
  }, [addClass, removeClass, coverScreen])

  // Register scroll-to-top handler so nav "Home" click works from works phase
  useEffect(() => {
    scrollToTopRef.current = () => {
      if (phaseRef.current === 'works') {
        startReturn()
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    return () => { scrollToTopRef.current = null }
  }, [scrollToTopRef, startReturn])

  // Register goToWorks handler so nav "Our Work" click works from anywhere on Home
  useEffect(() => {
    goToWorksRef.current = () => {
      if (phaseRef.current === 'hero' || phaseRef.current === 'exiting') {
        startExit()
      }
      // Already in works/returning — do nothing
    }
    return () => { goToWorksRef.current = null }
  }, [goToWorksRef, startExit])

  // Wheel on hero (desktop)
  useEffect(() => {
    const el = heroRef.current
    if (!el || phase !== 'hero') return
    const onWheel = (e) => {
      if (e.deltaY > 0) { e.preventDefault(); startExit() }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [phase, startExit])

  // Wheel up during exit — cancel and restore hero
  useEffect(() => {
    const el = heroRef.current
    if (!el || phase !== 'exiting') return
    const onWheel = (e) => {
      if (e.deltaY < 0) { e.preventDefault(); cancelExit() }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [phase, cancelExit])

  // Hammer on hero (touch)
  useEffect(() => {
    const el = heroRef.current
    if (!el || phase !== 'hero') return
    const hammer = new Hammer.Manager(el)
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 20 }))
    hammer.on('panup', () => startExit())
    return () => hammer.destroy()
  }, [phase, startExit])

  // Hammer pan-down during exit (touch) — cancel and restore hero
  useEffect(() => {
    const el = heroRef.current
    if (!el || phase !== 'exiting') return
    const hammer = new Hammer.Manager(el)
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 20 }))
    hammer.on('pandown', () => cancelExit())
    return () => hammer.destroy()
  }, [phase, cancelExit])

  // Scroll on works section
  useEffect(() => {
    const el = worksWrapRef.current
    if (!el || phase !== 'works') return

    worksScrollY.current = 0
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    if (isTouch) {
      // JS-driven scroll. Native overflow scroll is unreliable inside the
      // overflow:hidden ancestor chain, so we move the content ourselves with
      // transform:translate3d and apply exponential velocity decay for a slow,
      // icy Lenis-like coast (~3–5s) on finger lift.
      el.style.position = 'fixed'
      el.style.top = '0'
      el.style.left = '0'
      el.style.width = '100%'
      el.style.height = '100%'
      el.style.overflowY = 'hidden'

      const content = el.firstElementChild
      content.style.willChange = 'transform'

      // Lenis-style model: a `target` we push toward with the finger, and an
      // actual `scroll` that eases toward `target` EVERY frame. The rAF loop
      // never stops, so both the drag and the coast are smoothed the same way.
      // A big LERP-per-frame that's small => long, icy glide.
      let target = 0
      let scroll = 0
      let running = true
      let dragging = false
      let downFromTop = false
      let lastY = 0

      const maxScroll = () =>
        Math.max(0, content.scrollHeight - el.clientHeight)

      // Smoothing per frame. Lower = slower/smoother/longer glide.
      // 0.05 ≈ very icy (several seconds to settle); 0.12 ≈ snappier.
      const EASE = 0.10
      // Below this gap we consider it arrived.
      const SETTLE = 0.1

      const clamp = (v) => {
        if (v < 0) return 0
        const max = maxScroll()
        return v > max ? max : v
      }

      const frame = () => {
        if (!running) return
        // Ease actual position toward the target every frame.
        const diff = target - scroll
        if (Math.abs(diff) > SETTLE) {
          scroll += diff * EASE
        } else {
          scroll = target
        }
        content.style.transform = `translate3d(0, ${-scroll}px, 0)`
        worksScrollY.current = scroll
        rafRef = requestAnimationFrame(frame)
      }
      let rafRef = requestAnimationFrame(frame)

      const onTouchStart = (e) => {
        dragging = true
        // Touching while it's still gliding: freeze it where it visually is,
        // so a new touch stops the coast immediately.
        target = scroll
        lastY = e.touches[0].clientY
        downFromTop = scroll <= 0.5
      }

      const onTouchMove = (e) => {
        if (!dragging) return
        e.preventDefault()
        const y = e.touches[0].clientY
        const dy = y - lastY // finger down (positive) => scroll up (toward top)
        lastY = y

        // Pulling down while already at the very top: leave it, let touchend
        // decide whether to startReturn().
        if (downFromTop && target <= 0.5 && dy > 0) return
        downFromTop = false

        // Push the TARGET, not the actual scroll. Multiplier controls how far
        // the content travels per unit of finger travel while dragging. >1 makes
        // a swipe throw the target ahead of the finger, so momentum carries after
        // release without any velocity bookkeeping.
        target = clamp(target - dy * 1.0)
      }

      const onTouchEnd = () => {
        if (!dragging) return
        dragging = false
        if (downFromTop && scroll <= 1) {
          startReturn()
        }
        // Nothing else to do: the frame loop keeps easing `scroll` toward the
        // `target` we already threw ahead, producing the long coast.
      }

      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchmove', onTouchMove, { passive: false })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
      el.addEventListener('touchcancel', onTouchEnd, { passive: true })

      content.style.transform = 'translate3d(0, 0, 0)'

      return () => {
        running = false
        cancelAnimationFrame(rafRef)
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchmove', onTouchMove)
        el.removeEventListener('touchend', onTouchEnd)
        el.removeEventListener('touchcancel', onTouchEnd)
        el.style.position = ''
        el.style.top = ''
        el.style.left = ''
        el.style.width = ''
        el.style.height = ''
        el.style.overflowY = ''
        content.style.transform = ''
        content.style.willChange = ''
        worksScrollY.current = 0
      }
    }

    // Desktop — Lenis smooth wheel scroll
    const easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild,
      duration: 5,
      easing,
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.4,
    })
    lenis.scrollTo(0, { immediate: true })
    lenis.on('scroll', ({ scroll }) => { worksScrollY.current = scroll })
    lenisRef.current = lenis

    let rafId
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      worksScrollY.current = 0
    }
  }, [phase, startReturn])

  // Wheel on works — scroll up at top → back to hero (desktop only)
  useEffect(() => {
    const el = worksWrapRef.current
    if (!el || phase !== 'works') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onWheel = (e) => {
      if (e.deltaY < 0 && worksScrollY.current <= 5) {
        e.preventDefault()
        e.stopPropagation()
        startReturn()
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => el.removeEventListener('wheel', onWheel, { capture: true })
  }, [phase, startReturn])

  const [worksExiting, setWorksExiting] = useState(false)

  const handleWorkClick = (work) => {
    if (worksExiting) return
    setWorksExiting(true)

    // Items + label exit via CSS stagger, then navigateTo fires its own overlay
    const t = setTimeout(() => {
      navigateTo(`/${work.collection}/${work.slug}`)
    }, 900)

    return () => clearTimeout(t)
  }

  const showHero = phase === 'hero' || phase === 'exiting'
  const showWorks = phase === 'works' || phase === 'returning'

  return (
    <section className="page page-home">

      {/* Local overlay — fully controlled by React, no body-class conflicts */}
      <div
        className={`home-cover${covering ? ' home-cover--in' : ''}`}
        onTransitionEnd={handleCoverTransitionEnd}
      />

      {/* ── HERO ── */}
      <div
        ref={heroRef}
        className="home-hero"
        style={{ opacity: showHero ? 1 : 0, pointerEvents: showHero ? 'auto' : 'none' }}
      >
        <div className="home-hero-bg" style={{ backgroundImage: `url('/images/hero.jpg')` }} />
        <div className="home-hero-center">
          <p className="home-hero-title">
            <SplitChars text="marigold akufo-addo" />
          </p>
          <div className="home-hero-line" />
        </div>
      </div>

      {/* ── OUR WORK ── */}
      <div
        ref={worksWrapRef}
        className={`home-works-wrapper${worksExiting ? ' works-exiting' : ''}`}
        style={{ opacity: showWorks ? 1 : 0, pointerEvents: showWorks ? 'auto' : 'none', zIndex: showWorks ? 3 : 1 }}
      >
        <div className="home-works-content">
          <div className="home-works">
            <div className="home-works-left">
              {allWorks.map((work, idx) => (
                <div
                  key={`${work.collection}-${work.slug}`}
                  className="home-work-item"
                  data-cursor="link"
                  onClick={() => handleWorkClick(work)}
                  style={{ '--item-i': idx }}
                >
                  <div className="home-work-img">
                    <img src={work.src} alt={work.title} loading={idx < 3 ? 'eager' : 'lazy'} draggable="false" />
                  </div>
                  <span className="home-work-caption">{work.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sticky label */}
        <div className="home-works-right">
          <p className="home-works-label">
            {'Work'.split('').map((c, i) => (
              <span key={i} className="label-char" style={{ '--i': i }}>{c === ' ' ? '\u00A0' : c}</span>
            ))}
          </p>
          <div className="home-works-line" />
        </div>
      </div>

    </section>
  )
}