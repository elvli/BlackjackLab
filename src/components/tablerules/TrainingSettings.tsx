"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import {
  setDealerSpeed,
  setShowCount,
  setShowHiddenCard,
  setShowOptimalPlay,
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
import DealerSpeedSlider from "@/components/training/DealerSpeedSlider";

const TrainingSettings = () => {
  const dispatch = useDispatch();
  const { showCount, showHiddenCard, showOptimalPlay, dealerSpeed } = useSelector(
    (state: RootState) => state.settings
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"numDecks"}>
            <div className="space-y-2 -mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-count"
                  checked={showCount}
                  onCheckedChange={(checked) => dispatch(setShowCount(checked))}
                />
                <Label htmlFor="show-count">Show count</Label>
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-hidden-card"
                  checked={showHiddenCard}
                  onCheckedChange={(checked) =>
                    dispatch(setShowHiddenCard(checked))
                  }
                />
                <Label htmlFor="show-hidden-card">Show hidden card</Label>
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-optimal-play"
                  checked={showOptimalPlay}
                  onCheckedChange={(checked) =>
                    dispatch(setShowOptimalPlay(checked))
                  }
                />
                <Label htmlFor="show-optimal-play">Show optimal play</Label>
              </div>
              <Separator />

              <DealerSpeedSlider
                dealerSpeed={dealerSpeed}
                setDealerSpeed={(value) => dispatch(setDealerSpeed(value))}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default TrainingSettings;
