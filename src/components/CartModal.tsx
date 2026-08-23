'use client';

import { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } from '@/lib/cart';
import type { CartItem } from '@/lib/cart';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Load cart items when modal opens
  useEffect(() => {
    if (isOpen) {
      const items = getCart();
      setCartItems(items);
      setTotal(getCartTotal());
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleRemoveItem = (itemId: number) => {
    const updatedCart = removeFromCart(itemId);
    setCartItems(updatedCart);
    setTotal(getCartTotal());
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
    setTotal(getCartTotal());
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setTotal(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">سبد خرید</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items or Empty State */}
        {cartItems.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg mb-2">سبد خرید شما خالی است</p>
            <p className="text-gray-400 text-sm">برای افزودن محصول به سبد خرید، از فروشگاه دیدن کنید</p>
            <button
              onClick={onClose}
              className="mt-6 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-purple-600 font-bold">{item.price.toLocaleString('fa-IR')} تومان</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Actions */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">مجموع:</span>
                <span className="text-xl font-bold text-purple-600">{total.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                >
                  خالی کردن سبد
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#E879F9] text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  ادامه خرید
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
