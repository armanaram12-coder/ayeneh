'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-purple-700 mb-4">
                آینه
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                فروشگاه آنلاین محصولات آرایشی و بهداشتی
              </p>
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                <p className="text-gray-700 text-lg">
                  به زودی...
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
