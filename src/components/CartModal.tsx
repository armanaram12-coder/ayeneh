'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id?: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export default function CartModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', session.user.id);
        setCartItems(data || []);
      }
      setLoading(false);
    };
    
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    alert('سیستم پرداخت به زودی فعال می‌شود!');
  };

  const handleClearCart = async () => {
    if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟')) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('cart').delete().eq('user_id', session.user.id);
        setCartItems([]);
      }
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto" dir="rtl">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">سبد خرید</h2>
        
        {loading ? (
          <div className="text-center py-8">در حال بارگذاری...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4"></div>
            <p className="text-gray-600">سبد خرید شما خالی است</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product_id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                  <p className="text-purple-600">{item.price.toLocaleString()} تومان</p>
                </div>
                <div className="text-gray-700">تعداد: {item.quantity}</div>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">مجموع:</span>
                <span className="text-xl font-bold text-purple-600">{total.toLocaleString()} تومان</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCheckout} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold">
                  ادامه فرآیند خرید
                </button>
                <button onClick={handleClearCart} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  خالی کردن سبد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
