import React, { useState, createContext, useContext } from "react";

const GameContext = createContext();

export const useGameProvider = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const [NumDecks, SetNumDecks] = useState(4);
  const [Regular, SetRegular] = useState(true);
  const [AceX, SetAceX] = useState(false);
  const [Pairs, SetPairs] = useState(false);
  const [Stands17, SetStands17] = useState(true);
  const [Hits17, SetHits17] = useState(false);

  const [deck, setDeck] = useState([]);
  const [numHands, setNumHands] = useState(0);
  const [currentHand, setCurrentHand] = useState(1);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameStatus, setGameStatus] = useState("idle");

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
    return newDeck;
  };

  const shuffleDeck = (deckToShuffle) => {
    const shuffledDeck = [...deckToShuffle];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };

  const startGame = () => {
    const newDeck = createDeck(NumDecks);
    const shuffledDeck = shuffleDeck(newDeck);

    const dealerHand = [shuffledDeck[0], shuffledDeck[2]];
    const playerHand = [shuffledDeck[1], shuffledDeck[3]];

    setDealerCards(dealerHand);
    setPlayerCards(playerHand);
    setDeck(shuffledDeck.slice(4));

    console.log("Dealt cards:", dealerHand, playerHand);
    console.log("Remaining deck:", shuffledDeck.slice(4));
  };

  return (
    <GameContext.Provider
      value={{
        NumDecks,
        Regular,
        AceX,
        Pairs,
        Stands17,
        Hits17,
        deck,
        numHands,
        currentHand,
        playerCards,
        dealerCards,
        gameStatus,
        setNumDecks: SetNumDecks,
        setRegular: SetRegular,
        setAceX: SetAceX,
        setPairs: SetPairs,
        setStands17: SetStands17,
        setHits17: SetHits17,
        setDeck,
        setNumHands,
        setCurrentHand,
        setPlayerCards,
        setDealerCards,
        setGameStatus,
        createDeck,
        shuffleDeck,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
