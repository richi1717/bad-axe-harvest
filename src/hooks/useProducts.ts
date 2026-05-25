import { useState, useCallback } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import type { Product } from '../types';

const STORAGE_KEY = 'bah_products';

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PRODUCTS;
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const next = [...prev, product];
      saveProducts(next);
      return next;
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProducts(next);
      return next;
    });
  }, []);

  return { products, addProduct, removeProduct };
}