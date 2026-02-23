import { supabase } from '@/api/supabase';
import { logger } from '@/shared/lib/logger';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  total: number;
  items: OrderItem[];
}

interface CreateOrderResult {
  orderId: string;
}

/**
 * Repository for order-related database operations.
 * Follows the same pattern as ProductRepository for consistency.
 */
export const OrderRepository = {
  /**
   * Creates a new order with its items in Supabase.
   * Inserts the order first, then the order items referencing the order ID.
   *
   * @throws Will throw an error if the order creation fails.
   */
  async create({ total, items }: CreateOrderInput): Promise<CreateOrderResult> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ total, status: 'pending' }])
      .select('id')
      .single();

    if (orderError) {
      logger.error('Error creating order:', orderError);
      throw orderError;
    }

    if (order) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        logger.error('Error inserting order_items:', itemsError);
      }
    }

    return { orderId: order.id };
  },
};
