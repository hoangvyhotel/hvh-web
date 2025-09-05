// material-ui
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import { useNavigate } from 'react-router-dom';
import { handlerDrawerOpen, useGetMenuMaster } from 'states/menu';
import { useAuthState, useHotelState } from 'hooks/useAuth';
import { DRAWER_WIDTH } from 'config';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

// AppBar props
// header should match drawer width on large screens and be full width on small screens
const appBar = {
  color: 'primary',
  position: 'fixed',
  sx: {
    width: { xs: '100%', lg: DRAWER_WIDTH },
    zIndex: { xs: 1100, lg: 1201 },
    left: 0,
    borderTopLeftRadius: { xs: 0, lg: 8 },
    borderTopRightRadius: { xs: 0, lg: 8 },
    boxShadow: (theme) => `0 6px 18px ${theme.palette.mode === 'light' ? 'rgba(16,24,40,0.06)' : 'rgba(0,0,0,0.4)'}`
  }
};

// ==============================|| MAIN LAYOUT - HEADER (MINIMAL) ||============================== //

export default function Header() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const navigate = useNavigate();
  const { logout } = useAuthState();
  const { setHotelId } = useHotelState();

  const toggleDrawer = () => handlerDrawerOpen(!drawerOpen);

  const onLogout = () => {
    try {
      logout();
    } catch (e) {
      try {
        localStorage.setItem('is_logged_in', 'false');
        localStorage.removeItem('hotel_id');
        localStorage.removeItem('username');
        localStorage.removeItem('is_admin_logged_in');
      } catch (err) {}
    }
    try {
      setHotelId(null);
    } catch (e) {}
    navigate('/login');
  };

  return (
    <>
      {/* persistent floating hamburger, always visible */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 12, sm: 12 },
          left: { xs: 12, sm: 12 },
          zIndex: 1400,
          display: 'flex'
        }}
      >
        <IconButton
          aria-label="open drawer"
          onClick={toggleDrawer}
          size="medium"
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            color: 'common.white',
            border: '1.5px solid rgba(255,255,255,0.9)',
            borderRadius: '50%',
            boxShadow: (theme) => `0 4px 10px ${theme.palette.mode === 'light' ? 'rgba(59,130,246,0.12)' : 'rgba(0,0,0,0.45)'}`,
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <MenuTwoToneIcon sx={{ fontSize: '1.1rem', color: 'common.white' }} />
        </IconButton>
      </Box>

      {/* AppBar animates in/out to match drawer transition; always mounted to allow smooth animation */}
      <AppBar
        {...appBar}
        sx={{
          ...appBar.sx,
          // animate visibility on large screens, always visible on xs
          opacity: { xs: 1, lg: drawerOpen ? 1 : 0 },
          transform: { xs: 'none', lg: drawerOpen ? 'none' : 'translateY(-8px)' },
          pointerEvents: { xs: 'auto', lg: drawerOpen ? 'auto' : 'none' },
          transition: (theme) => theme.transitions.create(['opacity', 'transform'], { duration: 250 }),
          willChange: 'opacity, transform'
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: { xs: 1, lg: 1.25 }, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
    </>
  );
}
