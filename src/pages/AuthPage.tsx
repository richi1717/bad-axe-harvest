import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export function AuthPage() {
  const { setFarm } = useAppContext();
  const [mode, setMode] = useState<'signin' | 'signup' | 'check-email'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      fontSize: '1.1rem',
      '& fieldset': { borderColor: '#2A2A2A' },
      '&:hover fieldset': { borderColor: '#444' },
      '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!farmName.trim()) { setError('Enter your farm name.'); setLoading(false); return; }

      const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }

      if (data.user && data.session) {
        const { data: farm, error: farmError } = await supabase
          .from('farms')
          .insert({ name: farmName.trim(), owner_id: data.user.id })
          .select('id, name')
          .single();
        if (farmError) { setError(farmError.message); setLoading(false); return; }
        setFarm(farm);
      } else if (data.user && !data.session) {
        setMode('check-email');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
    }

    setLoading(false);
  };

  if (mode === 'check-email') {
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
          textAlign: 'center',
        }}
      >
        <MarkEmailReadIcon sx={{ fontSize: '4rem', color: '#F59E0B', mb: 2 }} />
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B', mb: 1 }}>
          Check your email
        </Typography>
        <Typography sx={{ color: 'text.secondary', maxWidth: 300, lineHeight: 1.6, mb: 3 }}>
          We sent a confirmation link to <strong style={{ color: '#ccc' }}>{email}</strong>. Click it, then come back and sign in.
        </Typography>
        <Button
          variant="text"
          onClick={() => { setMode('signin'); setError(''); }}
          sx={{ color: '#F59E0B', fontWeight: 700 }}
        >
          Back to sign in
        </Button>
      </Box>
    );
  }

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
          BAD AXE HARVEST
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Farm inventory & sales</Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        )}

        {mode === 'signup' && (
          <TextField
            label="Farm name"
            fullWidth
            value={farmName}
            onChange={e => setFarmName(e.target.value)}
            slotProps={{ htmlInput: { autoComplete: 'organization' } }}
            sx={fieldSx}
          />
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
          slotProps={{ htmlInput: { autoComplete: 'email' } }}
          sx={fieldSx}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          slotProps={{ htmlInput: { autoComplete: mode === 'signup' ? 'new-password' : 'current-password' } }}
          sx={fieldSx}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
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
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); }}
          sx={{ color: 'text.secondary', fontWeight: 600 }}
        >
          {mode === 'signin' ? "New farm? Create an account" : 'Already have an account? Sign in'}
        </Button>
      </Box>
    </Box>
  );
}