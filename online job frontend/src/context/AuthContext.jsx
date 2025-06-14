import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setShowAuthModal(false);
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setShowAuthModal(true);
    }
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowAuthModal(false);
    // Set default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowAuthModal(true);
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Watch for changes in user and update modal visibility
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user]);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      login, 
      logout, 
      showAuthModal, 
      setShowAuthModal,
      isLoggedIn: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 