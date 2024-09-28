import React, { useState, useEffect } from "react";

const getCardImage = async (value) => {
  try {
    const image = await import(`../../public/assets/CardImages/${value}.png`);
    return image.default;
  } catch (error) {
    console.error("Error loading card image:", error);
    return null;
  }
};

const PlayingCard = ({ value }) => {
  const [cardImage, setCardImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const image = await getCardImage(value);
      setCardImage(image);
    };
    loadImage();
  }, [value]);

  return (
    <div className="flex items-center justify-center">
      <img
        src={cardImage}
        alt={value}
        className="object-contain max-w-sm max-h-40 sm:max-h-48 md:max-h-56 lg:max-h-72"
      />
      {/* ) : (
        <span className="text-gray-500">No Image</span>
      )} */}
    </div>
  );
};

export default PlayingCard;
