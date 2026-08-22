'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  
  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100" dir="rtl">
          <HeroSlider />
          <FlashSale />
        </main>
      )}
    </>
  );
}
