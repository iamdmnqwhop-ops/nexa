'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@whop/react/components';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      try {
        // Exchange code for access token
        const response = await fetch('/api/auth/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const data = await response.json();

        // Store user session
        localStorage.setItem('whop_session', JSON.stringify({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }));

        setStatus('success');
        setMessage('Successfully authenticated! Redirecting...');

        setTimeout(() => {
          router.push('/');
        }, 1500);

      } catch (error) {
        console.error('Auth error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
      <Card
        className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0',
          width: '400px'
        }}
      >
        <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: status === 'success'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))'
                  : status === 'error'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))'
                  : 'linear-gradient(135deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.1))',
                border: status === 'success'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : status === 'error'
                  ? '1px solid rgba(239, 68, 68, 0.3)'
                  : '1px solid rgba(0, 123, 255, 0.3)'
              }}
            >
              {status === 'loading' && (
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#007BFF' }} />
              )}
              {status === 'success' && (
                <CheckCircle className="h-8 w-8" style={{ color: '#10b981' }} />
              )}
              {status === 'error' && (
                <XCircle className="h-8 w-8" style={{ color: '#ef4444' }} />
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Authentication Failed'}
            </h2>

            <p
              className="text-sm"
              style={{
                color: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#9ca3af'
              }}
            >
              {message}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none nexa-inner-glow"
          style={{ borderRadius: '12px' }}
        />
      </Card>
    </div>
  );
}