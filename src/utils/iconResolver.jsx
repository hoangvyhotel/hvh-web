import * as LucideIcons from "lucide-react";

export const resolveIcon = (iconName, props = {}) => {
  const IconComponent = LucideIcons[iconName];
  if (!IconComponent) {
    // fallback khi không tìm thấy icon
    return <LucideIcons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
};
