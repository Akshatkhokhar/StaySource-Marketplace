import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function VendorRoute({ children }) {
  const { user: contextUser, isAuthenticated, isLoading } = useAuth();
  const token = localStorage.getItem('staysource_token');
  const userStr = localStorage.getItem('staysource_user');
  
  let lsUser = null;
  try {
     lsUser = JSON.parse(userStr || 'null');
  } catch (e) {
     lsUser = null;
  }
  
  const activeUser = contextUser || lsUser;

  useEffect(() => {
    if (!isLoading && token && activeUser && activeUser?.role !== 'vendor') {
      toast.error('Access restricted to vendors only');
    }
  }, [isLoading, token, activeUser]);

  if (isLoading && token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading session...</div>
      </div>
    );
  }

  if (!token || !activeUser || (!isLoading && !isAuthenticated)) {
    return <Navigate to="/login" replace />;
  }

  if (activeUser?.role !== 'vendor') {
    return <Navigate to="/vendors" replace />;
  }

  return children || <Outlet />;
}
