import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [bodyClasses, setBodyClasses] = useState(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  // Pages can register a custom "go to top" handler (e.g. Home uses startReturn)
  const scrollToTopRef = useRef(null)
  // Home registers startExit here so nav can trigger the works transition from anywhere
  const goToWorksRef = useRef(null)

  const addClass = useCallback((cls) => {
    setBodyClasses(prev => {
      if (prev.has(cls)) return prev
      const next = new Set(prev)
      next.add(cls)
      return next
    })
  }, [])

  const removeClass = useCallback((cls) => {
    setBodyClasses(prev => {
      if (!prev.has(cls)) return prev
      const next = new Set(prev)
      next.delete(cls)
      return next
    })
  }, [])

  const toggleClass = useCallback((cls, bool) => {
    if (bool) {
      addClass(cls)
    } else {
      removeClass(cls)
    }
  }, [addClass, removeClass])

  useEffect(() => {
    document.body.className = Array.from(bodyClasses).join(' ')
  }, [bodyClasses])

  return (
    <SiteContext.Provider value={{
      bodyClasses,
      addClass,
      removeClass,
      toggleClass,
      isLoaded,
      setIsLoaded,
      currentPage,
      setCurrentPage,
      scrollToTopRef,
      goToWorksRef,
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
