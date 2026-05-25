import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import type { Product } from '../types';

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    emoji: row.emoji as string,
    price: row.price as number,
    unit: row.unit as string,
    initialStock: row.initial_stock as number,
  };
}

export function loadProducts(): Product[] {
  return [];
}

export function useProducts() {
  const { farm } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!farm) return;
    supabase
      .from('products')
      .select('*')
      .eq('farm_id', farm.id)
      .order('name')
      .then(({ data }) => setProducts((data ?? []).map(toProduct)));
  }, [farm]);

  const addProduct = useCallback(async (product: Product): Promise<Product | null> => {
    if (!farm) return null;
    const { data } = await supabase
      .from('products')
      .insert({
        farm_id: farm.id,
        name: product.name,
        emoji: product.emoji,
        price: product.price,
        unit: product.unit,
        initial_stock: product.initialStock,
      })
      .select()
      .single();
    if (data) {
      const created = toProduct(data);
      setProducts(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      return created;
    }
    return null;
  }, [farm]);

  const removeProduct = useCallback(async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return { products, addProduct, removeProduct };
}