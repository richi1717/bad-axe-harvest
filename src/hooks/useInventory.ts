import { useState, useCallback } from 'react';
import { loadProducts } from './useProducts';

const STORAGE_KEY = 'bah_inventory';

function loadInventory(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return Object.fromEntries(loadProducts().map(p => [p.id, p.initialStock]));
}

function saveInventory(inventory: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, number>>(loadInventory);

  const decrementStock = useCallback((productId: string, qty = 1) => {
    setInventory(prev => {
      const next = { ...prev, [productId]: Math.max(0, (prev[productId] ?? 0) - qty) };
      saveInventory(next);
      return next;
    });
  }, []);

  const setStock = useCallback((productId: string, qty: number) => {
    setInventory(prev => {
      const next = { ...prev, [productId]: Math.max(0, qty) };
      saveInventory(next);
      return next;
    });
  }, []);

  const resetInventory = useCallback(() => {
    const fresh = Object.fromEntries(loadProducts().map(p => [p.id, p.initialStock]));
    saveInventory(fresh);
    setInventory(fresh);
  }, []);

  return { inventory, decrementStock, setStock, resetInventory };
}