import { getCategoryColor } from "@/data/categories";

interface CategoryBadgeProps {
  category: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export default function CategoryBadge({
  category,
  size = "sm",
  className = "",
}: CategoryBadgeProps) {
  const color = getCategoryColor(category);

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={`inline-block rounded font-bold text-white uppercase tracking-wider ${color} ${sizeClasses[size]} ${className}`}
    >
      {category}
    </span>
  );
}
