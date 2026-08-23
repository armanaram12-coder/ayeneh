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
  
  const [formData, setFormData] = useState({
    phone: '',
    postal_code: '',
    address: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'post' | 'tehran' | 'mashhad'>('post');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card'>('online');
  const [discountCode, setDiscountCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

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
        .select('phone, postal_code, address')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setFormData({
          phone: profileData.phone || '',
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
      
      const order = await createOrder(user.id, items, formData);
      
      // محاسبه هزینه ارسال برای ذخیره در دیتابیس
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = subtotal >= 3000000 ? 0 : (shippingMethod === 'post' ? 160000 : 0);

      await supabase
        .from('orders')
        .update({ 
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost,
          discount_code: discountCode || null
        })
        .eq('id', order.id);
      
      await supabase.from('cart').delete().eq('user_id', user.id);
      
      // هدایت به صفحه موفقیت (یا درگاه پرداخت)
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
            
            {/* ستون راست: فرم اطلاعات (۶۶٪) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* اطلاعات تماس */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">اطلاعات تماس و ارسال</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm font-medium">شماره موبایل *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target
