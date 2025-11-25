'use client';

import { WhopCheckoutEmbed } from '@whop/checkout/react';
import { Crown, Sparkles, X, Check } from 'lucide-react';
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
    // console.log('Payment completed:', { planId, receiptId });
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-0 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Info */}
          <div className="p-8 relative z-10 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-400/5 border border-amber-400/20 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">NEXA Premium</h2>
                  <p className="text-sm text-gray-400">$14 one-time payment</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex-grow">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white">What's included:</span>
              </div>
              <ul className="space-y-4">
                {[
                  'Unlimited AI product generations',
                  'Advanced idea refinement',
                  'Export in multiple formats',
                  'Priority support & updates'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Checkout */}
          <div className="p-6 bg-white/[0.02] border-l border-white/10 relative z-10 flex flex-col">
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Whop Embedded Checkout */}
            <div style={{
              padding: '0 24px 24px 24px',
              position: 'relative',
              zIndex: 1,
              maxHeight: '600px', // Constrain height
              overflowY: 'auto'   // Allow scrolling if needed
            }}>
              <WhopCheckoutEmbed
                planId={PLAN_ID}
                theme="dark"
                onComplete={handlePaymentComplete}
                themeOptions={{
                  accentColor: 'tomato'
                }}
              />
            </div>
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-amber-400/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};