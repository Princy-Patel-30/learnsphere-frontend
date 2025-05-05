import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, login, logout, fetchUser } from '../Services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser();
        setUser(data);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          toast.error('Failed to fetch user data');
          console.error('Unexpected error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const handleRegister = async (data) => {
    try {
      await registerUser(data);
      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  const handleLogin = async (data) => {
    try {
      const userData = await login(data);
      setUser(userData);
      toast.success('Login successful');
      const role = userData.user.role;
      if (role === 'INSTRUCTOR') navigate('/InstructorDashboard');
      else if (role === 'STUDENT') navigate('/StudentDashboard');
      else navigate('/select-role');
      return userData;
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const value = useMemo(() => ({ user, isLoading, handleRegister, handleLogin, handleLogout, setUser }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);