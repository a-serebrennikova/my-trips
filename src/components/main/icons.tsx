type IconProps = {
  className?: string;
};

export const iconBasePath = (className?: string) => {
  return `h-4 w-4 stroke-current ${className ?? ""}`;
};

export const LocationIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <path
        d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="10" r="2.8" strokeWidth="1.9" />
    </svg>
  );
};

export const CalendarIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <rect x="3" y="5" width="18" height="16" rx="3" strokeWidth="1.9" />
      <path d="M3 9h18M8 3v4m8-4v4" strokeWidth="1.9" />
    </svg>
  );
};

export const ClockIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconBasePath(className)}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.9" />
      <path d="M12 7v5l3 2" strokeWidth="1.9" />
    </svg>
  );
};
