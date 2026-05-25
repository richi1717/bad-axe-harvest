import { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, IconButton, Button, TextField,
  InputAdornment, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import type { Product } from '../types';

const FARM_EMOJIS = [
  '🥛','🥚','🥩','🍔','🍖','🥓','🍗','🐄','🐔','🐖',
  '🐑','🐐','🐇','🦆','🦃','🐝','🥬','🍅','🌽','🥕',
  '🥦','🧅','🥒','🌶️','🫑','🧄','🥜','🫘','🍠','🥔',
  '🍎','🍊','🍋','🍓','🫐','🍇','🍑','🍒','🥝','🍐',
  '🫒','🍯','🧈','🧀','🌿','🌱','🌾','🌻','🪴','🌺',
  '🍞','🧁','🫙','🧺','🪣','🚜','🧃','☕','📦','🏷️',
];

const COMMON_ITEMS = [
  'Eggs', 'Milk', 'Ground Beef', 'Beef Steak', 'Beef Ribs', 'Beef Roast',
  'Whole Chicken', 'Chicken Parts', 'Chicks', 'Hatching Eggs', 'Duck Eggs',
  'Butter', 'Cheese', 'Cream', 'Yogurt', 'Bacon', 'Pork Chops', 'Pork Roast',
  'Honey', 'Jam', 'Jelly', 'Fresh Herbs', 'Lettuce', 'Tomatoes', 'Sweet Corn',
  'Carrots', 'Potatoes', 'Onions', 'Garlic', 'Peppers', 'Cucumbers', 'Squash',
  'Zucchini', 'Green Beans', 'Peas', 'Broccoli', 'Kale', 'Spinach',
  'Apples', 'Peaches', 'Strawberries', 'Blueberries', 'Raspberries', 'Pears',
  'Plant Starts', 'Firewood', 'Wool', 'Goat Milk', 'Goat Cheese',
  'Soap', 'Candles', 'Cut Flowers', 'Wreaths', 'Compost',
];

const UNITS = ['lb', 'each', 'dozen', 'gallon', 'half-gal', 'oz', 'pint', 'quart', 'bunch', 'head', 'bag', 'jar', 'bundle', 'flat'];

const STEP_TITLES = [
  'What are you selling?',
  'Pick an icon',
  'Price & unit',
  'Starting stock',
];

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: i === current ? 22 : 7,
            height: 7,
            borderRadius: 4,
            bgcolor: i === current ? '#F59E0B' : '#333',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </Box>
  );
}

interface Step1Props {
  name: string;
  isCustom: boolean;
  customName: string;
  search: string;
  filteredItems: string[];
  onSelect: (n: string) => void;
  onCustom: () => void;
  onCustomNameChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

function Step1({ name, isCustom, customName, search, filteredItems, onSelect, onCustom, onCustomNameChange, onSearchChange }: Step1Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#555' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': { borderColor: '#2A2A2A' },
              '&:hover fieldset': { borderColor: '#444' },
              '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
            },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        {filteredItems.map(item => (
          <Box
            key={item}
            onClick={() => onSelect(item)}
            sx={{
              py: 1.75,
              px: 2,
              mb: 0.5,
              borderRadius: 3,
              cursor: 'pointer',
              bgcolor: name === item ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: name === item ? '2px solid #F59E0B' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontWeight: name === item ? 700 : 500, fontSize: '1.05rem' }}>
              {item}
            </Typography>
            {name === item && <CheckIcon sx={{ color: '#F59E0B', fontSize: '1.2rem' }} />}
          </Box>
        ))}
        <Box
          onClick={onCustom}
          sx={{
            py: 1.75,
            px: 2,
            mb: 0.5,
            borderRadius: 3,
            cursor: 'pointer',
            bgcolor: isCustom ? 'rgba(245,158,11,0.12)' : 'transparent',
            border: isCustom ? '2px solid #F59E0B' : '2px dashed #333',
          }}
        >
          <Typography sx={{ color: isCustom ? '#F59E0B' : 'text.secondary', fontWeight: 600, fontSize: '1.05rem' }}>
            + Something else...
          </Typography>
        </Box>
        {isCustom && (
          <Box sx={{ pt: 1, pb: 2 }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Type item name..."
              value={customName}
              onChange={e => onCustomNameChange(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  '& fieldset': { borderColor: '#F59E0B' },
                  '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface Step2Props {
  finalName: string;
  emoji: string;
  isCustom: boolean;
  customEmoji: string;
  onSelect: (e: string) => void;
  onCustom: () => void;
  onCustomChange: (v: string) => void;
}

function Step2({ finalName, emoji, isCustom, customEmoji, onSelect, onCustom, onCustomChange }: Step2Props) {
  const displayed = isCustom ? customEmoji : emoji;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        {displayed && (
          <Typography sx={{ fontSize: '3.5rem', lineHeight: 1, flexShrink: 0 }}>{displayed}</Typography>
        )}
        <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
          for {finalName}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mb: 2 }}>
          {FARM_EMOJIS.map(e => (
            <Box
              key={e}
              onClick={() => onSelect(e)}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                cursor: 'pointer',
                fontSize: '2rem',
                bgcolor: emoji === e && !isCustom ? 'rgba(245,158,11,0.15)' : '#1C1C1C',
                border: emoji === e && !isCustom ? '2px solid #F59E0B' : '2px solid transparent',
                userSelect: 'none',
                '&:active': { transform: 'scale(0.88)' },
              }}
            >
              {e}
            </Box>
          ))}
        </Box>
        <Box
          onClick={onCustom}
          sx={{
            py: 1.75,
            px: 2,
            mb: 1,
            borderRadius: 3,
            cursor: 'pointer',
            bgcolor: isCustom ? 'rgba(245,158,11,0.12)' : 'transparent',
            border: isCustom ? '2px solid #F59E0B' : '2px dashed #333',
          }}
        >
          <Typography sx={{ color: isCustom ? '#F59E0B' : 'text.secondary', fontWeight: 600 }}>
            ✏️  Type your own emoji
          </Typography>
        </Box>
        {isCustom && (
          <TextField
            autoFocus
            fullWidth
            placeholder="Open emoji keyboard and pick one..."
            value={customEmoji}
            onChange={e => {
              const val = e.target.value;
              const segments = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(val)];
              onCustomChange(segments.length > 0 ? segments[segments.length - 1].segment : '');
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '2rem',
                '& fieldset': { borderColor: '#F59E0B' },
                '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
              },
              '& input': { textAlign: 'center' },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

interface Step3Props {
  price: string;
  unit: string;
  isCustomUnit: boolean;
  customUnit: string;
  onPriceChange: (v: string) => void;
  onUnitSelect: (u: string) => void;
  onCustomUnit: () => void;
  onCustomUnitChange: (v: string) => void;
}

function Step3({ price, unit, isCustomUnit, customUnit, onPriceChange, onUnitSelect, onCustomUnit, onCustomUnitChange }: Step3Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 2.5, overflowY: 'auto' }}>
      <Typography sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>Price</Typography>
      <TextField
        autoFocus
        fullWidth
        type="number"
        placeholder="0.00"
        value={price}
        onChange={e => onPriceChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#F59E0B' }}>$</Typography>
              </InputAdornment>
            ),
          },
          htmlInput: { min: 0, step: 0.01 },
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            fontSize: '2rem',
            fontWeight: 900,
            borderRadius: 3,
            '& fieldset': { borderColor: '#2A2A2A' },
            '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
          },
        }}
      />
      <Typography sx={{ color: 'text.secondary', mb: 1.5, fontWeight: 600 }}>Sold per</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {UNITS.map(u => (
          <Chip
            key={u}
            label={u}
            onClick={() => onUnitSelect(u)}
            sx={{
              height: 48,
              fontSize: '1rem',
              fontWeight: 700,
              px: 0.5,
              bgcolor: unit === u && !isCustomUnit ? '#F59E0B' : '#1C1C1C',
              color: unit === u && !isCustomUnit ? '#000' : 'text.primary',
              border: unit === u && !isCustomUnit ? 'none' : '1px solid #2A2A2A',
              borderRadius: 2,
              '&:hover': { bgcolor: unit === u && !isCustomUnit ? '#D97706' : '#2A2A2A' },
            }}
          />
        ))}
        <Chip
          label="other..."
          onClick={onCustomUnit}
          sx={{
            height: 48,
            fontSize: '1rem',
            fontWeight: 700,
            px: 0.5,
            bgcolor: isCustomUnit ? 'rgba(245,158,11,0.12)' : 'transparent',
            color: isCustomUnit ? '#F59E0B' : 'text.secondary',
            border: isCustomUnit ? '1px solid #F59E0B' : '1px dashed #333',
            borderRadius: 2,
          }}
        />
      </Box>
      {isCustomUnit && (
        <TextField
          autoFocus
          fullWidth
          placeholder="e.g. cord, pallet, crate..."
          value={customUnit}
          onChange={e => onCustomUnitChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': { borderColor: '#F59E0B' },
              '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
            },
          }}
        />
      )}
    </Box>
  );
}

interface Step4Props {
  finalName: string;
  finalEmoji: string;
  stock: string;
  onStockChange: (v: string) => void;
}

function Step4({ finalName, finalEmoji, stock, onStockChange }: Step4Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        px: 2.5,
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: '5rem', lineHeight: 1 }}>{finalEmoji || '📦'}</Typography>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 }}>
        How many {finalName}s do you have?
      </Typography>
      <TextField
        autoFocus
        type="number"
        value={stock}
        onChange={e => onStockChange(e.target.value)}
        slotProps={{
          htmlInput: {
            min: 0,
            inputMode: 'numeric',
            style: { fontSize: '3rem', fontWeight: 900, textAlign: 'center', padding: '16px' },
          },
        }}
        sx={{
          width: '55%',
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            '& fieldset': { borderColor: '#2A2A2A' },
            '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
          },
        }}
      />
      <Typography sx={{ color: '#555', fontSize: '0.85rem', textAlign: 'center' }}>
        You can always update this in COUNT mode
      </Typography>
    </Box>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export function AddItemWizard({ open, onClose, onAdd }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [isCustomEmoji, setIsCustomEmoji] = useState(false);
  const [customEmoji, setCustomEmoji] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [customUnit, setCustomUnit] = useState('');
  const [stock, setStock] = useState('0');
  const [search, setSearch] = useState('');

  const finalName = isCustomName ? customName : name;
  const finalEmoji = isCustomEmoji ? customEmoji : emoji;
  const finalUnit = isCustomUnit ? customUnit : unit;

  const filteredItems = useMemo(() => {
    const base = search
      ? COMMON_ITEMS.filter(item => item.toLowerCase().includes(search.toLowerCase()))
      : COMMON_ITEMS;
    return [...base].sort((a, b) => a.localeCompare(b));
  }, [search]);

  const reset = useCallback(() => {
    setStep(0);
    setName(''); setIsCustomName(false); setCustomName('');
    setEmoji(''); setIsCustomEmoji(false); setCustomEmoji('');
    setPrice('');
    setUnit(''); setIsCustomUnit(false); setCustomUnit('');
    setStock('0');
    setSearch('');
  }, []);

  const handleClose = () => { reset(); onClose(); };
  const handleBack = () => step === 0 ? handleClose() : setStep(s => s - 1);

  const handleAdd = () => {
    const id = `${finalName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    onAdd({
      id,
      emoji: finalEmoji || '📦',
      name: finalName,
      price: parseFloat(price) || 0,
      unit: finalUnit || 'each',
      initialStock: Math.max(0, parseInt(stock, 10) || 0),
    });
    reset();
    onClose();
  };

  const canProceed = [
    !!finalName.trim(),
    !!finalEmoji,
    !!price && parseFloat(price) >= 0 && !!finalUnit.trim(),
    true,
  ][step];

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: '#0F0F0F',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 3,
          pb: 1.5,
          flexShrink: 0,
        }}
      >
        <IconButton onClick={handleBack} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon />
        </IconButton>
        <StepDots total={4} current={step} />
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, mb: 2, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, lineHeight: 1.1 }}>
          {STEP_TITLES[step]}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {step === 0 && (
          <Step1
            name={name}
            isCustom={isCustomName}
            customName={customName}
            search={search}
            filteredItems={filteredItems}
            onSelect={n => { setName(n); setIsCustomName(false); setCustomName(''); }}
            onCustom={() => { setIsCustomName(true); setName(''); }}
            onCustomNameChange={setCustomName}
            onSearchChange={setSearch}
          />
        )}
        {step === 1 && (
          <Step2
            finalName={finalName}
            emoji={emoji}
            isCustom={isCustomEmoji}
            customEmoji={customEmoji}
            onSelect={e => { setEmoji(e); setIsCustomEmoji(false); setCustomEmoji(''); }}
            onCustom={() => { setIsCustomEmoji(true); setEmoji(''); }}
            onCustomChange={setCustomEmoji}
          />
        )}
        {step === 2 && (
          <Step3
            price={price}
            unit={unit}
            isCustomUnit={isCustomUnit}
            customUnit={customUnit}
            onPriceChange={setPrice}
            onUnitSelect={u => { setUnit(u); setIsCustomUnit(false); setCustomUnit(''); }}
            onCustomUnit={() => { setIsCustomUnit(true); setUnit(''); }}
            onCustomUnitChange={setCustomUnit}
          />
        )}
        {step === 3 && (
          <Step4
            finalName={finalName}
            finalEmoji={finalEmoji}
            stock={stock}
            onStockChange={setStock}
          />
        )}
      </Box>

      <Box sx={{ px: 2, pb: 4, pt: 2, flexShrink: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!canProceed}
          onClick={step < 3 ? () => setStep(s => s + 1) : handleAdd}
          sx={{
            py: 2.25,
            fontSize: '1.2rem',
            fontWeight: 900,
            bgcolor: step === 3 ? '#10B981' : '#F59E0B',
            color: step === 3 ? '#fff' : '#000',
            borderRadius: '14px',
            '&:hover': { bgcolor: step === 3 ? '#059669' : '#D97706' },
            '&.Mui-disabled': { bgcolor: '#1A1A1A', color: '#444' },
          }}
        >
          {step < 3 ? 'Next' : 'Add Item'}
        </Button>
      </Box>
    </Box>
  );
}