"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store/store";
import { cn } from "@/lib/utils";
import { getCardDealAnimationDuration } from "@/lib/dealer-speed";
import { getCardFanMetrics } from "@/lib/card-fan-layout";
import { Card as PlayingCard } from "@/components/utils/cardUtils";

type CardFanProps = {
  hand: PlayingCard[];
  hiddenCardIndices?: number[];
  className?: string;
  cardClassName?: string;
};

export default function CardFan({
  hand,
  hiddenCardIndices = [],
  className,
  cardClassName,
}: CardFanProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const dealerSpeed = useSelector((state: RootState) => state.settings.dealerSpeed);
  const animationDuration = getCardDealAnimationDuration(dealerSpeed);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.getBoundingClientRect().width);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const metrics = useMemo(
    () => getCardFanMetrics(containerWidth, hand.length || 1),
    [containerWidth, hand.length]
  );

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full justify-center overflow-hidden px-1", className)}
    >
      <div
        className="flex items-end justify-center"
        style={{
          width: `${metrics.fanWidth}px`,
          minHeight: `${metrics.cardHeight}px`,
        }}
      >
        {hand.map((card, idx) => {
          const suitLetter = card.suit[0];
          const cardCode = `${card.value}-${suitLetter}`;
          const isHidden = hiddenCardIndices.includes(idx);
          const imageSrc = isHidden ? "/cards/RedBack.png" : `/cards/${cardCode}.png`;
          const altText = isHidden
            ? "Face-down dealer card"
            : `${card.value} of ${card.suit}`;

          return (
            <motion.div
              key={`${cardCode}-${idx}`}
              initial={animationDuration === 0 ? false : { y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: animationDuration, ease: "easeOut" }}
              style={{
                width: `${metrics.cardWidth}px`,
                height: `${metrics.cardHeight}px`,
                marginLeft: idx === 0 ? 0 : `-${metrics.overlap}px`,
              }}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                cardClassName
              )}
            >
              <Image
                src={imageSrc}
                alt={altText}
                width={Math.round(metrics.cardWidth)}
                height={Math.round(metrics.cardHeight)}
                className="h-full w-full object-contain"
                sizes="(max-width: 640px) 24vw, (max-width: 1024px) 16vw, 136px"
                priority
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
