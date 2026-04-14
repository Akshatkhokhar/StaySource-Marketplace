import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/auth.api';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('staysource_token');
      
      if (storedToken) {
        try {
          const resData = await getCurrentUser();
          const pData = resData.data || resData;
          setUser(pData.user || pData);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Session verification failed", error);
          localStorage.removeItem('staysource_token');
          localStorage.removeItem('staysource_user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        localStorage.removeItem('staysource_user');
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listener for interceptor 401 triggers
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      toast.error("Session expired. Please login again.");
    };
    
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const resData = await loginUser(email, password);
      // Express wrapper puts it in data.data
      const payload = resData.data || resData;
      const u = payload.user || payload;
      const t = payload.token || payload.access_token || localStorage.getItem('staysource_token');
      
      if (t) {
        localStorage.setItem('staysource_token', t);
        setToken(t);
      }
      
      localStorage.setItem('staysource_user', JSON.stringify(u));
      setUser(u);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${u.full_name || u.name || 'there'}!`);
      return { success: true, role: u.role };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const resData = await registerUser(userData);
      const payload = resData.data || resData;
      const u = payload.user || payload;
      const t = payload.token || localStorage.getItem('staysource_token');

      // The specs say we can optionally log them in, or just redirect. We'll set it just in case.
      if (t) {
        localStorage.setItem('staysource_token', t);
        setToken(t);
      }
      if (u) {
        localStorage.setItem('staysource_user', JSON.stringify(u));
        setUser(u);
        setIsAuthenticated(true);
      }

      toast.success("Account created successfully!");
      return { success: true, role: u?.role };
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Registration failed.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('staysource_token');
      localStorage.removeItem('staysource_user');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      toast.info("Logged out successfully");
    }
  };

  const loginSocial = (u, t) => {
    localStorage.setItem('staysource_token', t);
    localStorage.setItem('staysource_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout, loginSocial }}>
      {children}
    </AuthContext.Provider>
  );
}
