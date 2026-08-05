type IconProps = {
  className?: string;
};

export const LocationPinIcon = ({ className }: IconProps) => {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className ?? "h-4 w-4"}
        aria-hidden="true"
      >
        <path
          d="M12 20.5s6.5-4.1 6.5-10a6.5 6.5 0 1 0-13 0c0 5.9 6.5 10 6.5 10z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="10.5"
          r="2.3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
};
