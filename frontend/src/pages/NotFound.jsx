import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px'
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 800,
        color: 'var(--primary)',
        lineHeight: 1,
        marginBottom: 16,
        opacity: 0.1
      }}>404</div>
      
      <div className="navbar-logo-mark" style={{ width: 64, height: 64, fontSize: 32, marginBottom: 32 }}>SS</div>
      
      <h1 className="display-md mb-16">Page Not Found</h1>
      <p className="body-lg mb-32" style={{ maxWidth: 480, color: 'var(--on-surface-variant)' }}>
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
      </p>
      
      <div style={{ display: 'flex', gap: 16 }}>
        <button className="btn btn-outline" onClick={() => window.history.back()}>
          Go Back
        </button>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  )
}
