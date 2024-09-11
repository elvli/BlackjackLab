import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import BlackjackTable from "./Components/BlackjackTable";

var mySum = 0;
var dealerSum = 0;

var myAceCount = 0;
var dealerAceCount = 0;

var myCards = [];
var dealerCards = [];

var hidden;
var deck = [];

var canHit = true;
var dealerCanHit = true;

function createDeck(numDecks) {
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
        deck.push(rank + "-" + suit);
      }
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
  let card = deck.pop();
  myCards.push(card);
  mySum += getValue(card);
  myAceCount += checkAce(card);

  card = deck.pop();
  dealerCards.push(card);
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);

  card = deck.pop();
  myCards.push(card);
  mySum += getValue(card);
  myAceCount += checkAce(card);
  mySum = reduceAce(mySum, myAceCount);

  card = deck.pop();
  dealerCards.push(card);
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  dealerSum = reduceAce(dealerSum, dealerAceCount);

  canHit = !(mySum === 21);
  dealerCanHit = !(dealerSum === 21);

  console.log("myCards:", myCards, "mySum:", mySum);
  console.log("dealersCards:", dealerCards, "dealerSum:", dealerSum);
  console.log("canHit:", canHit);
  console.log("canHit:", canHit);
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    if (value === "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
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

  window.onload = function () {
    createDeck(settings.NumDecks);
    shuffleDeck();
    startGame();
  };

  return (
    <div>
      <Navbar settings={settings} setSettings={setSettings} />
      <BlackjackTable />
    </div>
  );
}

export default App;
