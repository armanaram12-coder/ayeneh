'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { getCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    address: '',
    postal_code: '',
    phone: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      
      setUser(session.user);
      
      // دریافت اطلاعات سبد خرید
      const cart = await getCart(session.user.id);
      setCartItems(cart);
      
      // دریافت اطلاعات پروفایل برای پر کردن خودکار فرم
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        setFormData({
          address: profileData.address || '',
          postal_code: profileData.postal_code || '',
          phone: profileData.phone || '',
        });
      }
      
      // اگر سبد خرید خالی بود، برگرد به صفحه اصلی
      if (cart.length === 0) {
        router.push('/');
      }
    };
    
    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      // آماده‌سازی آیتم‌ها برای ثبت در دیتابیس
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      }));
      
      // ایجاد سفارش در سوپابیس
      const order = await createOrder(user.id, items, formData);
      
      // خالی کردن سبد خرید بعد از ثبت موفق
      await supabase.from('cart').delete().eq('user_id', user.id);
      
      // هدایت به صفحه موفقیت با استفاده از مسیر داینامیک (Next.js 15)
      router.push(`/checkout/success/${order.id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('خطا در ثبت سفارش: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">تسویه حساب</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* فرم اطلاعات ارسال */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">اطلاعات ارسال</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">شماره تلفن</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">کد پستی</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">آدرس کامل</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                    placeholder="آدرس دقیق پستی"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
                </button>
              </form>
            </div>
            
            {/* خلاصه سفارش */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">خلاصه سفارش</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.product_name}</h3>
                      <p className="text-xs text-gray-600">تعداد: {item.quantity}</p>
                    </div>
                    <p className="text-purple-600 font-bold">
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">مجموع قابل پرداخت:</span>
                  <span className="text-xl font-bold text-purple-600">{total.toLocaleString()} تومان</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * هزینه ارسال پس از بررسی آدرس توسط پشتیبانی محاسبه و اطلاع‌رسانی خواهد شد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
