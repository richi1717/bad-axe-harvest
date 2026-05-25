import { useState, useCallback, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardActionArea,
  Button, IconButton, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UndoIcon from '@mui/icons-material/Undo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useInventory } from '../hooks/useInventory';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

interface PickerCardProps {
  product: Product;
  expected: number;
  onSelect: () => void;
}

function PickerCard({ product, expected, onSelect }: PickerCardProps) {
  return (
    <Card sx={{ bgcolor: 'background.paper', border: '3px solid transparent' }}>
      <CardActionArea
        onClick={onSelect}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          minHeight: 148,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <Typography sx={{ fontSize: '3.5rem', lineHeight: 1 }}>
          {product.emoji}
        </Typography>
        <Typography
          sx={{ fontWeight: 700, textAlign: 'center', fontSize: '0.95rem', lineHeight: 1.2, mt: 0.5 }}
        >
          {product.name}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.25 }}>
          {expected} expected
        </Typography>
      </CardActionArea>
    </Card>
  );
}

interface CounterViewProps {
  product: Product;
  expected: number;
  onSave: (count: number) => void;
  onBack: () => void;
}

function CounterView({ product, expected, onSave, onBack }: CounterViewProps) {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState('');

  const handleTap = useCallback(() => {
    setHistory(prev => [...prev, count]);
    setCount(c => c + 1);
    if (navigator.vibrate) navigator.vibrate(8);
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 80);
  }, [count]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    setCount(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const handleReset = useCallback(() => {
    setHistory([]);
    setCount(0);
  }, []);

  const openDialog = () => { setDialogValue(String(count)); setDialogOpen(true); };

  const confirmDialog = () => {
    const n = parseInt(dialogValue, 10);
    if (!isNaN(n) && n >= 0) {
      setHistory(prev => [...prev, count]);
      setCount(n);
    }
    setDialogOpen(false);
  };

  const diff = count - expected;
  const diffColor = diff === 0 ? '#10B981' : diff > 0 ? '#F59E0B' : '#EF4444';
  const diffLabel = diff === 0 ? 'matches expected' : diff > 0 ? `+${diff} over` : `${diff} short`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', pb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          pt: 2.5,
          pb: 2,
          flexShrink: 0,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: 'text.secondary', ml: -1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{product.emoji}</Typography>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {expected} expected
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          py: 1,
        }}
      >
        <Box
          onClick={openDialog}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            borderRadius: 2,
            px: 1,
            '&:active': { opacity: 0.7 },
          }}
        >
          <Typography
            sx={{
              fontSize: 'clamp(5rem, 22vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </Typography>
          <EditIcon sx={{ fontSize: '1.5rem', color: '#444', mb: 1, alignSelf: 'flex-end' }} />
        </Box>
        <Typography sx={{ fontSize: '0.72rem', color: '#444', letterSpacing: '0.05em', mt: 0.25 }}>
          tap number to type
        </Typography>
        {count > 0 && (
          <Typography sx={{ fontSize: '0.85rem', color: diffColor, fontWeight: 700, mt: 0.5 }}>
            {diffLabel}
          </Typography>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        slotProps={{ paper: { sx: { bgcolor: '#1C1C1C', borderRadius: 4, px: 1, pb: 1, width: '100%', maxWidth: 340 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          {product.emoji} Set count
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            type="number"
            value={dialogValue}
            onChange={e => setDialogValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmDialog(); }}
            slotProps={{ htmlInput: { inputMode: 'numeric', min: 0, style: { fontSize: '2.5rem', fontWeight: 900, textAlign: 'center', padding: '12px 8px' } } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#666', fontWeight: 700, flex: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDialog}
            sx={{ bgcolor: '#F59E0B', color: '#000', fontWeight: 900, flex: 1, '&:hover': { bgcolor: '#D97706' } }}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="button"
        onClick={handleTap}
        sx={{
          flex: 1,
          mx: 2,
          mb: 2,
          borderRadius: '24px',
          border: flash ? '3px solid rgba(245,158,11,0.6)' : '3px solid #2A2A2A',
          cursor: 'pointer',
          bgcolor: flash ? 'rgba(245,158,11,0.18)' : '#1C1C1C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          transition: 'background-color 0.06s ease, border-color 0.06s ease',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          '&:active': { bgcolor: 'rgba(245,158,11,0.24)', transform: 'scale(0.988)' },
          minHeight: 180,
        }}
      >
        <Typography
          sx={{
            fontSize: '5rem',
            lineHeight: 1,
            userSelect: 'none',
            filter: flash ? 'drop-shadow(0 0 12px rgba(245,158,11,0.7))' : 'none',
            transition: 'filter 0.06s ease',
          }}
        >
          {product.emoji}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: flash ? '#F59E0B' : '#666',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'color 0.06s ease',
            userSelect: 'none',
          }}
        >
          Tap to count
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, px: 2, pb: 1, flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={handleUndo}
          disabled={history.length === 0}
          sx={{
            flex: 1,
            py: 1.75,
            fontWeight: 700,
            borderColor: '#333',
            color: history.length > 0 ? 'text.primary' : 'text.secondary',
            '&:hover': { borderColor: '#555' },
            '&.Mui-disabled': { borderColor: '#222', color: '#333' },
          }}
        >
          Undo
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={count === 0}
          sx={{
            flex: 1,
            py: 1.75,
            fontWeight: 700,
            borderColor: '#333',
            color: count > 0 ? 'text.primary' : 'text.secondary',
            '&:hover': { borderColor: '#555' },
            '&.Mui-disabled': { borderColor: '#222', color: '#333' },
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={<TaskAltIcon />}
          onClick={() => onSave(count)}
          sx={{
            flex: 1.4,
            py: 1.75,
            fontWeight: 900,
            bgcolor: '#10B981',
            color: '#fff',
            '&:hover': { bgcolor: '#059669' },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export function CountPage() {
  const { inventory, setStock } = useInventory();
  const { products } = useProducts();
  const [active, setActive] = useState<Product | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback((product: Product, count: number) => {
    setStock(product.id, count);
    setActive(null);
    setSaved(true);
  }, [setStock]);

  if (active) {
    return (
      <CounterView
        product={active}
        expected={inventory[active.id] ?? active.initialStock}
        onSave={(count) => handleSave(active, count)}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ px: 2.5, pt: 3.5, pb: 2 }}>
        <Typography
          component="div"
          sx={{ fontSize: '2rem', fontWeight: 900, color: '#F59E0B', lineHeight: 1, letterSpacing: '-0.01em' }}
        >
          COUNT
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Pick a product to start counting
        </Typography>
      </Box>

      <Box sx={{ px: 1.5 }}>
        <Grid container spacing={1.5}>
          {products.map(product => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <PickerCard
                product={product}
                expected={inventory[product.id] ?? product.initialStock}
                onSelect={() => setActive(product)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={saved}
        autoHideDuration={2500}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ fontWeight: 700, fontSize: '1rem', borderRadius: 2 }}>
          Count saved ✓
        </Alert>
      </Snackbar>
    </Box>
  );
}