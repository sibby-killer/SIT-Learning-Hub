import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label="SIT Learning Hub home"
    >
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-bold tracking-tight text-primary-foreground shadow-sm">
        SIT
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Learning Hub
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Learn. Practise. Prove.
        </span>
      </span>
    </Link>
  );
}
