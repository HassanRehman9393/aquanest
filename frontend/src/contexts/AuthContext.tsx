'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';
import { authAPI } from '@/lib/auth-api';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('aquanest_token');
        const storedUser = localStorage.getItem('aquanest_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validate token by fetching user profile
          try {
            const profileResponse = await authAPI.getProfile();
            setUser(profileResponse.user);
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem('aquanest_token');
            localStorage.removeItem('aquanest_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      
      // Store auth data
      localStorage.setItem('aquanest_token', response.token);
      localStorage.setItem('aquanest_user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      toast.success(response.message || 'Login successful!');
      
      // Trigger order fetching after successful login
      // We'll do this by dispatching a custom event that the order store can listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('user-logged-in'));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(data);
      
      // Don't auto-login after registration
      // User needs to login manually after registration
      toast.success(response.message || 'Registration successful! Please login with your credentials.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };  const logout = () => {
    // Clear auth data
    localStorage.removeItem('aquanest_token');
    localStorage.removeItem('aquanest_user');
    
    setToken(null);
    setUser(null);
    
    // Trigger order clearing after logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('user-logged-out'));
    }
    
    // Optional: Call logout API
    try {
      authAPI.logout();
    } catch (error) {
      // Ignore logout API errors
    }
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(userData);
      
      const updatedUser = response.user;
      localStorage.setItem('aquanest_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
