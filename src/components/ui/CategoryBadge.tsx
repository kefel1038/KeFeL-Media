import { getCategoryBySlug } from "@/data/categories";

interface CategoryBadgeProps {
  category: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function CategoryBadge({
  category,
  size = "sm",
  className = "",
}: CategoryBadgeProps) {
  const cat = getCategoryBySlug(category);
  const color = cat?.color || "bg-brand-primary";
  const label = cat?.label || category;

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  return (
    <span
      className={`inline-block rounded font-sans font-bold text-white uppercase tracking-wider ${color} ${sizeClasses[size]} ${className}`}
    >
      {label}
    </span>
  );
}
