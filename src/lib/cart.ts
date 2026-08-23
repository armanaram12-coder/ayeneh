import { supabase } from './supabase';

export interface CartItem {
  id?: string;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export const getCart = async (userId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
  return data || [];
};

export const addToCart = async (userId: string, product: { id: number; name: string; price: number }) => {
  const { data: existing } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', product.id)
    .single();

  if (existing) {
    await supabase
      .from('cart')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('cart')
      .insert({
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1
      });
  }
  return getCart(userId);
};

export const removeFromCart = async (userId: string, productId: number) => {
  await supabase.from('cart').delete().eq('user_id', userId).eq('product_id', productId);
  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  await supabase.from('cart').delete().eq('user_id', userId);
  return [];
};

export const getCartCount = async (userId: string | null): Promise<number> => {
  if (!userId) return 0;
  const { data, error } = await supabase
    .from('cart')
    .select('quantity')
    .eq('user_id', userId);
  
  if (error) return 0;
  return data.reduce((sum, item) => sum + item.quantity, 0);
};
