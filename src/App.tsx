import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { SellPage } from './pages/SellPage';
import { CountPage } from './pages/CountPage';
import { AuditPage } from './pages/AuditPage';
import { AuthPage } from './pages/AuthPage';
import { FarmSetupPage } from './pages/FarmSetupPage';
import { ModeNav } from './components/ModeNav';
import { useAppContext } from './context/AppContext';

function App() {
  const { session, farm, loading } = useAppContext();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', bgcolor: '#0F0F0F' }}>
        <CircularProgress sx={{ color: '#F59E0B' }} />
      </Box>
    );
  }

  if (!session) return <AuthPage />;
  if (!farm) return <FarmSetupPage />;

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