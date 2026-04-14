export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full bg-stone-800/70 border-2 border-stone-700 overflow-hidden rounded-none ${className}`}>
      <div
        className="h-2 bg-emerald-600 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
export default Progress;
