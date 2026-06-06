type Specialty = "nail" | "makeup" | "hair";

const SPECIALTY_CONFIG: Record<Specialty, { bg: string; text: string; label: string; labelVi: string }> = {
  nail: { bg: "#E8C4B8", text: "#7A3F30", label: "Nail Art", labelVi: "Nail Art" },
  makeup: { bg: "#D4B8D4", text: "#5A3060", label: "Makeup", labelVi: "Trang điểm" },
  hair: { bg: "#B8D4C0", text: "#2D5A3A", label: "Hair", labelVi: "Làm tóc" },
};

type Props = {
  specialty: string;
  locale?: "vi" | "en";
  size?: "sm" | "md";
};

export function SpecialtyBadge({ specialty, locale = "vi", size = "md" }: Props) {
  const config = SPECIALTY_CONFIG[specialty as Specialty];
  if (!config) return null;

  const label = locale === "vi" ? config.labelVi : config.label;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {label}
    </span>
  );
}
