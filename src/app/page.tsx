"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Card, CardContent } from "@/components/ui/card";
import GameControls from "@/components/GameControls";
import HandDisplay from "@/components/HandDisplay";

export default function Home() {
  const {
    playerHands,
    dealerHand,
    playerScores,
    // dealerScore,
    currentHandIndex,
  } = useSelector((state: RootState) => state.play);
  // const { numHands } = useSelector((state: RootState) => state.settings);

  const getAngles = (n: number) => {
    if (n === 1) return [90];
    if (n === 2) return [65, 115];
    const start = 40;
    const end = 140;
    const step = (end - start) / (n - 1);
    return Array.from({ length: n }, (_, i) => start + i * step);
  };

  return (
    <div className="relative h-screen overflow-hidden p-4 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Card className="h-full bg-green-900 overflow-auto border-0">
          <CardContent>
            <div className="relative w-full flex-grow m-auto flex items-center justify-center">
              <div className="absolute top-[5vh] dark:text-black">
                {/* left-1/2 -translate-x-1/2 */}
                {/* Dealer (Score: {dealerScore}) */}
                <div className="flex space-x-2 p-2">
                  <HandDisplay hand={dealerHand} />
                </div>
              </div>

              {getAngles(playerHands.length).map((deg, i) => {
                const angle = (deg * Math.PI) / 180;
                const radius = 280;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius + 60;

                return (
                  <div
                    key={i}
                    className={`absolute rounded-lg dark:text-black mt-14 lg:mt-20 w-max text-center`}
                    style={{
                      top: `calc(10vh + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="flex flex-col items-center p-2">
                      <span
                        className={`bg-white font-semibold rounded-md p-2 mb-2 shadow animate-border-pulse ${
                          i === currentHandIndex
                            ? "border-4 border-blue-500"
                            : ""
                        }`}
                      >
                        Hand {i + 1} (Score: {playerScores[i] ?? 0})
                      </span>

                      <HandDisplay hand={playerHands[i]} />
                    </div>
                  </div>

                  // // This is the original
                  // <div
                  //   key={i}
                  //   className={`absolute rounded-lg dark:text-black mt-14 lg:mt-20`}
                  //   style={{
                  //     top: `calc(10vh + ${y}px)`,
                  //     left: `calc(50% + ${x}px)`,
                  //     transform: "translate(-50%, -50%)",
                  //   }}
                  // >
                  //   <div className="flex flex-col items-center p-2">
                  //     <span
                  //       className={`bg-white font-semibold rounded-md p-2 mb-2 shadow animate-border-pulse ${
                  //         i === currentHandIndex
                  //           ? "border-4 border-blue-500"
                  //           : ""
                  //       }`}
                  //     >
                  //       Hand {i + 1} (Score: {playerScores[i] ?? 0})
                  //     </span>

                  //     <HandDisplay hand={playerHands[i]} />
                  //   </div>
                  // </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <GameControls />
    </div>
  );
}
