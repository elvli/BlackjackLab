import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BlackjackTableLayoutProps = {
  overlayLeft?: ReactNode;
  overlayRight?: ReactNode;
  overlayCenter?: ReactNode;
  dealerArea: ReactNode;
  centerArea?: ReactNode;
  playerArea: ReactNode;
  controls?: ReactNode;
  modalOverlay?: ReactNode;
  className?: string;
};

export default function BlackjackTableLayout({
  overlayLeft,
  overlayRight,
  overlayCenter,
  dealerArea,
  centerArea,
  playerArea,
  controls,
  modalOverlay,
  className,
}: BlackjackTableLayoutProps) {
  return (
    <div
      className={cn(
        "relative grid h-full min-h-[clamp(34rem,72svh,58rem)] grid-rows-[minmax(0,1fr)_auto] gap-4 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4",
        className
      )}
    >
      <div className="pointer-events-none absolute left-3 right-3 top-2 z-20 sm:left-4 sm:right-4 sm:top-3 lg:left-6 lg:right-6 lg:top-4">
        <div className="flex min-h-16 flex-wrap items-start justify-between gap-3 lg:min-h-20">
          <div className="pointer-events-auto flex flex-1 justify-start">{overlayLeft}</div>
          {overlayCenter ? (
            <div className="pointer-events-auto order-last flex w-full justify-center lg:order-none lg:w-auto">
              {overlayCenter}
            </div>
          ) : null}
          <div className="pointer-events-auto flex flex-1 justify-end">{overlayRight}</div>
        </div>
      </div>

      <div className="relative z-10 grid min-h-0 grid-rows-[minmax(0,1fr)_auto_minmax(0,1.15fr)] gap-3 sm:gap-4 lg:gap-5">
        <div className="flex min-h-0 items-center justify-center">{dealerArea}</div>
        <div className="flex min-h-[2.5rem] items-center justify-center px-2">
          {centerArea}
        </div>
        <div className="flex min-h-0 items-center justify-center">{playerArea}</div>
      </div>

      {controls ? <div className="relative z-10">{controls}</div> : null}

      {modalOverlay ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          {modalOverlay}
        </div>
      ) : null}
    </div>
  );
}
