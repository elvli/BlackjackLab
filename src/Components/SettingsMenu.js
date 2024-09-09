import React, { useState } from "react";

const SettingsMenu = ({ settings, setSettings }) => {
  const [Regular, SetRegular] = useState(settings.Regular);
  const [AceX, SetAceX] = useState(settings.AceX);
  const [Pairs, SetPairs] = useState(settings.Pairs);
  const [Stands17, SetStands17] = useState(settings.Stands17);
  const [Hits17, SetHits17] = useState(settings.Hits17);

  const handleRegular = () => {
    SetRegular(!Regular);
    SetAceX(Regular);
    SetPairs(false);
  };

  const handleAceX = () => {
    SetRegular(false);
    SetAceX(!AceX);
    SetPairs(AceX);
  };

  const handlePairs = () => {
    SetRegular(Pairs);
    SetAceX(false);
    SetPairs(!Pairs);
  };

  const handleDealer17 = () => {
    const newStands17 = !Stands17;

    SetStands17(newStands17);
    SetHits17(!newStands17);
  };

  const handleReset = () => {
    setSettings((prevSettings) => {
      const newSettings = {
        Regular: Regular,
        AceX: AceX,
        Pairs: Pairs,
        Stands17: Stands17,
        Hits17: Hits17,
      };

      console.log(newSettings);
      return newSettings;
    });
  };

  return (
    <div>
      <ul
        role="menu"
        data-popover="menu"
        data-popover-placement="bottom"
        className="absolute z-10 mt-3 right-3 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
      >
        <li
          role="menuitem"
          className="block w-full cursor-pointer rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Number of Decks
            </span>
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="4"
              required
            />
          </label>
        </li>

        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onClick={handleRegular}
              checked={Regular}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Dealer deals you regulary
            </span>
          </label>
        </li>
        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onClick={handleAceX}
              checked={AceX}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Dealer deals you Ace & X only
            </span>
          </label>
        </li>
        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onClick={handlePairs}
              checked={Pairs}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Dealer deals you pairs only
            </span>
          </label>
        </li>
        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onClick={handleDealer17}
              checked={Stands17}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Dealer stands on SOFT 17
            </span>
          </label>
        </li>
        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              onClick={handleDealer17}
              checked={Hits17}
            />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Dealer hits on SOFT 17
            </span>
          </label>
        </li>
        <li
          role="menuitem"
          className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <label class="inline-flex items-center cursor-pointer">
            <button
              type="button"
              onClick={handleReset}
              class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            >
              Reset Deck
            </button>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default SettingsMenu;

// const handleRegular = () => {
//   const newRegular = !Regular;

//   SetRegular(newRegular);
//   SetAceX(!newRegular);
//   SetPairs(false);

//   setSettings({
//     Regular: newRegular,
//     AceX: Regular,
//     Pairs: false,
//     Stands17,
//     Hits17,
//   });
// };

// const handleAceX = () => {
//   const newAceX = !AceX;

//   SetRegular(false);
//   SetAceX(newAceX);
//   SetPairs(!newAceX);

//   setSettings({
//     Regular: false,
//     AceX: newAceX,
//     Pairs: AceX,
//     Stands17,
//     Hits17,
//   });
// };

// const handlePairs = () => {
//   const newPairs = !Pairs;

//   SetRegular(!newPairs);
//   SetAceX(false);
//   SetPairs(newPairs);

//   setSettings({
//     Regular: !newPairs,
//     AceX: false,
//     Pairs: newPairs,
//     Stands17,
//     Hits17,
//   });
// };

// const handleDealer17 = () => {
//   const newStands17 = !Stands17;

//   SetStands17(newStands17);
//   SetHits17(!newStands17);

//   setSettings({
//     Regular,
//     AceX,
//     Pairs,
//     Stands17: newStands17,
//     Hits17: !newStands17,
//   });
// };
