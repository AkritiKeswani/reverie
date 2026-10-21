import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoftIconProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { wrap: "w-7 h-7 rounded-xl", icon: "w-3.5 h-3.5" },
  md: { wrap: "w-9 h-9 rounded-2xl", icon: "w-[18px] h-[18px]" },
  lg: { wrap: "w-16 h-16 rounded-[1.75rem]", icon: "w-7 h-7" },
};

// Lucide icon inside a rounded light-blue bubble with thin, round-capped strokes
export function SoftIcon({ icon: Icon, size = "md", className }: SoftIconProps) {
  const s = sizes[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-sky-100 to-blue-50 text-sky-600 ring-1 ring-sky-100",
        s.wrap,
        className
      )}
    >
      <Icon className={s.icon} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </span>
  );
}
