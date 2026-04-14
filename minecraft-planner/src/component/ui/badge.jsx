export function Badge({ className = "", size = "md", ...props }) {
  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-[11px] px-2 py-1",
    lg: "text-[12px] px-3 py-1.5", // bigger & clearer
  };
  return (
    <span
      className={`pixel-badge inline-flex items-center rounded-none ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}
export default Badge;
