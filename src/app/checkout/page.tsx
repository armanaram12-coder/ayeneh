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

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card'>('online');
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState('');

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
        setFormData({
          address: profileData.address || '',
          postal_code: profileData.postal_code || '',
          phone: profileData.phone || '',
        });
      }
      
      if (cart.length === 0) {
        router.push('/');
      }
    };
    
    loadData();
  }, [router]);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

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
      
      const order = await createOrder(user.id, items, formData);
      
      // ذخیره روش پرداخت
      await supabase
        .from('orders')
        .update({
          payment_method: paymentMethod,
          card_number: paymentMethod === 'card' ? cardNumber : null,
          card_holder_name: paymentMethod === 'card' ? cardHolderName : null,
        })
        .eq('id', order.id);

      // اگر کارت به کارت بود، آپلود فیش
      if (paymentMethod === 'card' && receiptImage) {
        const fileExt = receiptImage.name.split('.').pop();
        const fileName = `${order.id}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(filePath, receiptImage);
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath);
          
          await supabase
            .from('orders')
            .update({ receipt_url: publicUrl })
            .eq('id', order.id);
        }
      }
      
      await supabase.from('cart').delete().eq('user_id', user.id);
      
      if (paymentMethod === 'online') {
        // هدایت به درگاه زرین‌پال
        const response = await fetch('/api/payment/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId: order.id, 
            amount: order.total_amount 
          }),
        });
        
        const result = await response.json();
        
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          alert('خطا در اتصال به درگاه پرداخت');
          router.push(`/checkout/success/${order.id}`);
        }
      } else {
        // کارت به کارت - مستقیم به صفحه موفقیت
        router.push(`/checkout/success/${order.id}`);
      }
      
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

                {/* انتخاب روش پرداخت */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">روش پرداخت</h3>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
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
                      paymentMethod === 'card' 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
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
                        <p className="text-sm text-gray-600">واریز به حساب و ارسال فیش</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* اطلاعات کارت به کارت */}
                {paymentMethod === 'card' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">شماره کارت:</p>
                      <p className="text-xl font-bold text-purple-600 font-mono" dir="ltr">6037-9975-1234-5678</p>
                      <p className="text-sm text-gray-600 mt-2">به نام: آینه فروشگاه</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">شماره کارت شما</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                        placeholder="16 رقم"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">نام صاحب کارت</label>
                      <input
                        type="text"
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">تصویر فیش واریزی</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500"
                        required
                      />
                      {receiptPreview && (
                        <img 
                          src={receiptPreview} 
                          alt="فیش" 
                          className="mt-2 max-h-48 rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت سفارش...' : 'پرداخت'}
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
