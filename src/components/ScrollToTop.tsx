'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // با هر بار تغییر مسیر (حتی دکمه برگشت مرورگر)، صفحه به بالا می‌رود
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
