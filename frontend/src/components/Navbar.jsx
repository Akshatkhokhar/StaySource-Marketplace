import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleAnchorClick = (e, hash) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#' + hash)
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          {!isAuthenticated ? (
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-mark">SS</div>
              <span className="navbar-logo-text" style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.02em', fontSize: 22 }}>
                <span style={{ fontWeight: 800, color: '#1A2E4A' }}>Stay</span>
                <span style={{ fontWeight: 800, color: '#C8A951' }}>Source</span>
              </span>
            </Link>
          ) : (
            <div className="navbar-logo" style={{ cursor: 'default' }}>
              <div className="navbar-logo-mark">SS</div>
              <span className="navbar-logo-text" style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.02em', fontSize: 22 }}>
                <span style={{ fontWeight: 800, color: '#1A2E4A' }}>Stay</span>
                <span style={{ fontWeight: 800, color: '#C8A951' }}>Source</span>
              </span>
            </div>
          )}

          {/* Nav links */}
          <div className="navbar-nav">
            {(isAuthenticated && user?.role === 'vendor') && (
               <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
            )}
            {(isAuthenticated && user?.role === 'hotel_owner') && (
               <>
                  <Link to="/vendors" className={`nav-link ${isActive('/vendors')}`}>Browse Market</Link>
                  <Link to="/buyer-dashboard" className={`nav-link ${isActive('/buyer-dashboard')}`}>Messages</Link>
                  <Link to="/saved-vendors" className={`nav-link ${isActive('/saved-vendors')}`}>Saved Vendors</Link>
               </>
            )}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
              </>
            ) : (
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }} 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                    {user?.full_name?.charAt(0) || user?.company_name?.charAt(0) || 'U'}
                  </div>
                  {user?.full_name || user?.company_name || 'My Account'}
                  <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_drop_down</span>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    background: '#fff',
                    borderRadius: 6,
                    boxShadow: 'var(--shadow-elevated)',
                    border: '1px solid var(--outline-variant)',
                    minWidth: 180,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    {user?.role === 'vendor' ? (
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--on-surface)', display: 'block', textDecoration: 'none', borderBottom: '1px solid var(--outline-variant)' }}>My Dashboard</Link>
                    ) : (
                      <Link to="/buyer-dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--on-surface)', display: 'block', textDecoration: 'none', borderBottom: '1px solid var(--outline-variant)' }}>Buyer Dashboard</Link>
                    )}
                    <Link to="/saved-vendors" className="dropdown-item" onClick={() => setDropdownOpen(false)} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--on-surface)', display: 'block', textDecoration: 'none', borderBottom: '1px solid var(--outline-variant)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--gold)' }}>bookmark</span>
                         Saved Vendors
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item"
                      style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--error)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="navbar-mobile-toggle btn btn-ghost"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-icons-round">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            padding: '16px 0 24px',
            borderTop: '1px solid rgba(196,198,206,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {(isAuthenticated && user?.role === 'vendor') && (
               <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            )}
            {(isAuthenticated && user?.role === 'hotel_owner') && (
               <Link to="/buyer-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Buyer Dashboard</Link>
            )}

            <div style={{ height: '12px' }} />
            
            {!isAuthenticated ? (
               <>
                  <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ width: 'fit-content' }} onClick={() => setMenuOpen(false)}>Join Now</Link>
               </>
            ) : (
               <>
                  <div style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account</div>
                  {user?.role === 'vendor' ? (
                    <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                  ) : (
                    <Link to="/buyer-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Buyer Dashboard</Link>
                  )}
                  <Link to="/saved-vendors" className="nav-link" onClick={() => setMenuOpen(false)}>Saved Vendors</Link>
                  <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--error)' }}>Logout</button>
               </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
