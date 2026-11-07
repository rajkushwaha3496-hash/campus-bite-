import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper queries with graceful local fallback
export const supabaseService = {
  isConfigured: isSupabaseConfigured,

  // Fetch food items from Supabase
  async getMenuItems() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('name');
      if (error) {
        console.warn('[CampusBite] Supabase menu query error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[CampusBite] Supabase connection failed:', err);
      return null;
    }
  },

  // Save new order to Supabase
  async saveOrder(order: any) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: order.orderNumber,
          type: order.type,
          status: order.status,
          item_total: order.itemTotal,
          delivery_fee: order.deliveryFee,
          discount: order.discount,
          promo_code_applied: order.promoCodeApplied,
          final_amount: order.finalAmount,
          student_name: order.studentName,
          student_phone: order.studentPhone,
          student_id: order.studentId,
          delivery_slot: order.deliverySlot,
          delivery_pin: order.deliveryPin,
          pickup_slot: order.pickupSlot,
          pickup_counter: order.pickupCounter,
          pickup_qr_code: order.pickupQrCode,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus
        }])
        .select();

      if (error) {
        console.warn('[CampusBite] Supabase order insert error:', error.message);
        return null;
      }
      return data?.[0] || null;
    } catch (err) {
      console.warn('[CampusBite] Supabase order save failed:', err);
      return null;
    }
  },

  // Update order status in Supabase
  async updateOrderStatus(orderNumber: string, status: string) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('order_number', orderNumber)
        .select();
      if (error) {
        console.warn('[CampusBite] Supabase status update error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      return null;
    }
  }
};
