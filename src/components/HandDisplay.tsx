import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getCardDealAnimationDuration } from "@/lib/dealer-speed";
// import { useEffect, useRef } from "react";

interface Card {
  value: string;
  suit: string;
}

interface HandDisplayProps {
  hand: Card[];
  hiddenCardIndices?: number[];
}

const HandDisplay: React.FC<HandDisplayProps> = ({
  hand,
  hiddenCardIndices = [],
}) => {
  const dealerSpeed = useSelector((state: RootState) => state.settings.dealerSpeed);
  const animationDuration = getCardDealAnimationDuration(dealerSpeed);

  // const prevHandLength = useRef(hand.length);

  // useEffect(() => {
  //   if (hand.length > prevHandLength.current) {
  //     const audio = new Audio("/sounds/CardPlaced.wav");
  //     audio.play();
  //   }
  //   prevHandLength.current = hand.length;
  // }, [hand.length]);

  return (
    <div className="relative flex">
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
              marginLeft: idx === 0 ? 0 : -96,
              width: 192,
              height: 288,
            }}
            className="relative overflow-hidden"
          >
            <Image
              src={imageSrc}
              alt={altText}
              width={192}
              height={288}
              className="object-cover"
              priority
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default HandDisplay;
