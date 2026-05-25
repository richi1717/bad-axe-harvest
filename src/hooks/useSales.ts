import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import type { CartItem } from '../types';

export function useSales() {
  const { farm } = useAppContext();

  const recordSale = useCallback(async (items: CartItem[]) => {
    if (!farm || items.length === 0) return;
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const { data: sale } = await supabase
      .from('sales')
      .insert({ farm_id: farm.id, total })
      .select('id')
      .single();

    if (!sale) return;

    await supabase.from('sale_items').insert(
      items.map(i => ({
        sale_id: sale.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price_at_time: i.product.price,
      })),
    );
  }, [farm]);

  return { recordSale };
}