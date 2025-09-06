import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import { handlerActiveItem, handlerDrawerOpen, useGetMenuMaster } from 'states/menu';
import { http } from 'lib/http/axios';
import { useAuthState, useHotelState } from 'hooks/useAuth';

// assets
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| RESPONSIVE DRAWER - ITEM ||============================== //

export default function NavItem({ item, level = 0 }) {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const openItem = menuMaster.openedItem;

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const location = useLocation();
    // handled navigation for protected menu items in the click handler below


  const navigate = useNavigate();

  const handleProtectedNavigation = async () => {
    // protect management routes
    const isProtected = item.id === 'management' || (item.url && item.url.includes('/pages/management'));
    if (!isProtected) return true; // allow

    // check admin flag
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('is_admin_logged_in') === 'true';
    if (isAdmin) return true;

    // not admin => redirect to admin-login page (handled by AdminLogin component)
    return false;
  };
  const { logout } = useAuthState();
  const { setHotelId } = useHotelState();
  useEffect(() => {
    if (location.pathname === item.url) handlerActiveItem(item.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const itemHandler = async () => {
    if (downLG) handlerDrawerOpen(false);
    // handle logout menu item directly
    if (item.id === 'logout') {
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
      return;
    }

    const ok = await handleProtectedNavigation();
    if (ok && item.url) {
      navigate(item.url);
      return;
    }

    // if protected and not ok (i.e. not admin), redirect to /admin-login with target
    const isProtected = item.id === 'management' || (item.url && item.url.includes('/pages/management'));
    if (isProtected) {
  navigate('/admin-login', { state: { from: item.url } });
    }
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon color="inherit" /> : <ArrowForwardIcon color="inherit" fontSize={level > 0 ? 'inherit' : 'medium'} />;

  return (
    <ListItemButton
      id={`${item.id}-btn`}
  {...(item.target && { target: item.target })}
      selected={openItem === item.id}
      disabled={item.disabled}
      onClick={itemHandler}
      sx={{
        color: 'text.primary',
        mb: 0.625,
  mt: level === 0 && item.id === 'home' ? 1 : 0,
        borderRadius: 1,
        pl: `${level * 16}px`,
        ...(level === 0 && { '&.Mui-selected': { color: 'primary.main' } }),
        ...(level > 1 && { bgcolor: 'transparent !important', py: 1 })
      }}
    >
      <ListItemIcon sx={{ minWidth: 25 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography sx={{ pl: level > 1 ? 2 : 1.4 }} variant={openItem === item.id ? 'subtitle1' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, pl: 2 }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={typeof item.chip.avatar === 'string' ? <Avatar>{item.chip.avatar}</Avatar> : item.chip.avatar}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = { item: PropTypes.any, level: PropTypes.number };
