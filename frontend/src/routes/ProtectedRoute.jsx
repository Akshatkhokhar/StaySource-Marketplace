import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const token = localStorage.getItem('staysource_token');
  const userStr = localStorage.getItem('staysource_user');
  
  let user = null;
  try {
     user = JSON.parse(userStr || 'null');
  } catch (e) {
     user = null;
  }

  if (isLoading && token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading session...</div>
      </div>
    );
  }

  if (!token || !user || (!isLoading && !isAuthenticated)) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
