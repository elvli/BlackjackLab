import Image from "next/image";

interface Card {
  value: string;
  suit: string;
}

interface HandDisplayProps {
  hand: Card[];
}

const HandDisplay: React.FC<HandDisplayProps> = ({ hand }) => {
  return (
    <div className="relative flex">
      {hand.map((card, idx) => {
        const suitLetter = card.suit[0];
        const cardCode = `${card.value}-${suitLetter}`;

        return (
          <Image
            key={idx}
            src={`/cards/${cardCode}.png`}
            alt={`${card.value} of ${card.suit}`}
            width={192}
            height={288}
            className="rounded shadow-sm"
            style={{ marginLeft: idx === 0 ? 0 : -96 }}
          />
        );
      })}
    </div>
  );
};

export default HandDisplay;
