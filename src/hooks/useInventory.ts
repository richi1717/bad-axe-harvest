import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from '../context/AppContext'

export function useInventory() {
  const { farm } = useAppContext()
  const [inventory, setInventory] = useState<Record<string, number>>({})
  const syncedRef = useRef<Record<string, number>>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!farm) return
    supabase
      .from('inventory')
      .select('product_id, quantity')
      .eq('farm_id', farm.id)
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(
            data.map((r) => [r.product_id, r.quantity]),
          )
          setInventory(map)
          syncedRef.current = map
        }
      })
  }, [farm])

  useEffect(() => {
    if (!farm) return

    const dirty = Object.entries(inventory).filter(
      ([id, qty]) => syncedRef.current[id] !== qty,
    )

    if (dirty.length === 0) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      for (const [productId, quantity] of dirty) {
        const { error } = await supabase
          .from('inventory')
          .upsert(
            { farm_id: farm.id, product_id: productId, quantity },
            { onConflict: 'farm_id,product_id' },
          )
        if (error) console.error('[inventory]', error)
        else syncedRef.current[productId] = quantity
      }
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inventory, farm])

  const decrementStock = useCallback((productId: string, qty = 1) => {
    setInventory((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) - qty,
    }))
  }, [])

  const setStock = useCallback((productId: string, qty: number) => {
    setInventory((prev) => ({ ...prev, [productId]: qty }))
  }, [])

  const resetInventory = useCallback(async () => {
    if (!farm) return
    await supabase.from('inventory').delete().eq('farm_id', farm.id)
    setInventory({})
    syncedRef.current = {}
  }, [farm])

  return { inventory, decrementStock, setStock, resetInventory }
}
