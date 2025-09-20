import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { APP_DEFAULT_PATH } from 'config';
import menuItems from 'menu-items';
import { useHotelState } from 'hooks/useAuth';

//assets
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

const homeBreadcrumb = { title: '', url: APP_DEFAULT_PATH, icon: HomeTwoToneIcon };
const flexStyle = { display: 'flex', alignItems: 'center', gap: 0.5 };

// ==============================|| BREADCRUMBS ||============================== //

export default function Breadcrumbs({ data, divider = true, title, icons = false, sx, ...rest }) {
  const location = useLocation();
  const { hotelName } = useHotelState();

  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [activeItem, setActiveItem] = useState();

  useEffect(() => {
    if (data?.length) {
      dataHandler(data);
    } else {
      for (const menu of menuItems?.items ?? []) {
        if (menu.type && menu.type === 'group') {
          const matchedParents = findParentElements(menu.children || [], location.pathname);
          dataHandler(matchedParents || []);
          if (matchedParents) break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, location]);

  const dataHandler = (data) => {
    const filtered = data;
    // display breadcrumbs if breadcrumbs is set to false
    // const filtered = data.filter((item) => item.breadcrumbs !== false);
    const active = filtered.at(-1);
    const linkItems = filtered.slice(0, -1);
    if (active && active.url != homeBreadcrumb.url) {
      const home = { ...homeBreadcrumb };
      linkItems.unshift(home);
    }
    setActiveItem(active);
    setBreadcrumbItems(linkItems);
  };

  function findParentElements(navItems, targetUrl, parents = []) {
    for (const item of navItems) {
      // Add the current item to the parents array
      const newParents = [...parents, item];

      // Check if the current item matches the target URL
      if (item.url && item.url === targetUrl && targetUrl.includes(item.url)) {
        return newParents; // Return the array of parent elements
      }

      // If the item has children, recurse into them
      if (item.children) {
        const result = findParentElements(item.children, targetUrl, newParents);
        if (result) {
          return result; // Return the result if found in children
        }
      }
    }

    return null; // Return null if no match is found
  }

  if (!activeItem || activeItem.breadcrumbs === false) {
    return null;
  }

  function CoreBreadcrumb() {
    console.log('hotelName:', hotelName);
    return (
      <Stack sx={{ mb: 2 }}>
        {/* Hàng 1: Breadcrumb (trái) + HotelName (giữa) */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Left: Breadcrumb */}
          <MuiBreadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.75rem', color: 'text.secondary' }} {...rest}>
            {breadcrumbItems.length &&
              breadcrumbItems.map((item, index) => (
                <Typography
                  {...(item.url && { component: Link, to: item.url })}
                  key={index}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    ...(item.url && {
                      cursor: 'pointer',
                      ':hover': { color: 'primary.main' }
                    }),
                    ...flexStyle
                  }}
                >
                  {icons && item.icon && <item.icon />} {item.title}
                </Typography>
              ))}
            {activeItem && (
              <Typography variant="caption" color="primary" sx={{ ...flexStyle }}>
                {icons && activeItem.icon && <activeItem.icon />}
                {activeItem.title}
              </Typography>
            )}
          </MuiBreadcrumbs>

          {/* Center: Hotel Name */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              flexGrow: 2,
              textAlign: 'center',
              // position: 'absolute',
              left: 0,
              right: 0,
              pointerEvents: 'none'
            }}
          >
            {hotelName || 'Khách sạn Hoàng Vy'}
          </Typography>
        </Stack>

        {/* Hàng 2: Title */}
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mt: 1 }}>
          {title || activeItem?.title}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack>
      <CoreBreadcrumb />
      {divider && <Divider sx={{ mb: 0, mt: 0 }} />}
    </Stack>
  );
}

Breadcrumbs.propTypes = {
  data: PropTypes.array,
  divider: PropTypes.bool,
  title: PropTypes.string,
  icons: PropTypes.bool,
  sx: PropTypes.any,
  rest: PropTypes.any
};
