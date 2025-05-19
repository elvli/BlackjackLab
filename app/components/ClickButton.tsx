"use client";
// ^ moves component to client-side bundle

import React from "react";

const ClickButton = () => {
  return (
    <button
      className="p-2 bg-gray-200 rounded-lg shadow-lg"
      onClick={() => console.log(`Click`)}
    >
      {" "}
      Click Button{" "}
    </button>
  );
};

export default ClickButton;
