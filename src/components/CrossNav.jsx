export default function CrossNav({ navigateTo }) {
  return (
    <nav className="cross-nav">
      {/* Back button shown on /paintings page — right side */}
      <div className="peint-cross">
        <a
          onClick={() => navigateTo('/')}
          style={{ cursor: 'none' }}
          aria-label="Back to home"
        >
          <div className="cross">
            <div />
            <div />
          </div>
        </a>
      </div>

      {/* Back button shown on /drawings page — left side */}
      <div className="sculpt-cross">
        <a
          onClick={() => navigateTo('/')}
          style={{ cursor: 'none' }}
          aria-label="Back to home"
        >
          <div className="cross">
            <div />
            <div />
          </div>
        </a>
      </div>
    </nav>
  )
}
