import React from "react";
import { useState } from "react";

import SettingsMenu from "./SettingsMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full">
        <div className="flex items-center justify-between mx-auto p-4 w-full">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMA2RoDdhkwDsLpz292znc9A5fj4PNPJMl5Q&s"
              className="h-8"
              alt="Blackjack Lab"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Blackjack Lab
            </span>
          </div>

          <div className="md:block md:w-auto">
            <ul className="font-medium flex p-4 md:p-0 space-x-8 rtl:space-x-reverse md:mt-0 dark:border-gray-700">
              <li>
                <button
                  onClick={toggleMenu}
                  data-ripple-light="true"
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-default"
                  aria-expanded={isMenuOpen ? "true" : "false"}
                >
                  <span className="sr-only">Open settings menu</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>

                {isMenuOpen && <SettingsMenu />}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
