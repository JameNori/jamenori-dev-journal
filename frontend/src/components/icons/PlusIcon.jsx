export const PlusIcon = ({
  className = "h-6 w-6",
  stroke = "currentColor",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 6L12 18"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M18 12L6 12"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

