type IconProps = {
  className?: string;
};

export const EmailIcon = ({ className }: IconProps) => {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className ?? "h-4 w-4"}
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="5"
          width="17"
          height="14"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4.5 7l7.5 6 7.5-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
