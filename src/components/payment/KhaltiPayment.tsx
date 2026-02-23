'use client';

import { useEffect } from 'react';

interface KhaltiPaymentProps {
  amount: number;
  orderId: string;
  productName: string;
  onSuccess: (payload: any) => void;
  onError: (error: any) => void;
}

export default function KhaltiPayment({ 
  amount, 
  orderId, 
  productName,
  onSuccess, 
  onError 
}: KhaltiPaymentProps) {
  
  useEffect(() => {
    // Load Khalti SDK
    const script = document.createElement('script');
    script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js';
    script.async = true;
    script.onload = () => {
      console.log('Khalti SDK loaded');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = () => {
    // Khalti test public key (verified working)
    const publicKey = 'test_public_key_dc74e0fd57cb46cd93832aee0a390234';
    
    const config = {
      publicKey: publicKey,
      productIdentity: orderId,
      productName: productName,
      productUrl: typeof window !== 'undefined' ? `${window.location.origin}/orders/${orderId}` : '',
      eventHandler: {
        onSuccess: (payload: any) => {
          console.log(' Payment Success:', payload);
          onSuccess(payload);
        },
        onError: (error: any) => {
          console.error('Payment Error:', error);
          onError(error);
        },
        onClose: () => {
          console.log('Payment widget closed');
        }
      }
    };

    try {
      // @ts-ignore - Khalti SDK is loaded via CDN
      if (typeof window.KhaltiCheckout === 'undefined') {
        alert('Khalti SDK not loaded. Please refresh the page.');
        return;
      }

      // @ts-ignore
      const checkout = new window.KhaltiCheckout(config);
      
      // Amount must be in paisa (1 Rs = 100 paisa)
      const amountInPaisa = Math.round(amount * 100);
      console.log('Initiating payment for Rs.', amount, '(', amountInPaisa, 'paisa)');
      
      checkout.show({ amount: amountInPaisa });
    } catch (error) {
      console.error('Failed to initialize Khalti:', error);
      alert('Failed to open payment gateway. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Test Credentials Info */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
        <h4 className="font-bold text-purple-800 mb-2">🧪 Test Payment Credentials:</h4>
        <div className="text-sm text-purple-700 space-y-1">
          <p><strong>Mobile:</strong> 9800000001 (or 9800000002, 9800000003... up to 9800000010)</p>
          <p><strong>MPIN:</strong> 1111</p>
          <p><strong>OTP:</strong> 987654</p>
        </div>
      </div>

      <button
        onClick={initiatePayment}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-[1.02]"
      >
        <svg className="w-6 h-6" viewBox="0 0 50 50" fill="white">
          <path d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0zm0 45C13.9 45 5 36.1 5 25S13.9 5 25 5s20 8.9 20 20-8.9 20-20 20z"/>
          <path d="M25 15c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
        </svg>
        Pay Rs. {amount} with Khalti
      </button>

      <p className="text-xs text-center text-gray-500">
        Secure payment powered by Khalti
      </p>
    </div>
  );
}