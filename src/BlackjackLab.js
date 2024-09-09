import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import BlackjackTable from "./Components/BlackjackTable";

function createDeck(numDecks) {
  if (!numDecks) numDecks = 4;

  const suits = ["D", "S", "H", "C"]; // Diamonds, Spades, Hearts, Clubs
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

  const deck = [];

  for (let i = 0; i < numDecks; i++) {
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push(`${rank}${suit}`);
      }
    }
  }

  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function App() {
  const [settings, setSettings] = useState({
    NumDecks: 4,
    Regular: true,
    AceX: false,
    Pairs: false,
    Stands17: true,
    Hits17: false,
  });

  useEffect(() => {
    let deck = createDeck(4);
    console.log("Deck before shuffle:", deck);

    deck = shuffleDeck(deck);
    console.log("Deck after shuffle:", deck);
  }, []);

  return (
    <div>
      <Navbar settings={settings} setSettings={setSettings} />
      <BlackjackTable />
    </div>
  );
}

export default App;
