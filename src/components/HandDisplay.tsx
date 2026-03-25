import Image from "next/image";
import { motion } from "framer-motion";
// import { useEffect, useRef } from "react";

interface Card {
  value: string;
  suit: string;
}

interface HandDisplayProps {
  hand: Card[];
}

const HandDisplay: React.FC<HandDisplayProps> = ({ hand }) => {
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

        return (
          <motion.div
            key={`${cardCode}-${idx}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              marginLeft: idx === 0 ? 0 : -96,
              width: 192,
              height: 288,
            }}
            className="relative overflow-hidden"
          >
            <Image
              src={`/cards/${cardCode}.png`}
              alt={`${card.value} of ${card.suit}`}
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
