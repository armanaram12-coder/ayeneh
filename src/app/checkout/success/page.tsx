'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { getOrderItems, getOrderStatusText, getOrderStatusColor } from '@/lib/orders';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    
    const loadOrder = async () => {
      // دریافت اطلاعات سفارش از طریق Supabase
      const { data: orderData } = await fetch(`/api/orders/${orderId}`).then(r => r.json());
      if (orderData) {
        setOrder(orderData);
        const orderItems = await getOrderItems(orderId);
        setItems(orderItems);
      }
      setLoading(false);
    };
    
    loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-600 text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">سفارش یافت نشد</div>
      </div>
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
            
            <div className="text-right mb-6">
              <h3 className="font-bold text-gray-900 mb-3">محصولات سفارش:</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">{item.product_name} (x{item.quantity})</span>
                    <span className="text-purple-600 font-semibold">{item.price.toLocaleString()} تومان</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-6 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>مجموع کل:</span>
                <span className="text-purple-600">{order.total_amount.toLocaleString()} تومان</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard?tab=orders')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90"
              >
                مشاهده در داشبورد
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50"
              >
                ادامه خرید
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
