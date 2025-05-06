import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, login, logout, fetchUser, updateUserRole } from '../Services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser();
        setUser(data.user); // Normalize user shape
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
      const response = await login(data);
      const userData = response.user;
      setUser(userData);
      toast.success('Login successful');

      if (userData.role === 'INSTRUCTOR') navigate('/InstructorDashboard');
      else if (userData.role === 'STUDENT') navigate('/StudentDashboard');
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

  const updateRole = async (role) => {
    try {
      const response = await updateUserRole(role); 
      setUser(response.user); 
      toast.success('Role updated successfully');
      return response.user;
    } catch (error) {
      toast.error('Failed to update role');
      throw error;
    }
  };
  

  const value = useMemo(
    () => ({
      user,
      isLoading,
      handleRegister,
      handleLogin,
      handleLogout,
      setUser,
      updateRole
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
