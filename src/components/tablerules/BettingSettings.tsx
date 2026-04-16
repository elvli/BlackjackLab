"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import {
  setStartingBankroll,
  setStartingBet,
  setBettingIncrement,
} from "@/app/store/SettingsSlice";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  getMaxBettingIncrement,
  getMaxStartingBet,
  MAX_STARTING_BANKROLL,
  MIN_BETTING_INCREMENT,
  MIN_STARTING_BANKROLL,
  MIN_STARTING_BET,
} from "@/lib/betting-settings";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const BettingSettings = () => {
  const dispatch = useDispatch();
  const { startingBankroll, startingBet, bettingIncrement } =
    useSelector((state: RootState) => state.settings);
  const maxStartingBet = getMaxStartingBet(startingBankroll);
  const maxBettingIncrement = getMaxBettingIncrement(startingBankroll);

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
                  min={MIN_STARTING_BANKROLL}
                  max={MAX_STARTING_BANKROLL}
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
              <p className="text-xs text-muted-foreground">
                Limit: ${MIN_STARTING_BANKROLL.toLocaleString()} to ${MAX_STARTING_BANKROLL.toLocaleString()}
              </p>
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
                    min={MIN_STARTING_BET}
                    max={maxStartingBet}
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
              <p className="text-xs text-muted-foreground">
                Max starting bet: ${maxStartingBet.toLocaleString()}
              </p>
              <Separator />

              <div className="flex items-center py-1">
                <Label htmlFor="bet-increment">Betting increment:</Label>
                $
                <Input
                  id="bet-increment"
                  type="number"
                  min={MIN_BETTING_INCREMENT}
                  max={maxBettingIncrement}
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
              <p className="text-xs text-muted-foreground">
                Increment range: ${MIN_BETTING_INCREMENT.toLocaleString()} to ${maxBettingIncrement.toLocaleString()}
              </p>
              <Separator />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default BettingSettings;
