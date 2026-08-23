export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('ayeneh_cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem('ayeneh_cart', JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (itemId: number) => {
  const cart = getCart();
  const updatedCart = cart.filter(i => i.id !== itemId);
  localStorage.setItem('ayeneh_cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export const updateCartItemQuantity = (itemId: number, quantity: number) => {
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem('ayeneh_cart', JSON.stringify(cart));
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem('ayeneh_cart');
  return [];
};

export const getCartCount = (): number => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

export const getCartTotal = (): number => {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
};
