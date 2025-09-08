import * as LucideIcons from 'lucide-react';
import React from 'react';
import IconErrorBoundary from 'components/IconErrorBoundary';

// Accept either a string name (legacy) or an object:
// { provider: 'lucide', name: 'Droplet', color?: '#...', size?: 18 }
export const resolveIcon = (icon, props = {}) => {
  if (!icon) return <LucideIcons.HelpCircle {...props} />;

  // If icon is a JSON string (stored as JSON on the server), try to parse it first
  if (typeof icon === 'string') {
    const trimmed = icon.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      // try strict JSON first
      try {
        const parsed = JSON.parse(trimmed);
        icon = parsed;
      } catch (err) {
        // try a lenient parse: convert single quotes to double quotes
        try {
          const converted = trimmed.replace(/'/g, '"');
          const parsed = JSON.parse(converted);
          icon = parsed;
        } catch (err2) {
          // final fallback: regex-based extraction for common shapes like {provider:'lucide',name:'Beer',size:28}
          try {
            const nameMatch = trimmed.match(/name\s*[:=]\s*['"]?([A-Za-z0-9\- _]+)['"]?/i);
            const providerMatch = trimmed.match(/provider\s*[:=]\s*['"]?([A-Za-z0-9\- _]+)['"]?/i);
            const sizeMatch = trimmed.match(/size\s*[:=]\s*(\d+)/i);
            const colorMatch = trimmed.match(/color\s*[:=]\s*['"]?(#[0-9a-fA-F]{3,6}|[A-Za-z0-9#]+)['"]?/i);
            const parsed = {};
            if (providerMatch) parsed.provider = providerMatch[1];
            if (nameMatch) parsed.name = nameMatch[1];
            if (sizeMatch) parsed.size = Number(sizeMatch[1]);
            if (colorMatch) parsed.color = colorMatch[1];
            if (Object.keys(parsed).length > 0) icon = parsed;
          } catch (err3) {
            // leave as string
          }
        }
      }
    }
  }

  // string -> assume lucide icon name OR url (return fallback)
  if (typeof icon === 'string') {
    // if looks like URL, render image tag
    if (/^(https?:)?\/\//.test(icon) || icon.startsWith('/')) {
      return <img src={icon} alt={props.alt || 'icon'} style={{ width: props.size || 24, height: props.size || 24 }} />;
    }
  try {
      // direct lookup
      let IconComponent = LucideIcons[icon];
      // try PascalCase conversion (e.g. smartphone-charging -> SmartphoneCharging)
      if (!IconComponent && typeof icon === 'string') {
        const parts = String(icon).split(/[^a-z0-9]+/i).filter(Boolean);
        if (parts.length > 0) {
          const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
          IconComponent = LucideIcons[pascal] || IconComponent;
        }
      }
      // fallback: case-insensitive or partial match on normalized names
      if (!IconComponent && typeof icon === 'string') {
        const nameNormalized = String(icon).toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchKey = Object.keys(LucideIcons).find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(nameNormalized));
        if (matchKey) IconComponent = LucideIcons[matchKey];
      }
  if (IconComponent && (typeof IconComponent === 'function' || typeof IconComponent === 'object')) {
        return (
          <IconErrorBoundary fallback={<LucideIcons.HelpCircle {...props} />}>
            <IconComponent {...props} />
          </IconErrorBoundary>
        );
      }
    } catch (e) {
      // ignore
    }
    // fallback
    return <LucideIcons.HelpCircle {...props} />;
  }

  // object metadata
  const meta = icon || {};
  // If metadata specifies provider 'lucide' or at least provides a name, try lucide lookup
  if (meta.provider === 'lucide' || (meta.name && typeof meta.name === 'string')) {
    try {
      let IconComponent = LucideIcons[meta.name];
      if (!IconComponent && typeof meta.name === 'string') {
        const parts = String(meta.name).split(/[^a-z0-9]+/i).filter(Boolean);
        if (parts.length > 0) {
          const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
          IconComponent = LucideIcons[pascal] || IconComponent;
        }
      }
      if (!IconComponent && typeof meta.name === 'string') {
        const nameNormalized = String(meta.name).toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchKey = Object.keys(LucideIcons).find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(nameNormalized));
        if (matchKey) IconComponent = LucideIcons[matchKey];
      }
      if (!IconComponent) return <LucideIcons.HelpCircle {...props} />;
      if (typeof IconComponent !== 'function' && typeof IconComponent !== 'object') return <LucideIcons.HelpCircle {...props} />;
  // only forward known simple props to avoid unexpected shapes
  const allowed = {};
  if (meta.color) allowed.color = meta.color;
  if (meta.size) allowed.size = meta.size;
  // allow callers to override meta when meta doesn't specify
  if (!allowed.color && props.color) allowed.color = props.color;
  if (!allowed.size && props.size) allowed.size = props.size;
  if (props.className) allowed.className = props.className;
  if (props.style) allowed.style = props.style;
      try {
        return (
          <IconErrorBoundary fallback={<LucideIcons.HelpCircle {...props} />}>
            <IconComponent {...allowed} />
          </IconErrorBoundary>
        );
      } catch (err) {
        return <LucideIcons.HelpCircle {...props} />;
      }
    } catch (e) {
      return <LucideIcons.HelpCircle {...props} />;
    }
  }

  return <LucideIcons.HelpCircle {...props} />;
};
