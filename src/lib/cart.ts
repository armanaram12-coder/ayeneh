import { supabase } from './supabase';

export interface CartItem {
  id?: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Get cart items from Supabase (for logged-in users)
export const getCartFromSupabase = async (userId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
  
  return data || [];
};

// Add item to cart in Supabase
export const addToCartSupabase = async (userId: string, item: Omit<CartItem, 'id'>) => {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', item.product_id)
    .single();
  
  if (existing) {
    // Update quantity
    await supabase
      .from('cart')
      .update({ quantity: existing.quantity + 1, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    // Insert new item
    await supabase
      .from('cart')
      .insert({ ...item, user_id: userId, quantity: 1 });
  }
  
  return getCartFromSupabase(userId);
};

// Remove item from cart
export const removeFromCart = async (userId: string, productId: number) => {
  await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  
  return getCartFromSupabase(userId);
};

// Clear cart
export const clearCart = async (userId: string) => {
  await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);
};

// Get cart count
export const getCartCount = async (userId: string | null): Promise<number> => {
  if (!userId) return 0;
  const items = await getCartFromSupabase(userId);
  return items.reduce((sum, item) => sum + item.quantity, 0);
};
