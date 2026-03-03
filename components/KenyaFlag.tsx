export default function KenyaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 3 2"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="3" height="2" fill="#006600" />
      <rect width="3" height="1.33" fill="#BB0000" />
      <rect width="3" height="0.67" fill="#000000" />
      <rect width="3" height="0.13" y="0.67" fill="white" />
      <rect width="3" height="0.13" y="1.2" fill="white" />
    </svg>
  );
}