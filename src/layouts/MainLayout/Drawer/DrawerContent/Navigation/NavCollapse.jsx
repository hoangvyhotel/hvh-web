import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from './NavItem';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| RESPONSIVE DRAWER - COLLAPSE LOOP ||============================== //

function NavCollapseLoop({ item, level }) {
  return item.children?.map((child) => {
    switch (child.type) {
      case 'collapse':
        return <NavCollapse key={child.id} item={child} level={level + 1} />;
      case 'item':
        return <NavItem key={child.id} item={child} level={level + 1} />;
      default:
        return (
          <Typography key={child.id} variant="h6" color="error" align="center">
            Fix - Collapse or Item
          </Typography>
        );
    }
  });
}

// ==============================|| RESPONSIVE DRAWER - COLLAPSE ||============================== //

export default function NavCollapse({ item, level }) {
  const [open, setOpen] = useState(false); // Menu mặc định đóng
  const [selected, setSelected] = useState(null); // Để highlight item đang active
  const { pathname } = useLocation();

  // Kiểm tra xem item hoặc sub-item có khớp với pathname không
  const checkActiveForParent = (children, id) => {
    return children.some((child) => {
      if (child.children?.length) {
        return checkActiveForParent(child.children, id); // Đệ quy kiểm tra sub-level
      }
      return child.url === pathname;
    });
  };

  useEffect(() => {
    // Reset trạng thái khi chuyển trang
    setOpen(false); // Đóng menu khi pathname thay đổi
    setSelected(null); // Reset selected

    if (item.children) {
      // Kiểm tra xem item hoặc sub-item có active không
      const isActive = item.children.some((child) => {
        if (child.children?.length) {
          return checkActiveForParent(child.children, item.id);
        }
        return child.url === pathname;
      });

      if (isActive) {
        setSelected(item.id); // Highlight item nếu active
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, item.children]);

  const handleClick = () => {
    setOpen((prev) => !prev); // Toggle menu chỉ khi người dùng click
  };

  const Icon = item.icon;
  const menuIcon = item.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'medium'} />;

  return (
    <>
      <ListItemButton
        id={`${item.id}-btn`}
        selected={selected === item.id} // Highlight nếu item active
        sx={{
          mb: 0.625,
          pl: `${level * 16}px`,
          borderRadius: 1,
          ...(level > 1 && { bgcolor: 'transparent !important', py: 1 }),
        }}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ minWidth: !item.icon ? 25 : 'unset' }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={selected === item.id ? 'subtitle1' : 'body1'} color="inherit" sx={{ pl: 1.9 }}>
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography variant="caption" sx={(theme) => ({ ...theme.typography.subMenuCaption, pl: 2 })} display="block" gutterBottom>
                {item.caption}
              </Typography>
            )
          }
        />
        {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" sx={{ position: 'relative', p: 0 }}>
          <NavCollapseLoop item={item} level={level} />
        </List>
      </Collapse>
    </>
  );
}

NavCollapseLoop.propTypes = { item: PropTypes.any, level: PropTypes.number };
NavCollapse.propTypes = { item: PropTypes.any, level: PropTypes.number };