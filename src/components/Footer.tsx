'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white pt-16 pb-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* درباره آینه */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-2">
              <span>🪞</span> فروشگاه آینه
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4 text-justify">
              فروشگاه اینترنتی آینه، با مدیریت <strong className="text-white">آرمان آرام</strong>، مرجع تخصصی و مطمئن شما برای خرید محصولات آرایشی، بهداشتی و مراقبت از پوست و مو است. ما با افتخار، <strong className="text-purple-300">نماینده فروش برند معتبر تراست (Trust)</strong> هستیم و تلاش می‌کنیم اصیل‌ترین سرم‌ها، کرم‌ها و محصولات مراقبتی این برند را با ضمانت کیفیت به دست شما برسانیم. هدف ما در آینه، ارائه یک روتین پوستی علمی و مؤثر برای درخشش طبیعی زیبایی شماست.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://wa.me/989352225693" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors" title="مشاوره در واتس‌اپ">
                <span className="text-xl">💬</span>
              </a>
              <a href="tel:09352225693" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors" title="تماس تلفنی">
                <span className="text-xl">📞</span>
              </a>
              <a href="mailto:ayenehshop@gmail.com" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors" title="ارسال ایمیل">
                <span className="text-xl">✉️</span>
              </a>
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">دسترسی سریع</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> صفحه اصلی</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> قوانین و مقررات خرید</Link></li>
              <li><Link href="/dashboard" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> پیگیری سفارشات</Link></li>
              <li><Link href="/checkout" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> تسویه حساب</Link></li>
            </ul>
          </div>

          {/* تماس با ما */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">ارتباط با آرمان آرام</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">📱</span>
                <div>
                  <p className="font-semibold text-white">شماره تماس و واتس‌اپ:</p>
                  <a href="tel:09352225693" className="hover:text-purple-300 transition-colors dir-ltr text-right block">0935 222 5693</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">✉️</span>
                <div>
                  <p className="font-semibold text-white">پشتیبانی ایمیلی:</p>
                  <a href="mailto:ayenehshop@gmail.com" className="hover:text-purple-300 transition-colors dir-ltr text-right block">ayenehshop@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">📍</span>
                <span>دفتر تهران: یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۳۹، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد ۳</span>
              </li>
            </ul>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="border-t border-purple-800/50 pt-8 text-center text-sm text-gray-400">
          <p>© ۱۴۰۵ فروشگاه اینترنتی آینه (با مدیریت آرمان آرام) - تمامی حقوق مادی و معنوی محفوظ است.</p>
          <p className="mt-2 text-xs text-purple-400/70">
            طراحی و توسعه با ❤️ | نماینده فروش محصولات Trust
          </p>
        </div>
      </div>
    </footer>
  );
}
