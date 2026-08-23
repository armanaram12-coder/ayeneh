import { supabase } from './supabase';

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  postal_code: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  items: Array<{
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
  }>,
  shippingInfo: {
    address: string;
    postal_code: string;
    phone: string;
  }
) => {
  // تولید شماره سفارش یکتا
  const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ایجاد سفارش
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      status: 'pending',
      total_amount: totalAmount,
      shipping_address: shippingInfo.address,
      postal_code: shippingInfo.postal_code,
      phone: shippingInfo.phone,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || 'خطا در ایجاد سفارش');
  }

  // ایجاد آیتم‌های سفارش
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    // اگر آیتم‌ها خطا دادن، سفارش رو حذف کن
    await supabase.from('orders').delete().eq('id', order.id);
    throw new Error(itemsError.message);
  }

  return order;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
};

export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error fetching order items:', error);
    return [];
  }

  return data || [];
};

export const getOrderStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده',
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};
