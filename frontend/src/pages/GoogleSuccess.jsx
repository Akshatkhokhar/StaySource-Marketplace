import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginSocial } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Update context state and localStorage
        loginSocial(user, token);
        
        toast.success(`Welcome, ${user.full_name}!`);
        
        // Redirect based on role
        if (user.role === 'vendor') {
          navigate('/dashboard');
        } else {
          navigate('/buyer-dashboard');
        }
      } catch (err) {
        console.error("Error parsing user data from Google OAuth", err);
        toast.error("Authentication failed. Please try again.");
        navigate('/login');
      }
    } else {
      toast.error("Authentication failed. No token received.");
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthState]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
      background: 'var(--surface)'
    }}>
      <div className="navbar-logo-mark" style={{ width: 60, height: 60, fontSize: 32 }}>SS</div>
      <p style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Completing authentication...</p>
    </div>
  );
}
