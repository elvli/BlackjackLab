"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import {
  setStartingBankroll,
  setStartingBet,
  setBettingIncrement,
  setAutoBet,
} from "@/app/store/SettingsSlice";

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
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const BettingSettings = () => {
  const dispatch = useDispatch();
  const { startingBankroll, startingBet, bettingIncrement, autoBet } =
    useSelector((state: RootState) => state.settings);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"numDecks"}>
            <div className="space-y-2 -mt-2">
              <div className="flex items-center py-1">
                <Label htmlFor="starting-bankroll">Starting Bankroll:</Label>
                $
                <Input
                  id="starting-bankroll"
                  type="number"
                  className="w-24 ml-1 text-center font-medium
                    [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                  value={startingBankroll}
                  onChange={(e) =>
                    dispatch(setStartingBankroll(Number(e.target.value)))
                  }
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between py-1">
                <div className="flex flex-col leading-tight">
                  <Label htmlFor="starting-bet">Starting</Label>
                  <Label htmlFor="starting-bet">Bet:</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <span>$</span>
                  <Input
                    id="starting-bet"
                    type="number"
                    className="w-22 text-center font-medium
                      [appearance:textfield] 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none"
                    value={startingBet}
                    onChange={(e) =>
                      dispatch(setStartingBet(Number(e.target.value)))
                    }
                  />
                </div>
              </div>
              <Separator />

              <div className="flex items-center py-1">
                <Label htmlFor="bet-increment">Betting increment:</Label>
                $
                <Input
                  id="bet-increment"
                  type="number"
                  min={1}
                  className="w-26 ml-1 text-center font-medium
                    [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                  value={bettingIncrement}
                  onChange={(e) =>
                    dispatch(setBettingIncrement(Number(e.target.value)))
                  }
                />
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-bet"
                  checked={autoBet}
                  onCheckedChange={(value) => dispatch(setAutoBet(value))}
                />
                <Label htmlFor="auto-bet">Auto bet</Label>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default BettingSettings;
