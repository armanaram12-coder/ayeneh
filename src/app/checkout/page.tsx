'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { getCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';

// لیست استان‌ها و شهرهای ایران
const provinces = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
  'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
  'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
  'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
  'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'
];

const cities: Record<string, string[]> = {
  'تهران': ['تهران', 'اسلامشهر', 'شهریار', 'ورامین', 'پاکدشت', 'دماوند', 'فیروزکوه'],
  'اصفهان': ['اصفهان', 'کاشان', 'خمینی‌شهر', 'نجف‌آباد', 'شاهین‌شهر', 'فلاورجان'],
  'فارس': ['شیراز', 'مرودشت', 'کازرون', 'جهرم', 'فسا', 'لار'],
  'خراسان رضوی': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه', 'قوچان', 'گناباد'],
  'آذربایجان شرقی': ['تبریز', 'مراغه', 'مرند', 'میانه', 'اهر', 'بناب'],
  'آذربایجان غربی': ['ارومیه', 'خوی', 'بوکان', 'مهاباد', 'نقده', 'پیرانشهر'],
  'البرز': ['کرج', 'فردیس', 'نظرآباد', 'اشتهارد', 'ساوجبلاغ', 'طالقان'],
  'خوزستان': ['اهواز', 'دزفول', 'آبادان', 'بهبهان', 'خرمشهر', 'اندیمشک', 'شوشتر'],
  'مازندران': ['ساری', 'بابل', 'آمل', 'قائم‌شهر', 'بابلسر', 'نوشهر', 'چالوس'],
  'گیلان': ['رشت', 'انزلی', 'لاهیجان', 'رودسر', 'تالش', 'آستارا'],
  'کرمان': ['کرمان', 'جیرفت', 'رفسنجان', 'سیرجان', 'بافت', 'بردسیر'],
  'قم': ['قم'],
  'مرکزی': ['اراک', 'ساوه', 'خمین', 'محلات', 'دلیجان', 'تفرش'],
  'همدان': ['همدان', 'ملایر', 'نهاوند', 'تویسرکان', 'کبودرآهنگ'],
  'کردستان': ['سنندج', 'سقز', 'مریوان', 'بانه', 'قروه', 'بیجار'],
  'کرمانشاه': ['کرمانشاه', 'اسلام‌آباد غرب', 'سنقر', 'کنگاور', 'صحنه'],
  'لرستان': ['خرم‌آباد', 'بروجرد', 'الیگودرز', 'دورود', 'کوهدشت', 'پلدختر'],
  'گلستان': ['گرگان', 'گنبد کاووس', 'علی‌آباد', 'آق‌قلا', 'کردکوی', 'مینودشت'],
  'هرمزگان': ['بندرعباس', 'میناب', 'بندر لنگه', 'قشم', 'کیش', 'رودان'],
  'یزد': ['یزد', 'میبد', 'اردکان', 'تفت', 'ابرکوه', 'بافق'],
  'زنجان': ['زنجان', 'ابهر', 'خدابنده', 'ماه‌نشان', 'خرمدره'],
  'سمنان': ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدی‌شهر'],
  'قزوین': ['قزوین', 'تاکستان', 'آبیک', 'بوئین‌زهرا', 'الوند'],
  'اردبیل': ['اردبیل', 'پارس‌آباد', 'مشگین‌شهر', 'خلخال', 'گرمی'],
  'بوشهر': ['بوشهر', 'کنگان', 'دیر', 'جم', 'گناوه', 'دیلم'],
  'ایلام': ['ایلام', 'دهلران', 'ایوان', 'آبدانان', 'دره‌شهر'],
  'چهارمحال و بختیاری': ['شهرکرد', 'بروجن', 'لردگان', 'فارسان', 'اردل'],
  'خراسان جنوبی': ['بیرجند', 'قائن', 'فردوس', 'نهبندان', 'سربیشه'],
  'خراسان شمالی': ['بجنورد', 'شیروان', 'جاجرم', 'اسفراین', 'مانه و سملقان'],
  'سیستان و بلوچستان': ['زاهدان', 'چابهار', 'ایرانشهر', 'خاش', 'سراوان', 'زابل'],
  'کهگیلویه و بویراحمد': ['یاسوج', 'گچساران', 'دنا', 'کهگیلویه', 'بهمئی'],
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    postal_code: '',
    address: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'post' | 'tehran'>('post');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card'>('online');
  const [discountCode, setDiscountCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      
      setUser(session.user);
      const cart = await getCart(session.user.id);
      setCartItems(cart);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, phone, postal_code, address')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setFormData({
          fullName: profileData.username || '',
          phone: profileData.phone || '',
          province: '',
          city: '',
          postal_code: profileData.postal_code || '',
          address: profileData.address || '',
        });
      }
      
      if (cart.length === 0) {
        router.push('/');
      }
    };
    
    loadData();
  }, [router]);

  // وقتی استان تغییر می‌کنه، شهرها رو آپدیت کن
  useEffect(() => {
    if (formData.province && cities[formData.province]) {
      setAvailableCities(cities[formData.province]);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [formData.province]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('لطفاً قوانین و مقررات خرید را مطالعه و تأیید کنید.');
      return;
    }

    if (!user) return;
    setLoading(true);
    
    try {
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));

      const fullAddress = `${formData.province} - ${formData.city} - ${formData.address}`;
      
      const order = await createOrder(user.id, items, {
        address: fullAddress,
        postal_code: formData.postal_code,
        phone: formData.phone,
      });
      
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = subtotal >= 3000000 ? 0 : (shippingMethod === 'post' ? 160000 : 0);

      await supabase
        .from('orders')
        .update({ 
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost,
          discount_code: discountCode || null,
          full_name: formData.fullName,
          province: formData.province,
          city: formData.city,
        })
        .eq('id', order.id);
      
      await supabase.from('cart').delete().eq('user_id', user.id);
      
      router.push(`/checkout/success/${order.id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 3000000 ? 0 : (shippingMethod === 'post' ? 160000 : 0);
  const total = subtotal + shippingCost;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">تسویه حساب و تکمیل خرید</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ستون راست: فرم اطلاعات */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* اطلاعات تماس */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">اطلاعات گیرنده</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 text-sm font-medium">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="نام کامل گیرنده"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">شماره موبایل *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="09xxxxxxxxx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">
                      کد پستی *
                      <span className="text-xs text-gray-500 mr-2 font-normal">(اگر کد پستی ندارید یک 0 بگذارید)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="10 رقم"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">استان *</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      required
                    >
                      <option value="">انتخاب استان</option>
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">شهر *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      disabled={!formData.province}
                      required
                    >
                      <option value="">
                        {formData.province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
                      </option>
                      {availableCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 text-sm font-medium">آدرس کامل *</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                      placeholder="خیابان، کوچه، پلاک، واحد..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* روش ارسال */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">روش ارسال</h2>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingMethod === 'post' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="post"
                      checked={shippingMethod === 'post'}
                      onChange={(e) => setShippingMethod(e.target.value as any)}
                      className="w-5 h-5 mt-1"
                    />
                    <div>
                      <p className="font-bold text-gray-900">پست پیشتاز</p>
                      <p className="text-sm text-gray-600">
                        {subtotal >= 3000000 ? 'ارسال رایگان (سفارش بالای ۳ میلیون تومان)' : '۶۰,۰۰۰ تومان - ارسال به سراسر کشور (۳ تا ۵ روز کاری)'}
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingMethod === 'tehran' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="tehran"
                      checked={shippingMethod === 'tehran'}
                      onChange={(e) => setShippingMethod(e.target.value as any)}
                      className="w-5 h-5 mt-1"
                    />
                    <div>
                      <p className="font-bold text-gray-900">تحویل حضوری در دفتر یوسف آباد تهران</p>
                      <p className="text-sm text-gray-600">بدون هزینه اضافی - خیابان یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۳۹، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد ۳</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* روش پرداخت */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">روش پرداخت</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">پرداخت امن زیبال</p>
                      <p className="text-sm text-gray-600">پرداخت امن به وسیله کلیه کارت‌های عضو شتاب از طریق درگاه زیبال</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">کارت به کارت</p>
                      <p className="text-sm text-gray-600">واریز به حساب و ارسال فیش واریزی</p>
                    </div>
                  </label>
                </div>

                {/* قوانین و مقررات */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      required
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      اطلاعات شخصی شما برای پردازش سفارش شما، پشتیبانی از تجربه شما در سراسر این وب سایت و برای اهدافی که در 
                      <a href="/privacy-policy" className="text-purple-600 hover:underline mx-1">سیاست حفظ حریم خصوصی</a> 
                      ذکر شده است استفاده می‌شود.
                      <br />
                      <strong className="text-red-600 block mt-2">⚠️ لطفاً پیش از ورود به صفحه پرداخت، VPN خود را خاموش کنید.</strong>
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'در حال پردازش...' : 'پرداخت و ثبت نهایی سفارش'}
                </button>
              </div>
            </div>

            {/* ستون چپ: خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">خلاصه سفارش</h2>
                
                {/* لیست محصولات */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-gray-500 text-xs mt-1">{item.quantity} عدد</p>
                      </div>
                      <p className="font-semibold text-gray-900 whitespace-nowrap mr-4">
                        {(item.price * item.quantity).toLocaleString()} تومان
                      </p>
                    </div>
                  ))}
                </div>

                {/* کد تخفیف */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="کد تخفیف"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button 
                      type="button"
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                      onClick={() => alert('سیستم کد تخفیف به زودی فعال می‌شود')}
                    >
                      اعمال
                    </button>
                  </div>
                </div>

                {/* جمع‌بندی */}
                <div className="space-y-3 border-t pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>جمع جزء:</span>
                    <span>{subtotal.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>حمل و نقل:</span>
                    <span>
                      {shippingCost === 0 ? 'رایگان' : `${shippingCost.toLocaleString()} تومان`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
                    <span>مجموع:</span>
                    <span className="text-purple-600">{total.toLocaleString()} تومان</span>
                  </div>
                </div>

                {/* نکات ارسال */}
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 text-xs text-gray-700 space-y-3">
                  <p className="font-bold text-purple-800">📦 نکات مهم درباره ارسال سفارشات:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>ارسال رایگان برای سفارشات بالای ۳ میلیون تومان در کل کشور</li>
                    <li>ارسال با پست پیشتاز به مبلغ ۱۶۰ هزار تومان برای تمامی کاربران در سراسر کشور</li>
                    <li>تحویل حضوری در تهران بدون هزینه اضافی</li>
                  </ul>
                  
                  <div className="pt-2 border-t border-purple-200">
                    <p className="font-bold text-purple-800 mb-1">📍 مرکز تحویل حضوری:</p>
                    <p className="mb-2"><strong>دفتر تهران:</strong> خیابان یوسف آباد، بالاتر از میدان جمال الدین اسد آبادی، نبش کوچه ۳، پلاک ۳۴۹، ساختمان کاج، طبقه دوم، واحد </p>
                  </div>

                  <div className="pt-2 border-t border-purple-200">
                    <p className="font-bold text-purple-800 mb-1">⏰ ساعات کاری دفتر تحویل حضوری:</p>
                    <p>شنبه تا چهارشنبه: ۱:۰۰ الی ۱:۰۰</p>
                    <p>پنجشنبه‌ها: ۰:۰۰ الی ۶:۰۰</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
