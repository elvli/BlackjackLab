"use client";

import React, { useState, useRef } from "react";
import { Settings, X } from "lucide-react";

import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, setNumHands } from "../store/SettingsSlice";

const SettingsModal = () => {
  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDialogElement>(null);

  const { numDecks, numHands } = useSelector(
    (state: RootState) => state.settings
  );

  const changeNumHands = () => {
    dispatch(setNumHands(localNumHands));
  };

  const [localNumHands, setLocalNumHands] = useState(numHands);

  return (
    <>
      <button
        className="btn btn-ghost p-2"
        onClick={() => modalRef.current?.showModal()}
      >
        <Settings />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle absolute right-2 top-2">
              <X size={16} />
            </button>
          </form>

          <h3 className="font-bold text-lg">Settings</h3>

          <div>numdecks: {numDecks}</div>
          <button className="" onClick={() => dispatch(increment())}>
            increment decks
          </button>
          <button className="" onClick={() => dispatch(decrement())}>
            decrement decks
          </button>

          <div className="w-full max-w-xs">
            <input
              type="range"
              min={1}
              max={5}
              value={localNumHands}
              onChange={(e) => setLocalNumHands(Number(e.target.value))}
              onMouseUp={changeNumHands}
              onTouchEnd={changeNumHands}
              className="range"
              step={1}
            />
            <div className="flex justify-between px-2.5 mt-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div className="flex justify-between px-2.5 mt-2 text-xs">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close modal" />
        </form>
      </dialog>
    </>
  );
};

export default SettingsModal;
