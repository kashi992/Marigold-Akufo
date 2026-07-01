import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Force hide OS cursor on ALL elements including <a> and <button>
// cursor: inherit !important on * forces inheritance from :root, overriding UA stylesheet's cursor: pointer on <a>
;(function () {
  const s = document.createElement('style')
  s.textContent = ':root { cursor: none !important } * { cursor: inherit !important }'
  document.head.insertBefore(s, document.head.firstChild)
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
