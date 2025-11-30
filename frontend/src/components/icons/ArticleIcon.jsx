export const ArticleIcon = ({
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
    <rect
      x="6"
      y="4"
      width="13"
      height="17"
      rx="2"
      stroke={stroke}
      strokeWidth="1.2"
    />
    <path
      d="M15 10V8"
      stroke={stroke}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M4 9H8" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4 13H8" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4 17H8" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
