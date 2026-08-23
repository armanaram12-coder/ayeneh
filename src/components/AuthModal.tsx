'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import RegisterModal from './RegisterModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  if (showRegisterModal) {
    return (
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={(registeredEmail) => {
          setEmail(registeredEmail);
          setSuccessMessage('✅ ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.');
          setShowRegisterModal(false);
          setIsLoginMode(true);
        }}
      />
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid') || error.message.includes('credentials')) {
          setError('ایمیل یا رمز عبور اشتباه است');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        // Force reload to update Header
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative" dir="rtl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ورود به حساب
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">شماره موبایل یا ایمیل</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 placeholder-gray-400 bg-white"
              placeholder="مثال: 09123456789 یا email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 placeholder-gray-400 bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
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
