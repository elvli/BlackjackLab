"use client";

import { Slider } from "@/components/ui/slider";
import {
  DEALER_SPEED_DEFAULT,
  DEALER_SPEED_MAX,
  DEALER_SPEED_MIN,
  DEALER_SPEED_STEP,
  getDealerSpeedLabel,
} from "@/lib/dealer-speed";

type DealerSpeedSliderProps = {
  dealerSpeed: number;
  setDealerSpeed: (value: number) => void;
};

export default function DealerSpeedSlider({
  dealerSpeed,
  setDealerSpeed,
}: DealerSpeedSliderProps) {
  const valueText = dealerSpeed === 0 ? "Instant" : `${dealerSpeed} ms`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Dealer Speed</p>
          <p className="text-xs text-muted-foreground">
            Controls the delay between dealer draw animations.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{valueText}</p>
          <p className="text-xs text-muted-foreground">
            {getDealerSpeedLabel(dealerSpeed)}
          </p>
        </div>
      </div>

      <Slider
        value={[dealerSpeed]}
        min={DEALER_SPEED_MIN}
        max={DEALER_SPEED_MAX}
        step={DEALER_SPEED_STEP}
        onValueChange={(value) => setDealerSpeed(value[0] ?? DEALER_SPEED_DEFAULT)}
      />
    </div>
  );
}
