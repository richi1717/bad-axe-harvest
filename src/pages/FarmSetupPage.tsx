import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

const handleSignOut = () => supabase.auth.signOut();

export function FarmSetupPage() {
  const { session, setFarm } = useAppContext();
  const [farmName, setFarmName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!farmName.trim() || !session) return;
    setError('');
    setLoading(true);
    const { data: farm, error: farmError } = await supabase
      .from('farms')
      .insert({ name: farmName.trim(), owner_id: session.user.id })
      .select('id, name')
      .single();
    if (farmError) { setError(farmError.message); setLoading(false); return; }
    setFarm(farm);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#0F0F0F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '3.5rem', lineHeight: 1 }}>🌾</Typography>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '-0.01em', mt: 1 }}>
          Name your farm
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>You can change this later</Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Typography sx={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</Typography>
        )}
        <TextField
          label="Farm name"
          fullWidth
          value={farmName}
          onChange={e => setFarmName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
          autoFocus
          slotProps={{ htmlInput: { autoComplete: 'organization' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '1.1rem',
              '& fieldset': { borderColor: '#2A2A2A' },
              '&:hover fieldset': { borderColor: '#444' },
              '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleCreate}
          disabled={loading || !farmName.trim()}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 900,
            bgcolor: '#F59E0B',
            color: '#000',
            borderRadius: '14px',
            mt: 1,
            '&:hover': { bgcolor: '#D97706' },
            '&.Mui-disabled': { bgcolor: '#2A2A2A', color: '#555' },
          }}
        >
          {loading ? 'Setting up...' : 'Get Started'}
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={handleSignOut}
          sx={{ color: '#555', fontWeight: 600 }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
}