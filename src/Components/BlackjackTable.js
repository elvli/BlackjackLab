import React from "react";

import PlayingCard from "./PlayingCard";

const BlackjackTable = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)]">
      <div className="flex-1 bg-green-700 flex justify-center">
        <PlayingCard value="A-S" />
        <PlayingCard value="CB" />
      </div>

      <div className="flex-1 bg-green-900 flex justify-center">
        <PlayingCard value="J-D" />
        <PlayingCard value="A-S" />
        <PlayingCard value="A-D" />
      </div>

      <div className="h-1/5 mt-2 flex justify-center items-center">
        <button
          type="button"
          class="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Hit
        </button>

        <button
          type="button"
          class="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-500 dark:hover:bg-red-600"
        >
          Stand
        </button>

        <button
          type="button"
          class="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Double
        </button>

        <button
          type="button"
          class="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700"
        >
          Split
        </button>
      </div>
    </div>
  );
};

export default BlackjackTable;
