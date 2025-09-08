import React, { useMemo } from 'react';
import { Autocomplete, TextField, Box, Stack, Button } from '@mui/material';
import * as LucideIcons from 'lucide-react';
import { resolveIcon } from 'utils/iconResolver';
import IconErrorBoundary from 'components/IconErrorBoundary';

let ICON_NAMES = [];
try {
  ICON_NAMES = Object.keys(LucideIcons).filter((k) => /^[A-Z]/.test(k));
} catch (e) {
  ICON_NAMES = [];
}

export default function IconPicker({ value, onChange, size = 24, allowedIcons = null, allowedKeywords = null }) {
  const options = useMemo(() => {
    if (Array.isArray(allowedIcons) && allowedIcons.length > 0) return allowedIcons;
    if (Array.isArray(allowedKeywords) && allowedKeywords.length > 0) {
      const kws = allowedKeywords.map((k) => String(k).toLowerCase());
      return ICON_NAMES.filter((n) => kws.some((k) => n.toLowerCase().includes(k)));
    }
    return ICON_NAMES;
  }, [allowedIcons, allowedKeywords]);

  const toDisplay = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val.name || '';
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Autocomplete
        sx={{ flex: 1 }}
        freeSolo
        options={options}
        value={toDisplay(value)}
        onChange={(_, v) => {
          if (v == null) return onChange && onChange('');
          const name = typeof v === 'string' ? v : v?.name || '';
          if (!name) return onChange && onChange('');
          onChange && onChange({ provider: 'lucide', name, size });
        }}
        renderInput={(params) => <TextField {...params} label="Icon (lucide)" size="small" />}
        renderOption={(props, option) => {
          const { key, ...liProps } = props || {};
          const optionName = typeof option === 'string' ? option : option?.name || '';
          return (
            <li {...liProps} key={optionName}>
              <Box sx={{ mr: 1 }}>
                {optionName ? (
                  <IconErrorBoundary fallback={<LucideIcons.HelpCircle size={size} />}>
                    {resolveIcon({ provider: 'lucide', name: optionName }, { size })}
                  </IconErrorBoundary>
                ) : null}
              </Box>
              {optionName}
            </li>
          );
        }}
      />

      <Box sx={{ width: 48, textAlign: 'center' }}>
        {value && typeof value === 'string' ? (
          // if user provides URL string, show image
          <img src={value} alt="icon" style={{ width: size, height: size, objectFit: 'cover' }} />
        ) : (
          <IconErrorBoundary fallback={<LucideIcons.HelpCircle size={size} />}>
            {resolveIcon(value, { size })}
          </IconErrorBoundary>
        )}
      </Box>
    </Stack>
  );
}
