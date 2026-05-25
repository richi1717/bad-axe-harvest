import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { SellPage } from './pages/SellPage';
import { CountPage } from './pages/CountPage';
import { AuditPage } from './pages/AuditPage';
import { ModeNav } from './components/ModeNav';

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/sell" replace />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/count" element={<CountPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Routes>
      <ModeNav />
    </Box>
  );
}

export default App;