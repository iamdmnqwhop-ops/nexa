'use client';

import { useState, useEffect } from 'react';

interface PaymentStatus {
  hasPaid: boolean;
  isChecking: boolean;
  paymentDate?: string;
}

export const usePaymentStatus = (userId?: string) => {
  const [status, setStatus] = useState<PaymentStatus>({
    hasPaid: false,
    isChecking: true,
  });

  useEffect(() => {
    checkPaymentStatus();
  }, [userId]);

  const checkPaymentStatus = async () => {
    try {
      // Check localStorage first for immediate response
      const storedStatus = localStorage.getItem('nexa_payment_status');
      if (storedStatus) {
        const parsed = JSON.parse(storedStatus);
        setStatus({
          hasPaid: parsed.hasPaid,
          isChecking: false,
          paymentDate: parsed.paymentDate,
        });
        return;
      }

      // If no stored status, check with server
      if (userId) {
        const response = await fetch('/api/payment/status');
        if (response.ok) {
          const data = await response.json();
          setStatus({
            hasPaid: data.hasPaid,
            isChecking: false,
            paymentDate: data.paymentDate,
          });
          // Store in localStorage for faster future checks
          localStorage.setItem('nexa_payment_status', JSON.stringify({
            hasPaid: data.hasPaid,
            paymentDate: data.paymentDate,
          }));
        }
      } else {
        setStatus({ hasPaid: false, isChecking: false });
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      setStatus({ hasPaid: false, isChecking: false });
    }
  };

  const markAsPaid = () => {
    const paymentData = {
      hasPaid: true,
      paymentDate: new Date().toISOString(),
    };
    setStatus({
      hasPaid: true,
      isChecking: false,
      paymentDate: paymentData.paymentDate,
    });
    localStorage.setItem('nexa_payment_status', JSON.stringify(paymentData));
  };

  const clearPaymentStatus = () => {
    setStatus({ hasPaid: false, isChecking: false });
    localStorage.removeItem('nexa_payment_status');
  };

  return {
    ...status,
    checkPaymentStatus,
    markAsPaid,
    clearPaymentStatus,
  };
};