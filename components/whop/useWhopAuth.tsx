'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Whop from '@whop/sdk';

interface WhopUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface WhopAuthContextType {
  user: WhopUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const WhopAuthContext = createContext<WhopAuthContextType | undefined>(undefined);

export const useWhopAuth = () => {
  const context = useContext(WhopAuthContext);
  if (!context) {
    throw new Error('useWhopAuth must be used within a WhopAuthProvider');
  }
  return context;
};

interface WhopAuthProviderProps {
  children: ReactNode;
}

export const WhopAuthProvider = ({ children }: WhopAuthProviderProps) => {
  const [user, setUser] = useState<WhopUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Whop client
  const whopClient = new Whop({
    apiKey: process.env.NEXT_PUBLIC_WHOP_API_KEY,
    appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  });

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Check if user has a valid session
      const session = localStorage.getItem('whop_session');
      if (session) {
        // Validate session with Whop
        const sessionData = JSON.parse(session);
        // In a real implementation, you'd validate this with Whop's API
        if (sessionData && sessionData.user) {
          setUser(sessionData.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid session
      localStorage.removeItem('whop_session');
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Redirect to Whop OAuth flow
    const authUrl = `https://whop.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_WHOP_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&response_type=code`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whop_session');
    // In a real implementation, you might want to revoke the token with Whop
  };

  const value: WhopAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <WhopAuthContext.Provider value={value}>
      {children}
    </WhopAuthContext.Provider>
  );
};