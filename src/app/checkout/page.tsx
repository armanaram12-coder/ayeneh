'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { getCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';
import { provinces, getCitiesByProvince } from '@/lib/cities';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    postal_code: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card'>('online');
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
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        setFormData(prev => ({
          ...prev,
          phone: profileData.phone || '',
          postal_code: profileData.postal_code || '',
          address: profileData.address || '',
        }));
      }
      
      if (cart.length === 0) {
        router.push('/');
      }
    };
    
    loadData();
  }, [router]);

  useEffect(() => {
    if (formData.province) {
      setAvailableCities(getCitiesByProvince(formData.province));
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [formData.province]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      await supabase
        .from('orders')
        .update({ payment_method: paymentMethod })
        .eq('id', order.id);
      
      await supabase.from('cart').delete().eq('user_id', user.id);
      
      router.push(`/checkout/success/${order.id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('خطا در ثبت سفارش');
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">اطلاعات ارسال</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">استان</label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">شهر</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                      disabled={!formData.province}
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
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
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">روش پرداخت</h3>
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
                        <p className="font-bold text-gray-900">پرداخت آنلاین</p>
                        <p className="text-sm text-gray-600">اتصال به درگاه بانکی</p>
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
                        <p className="text-sm text-gray-600">واریز به حساب و ارسال رسید</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت...' : 'پرداخت'}
                </button>
              </form>
            </div>
            
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
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">مجموع قابل پرداخت:</span>
                  <span className="text-xl font-bold text-purple-600">{total.toLocaleString()} تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
