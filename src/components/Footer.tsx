'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white pt-16 pb-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* درباره آینه */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-purple-300">🪞 فروشگاه آینه</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              فروشگاه اینترنتی آینه، مرجع تخصصی <strong className="text-white">محصولات آرایشی و بهداشتی</strong>، 
              <strong className="text-white">مراقبت از پوست و مو</strong>، و 
              <strong className="text-white">محصولات سلامت</strong> با تمرکز بر برندهای معتبر جهانی.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              ما نماینده رسمی <strong className="text-purple-300">برند تراست (Trust)</strong> در ایران هستیم و 
              کامل‌ترین مجموعه <strong className="text-white">سرم‌های تراست</strong>، 
              <strong className="text-white">کرم‌های تراست</strong>، 
              <strong className="text-white">ضد آفتاب تراست</strong>، 
              <strong className="text-white">شوینده‌های تراست</strong> و 
              <strong className="text-white">عطرهای تراست</strong> را با ضمانت اصالت کالا ارائه می‌دهیم.
            </p>
            <p className="text-gray-300 leading-relaxed">
              با آینه، یک <strong className="text-white">روتین مراقبت از پوست</strong> حرفه‌ای داشته باشید و 
              از <strong className="text-white">محصولات بهداشتی اصل</strong> لذت ببرید.
            </p>
          </div>

          {/* لینک‌های مفید */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">دسترسی سریع</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-purple-300 transition-colors">صفحه اصلی</Link></li>
              <li><Link href="/product/1" className="hover:text-purple-300 transition-colors">محصولات تراست</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-300 transition-colors">قوانین و مقررات</Link></li>
              <li><Link href="/dashboard" className="hover:text-purple-300 transition-colors">داشبورد کاربری</Link></li>
              <li><Link href="/checkout" className="hover:text-purple-300 transition-colors">تسویه حساب</Link></li>
            </ul>
          </div>

          {/* تماس با ما */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">ارتباط با ما</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span></span>
                <span dir="ltr">ayenehshop@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <span dir="ltr">09352225693</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span className="text-sm">دفتر تهران: یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۹، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد ۳</span>
              </li>
            </ul>
            
            {/* شبکه‌های اجتماعی */}
            <div className="mt-6">
              <h5 className="text-sm font-bold mb-3 text-purple-300">ما را دنبال کنید</h5>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">📷</a>
                <a href="#" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">💬</a>
                <a href="#" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">📺</a>
              </div>
            </div>
          </div>
        </div>

        {/* بخش کلمات کلیدی طبیعی (SEO-friendly) */}
        <div className="border-t border-purple-800 pt-8 mb-8">
          <h4 className="text-sm font-bold mb-3 text-purple-300">موضوعات مرتبط:</h4>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">محصولات آرایشی بهداشتی</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">مراقبت از پوست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">مراقبت از مو</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">روتین پوستی</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">سرم تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">کرم تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">ضد آفتاب تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">عطر تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">شوینده تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">Trust skincare</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">محصولات سلامت</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">خرید آنلاین لوازم آرایشی</span>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="border-t border-purple-800 pt-6 text-center text-sm text-gray-400">
          <p>© ۱۴۰۵ فروشگاه اینترنتی آینه - تمامی حقوق محفوظ است.</p>
          <p className="mt-2 text-xs">
            طراحی و توسعه با ❤️ | نماینده رسمی محصولات Trust در ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
