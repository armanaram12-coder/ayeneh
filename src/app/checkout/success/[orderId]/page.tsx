'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { getOrderStatusText, getOrderStatusColor } from '@/lib/orders';

export default function CheckoutSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      window.location.href = '/';
      return;
    }
    
    const loadOrder = async () => {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError || !orderData) {
          console.error('Order fetch error:', orderError);
          setError('سفارش یافت نشد');
          setLoading(false);
          return;
        }

        setOrder(orderData);

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) {
          console.error('Items fetch error:', itemsError);
        } else {
          setItems(itemsData || []);
        }
      } catch (err) {
        console.error('Failed to load order', err);
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-purple-600 text-xl">در حال بارگذاری اطلاعات سفارش...</div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50" dir="rtl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'سفارش یافت نشد'}</h1>
          <Link 
            href="/"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 text-center"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12" dir="rtl">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-green-500 text-8xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">سفارش شما با موفقیت ثبت شد!</h1>
            <p className="text-gray-600 mb-6">شماره سفارش: <span className="font-bold text-purple-600">{order.order_number}</span></p>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-6 text-right">
              <h3 className="font-bold text-gray-900 mb-2">وضعیت سفارش:</h3>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                {getOrderStatusText(order.status)}
              </span>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-right border border-yellow-200">
              <h3 className="font-bold text-gray-900 mb-2">📍 اطلاعات ارسال:</h3>
              <p className="text-sm text-gray-700 mb-1"><strong>تلفن:</strong> {order.phone}</p>
              <p className="text-sm text-gray-700 mb-1"><strong>کد پستی:</strong> {order.postal_code}</p>
              <p className="text-sm text-gray-700"><strong>آدرس:</strong> {order.shipping_address}</p>
            </div>
            
            <div className="text-right mb-6">
              <h3 className="font-bold text-gray-900 mb-3">محصولات سفارش:</h3>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm">آیتمی یافت نشد</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700">{item.product_name} (x{item.quantity})</span>
                      <span className="text-purple-600 font-semibold">{item.price.toLocaleString()} تومان</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="border-t pt-6 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>مجموع کل:</span>
                <span className="text-purple-600">{order.total_amount.toLocaleString()} تومان</span>
              </div>
            </div>
            
            {/* دکمه‌ها با استفاده از Link برای جلوگیری از باز شدن تب جدید یا رفرش */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                مشاهده در داشبورد
              </Link>
              <Link
                href="/"
                className="flex-1 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
