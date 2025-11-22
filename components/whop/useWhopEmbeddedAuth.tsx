'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WhopEmbeddedUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface WhopEmbeddedAuthContextType {
  user: WhopEmbeddedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const WhopEmbeddedAuthContext = createContext<WhopEmbeddedAuthContextType | undefined>(undefined);

export const useWhopEmbeddedAuth = () => {
  const context = useContext(WhopEmbeddedAuthContext);
  if (!context) {
    throw new Error('useWhopEmbeddedAuth must be used within a WhopEmbeddedAuthProvider');
  }
  return context;
};

interface WhopEmbeddedAuthProviderProps {
  children: ReactNode;
}

export const WhopEmbeddedAuthProvider = ({ children }: WhopEmbeddedAuthProviderProps) => {
  const [user, setUser] = useState<WhopEmbeddedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a Whop embedded experience
    checkEmbeddedAuth();
  }, []);

  const checkEmbeddedAuth = async () => {
    try {
      setIsLoading(true);

      // Check if we're in an iframe (embedded in Whop)
      const isInIframe = window !== window.parent;

      if (isInIframe) {
        // In Whop embedded experience, user is automatically authenticated
        // We can get user info from the Whop experience API or parent window
        try {
          // Try to get user info from the experience endpoint
          const response = await fetch('/api/auth/embedded-user');

          if (response.ok) {
            const userData = await response.json();
            setUser({
              id: userData.id,
              username: userData.username,
              email: userData.email,
              avatar: userData.avatar,
            });
          } else {
            // Fallback for development - simulate authenticated user
            setUser({
              id: 'embedded-user-demo',
              username: 'Whop User',
              email: 'user@whop.com',
            });
          }
        } catch (error) {
          console.log('Using fallback embedded auth');
          // Fallback for development/testing
          setUser({
            id: 'embedded-user-fallback',
            username: 'Whop User',
            email: 'user@whop.com',
          });
        }
      } else {
        // Not embedded, no authentication
        setUser(null);
      }
    } catch (error) {
      console.error('Embedded auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: WhopEmbeddedAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <WhopEmbeddedAuthContext.Provider value={value}>
      {children}
    </WhopEmbeddedAuthContext.Provider>
  );
};