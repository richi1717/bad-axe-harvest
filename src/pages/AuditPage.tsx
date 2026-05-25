import { Box, Typography } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export function AuditPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: 2,
      }}
    >
      <FactCheckIcon sx={{ fontSize: '4rem', color: '#333' }} />
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
        AUDIT
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>Coming soon</Typography>
    </Box>
  );
}