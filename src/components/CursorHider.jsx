import { useEffect } from 'react'

// Sets cursor:none on body/html via JS only — no CSS file, no <style> tag.
// For elements with UA cursor rules (a[href], button), each component sets
// style={{ cursor: 'none' }} directly via React props.
export default function CursorHider() {
  useEffect(() => {
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'

    // Catch any <a href> or <button> added dynamically that we don't own
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return
          node.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
            el.style.cursor = 'none'
          })
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
