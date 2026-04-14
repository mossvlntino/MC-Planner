export function Button({ variant = "default", size = "md", className = "", children, ...props }) {
  const variants = {
    default:    "bg-emerald-600 hover:bg-emerald-700 text-white pixel-btn focus:ring-2 focus:ring-emerald-500/40",
    secondary:  "bg-stone-800 text-stone-100 pixel-btn hover:bg-stone-700/60 focus:ring-2 focus:ring-stone-500/30",
    outline:    "bg-transparent text-stone-100 pixel-btn border-2 border-stone-600 hover:bg-stone-800/50",
    accent:     "bg-amber-500 hover:bg-amber-600 text-black font-medium pixel-btn",
    danger:     "bg-rose-600 hover:bg-rose-700 text-white pixel-btn",
  };
  const sizes = {
    md: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    icon: "p-2", // still available
  };
  return (
    <button
      className={`${variants[variant] || variants.default} ${sizes[size] || sizes.md} inline-flex items-center text-center w-auto rounded-none ${className}`}
      {...props}
    >
      <span className="w-full leading-none">{children}</span>
    </button>
  );
}
export default Button;
