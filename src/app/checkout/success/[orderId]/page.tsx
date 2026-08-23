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
  const [paying, setPaying] = useState(false);

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

  const handlePayment = async () => {
    if (!order) return;
    
    setPaying(true);
    
    try {
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
        alert('خطا در اتصال به درگاه پرداخت: ' + (result.error || 'نامشخص'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('خطا در درخواست پرداخت');
    } finally {
      setPaying(false);
    }
  };

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

            {/* اگر کارت به کارت بود، پیام تأیید فیش */}
            {order.payment_method === 'card' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-700 font-bold">📋 سفارش شما پس از تأیید فیش واریزی پردازش خواهد شد</p>
                <p className="text-sm text-blue-600 mt-2">پشتیبانی در اسرع وقت فیش شما را بررسی می‌کند</p>
              </div>
            )}

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

            {order.status === 'paid' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700 font-bold">✅ این سفارش قبلاً پرداخت شده است</p>
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              {order.status !== 'paid' && order.payment_method !== 'card' && (
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                >
                  {paying ? 'در حال اتصال به درگاه...' : 'پرداخت'}
                </button>
              )}
              
              <Link
                href="/dashboard"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                مشاهده سفارش در داشبورد
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              در صورت بروز مشکل در پرداخت، با پشتیبانی تماس بگیرید.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
