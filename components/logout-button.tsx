"use client";

import { signOut } from "@/app/actions/auth";
import { useTransition } from "react";

export function LogoutButton({ label }: { label: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="px-3 py-1.5 rounded-lg text-[#6B6560] hover:text-[#1C1C1C] hover:bg-[#F2EDE8] transition-colors text-sm disabled:opacity-50"
    >
      {isPending ? "..." : label}
    </button>
  );
}
