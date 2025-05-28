"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const GameSettings = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"numDecks"}>
            <div className="space-y-2 -mt-2">
              {/* Number of Decks */}
              <Label htmlFor="numDecks">Number of decks</Label>
              <ToggleGroup
                id="numDecks"
                type="single"
                defaultValue="4"
                className="mt-2"
              >
                {["1", "2", "4", "6", "8"].map((value) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="data-[state=on]:bg-primary data-[state=on]:text-white px-4 py-2 rounded-md dark:data-[state=on]:text-black"
                  >
                    {value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Separator />

              {/* Dealer Hit/Stand on soft 17 */}
              <RadioGroup defaultValue="hit">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hit" id="rhit" />
                  <Label htmlFor="rhit">Dealer hit on soft 17</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stand" id="rstand" />
                  <Label htmlFor="rstand">Dealer stand on soft 17</Label>
                </div>
              </RadioGroup>
              <Separator />

              {/* Reshuffle type */}
              <Label htmlFor="shuffle-type">Reshuffle type</Label>
              <RadioGroup id="shuffle-type" defaultValue="auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="rauto" />
                  <Label htmlFor="rauto">Auto reshuffle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csm" id="rcsm" />
                  <Label htmlFor="rcsm">CSMs</Label>
                </div>
              </RadioGroup>
              <Separator />

              {/* Surrendering */}
              <Label htmlFor="surrender">Surrender</Label>
              <div id="surrender" className="flex items-center space-x-2">
                <Switch id="allow-surrender" defaultChecked />
                <Label htmlFor="allow-surrender">Allow surrender</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="allow-late-surrender" defaultChecked />
                <Label htmlFor="allow-late-surrender">
                  Allow late surrender
                </Label>
              </div>
              <Separator />

              {/* Splitting */}
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="double-split" defaultChecked />
                <Label htmlFor="double-split">Allow double after split</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="resplit-aces" defaultChecked />
                <Label htmlFor="resplit-aces">Allow resplitting aces</Label>
              </div>
              <Separator />

              {/* Insurance */}
              <div className="flex items-center space-x-2">
                <Switch id="allow-surrender" defaultChecked />
                <Label htmlFor="allow-surrender">Offer insurance</Label>
              </div>
              <Separator />

              <Label htmlFor="bjpayout">Blackjack payout</Label>
              <RadioGroup defaultValue="3to2" id="bjpayout">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3to2" id="r3to2" />
                  <Label htmlFor="r3to2">3:2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6to5" id="r6to5" />
                  <Label htmlFor="r6to5">6:5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1to1" id="r1to1" />
                  <Label htmlFor="r1to1">1:1</Label>
                </div>
              </RadioGroup>
              <Separator />

              <Label htmlFor="bjpayout">Shoe penetration</Label>
              <div className="flex items-center space-x-1">
                <Input
                  type="number"
                  className="w-24 text-center font-medium
                        [appearance:textfield] 
                        [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none"
                  value={30}
                />
                <span className="font-medium">%</span>
              </div>

              <Separator />
            </div>
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default GameSettings;
