import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NumbersIcon from '@mui/icons-material/Numbers';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate, useLocation } from 'react-router-dom';

const MODES = [
  { label: 'SELL',  path: '/sell',  icon: <AttachMoneyIcon /> },
  { label: 'COUNT', path: '/count', icon: <NumbersIcon /> },
  { label: 'AUDIT', path: '/audit', icon: <FactCheckIcon /> },
];

export function ModeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = MODES.find(m => location.pathname.startsWith(m.path))?.path ?? '/sell';

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #222',
        zIndex: 200,
      }}
    >
      <BottomNavigation
        value={current}
        onChange={(_, val) => navigate(val)}
        sx={{
          bgcolor: '#111',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: '#555',
            minWidth: 0,
            gap: 0.25,
          },
          '& .Mui-selected': {
            color: '#F59E0B !important',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            opacity: '1 !important',
          },
        }}
      >
        {MODES.map(m => (
          <BottomNavigationAction
            key={m.path}
            label={m.label}
            value={m.path}
            icon={m.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}