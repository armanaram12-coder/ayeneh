'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';
import CartModal from './CartModal';

export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        // Fetch username from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.username) {
          setUsername(profile.username);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUsername(null);
    setShowDropdown(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40" dir="rtl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Right Section - Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-[#7C3AED]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="text-2xl font-bold text-[#7C3AED]">
                تراست
              </Link>
            </div>

            {/* Center - Search Bar (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="جستجو در محصولات..."
                  className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:border-[#7C3AED]"
                  onChange={(e) => console.log('Search:', e.target.value)}
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Left Section - Icons & Auth */}
            <div className="flex items-center gap-3">
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-[#7C3AED] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm">داشبورد</span>
              </Link>

              {/* Wishlist Icon */}
              <button
                onClick={() => setWishlistActive(!wishlistActive)}
                className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  wishlistActive ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={wishlistActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart Icon with Badge */}
              <button 
                onClick={() => setIsCartModalOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth Button / User Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-300"
                  >
                    <span>سلام، {username || 'کاربر'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        داشبورد
                      </Link>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        صفحه اصلی
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors"
                      >
                        خروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-300"
                >
                  ورود / ثبت‌نام
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search (Visible only on mobile) */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در محصولات..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:border-[#7C3AED]"
                onChange={(e) => console.log('Search:', e.target.value)}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Mobile Nav Links */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-2 border-t pt-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="block text-gray-600 hover:text-[#7C3AED] py-2">
                    صفحه اصلی
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="block text-gray-600 hover:text-[#7C3AED] py-2">
                    فروشگاه
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="block text-gray-600 hover:text-[#7C3AED] py-2">
                    داشبورد
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
}
