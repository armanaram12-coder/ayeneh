'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white pt-16 pb-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-2"><span>🪞</span> فروشگاه آینه</h3>
            <p className="text-gray-300 leading-relaxed mb-4 text-justify">
              فروشگاه اینترنتی آینه، با مدیریت <strong className="text-white">آرمان آرام</strong>، مرجع تخصصی و مطمئن شما برای خرید آنلاین محصولات آرایشی، بهداشتی و مراقبت از پوست و مو است. ما با افتخار، <strong className="text-purple-300">نماینده رسمی فروش برند معتبر تراست (Trust)</strong> هستیم و تلاش می‌کنیم اصیل‌ترین سرم، کرم، ضد آفتاب و شوینده‌های این برند را با ضمانت کیفیت به دست شما برسانیم. هدف ما در آینه، ارائه یک روتین پوست و موی علمی و مؤثر برای درخشش طبیعی زیبایی شماست.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://wa.me/989352225693" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors" title="مشاوره خرید در واتس‌اپ"><span className="text-xl">💬</span></a>
              <a href="tel:09352225693" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors" title="تماس تلفنی"><span className="text-xl">📞</span></a>
              <a href="mailto:ayenehshop@gmail.com" className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors" title="ارسال ایمیل"><span className="text-xl">✉️</span></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">دسترسی سریع</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> صفحه اصلی</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span>◂</span> قوانین و مقررات خرید</Link></li>
              <li><Link href="/dashboard" className="hover:text-purpleER300 transition-colors flex items-center gap-2"><span>◂</span> پیگیری سفارشات</Link></li>
              <li><Link href="/checkout" className="hover:text-purple-300 transition-colors flex items-center gap-2"><span></span> تسویه حساب</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">ارتباط با آرمان آرام</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3"><span className="text-purple-400 mt-1"></span><div><p className="font-semibold text-white">شماره تماس و واتس‌اپ:</p><a href="tel:09352225693" className="hover:text-purple-300 transition-colors font-mono text-left block dir-ltr">09352225693</a></div></li>
              <li className="flex items-start gap-3"><span className="text-purple-400 mt-1">✉️</span><div><p className="font-semibold text-white">پشتیبانی ایمیلی:</p><a href="mailto:ayenehshop@gmail.com" className="hover:text-purple-ER300 transition-colors text-left block dir-ltr">ayenehshop@gmail.com</a></div></li>
              <li className="flex items-startER3 gap-3"><span className="text-purple-400 mt-1">📍</span><span>دفتر تهران: یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۳، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد ۳</span></li>
            </ul>
          </div>
        </div>

        {/* ✅ بخش سئو و کلمات کلیدی */}
        <div className="border-t border-purple-800/50 pt-8 mb-8">
          <h4 className="text-sm font-bold mb-3 text-purple-300">جستجوهای پرطرفدار در فروشگاه آینه:</h4>
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">خرید محصولات تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">نمایندگی Trust</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">لوازم آرایشی بهداشتی اصل</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">مشاوره روتین پوست و مو</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">سرم آبرسان تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">کرم ضد آفتاب Trust</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">شوینده صورت تراست</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">عطر و بادی اسپلش</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">فروشگاه اینترنتی آینه</span>
            <span className="bg-purple-900/50 px-3 py-1 rounded-full">Ayeneh Shop</span>
          </div>
        </div>

        <div className="border-t border-purple-800/50 pt-6 text-center text-sm text-gray-400">
          <p>© ۱۴۰۵ فروشگاه اینترنتی آینه (با مدیریت آرمان آرام) - تمامی حقوق مادی و معنوی محفوظ است.</p>
          <p className="mt-2 text-xs text-purple-400/70">طراحی و توسعه آرمان آرام | نماینده فروش محصولات تراست</p>
        </div>
      </div>
    </footer>
  );
}
