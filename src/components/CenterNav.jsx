import { useSite } from '../context/SiteContext'

export default function CenterNav({ navigateTo }) {
  const { addClass, removeClass, bodyClasses } = useSite()

  // is-off hides the nav on white pages (about, news, contact, works detail)
  // On gallery pages (is-peintures/is-sculptures) the CSS moves the nav to the side — no is-off
  const isOff = bodyClasses.has('is-white')

  return (
    <>
      <nav className={`center-nav${isOff ? ' is-off' : ''}`}>
        {/* Paintings link — left side */}
        <div className="center-links peint-link">
          <a
            onClick={() => navigateTo('/paintings')}
            style={{ cursor: 'none' }}
            onMouseEnter={() => addClass('is-peint-over')}
            onMouseLeave={() => removeClass('is-peint-over')}
          >
            P
            <span className="is-full">
              <div>a</div>
              <div>i</div>
              <div>n</div>
              <div>t</div>
              <div>i</div>
              <div>n</div>
              <div>g</div>
              <div>s</div>
            </span>
          </a>
        </div>

        {/* Drawings link — right side */}
        <div className="center-links sculpt-link">
          <div className="sculpt-container">
            <a
              onClick={() => navigateTo('/drawings')}
              style={{ cursor: 'none' }}
              onMouseEnter={() => addClass('is-sculpt-over')}
              onMouseLeave={() => removeClass('is-sculpt-over')}
            >
              D
              <span className="is-full">
                <div>r</div>
                <div>a</div>
                <div>w</div>
                <div>i</div>
                <div>n</div>
                <div>g</div>
                <div>s</div>
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Separator line */}
      <div className="line-container">
        <span className="line" />
      </div>
    </>
  )
}
