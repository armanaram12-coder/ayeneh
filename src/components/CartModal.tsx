'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCart, removeFromCart, clearCart } from '@/lib/cart';

interface CartItem {
  id?: string;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export default function CartModal({ isOpen, onClose, userId }: { isOpen: boolean; onClose: () => void; userId: string | null }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      if (userId) {
        const items = await getCart(userId);
        setCartItems(items);
      }
      setLoading(false);
    };
    if (isOpen) {
      setLoading(true);
      loadCart();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('برای تکمیل خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.');
      window.dispatchEvent(new Event('openAuthModal'));
      onClose();
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = async () => {
    if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟') && userId) {
      await clearCart(userId);
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated')); // ✅ به‌روزرسانی هدر
    }
  };

  const handleRemoveItem = async (productId: number) => {
    if (userId) {
      const updatedCart = await removeFromCart(userId, productId);
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated')); // ✅ به‌روزرسانی هدر
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto" dir="rtl">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">✕</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">سبد خرید</h2>
        {loading ? (
          <div className="text-center py-8">در حال بارگذاری...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🛒</div>
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
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">تعداد: {item.quantity}</span>
                  <button onClick={() => handleRemoveItem(item.product_id)} className="text-red-500 hover:text-red-700 text-sm bg-red-50 px-2 py-1 rounded">حذف</button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">مجموع:</span>
                <span className="text-xl font-bold text-purple-600">{total.toLocaleString()} تومان</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCheckout} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">ادامه فرآیند خرید</button>
                <button onClick={handleClearCart} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">خالی کردن سبد</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
