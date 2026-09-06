import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="w-7 h-7 rounded-lg bg-[#F7941D] text-white grid place-items-center text-xs font-bold shrink-0">
        CG
      </span>
      <span className="text-base font-semibold tracking-tight text-charcoal">
        Career<span className="text-[#F7941D]">Gate</span>
      </span>
    </span>
  );
}
