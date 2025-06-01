"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import {
  setNumDecks,
  setSoft17,
  setReshuffle,
  setAllowSurrender,
  setAllowLateSurrender,
  setAllowDoubleSplit,
  setAllowResplitAces,
  setAllowInsurance,
  setBjPayout,
  setShoePenetration,
} from "@/app/store/SettingsSlice";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { setEnvironmentData } from "worker_threads";

const GameSettings = () => {
  const dispatch = useDispatch();
  const {
    numDecks,
    numHands,
    soft17,
    reshuffle,
    allowSurrender,
    allowLateSurrender,
    allowDoubleSplit,
    allowResplitAces,
    allowInsurance,
    bjPayout,
    shoePenetration,
  } = useSelector((state: RootState) => state.settings);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"numDecks"}>
            <div className="space-y-2 -mt-2">
              <Label htmlFor="numDecks">Number of decks</Label>
              <ToggleGroup
                id="numDecks"
                type="single"
                value={String(numDecks)}
                onValueChange={(value) => {
                  if (value) dispatch(setNumDecks(Number(value)));
                }}
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
              <RadioGroup
                value={soft17}
                onValueChange={(val) => dispatch(setSoft17(val))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hits" id="rhit" />
                  <Label htmlFor="rhit">Dealer hits on soft 17</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stands" id="rstand" />
                  <Label htmlFor="rstand">Dealer stands on soft 17</Label>
                </div>
              </RadioGroup>
              <Separator />

              {/* Reshuffle type */}
              <Label htmlFor="shuffle-type">Reshuffle type</Label>
              <RadioGroup
                value={reshuffle}
                onValueChange={(val) => dispatch(setReshuffle(val))}
                id="shuffle-type"
                defaultValue="auto"
              >
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
                <Switch
                  id="allow-surrender"
                  checked={allowSurrender}
                  onCheckedChange={(checked) =>
                    dispatch(setAllowSurrender(checked))
                  }
                />
                <Label htmlFor="allow-surrender">Allow surrender</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-late-surrenderr"
                  checked={allowLateSurrender}
                  onCheckedChange={(checked) =>
                    dispatch(setAllowLateSurrender(checked))
                  }
                />
                <Label htmlFor="allow-late-surrender">
                  Allow late surrender
                </Label>
              </div>
              <Separator />

              {/* Splitting */}
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="double-split"
                  checked={allowDoubleSplit}
                  onCheckedChange={(checked) =>
                    dispatch(setAllowDoubleSplit(checked))
                  }
                />
                <Label htmlFor="double-split">Allow double after split</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="resplit-aces"
                  checked={allowResplitAces}
                  onCheckedChange={(checked) =>
                    dispatch(setAllowResplitAces(checked))
                  }
                />
                <Label htmlFor="resplit-aces">Allow resplitting aces</Label>
              </div>
              <Separator />

              {/* Insurance */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="offer-insurance"
                  checked={allowInsurance}
                  onCheckedChange={(checked) =>
                    dispatch(setAllowInsurance(checked))
                  }
                />
                <Label htmlFor="offer-insurance">Offer insurance</Label>
              </div>
              <Separator />

              <Label htmlFor="bjpayout">Blackjack payout</Label>
              <RadioGroup
                id="bjpayout"
                value={bjPayout}
                onValueChange={(val) => dispatch(setBjPayout(val))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3:2" id="r3to2" />
                  <Label htmlFor="r3to2">3:2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6:5" id="r6to5" />
                  <Label htmlFor="r6to5">6:5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1:1" id="r1to1" />
                  <Label htmlFor="r1to1">1:1</Label>
                </div>
              </RadioGroup>
              <Separator />

              <Label htmlFor="bjpayout">Shoe penetration</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  className="w-12 text-center font-medium
                    [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                  value={Math.round(shoePenetration * 100)}
                  onChange={(e) =>
                    dispatch(setShoePenetration(Number(e.target.value) / 100))
                  }
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
