import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import BlackjackLab from "./BlackjackLab";
import reportWebVitals from "./reportWebVitals";
import { GameProvider } from "./Context/GameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameProvider>
      <BlackjackLab />
    </GameProvider>
  </React.StrictMode>
);

reportWebVitals();
