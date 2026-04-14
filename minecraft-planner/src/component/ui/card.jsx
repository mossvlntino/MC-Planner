export function Card({ className = "", ...props }) {
  return (
    <div
      className={`pixel-card rounded-none ${className}`}
      {...props}
    />
  );
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`font-pixel text-[14px] sm:text-[16px] leading-5 ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 pt-0 ${className}`} {...props} />;
}
export default Card;
