import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { isAuthenticated } = useAuth()
  
  const footerLinks = {
    Marketplace: [
      { label: 'About Us',       to: '#' },
      { label: 'Contact',        to: '#' },
      { label: 'Categories',     to: '/vendors' },
    ],
    Vendors: [
      ...(!isAuthenticated ? [{ label: 'Join as Vendor', to: '/register' }] : []),
      { label: 'Vendor Dashboard',  to: '/dashboard' },
      { label: 'Verified Listing',  to: '#' },
      { label: 'Success Stories',   to: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy',   to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Cookie Policy',    to: '#' },
    ],
  }

  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--outline-variant)', background: '#fff', padding: '64px 0 32px', marginTop: 80 }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="navbar-logo-mark">SS</div>
              <span className="navbar-logo-text" style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Stay<span style={{ color: 'var(--gold)' }}>Source</span>
              </span>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}>
              Architectural precision in hospitality procurement. Empowering hotels with verified supply chains across 60+ categories.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>
            © {new Date().getFullYear()} StaySource B2B Marketplace. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
             <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>language</span>
             <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>share</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
// Force HMR refresh - v2

