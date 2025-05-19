import React from "react";
import SettingsModal from "./SettingsModal";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 rounded-lg shadow-sm z-10">
      <div className="flex-1">
        <p className="pl-2 font-bold text-xl">BlackJackLab</p>
      </div>
      <div className="flex-none">
        <SettingsModal />
      </div>
    </div>
  );
};

export default Navbar;
