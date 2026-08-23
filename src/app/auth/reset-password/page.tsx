'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // چک کردن اینکه آیا کاربر در حالت reset password هست
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // کاربر در حالت بازیابی رمز هست
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">تعیین رمز عبور جدید</h1>

        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <p className="text-gray-700 mb-4">رمز عبور با موفقیت تغییر کرد!</p>
            <p className="text-sm text-gray-600">در حال انتقال به صفحه اصلی...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">رمز عبور جدید</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                placeholder="حداقل ۶ کاراکتر"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
