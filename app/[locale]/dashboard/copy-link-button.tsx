"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="h-9 text-sm border-[#E8E2DB] hover:border-[#C9A96E]"
    >
      {copied ? "✓ Đã sao chép" : "Sao chép link"}
    </Button>
  );
}
