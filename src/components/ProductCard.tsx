import { Box, Card, CardActionArea, Typography, Chip } from '@mui/material';
import type { Product } from '../types';

interface Props {
  product: Product;
  stock: number;
  quantity: number;
  onTap: () => void;
}

function stockColor(stock: number): string {
  if (stock === 0) return '#EF4444';
  if (stock <= 5) return '#F59E0B';
  return '#10B981';
}

export function ProductCard({ product, stock, quantity, onTap }: Props) {
  const outOfStock = stock === 0;
  const selected = quantity > 0;

  return (
    <Card
      sx={{
        position: 'relative',
        bgcolor: selected ? 'rgba(245,158,11,0.10)' : 'background.paper',
        border: selected ? '3px solid #F59E0B' : '3px solid transparent',
        opacity: outOfStock ? 0.4 : 1,
        transition: 'border-color 0.1s ease, background-color 0.1s ease',
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      <CardActionArea
        disabled={outOfStock}
        onClick={onTap}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          minHeight: 168,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {selected && (
          <Chip
            label={`×${quantity}`}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: '#F59E0B',
              color: '#000',
              fontWeight: 900,
              fontSize: '0.85rem',
              height: 26,
              minWidth: 32,
            }}
          />
        )}

        <Typography sx={{ fontSize: '3.75rem', lineHeight: 1, userSelect: 'none' }}>
          {product.emoji}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            mt: 0.5,
            fontSize: '0.95rem',
          }}
        >
          {product.name}
        </Typography>

        <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>
          ${product.price.toFixed(2)}
          <Typography
            component="span"
            sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 400, ml: 0.5 }}
          >
            /{product.unit}
          </Typography>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: stockColor(stock),
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1 }}>
            {outOfStock ? 'Out of stock' : `${stock} left`}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}