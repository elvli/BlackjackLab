import Image from "next/image";

const HandDisplay = ({ hand }) => {
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
            style={{ marginLeft: idx === 0 ? 0 : -96 }} // overlap by 48px
          />
        );
      })}
    </div>
  );
};

export default HandDisplay;
