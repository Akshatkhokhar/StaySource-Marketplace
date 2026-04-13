import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('hotel_owner')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'vendor' || role === 'vendor') {
        navigate('/dashboard');
      } else {
        navigate('/buyer-dashboard');
      }
    }
  }

  return (
    <div className="auth-page" style={{ minHeight: '100vh' }}>
      {/* Left panel */}
      <div className="auth-panel auth-left">
        <div style={{ marginBottom: 48 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div className="navbar-logo-mark">SS</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>StaySource</span>
          </Link>
          <div className="hero-eyebrow" style={{ display: 'inline-block', marginBottom: 20 }}>Welcome Back</div>
          <h2 className="auth-visual-title">The Curator's Corner.<br />Sign In to Continue.</h2>
          <p className="auth-visual-sub">Connect with 2,400+ verified hospitality vendors and streamline your procurement pipeline.</p>
        </div>

        {/* Testimonial */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: 24, marginTop: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
            "StaySource transformed our procurement. We sourced all FF&E for our new property in under 3 weeks — incredible."
          </p>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            — Sarah Lindqvist, GM, The Nordic House
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel auth-right">
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <h2 className="auth-form-title">Sign In</h2>
          <p className="auth-form-sub">Access your procurement dashboard</p>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-container)', borderRadius: 6, padding: 4, marginBottom: 28 }}>
            {[
              { v: 'hotel_owner', l: 'Hotel Buyer' },
              { v: 'vendor', l: 'Vendor' },
            ].map(r => (
              <button
                type="button"
                key={r.v}
                id={`role-${r.v}`}
                onClick={() => setRole(r.v)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: role === r.v ? '#fff' : 'transparent',
                  color: role === r.v ? 'var(--primary)' : 'var(--on-surface-variant)',
                  boxShadow: role === r.v ? '0 1px 4px rgba(22,28,39,0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {r.l}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '40px' }}
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-icons-round" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
            </div>
            <button type="submit" id="btn-login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider" style={{ margin: '24px 0' }}>OR</div>

          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--on-surface-variant)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
