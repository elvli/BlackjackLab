import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HandAreaProps = {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  active?: boolean;
  className?: string;
  children: ReactNode;
};

export default function HandArea({
  title,
  subtitle,
  footer,
  active = false,
  className,
  children,
}: HandAreaProps) {
  return (
    <section
      className={cn(
        "flex w-full min-w-0 flex-col items-center justify-center gap-3 text-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "inline-flex max-w-full items-center justify-center rounded-full border border-white/20 bg-white/92 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md",
            active && "border-sky-500 ring-2 ring-sky-400/70"
          )}
        >
          <span className="truncate">{title}</span>
        </div>

        {subtitle ? (
          <p className="max-w-md text-xs text-white/80 sm:text-sm">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex w-full min-w-0 justify-center">{children}</div>

      {footer ? <div className="text-xs text-white/75 sm:text-sm">{footer}</div> : null}
    </section>
  );
}
