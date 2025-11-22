'use client';

import { Card } from '@whop/react/components';
import { WhopCheckoutEmbed } from '@whop/checkout/react';
import { Crown, Sparkles } from 'lucide-react';
import { CONFIG } from '@/lib/config';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) => {
  // Your NEXA Premium plan ID from Whop dashboard
  const PLAN_ID = CONFIG.WHOP.PLAN_ID;

  if (!isOpen) return null;

  const handlePaymentComplete = (planId: string, receiptId?: string) => {
    console.log('Payment completed:', { planId, receiptId });
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="nexa-whop-glass nexa-whop-transition-slow relative overflow-hidden w-full max-w-md">
        <Card
          className="relative"
          style={{
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(20px) saturate(190%) contrast(90%) brightness(80%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.05)',
            padding: '0'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    boxShadow: '0 4px 20px rgba(251, 191, 36, 0.1)'
                  }}
                >
                  <Crown className="h-6 w-6" style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <h2
                    className="font-bold"
                    style={{
                      color: '#ffffff',
                      fontSize: '20px',
                      lineHeight: '1.2',
                      marginBottom: '4px'
                    }}
                  >
                    NEXA Premium
                  </h2>
                  <p
                    className="text-sm"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: '1.4'
                    }}
                  >
                    Unlimited access to refine ideas • $14 one-time
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="nexa-whop-transition rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{
                  background: 'none',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.343 2.343a1 1 0 011.414 0L8 6.586l4.243-4.243a1 1 0 111.414 1.414L9.414 8l4.243 4.243a1 1 0 01-1.414 1.414L8 9.414l-4.243 4.243a1 1 0 01-1.414-1.414L6.586 8 2.343 3.757a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            {/* Features Card */}
            <div
              className="nexa-whop-glass-subtle"
              style={{
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                background: 'rgba(0, 123, 255, 0.04)',
                border: '1px solid rgba(0, 123, 255, 0.12)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4" style={{ color: '#fbbf24' }} />
                <span
                  className="font-medium text-sm"
                  style={{ color: '#ffffff' }}
                >
                  What you get:
                </span>
              </div>
              <ul className="space-y-2" style={{ margin: 0, padding: 0 }}>
                {[
                  'Unlimited AI product generations',
                  'All idea refinement features',
                  'Export in TXT format',
                  'Priority support & updates'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Whop Embedded Checkout */}
          <div style={{
            padding: '0 24px 24px 24px',
            position: 'relative',
            zIndex: 1
          }}>
            <WhopCheckoutEmbed
              planId={PLAN_ID}
              theme="dark"
              onComplete={handlePaymentComplete}
              style={{
                container: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }
              }}
              themeOptions={{
                accentColor: 'tomato'
              }}
            />
          </div>

          {/* Whop Inner Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
              borderRadius: '16px'
            }}
          />
        </Card>
      </div>
    </div>
  );
};