"use client";

import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import GameControls from "@/components/GameControls";

export default function Home() {
  const { numDecks, numHands } = useSelector(
    (state: RootState) => state.settings
  );

  return (
    <div className="relative h-screen overflow-hidden p-4 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Card className="h-full bg-green-900 overflow-auto border-0">
          <CardContent>
            <p>Card Content</p>
            numDecks: {numDecks}
            numHands: {numHands}
          </CardContent>
        </Card>
      </div>

      <GameControls />
    </div>
  );
}
