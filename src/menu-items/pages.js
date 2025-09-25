// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';

const icons = {
  NavigationOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  TranslateIcon,
  SecurityOutlinedIcon,
  MonetizationOnOutlinedIcon,
  ErrorOutlineRoundedIcon,
  HourglassEmptyRoundedIcon,
  HelpOutlineOutlinedIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'pages',
  title: 'pages',
  caption: 'prebuild-pages',
  type: 'group',
  icon: icons.NavigationOutlinedIcon,
  children: [
    {
      id: 'home',
      title: 'Trang chủ',
      type: 'item',
      url: '/pages/home/room-tracking',
      icon: icons.ChromeReaderModeOutlinedIcon
    },
    {
      id: 'management',
      title: 'Quản lý',
      type: 'item',
      url: '/pages/management',
      icon: icons.ChromeReaderModeOutlinedIcon
    },
    {
      id: 'logout',
      title: 'Đăng xuất',
      type: 'item',
      url: '/login',
      icon: MeetingRoomTwoToneIcon
    }
  ]
};

export default pages;
