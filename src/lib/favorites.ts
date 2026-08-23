import { supabase } from './supabase';

export const toggleFavorite = async (userId: string, productId: number): Promise<boolean> => {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return false; // Removed from favorites
  } else {
    await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId });
    return true; // Added to favorites
  }
};

export const getFavorites = async (userId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);
  
  if (error) return [];
  return data.map(item => item.product_id);
};

export const isFavorite = async (userId: string, productId: number): Promise<boolean> => {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  
  return !!data;
};
