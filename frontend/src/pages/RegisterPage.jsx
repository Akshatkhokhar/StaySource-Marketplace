import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const steps = [
  { title: 'Account Details', desc: 'Your login credentials' },
  { title: 'Verification', desc: 'Confirm your identity' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '',
  })
  const { register } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleNext = () => {
    if (!role) {
      toast.error("Please select your account type");
      return;
    }
    if (!form.name || form.name.length < 2) {
      toast.error("Full Name is required (min 2 chars)");
      return;
    }
    if (!form.email || !form.email.includes('@')) {
      toast.error("Valid email is required");
      return;
    }
    if (!form.password || form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.phone) {
      toast.error("Phone number is required");
      return;
    }
    setStep(2);
  }

  const handleSubmitFinal = async () => {
    setIsLoading(true);
    const result = await register({
      full_name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: role
    });
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
          <div className="hero-eyebrow" style={{ display: 'inline-block', marginBottom: 20 }}>Join the Marketplace</div>
          <h2 className="auth-visual-title">Where Hospitality<br />Meets Precision Supply.</h2>
          <p className="auth-visual-sub">Register today and get access to 2,400+ verified vendors — or list your hospitality business for free.</p>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, paddingBottom: i < steps.length - 1 ? 0 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: i + 1 <= step ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                  color: i + 1 <= step ? '#021934' : 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                  transition: 'all 0.3s',
                }}>
                  {i + 1 < step
                    ? <span className="material-icons-round" style={{ fontSize: 16 }}>check</span>
                    : i + 1
                  }
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, height: 32, background: i + 1 < step ? 'var(--gold)' : 'rgba(255,255,255,0.12)', margin: '4px 0', transition: 'background 0.3s' }} />
                )}
              </div>
              <div style={{ paddingTop: 6, paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
                <div style={{ color: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, transition: 'color 0.3s' }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel auth-right">
        <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-container)', borderRadius: 6, padding: 4, marginBottom: 28 }}>
            {[
              { v: 'hotel_owner', l: 'I\'m a Hotel Buyer' },
              { v: 'vendor', l: 'I\'m a Vendor' },
            ].map(r => (
              <button
                type="button"
                key={r.v}
                id={`reg-role-${r.v}`}
                onClick={() => setRole(r.v)}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: 4, fontSize: 13, fontWeight: 600,
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

          {/* Step 1: Account */}
          {step === 1 && (
            <>
              <h2 className="auth-form-title">Create Account</h2>
              <p className="auth-form-sub">Step 1 of 2 — Your login credentials</p>
              <div className="auth-form">
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" className="input" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-email">Work Email</label>
                  <input id="reg-email" type="email" className="input" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-phone">Phone Number</label>
                  <input id="reg-phone" type="tel" className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="reg-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Minimum 8 characters" value={form.password} onChange={e => update('password', e.target.value)} required minLength="8" style={{ width: '100%', paddingRight: '40px' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-icons-round" style={{ fontSize: 20 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                 <div className="input-group">
                  <label className="input-label" htmlFor="reg-confirm-password">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input id="reg-confirm-password" type={showConfirmPassword ? 'text' : 'password'} className="input" placeholder="Match your password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required minLength="8" style={{ width: '100%', paddingRight: '40px' }} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                      }}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-icons-round" style={{ fontSize: 20 }}>{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <button id="btn-next-1" type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} onClick={handleNext}>
                  Review & Submit <span className="material-icons-round" style={{ fontSize: 18 }}>arrow_forward</span>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Done */}
          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,122,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <span className="material-icons-round" style={{ fontSize: 36, color: '#1a7a4a' }}>fact_check</span>
              </div>
              <h2 className="auth-form-title">Please Review Details</h2>
              <p className="auth-form-sub">We will create an account based on following information.</p>
              <div style={{ background: 'var(--surface-low)', borderRadius: 6, padding: 20, margin: '24px 0', textAlign: 'left' }}>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: 12, fontWeight: 700 }}>Account Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                  <div><strong>Name:</strong> {form.name || '—'}</div>
                  <div><strong>Email:</strong> {form.email || '—'}</div>
                  <div><strong>Phone:</strong> {form.phone || '—'}</div>
                  <div><strong>Role:</strong> {role === 'hotel_owner' ? 'Hotel Buyer' : 'Vendor'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)} disabled={isLoading}>Back</button>
                  <button id="btn-next-2" type="button" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmitFinal} disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Complete Registration'} <span className="material-icons-round" style={{ fontSize: 18 }}>check</span>
                  </button>
                </div>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--on-surface-variant)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
