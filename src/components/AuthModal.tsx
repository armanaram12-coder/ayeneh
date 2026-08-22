'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import RegisterModal from './RegisterModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!isOpen) return null;

  // If showing register modal, don't show auth modal
  if (showRegisterModal) {
    return (
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          // Optionally auto-login after registration
          login();
          onClose();
        }}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative" dir="rtl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ورود به حساب
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">شماره موبایل یا ایمیل</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED]"
              placeholder="مثال: 09123456789 یا email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300"
          >
            ورود
          </button>
        </form>

        {/* Toggle to Register */}
        <p className="text-center mt-6 text-gray-600">
          حساب ندارید؟
          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-[#7C3AED] font-semibold mr-1 hover:underline"
          >
            ثبت‌نام کنید
          </button>
        </p>
      </div>
    </div>
  );
}
