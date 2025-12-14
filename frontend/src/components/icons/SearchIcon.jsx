export function SearchIcon({ className, stroke = "currentColor" }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="6" stroke={stroke} />
      <path d="M20 20L17 17" stroke={stroke} strokeLinecap="round" />
    </svg>
  );
}

