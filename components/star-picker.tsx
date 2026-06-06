"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange: (rating: number) => void;
};

const LABELS = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"];

export function StarPicker({ value, onChange }: Props) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className="inline-flex items-center gap-1.5 text-3xl"
        role="group"
        aria-label="Chọn số sao"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] rounded"
            aria-label={`${star} sao — ${LABELS[star]}`}
            aria-pressed={value === star}
          >
            <span className={active >= star ? "text-[#C9A96E]" : "text-[#E8E2DB]"}>★</span>
          </button>
        ))}
      </span>
      {active > 0 && (
        <span className="text-xs text-[#6B6560] h-4 transition-opacity">{LABELS[active]}</span>
      )}
    </div>
  );
}
