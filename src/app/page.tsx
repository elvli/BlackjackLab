"use client";

import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { numDecks, numHands } = useSelector(
    (state: RootState) => state.settings
  );

  return (
    <div className="relative h-screen overflow-hidden p-4 flex flex-col">
      {/* Top Card that fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full bg-green-900 overflow-auto">
          <CardContent>
            <p>Card Content</p>
            numDecks: {numDecks}
            numHands: {numHands}
          </CardContent>
        </Card>
      </div>

      {/* Fixed footer (non-growing) */}
      <div className="mt-3">
        <Card className="py-3">
          <div className="flex gap-2 justify-center">
            <Button variant="default">Action 1</Button>
            <Button variant="secondary">Action 2</Button>
            <Button variant="ghost">Action 3</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
