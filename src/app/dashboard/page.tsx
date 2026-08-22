'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type TabType = 'profile' | 'security' | 'orders' | 'favorites' | 'reviews';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [username, setUsername] = useState<string>('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    phone: '',
    address: '',
    postal_code: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Security form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/');
        return;
      }
      
      setUser(session.user);
      
      // Load profile data from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.username) {
        setUsername(profile.username);
      }
      
      // Also load profile data from user metadata for form
      const userMetadata = session.user.user_metadata;
      setProfileData({
        username: userMetadata?.username || profile?.username || '',
        phone: userMetadata?.phone || '',
        address: userMetadata?.address || '',
        postal_code: userMetadata?.postal_code || '',
      });
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const { error } = await supabase.from('profiles').update({
        username: profileData.username,
        phone: profileData.phone,
        address: profileData.address,
        postal_code: profileData.postal_code,
      }).eq('id', user?.id);

      if (error) throw error;

      setProfileSuccess('اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'خطایی در به‌روزرسانی پروفایل رخ داده است');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    // Validate passwords
    if (passwordData.new_password.length < 8) {
      setPasswordError('رمز عبور جدید باید حداقل ۸ کاراکتر باشد');
      setPasswordLoading(false);
      return;
    }

    if (!/[A-Z]/.test(passwordData.new_password)) {
      setPasswordError('رمز عبور جدید باید حداقل یک حرف بزرگ داشته باشد');
      setPasswordLoading(false);
      return;
    }

    if (!/\d/.test(passwordData.new_password)) {
      setPasswordError('رمز عبور جدید باید حداقل یک عدد داشته باشد');
      setPasswordLoading(false);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password)) {
      setPasswordError('رمز عبور جدید باید حداقل یک کاراکتر خاص داشته باشد');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('رمز عبور و تکرار آن مطابقت ندارند');
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) throw error;

      setPasswordSuccess('رمز عبور با موفقیت تغییر کرد');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'خطایی در تغییر رمز عبور رخ داده است');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="text-sm text-gray-600 hover:text-[#7C3AED] transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به صفحه اصلی
          </Link>
          <h1 className="text-xl font-bold text-gray-900">داشبورد کاربری</h1>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            خروج
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar - Right side for RTL */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                👤 پروفایل
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                🔒 امنیت
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                📦 سفارشات
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                ❤️ علاقه‌مندی‌ها
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-right px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white'
                    : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                💬 نظرات
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Avatar Section */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#E879F9] flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">اطلاعات پروفایل</h2>
              
              {profileSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {profileSuccess}
                </div>
              )}
              
              {profileError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">نام کاربری</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">شماره تلفن</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">آدرس منزل</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">کد پستی</label>
                  <input
                    type="text"
                    value={profileData.postal_code}
                    onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) }))}
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold transition-all ${
                    profileLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {profileLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی پروفایل'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تغییر رمز عبور</h2>
              
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {passwordSuccess}
                </div>
              )}
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">رمز عبور فعلی</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">رمز عبور جدید</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                    placeholder="حداقل ۸ کاراکتر، یک حرف بزرگ، یک عدد، یک کاراکتر خاص"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">تکرار رمز عبور جدید</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#7C3AED] text-gray-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`w-full bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white py-3 rounded-lg font-semibold transition-all ${
                    passwordLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {passwordLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">سفارشات</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-700 text-lg">هنوز سفارشی ثبت نکرده‌اید</p>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">علاقه‌مندی‌ها</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <p className="text-gray-700 text-lg">لیست علاقه‌مندی‌ها خالی است</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرات</h2>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-700 text-lg">هنوز نظری ثبت نکرده‌اید</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
