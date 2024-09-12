import React, { useState, useEffect } from "react";
import PlayingCard from "./PlayingCard";

const BlackjackTable = ({ settings }) => {
  const [NumDecks, SetNumDecks] = useState(settings.NumDecks);
  const [Regular, SetRegular] = useState(settings.Regular);
  const [AceX, SetAceX] = useState(settings.AceX);
  const [Pairs, SetPairs] = useState(settings.Pairs);
  const [Stands17, SetStands17] = useState(settings.Stands17);
  const [Hits17, SetHits17] = useState(settings.Hits17);

  const [deck, setDeck] = useState([]);
  const [mySum, setMySum] = useState(0);
  const [dealerSum, setDealerSum] = useState(0);
  const [myAceCount, setMyAceCount] = useState(0);
  const [dealerAceCount, setDealerAceCount] = useState(0);
  const [myCards, setMyCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [canHit, setCanHit] = useState(true);
  const [dealerCanHit, setDealerCanHit] = useState(true);

  // let deck = [];

  const createDeck = (numDecks) => {
    const newDeck = [];
    if (!numDecks) numDecks = 4;
    const suits = ["D", "S", "H", "C"];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    for (let i = 0; i < numDecks; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          newDeck.push(rank + "-" + suit);
        }
      }
    }
    setDeck(newDeck);
  };

  const shuffleDeck = () => {
    setDeck((prevDeck) => {
      const shuffledDeck = [...prevDeck];
      for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
      }
      return shuffledDeck;
    });
  };

  const getValue = (card, currentSum = 0) => {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
      if (value === "A") {
        return currentSum + 11 > 21 ? 1 : 11;
      }
      return 10;
    }

    return parseInt(value);
  };

  const checkAce = (card) => {
    if (card[0] === "A") return 1;
    return 0;
  };

  const reduceAce = (playerSum, playerAceCount) => {
    while (playerSum > 21 && playerAceCount > 0) {
      playerSum -= 10;
      playerAceCount -= 1;
    }
    return playerSum;
  };

  const hit = () => {
    setDeck((prevDeck) => {
      let card = prevDeck.pop();
      console.log(prevDeck.length);
      let newMyCards = [...myCards, card];
      let myNewSum = mySum + getValue(card);
      let myNewAceCount = myAceCount + checkAce(card);
      myNewSum = reduceAce(myNewSum, myNewAceCount);

      setMyCards(newMyCards);
      setMySum(myNewSum);
      setMyAceCount(myNewAceCount);

      setCanHit(myNewSum < 21);

      console.log("MY SUM:", myNewSum);
      if (myNewSum > 21) console.log("BREAK");
      return prevDeck;
    });
  };

  const startGame = () => {
    setDeck((prevDeck) => {
      let card = prevDeck.pop();
      let newMyCards = [card];
      let myNewSum = getValue(card);
      let myNewAceCount = checkAce(card);

      card = prevDeck.pop();
      let newDealerCards = [card];
      let dealerNewSum = getValue(card);
      let dealerNewAceCount = checkAce(card);

      card = prevDeck.pop();
      newMyCards.push(card);
      myNewSum += getValue(card);
      myNewAceCount += checkAce(card);
      myNewSum = reduceAce(myNewSum, myNewAceCount);

      card = prevDeck.pop();
      newDealerCards.push(card);
      dealerNewSum += getValue(card);
      dealerNewAceCount += checkAce(card);
      dealerNewSum = reduceAce(dealerNewSum, dealerNewAceCount);

      setMyCards(newMyCards);
      setMySum(myNewSum);
      setMyAceCount(myNewAceCount);
      setDealerCards(newDealerCards);
      setDealerSum(dealerNewSum);
      setDealerAceCount(dealerNewAceCount);

      setCanHit(myNewSum < 21);
      setDealerCanHit(dealerNewSum < 17);

      return prevDeck;
    });
  };

  const handleHit = () => {
    console.log("deck:", deck);
    hit();
  };

  const handleStand = () => {
    console.log("Stand button clicked");
  };

  const handleDouble = () => {
    console.log("Double button clicked");
  };

  const handleSplit = () => {
    console.log("Split button clicked");
  };

  useEffect(() => {
    createDeck(NumDecks);
    shuffleDeck();
    startGame();

    console.log("deck num:", NumDecks);
    console.log("deck:", deck);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)]">
      {/* Dealer's Cards */}
      <div className="flex-1 bg-green-700 flex justify-center">
        {dealerCards.map((card, index) => (
          <PlayingCard key={index} value={card} />
        ))}
      </div>

      {/* My Cards */}
      <div className="flex-1 bg-green-900 flex justify-center">
        {myCards.map((card, index) => (
          <PlayingCard key={index} value={card} />
        ))}
      </div>

      {/* Control Buttons */}
      <div className="h-1/5 mt-2 flex justify-center items-center">
        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={handleHit}
        >
          Hit
        </button>

        <button
          type="button"
          className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-500 dark:hover:bg-red-600"
          onClick={handleStand}
        >
          Stand
        </button>

        <button
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
          onClick={handleDouble}
        >
          Double
        </button>

        <button
          type="button"
          className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
          onClick={handleSplit}
        >
          Split
        </button>
      </div>
    </div>
  );
};

export default BlackjackTable;
