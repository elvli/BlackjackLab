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

const BettingSettings = () => {
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
                  value={1000}
                  // onChange={(e) => setBetAmount(Number(e.target.value))}
                />
              </div>
              <Separator />

              <div className="flex items-center py-1">
                <Label htmlFor="bet-increment">Betting increment:</Label>
                $
                <Input
                  type="number"
                  className="w-24 ml-1 text-center font-medium
                [appearance:textfield] 
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none"
                  value={25}
                  // onChange={(e) => setBetAmount(Number(e.target.value))}
                />
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="auto-bet" defaultChecked />
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
