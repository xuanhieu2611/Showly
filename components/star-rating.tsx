type Props = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
};

export function StarRating({ rating, max = 5, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`} aria-label={`${rating} trên ${max} sao`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className={filled ? "text-[#C9A96E]" : half ? "text-[#C9A96E]/50" : "text-[#E8E2DB]"}>
            ★
          </span>
        );
      })}
    </span>
  );
}
