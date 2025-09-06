// material-ui
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

// project imports
import NavigationDrawer from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { AppBar, CardMedia, Toolbar } from '@mui/material';
import { handlerDrawerOpen } from 'states/menu';
import { useGetMenuMaster } from 'states/menu';

// assets
import logo from 'assets/images/logo.svg';

// ==============================|| DRAWER - CONTENT ||============================== //

export default function DrawerContent() {
  // reduce header reserved height so drawer content sits higher
  const contentHeight = `calc(100vh - 56px)`;
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  return (
    <>
      <AppBar sx={{ position: 'absolute', display: { xs: 'block', lg: 'none' } }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <CardMedia component="img" image={logo} alt="logo" sx={{ width: 138 }} />
        </Toolbar>
      </AppBar>
      {/* Small header inside drawer with a hamburger toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pl: 0.5, py: 0.5 }}>
        {/* hamburger aligned to the left */}
        <IconButton aria-label="toggle drawer" onClick={() => handlerDrawerOpen(!drawerOpen)} size="large" sx={{ ml: 0 }}>
          <MenuTwoToneIcon />
        </IconButton>
      </Box>
      <SimpleBar sx={{ height: contentHeight }}>
        <Stack sx={{ minHeight: contentHeight, pt: 0.25, px: 1, justifyContent: 'flex-start' }}>
          <NavigationDrawer />
        </Stack>
      </SimpleBar>
    </>
  );
}
