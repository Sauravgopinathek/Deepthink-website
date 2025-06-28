import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('deepthink_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('deepthink_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400`,
        bio: 'Welcome to DeepThink! Start your journey of better decision-making.',
        location: 'San Francisco, CA',
        timezone: 'PST',
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            goalReminders: true,
            mentorUpdates: true,
            weeklyDigest: true,
          },
          privacy: {
            profileVisible: true,
            showLocation: true,
            allowMentorRequests: true,
          },
          appearance: {
            theme: 'light',
            language: 'en',
          },
        },
        subscription: 'free',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('deepthink_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email,
        name,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400`,
        bio: 'New to DeepThink! Excited to start making better decisions.',
        location: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            goalReminders: true,
            mentorUpdates: true,
            weeklyDigest: true,
          },
          privacy: {
            profileVisible: true,
            showLocation: false,
            allowMentorRequests: true,
          },
          appearance: {
            theme: 'light',
            language: 'en',
          },
        },
        subscription: 'free',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('deepthink_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deepthink_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('deepthink_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};