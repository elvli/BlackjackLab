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

const TrainingSettings = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"numDecks"}>
            <div className="space-y-2 -mt-2">
              <div className="flex items-center space-x-2">
                <Switch id="show-count" defaultChecked />
                <Label htmlFor="show-count">Show count</Label>
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="show-hidden-card" defaultChecked />
                <Label htmlFor="show-hidden-card">Show hidden card</Label>
              </div>
              <Separator />

              <div className="flex items-center space-x-2">
                <Switch id="show-optimal-play" defaultChecked />
                <Label htmlFor="show-optimal-play">Show optimal play</Label>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default TrainingSettings;
