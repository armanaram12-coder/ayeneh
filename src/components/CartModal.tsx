'use client';

import { useEffect } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">سبد خرید</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Empty Cart State */}
        <div className="py-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 text-lg mb-2">سبد خرید شما خالی است</p>
          <p className="text-gray-400 text-sm">برای افزودن محصول به سبد خرید، از فروشگاه دیدن کنید</p>
          <button
            onClick={onClose}
            className="mt-6 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    </div>
  );
}
