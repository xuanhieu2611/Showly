"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAccountType } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type Role = "artist" | "client";

export default function SelectRolePage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    const result = await setAccountType(selected);
    if ("redirect" in result) {
      router.push(result.redirect);
    } else {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold text-[#1C1C1C]">
            Bạn là ai?
          </h1>
          <p className="text-muted-foreground">
            Chọn vai trò của bạn để bắt đầu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RoleCard
            selected={selected === "artist"}
            onClick={() => setSelected("artist")}
            emoji="💅"
            title="Tôi là Artist"
            description="Nail, trang điểm, làm tóc — tôi muốn tạo portfolio"
          />
          <RoleCard
            selected={selected === "client"}
            onClick={() => setSelected("client")}
            emoji="✨"
            title="Tôi là Khách"
            description="Tôi muốn tìm beauty artist phù hợp"
          />
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full h-12 bg-[#C9A96E] hover:bg-[#B8925A] text-white font-semibold rounded-xl"
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </Button>
      </div>
    </main>
  );
}

function RoleCard({
  selected,
  onClick,
  emoji,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 ${
        selected
          ? "border-[#C9A96E] bg-[#FDF8F2] shadow-md"
          : "border-[#E8E2DB] bg-white hover:border-[#C9A96E]/50"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <p className="font-semibold text-[#1C1C1C] text-sm">{title}</p>
      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
    </button>
  );
}
