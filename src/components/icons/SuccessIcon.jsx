export const SuccessIcon = ({
  size = 80,
  className = "",
  bgColor = "currentColor",
  strokeColor = "white",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="80" height="80" rx="40" fill={bgColor} />
      <path
        d="M26 44L33.2331 49.4248C33.6618 49.7463 34.2677 49.6728 34.607 49.2581L52 28"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
};
