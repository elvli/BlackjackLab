import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import BlackjackTable from "./Components/BlackjackTable";

function App() {
  const [settings, setSettings] = useState({
    Regular: true,
    AceX: false,
    Pairs: false,
    Stands17: true,
    Hits17: false,
  });

  return (
    <div>
      <Navbar settings={settings} setSettings={setSettings} />
      <BlackjackTable />
    </div>
  );
}

export default App;
