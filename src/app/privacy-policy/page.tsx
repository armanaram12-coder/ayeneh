'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* عنوان اصلی */}
            <div className="text-center mb-10 border-b-2 border-purple-200 pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                سیاست حفظ حریم خصوصی و قوانین خرید
              </h1>
              <p className="text-gray-600 text-sm">آخرین بروزرسانی: مرداد ۱۴۰۵</p>
            </div>

            {/* مقدمه */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8 border-r-4 border-purple-500">
              <p className="text-gray-800 leading-relaxed text-lg">
                با ثبت سفارش در فروشگاه ما، شما تأیید می‌کنید که این قوانین را مطالعه کرده و با آن موافق هستید. 
                <span className="font-semibold text-purple-700 block mt-2">
                  بله، چند دقیقه خواندنش از چند روز دردسر بهتر است. اینترنت همین‌طوری هم به اندازه کافی عاشق سوءتفاهم است.
                </span>
              </p>
            </div>

            {/* بخش‌ها */}
            <div className="space-y-8">
              
              {/* بخش ۱ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۱</span>
                  اطلاعاتی که از شما دریافت می‌کنیم
                </h2>
                <p className="text-gray-700 mb-4">برای ثبت سفارش ممکن است اطلاعات زیر را دریافت کنیم:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>نام و نام خانوادگی</li>
                  <li>شماره موبایل</li>
                  <li>آدرس ارسال سفارش</li>
                  <li>اطلاعات مربوط به سفارش</li>
                </ul>
                <p className="mt-4 text-gray-800 font-semibold bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  🔒 اطلاعات بانکی شما نزد ما ذخیره نمی‌شود و پرداخت از طریق درگاه پرداخت امن انجام می‌شود.
                </p>
              </section>

              {/* بخش  */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۲</span>
                  استفاده از اطلاعات شما
                </h2>
                <p className="text-gray-700 mb-4">اطلاعات شما فقط برای موارد زیر استفاده می‌شود:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>ثبت و ارسال سفارش</li>
                  <li>اطلاع‌رسانی وضعیت سفارش</li>
                  <li>پاسخگویی به پشتیبانی</li>
                  <li>بهبود خدمات فروشگاه</li>
                </ul>
                <p className="mt-4 text-gray-800 font-semibold bg-green-50 p-3 rounded-lg border border-green-200">
                  ✅ اطلاعات شما بدون حکم قانونی یا رضایت شما به شخص یا شرکت دیگری فروخته یا واگذار نمی‌شود.
                </p>
              </section>

              {/* بخش ۳ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"></span>
                  امنیت اطلاعات
                </h2>
                <p className="text-gray-700">
                  ما تلاش می‌کنیم اطلاعات شما را با روش‌های مناسب محافظت کنیم، اما هیچ سرویس اینترنتی امنیت صددرصدی ندارد.
                </p>
              </section>

              {/* بخش ۴ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm"></span>
                  قوانین ثبت سفارش
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>ثبت سفارش به معنی پذیرش قوانین فروشگاه است.</li>
                  <li>لطفاً اطلاعات تماس و آدرس را دقیق وارد کنید.</li>
                  <li>در صورت اشتباه بودن اطلاعات، مسئولیت تأخیر یا عدم تحویل سفارش بر عهده خریدار خواهد بود.</li>
                </ul>
              </section>

              {/* بخش  */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۵</span>
                  قیمت و موجودی
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>قیمت‌ها به تومان هستند.</li>
                  <li>ممکن است موجودی کالا قبل از نهایی شدن سفارش تغییر کند.</li>
                  <li>اگر امکان ارسال کالا وجود نداشته باشد، مبلغ پرداختی به شما بازگردانده می‌شود.</li>
                </ul>
              </section>

              {/* بخش  */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۶</span>
                  ارسال سفارش
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>زمان ارسال برای هر کالا ممکن است متفاوت باشد.</li>
                  <li>پس از تحویل سفارش به شرکت حمل، مسئولیت ارسال مطابق قوانین شرکت حمل ادامه پیدا می‌کند، اما ما تا رسیدن سفارش کنار شما هستیم و پیگیری می‌کنیم.</li>
                </ul>
              </section>

              {/* بخش ۷ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۷</span>
                  مرجوعی و انصراف از خرید
                </h2>
                <p className="text-gray-700 mb-4">
                  طبق قانون تجارت الکترونیکی ایران، در بسیاری از خریدهای اینترنتی، خریدار تا <span className="font-bold text-purple-700">۷ روز کاری</span> پس از دریافت کالا حق انصراف دارد، بدون اینکه نیاز به ارائه دلیل داشته باشد. تنها هزینه‌ای که ممکن است بر عهده خریدار باشد، هزینه بازگرداندن کالا است.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">شرایط مرجوعی:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                  <li>کالا نباید آسیب دیده یا استفاده شده باشد.</li>
                  <li>بسته‌بندی اصلی تا حد امکان حفظ شود.</li>
                  <li>درخواست مرجوعی باید در مهلت قانونی ثبت شود.</li>
                  <li>استثنا: برخی کالاها به دلیل ماهیت بهداشتی، سفارشی یا شرایط خاص، ممکن است شامل حق انصراف نباشند.</li>
                </ul>
              </section>

              {/* بخش ۸ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۸</span>
                  لغو سفارش
                </h2>
                <p className="text-gray-700">
                  در صورتی که سفارش هنوز ارسال نشده باشد، امکان لغو آن وجود دارد. اگر ارسال انجام شده باشد، قوانین مرجوعی اعمال می‌شود.
                </p>
              </section>

              {/* بخش ۹ */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">۹</span>
                  ارتباط با ما
                </h2>
                <p className="text-gray-700">
                  در صورت داشتن هرگونه سؤال یا نیاز به پشتیبانی، از طریق راه‌های ارتباطی درج‌شده در سایت با ما در تماس باشید.
                </p>
              </section>

            </div>

            {/* تأیید نهایی */}
            <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تأیید نهایی مشتری</h3>
              <p className="text-gray-800 text-center mb-6 leading-relaxed">
                قبل از پرداخت، لطفاً این گزینه را فعال کنید:
              </p>
              <div className="bg-white rounded-lg p-6 shadow-md border border-purple-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-gray-800 leading-relaxed">
                    <strong className="text-gray-900 block mb-2">با ثبت سفارش، تأیید می‌کنم که:</strong>
                    سیاست حفظ حریم خصوصی و قوانین خرید فروشگاه را مطالعه کرده و می‌پذیرم.
                    <span className="block text-sm text-gray-600 mt-2 italic">
                      چون بعداً کسی نمی‌تواند بگوید «من نخوانده بودم»، جمله‌ای که اینترنت بعد از هر خرید تقریباً به آن معتاد شده است 😊
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* دکمه بازگشت */}
            <div className="mt-10 text-center">
              <Link 
                href="/checkout" 
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                بازگشت به صفحه پرداخت
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
