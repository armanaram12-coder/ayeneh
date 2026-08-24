'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FloatingContact() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* متن بازشو */}
      <div className={`bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl border border-purple-100 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
        <p className="text-sm font-bold text-purple-700">مشاوره تخصصی پوست و مو</p>
        <p className="text-xs text-gray-600 mt-1">پاسخگویی در واتس‌اپ و تماس</p>
      </div>

      {/* دکمه اصلی */}
      <a 
        href="https://wa.me/989352225693" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {/* انیمیشن پالس */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
        
        {/* آیکون */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </a>
    </div>
  );
}
