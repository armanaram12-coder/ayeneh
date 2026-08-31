'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // ۱. غیرفعال کردن حافظه اسکرول خودکار مرورگر (مهم‌ترین خط)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // ۲. اسکرول اجباری به بالا
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // از auto استفاده کن تا بدون انیمیشن و آنی به بالا برود
    });
  }, [pathname]);

  return null;
}
