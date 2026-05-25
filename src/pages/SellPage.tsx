import { useState, useCallback } from 'react';
import {
  Box, Typography, Grid, Button, Drawer, Divider,
  IconButton, Stack, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ProductCard } from '../components/ProductCard';
import { AddItemWizard } from '../components/AddItemWizard';
import { useInventory } from '../hooks/useInventory';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import type { CartItem, Product } from '../types';

export function SellPage() {
  const { inventory, decrementStock, setStock } = useInventory();
  const { products, addProduct } = useProducts();
  const { recordSale } = useSales();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [saleComplete, setSaleComplete] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [negativeWarning, setNegativeWarning] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleTap = useCallback((productId: string, productList: Product[]) => {
    const product = productList.find(p => p.id === productId)!;
    setCart(prev => {
      const hit = prev.find(i => i.product.id === productId);
      if (hit) {
        return prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleRemove = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const wouldGoNegative = cart.some(item => {
    const current = inventory[item.product.id] ?? item.product.initialStock;
    return current - item.quantity < 0;
  });

  const executeSale = useCallback(async () => {
    await recordSale(cart);
    cart.forEach(item => decrementStock(item.product.id, item.quantity));
    setCart([]);
    setCartOpen(false);
    setNegativeWarning(false);
    setSaleComplete(true);
  }, [cart, decrementStock, recordSale]);

  const handleConfirmSale = useCallback(() => {
    if (wouldGoNegative) {
      setNegativeWarning(true);
    } else {
      executeSale();
    }
  }, [wouldGoNegative, executeSale]);

  const handleAddProduct = useCallback(async (product: Product) => {
    const created = await addProduct(product);
    if (created && created.initialStock > 0) {
      setStock(created.id, created.initialStock);
    }
  }, [addProduct, setStock]);

  const handleClear = useCallback(() => {
    setCart([]);
    setCartOpen(false);
  }, []);

  return (
    <Box sx={{ pb: 14 }}>
      <Box
        sx={{
          px: 2.5,
          pt: 3.5,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{ fontSize: '2rem', fontWeight: 900, color: '#F59E0B', lineHeight: 1, letterSpacing: '-0.01em' }}
          >
            SELL
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tap products to add
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setWizardOpen(true)}
          sx={{
            fontWeight: 700,
            color: '#F59E0B',
            border: '1.5px solid rgba(245,158,11,0.35)',
            borderRadius: 3,
            px: 1.5,
            py: 0.75,
            fontSize: '0.85rem',
            '&:hover': { bgcolor: 'rgba(245,158,11,0.08)' },
          }}
        >
          Add Item
        </Button>
      </Box>

      <Box sx={{ px: 1.5 }}>
        <Grid container spacing={1.5}>
          {products.map(product => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard
                product={product}
                stock={inventory[product.id] ?? product.initialStock}
                quantity={cart.find(i => i.product.id === product.id)?.quantity ?? 0}
                onTap={() => handleTap(product.id, products)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {cartCount > 0 && (
        <Box sx={{ position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 100 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon sx={{ fontSize: '1.4rem !important' }} />}
            onClick={() => setCartOpen(true)}
            sx={{
              py: 2,
              fontSize: '1.15rem',
              fontWeight: 900,
              bgcolor: '#F59E0B',
              color: '#000',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(245,158,11,0.45)',
              '&:hover': { bgcolor: '#D97706' },
            }}
          >
            {cartCount} item{cartCount !== 1 ? 's' : ''}&nbsp;&nbsp;·&nbsp;&nbsp;${cartTotal.toFixed(2)}
          </Button>
        </Box>
      )}

      <Drawer
        anchor="bottom"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        slotProps={{
          paper: {
            sx: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '82vh' },
          },
        }}
      >
        <Box sx={{ p: 3, pb: 4 }}>
          <Box sx={{ width: 44, height: 4, bgcolor: '#3A3A3A', borderRadius: 2, mx: 'auto', mb: 2.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
            Current Sale
          </Typography>
          <Stack spacing={2} sx={{ mb: 2.5 }}>
            {cart.map(item => {
              const current = inventory[item.product.id] ?? item.product.initialStock;
              const goesNegative = current - item.quantity < 0;
              return (
                <Box key={item.product.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{item.product.emoji}</Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{item.product.name}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: goesNegative ? '#EF4444' : 'text.secondary' }}>
                      {item.quantity} × ${item.product.price.toFixed(2)}/{item.product.unit}
                      {goesNegative && ' · goes negative'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: '#F59E0B', fontSize: '1.1rem', flexShrink: 0 }}>
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemove(item.product.id)} sx={{ color: '#555', flexShrink: 0 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>
          <Divider sx={{ borderColor: '#2A2A2A', mb: 2.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Total</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#F59E0B' }}>
              ${cartTotal.toFixed(2)}
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleConfirmSale}
              sx={{
                py: 2.25,
                fontSize: '1.2rem',
                fontWeight: 900,
                bgcolor: '#10B981',
                color: '#fff',
                borderRadius: '14px',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              CONFIRM SALE
            </Button>
            <Button fullWidth variant="text" onClick={handleClear} sx={{ color: '#666', fontWeight: 600, py: 1.25 }}>
              Clear Sale
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <Dialog
        open={negativeWarning}
        onClose={() => setNegativeWarning(false)}
        slotProps={{
          paper: { sx: { bgcolor: '#1C1C1C', borderRadius: 4, px: 1, pb: 1, maxWidth: 360 } },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <WarningAmberIcon sx={{ color: '#F59E0B', fontSize: '1.8rem' }} />
          Heads up
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            One or more items will go below zero. That might mean inventory wasn't logged — worth double-checking.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, gap: 1, pb: 2 }}>
          <Button onClick={() => setNegativeWarning(false)} sx={{ color: '#666', fontWeight: 700, flex: 1 }}>
            Go back
          </Button>
          <Button
            variant="contained"
            onClick={executeSale}
            sx={{ bgcolor: '#F59E0B', color: '#000', fontWeight: 900, flex: 1, '&:hover': { bgcolor: '#D97706' } }}
          >
            Sell anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={saleComplete}
        autoHideDuration={2500}
        onClose={() => setSaleComplete(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ fontWeight: 700, fontSize: '1rem', borderRadius: 2 }}>
          Sale recorded ✓
        </Alert>
      </Snackbar>

      <AddItemWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onAdd={handleAddProduct}
      />
    </Box>
  );
}