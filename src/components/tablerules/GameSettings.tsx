"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SessionChangeBehavior = "start-new-session" | "continue-current-session";

type GameSettingsDraft = {
  numDecks: number;
  soft17: string;
  reshuffle: string;
  allowSurrender: boolean;
  allowLateSurrender: boolean;
  allowDoubleSplit: boolean;
  allowResplitAces: boolean;
  allowInsurance: boolean;
  bjPayout: string;
  shoePenetration: number;
};

const GameSettings = () => {
  const dispatch = useDispatch();
  const {
    numDecks,
    // numHands,
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

  const currentSettings = useMemo(
    () => ({
      numDecks,
      soft17,
      reshuffle,
      allowSurrender,
      allowLateSurrender,
      allowDoubleSplit,
      allowResplitAces,
      allowInsurance,
      bjPayout,
      shoePenetration,
    }),
    [
      allowDoubleSplit,
      allowInsurance,
      allowLateSurrender,
      allowResplitAces,
      allowSurrender,
      bjPayout,
      numDecks,
      reshuffle,
      shoePenetration,
      soft17,
    ]
  );

  const [draftSettings, setDraftSettings] =
    useState<GameSettingsDraft | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const resolvedDraftSettings = draftSettings ?? currentSettings;

  const hasPendingChanges =
    JSON.stringify(resolvedDraftSettings) !== JSON.stringify(currentSettings);

  const updateDraftSetting = <K extends keyof GameSettingsDraft>(
    key: K,
    value: GameSettingsDraft[K]
  ) => {
    setDraftSettings((currentDraft) => ({
      ...(currentDraft ?? currentSettings),
      [key]: value,
    }));
  };

  const applyPendingGameSettingChange = (
    behavior: SessionChangeBehavior
  ) => {
    switch (behavior) {
      case "start-new-session":
        // Placeholder for future session split behavior.
        dispatch(setNumDecks(resolvedDraftSettings.numDecks));
        dispatch(setSoft17(resolvedDraftSettings.soft17));
        dispatch(setReshuffle(resolvedDraftSettings.reshuffle));
        dispatch(setAllowSurrender(resolvedDraftSettings.allowSurrender));
        dispatch(setAllowLateSurrender(resolvedDraftSettings.allowLateSurrender));
        dispatch(setAllowDoubleSplit(resolvedDraftSettings.allowDoubleSplit));
        dispatch(setAllowResplitAces(resolvedDraftSettings.allowResplitAces));
        dispatch(setAllowInsurance(resolvedDraftSettings.allowInsurance));
        dispatch(setBjPayout(resolvedDraftSettings.bjPayout));
        dispatch(setShoePenetration(resolvedDraftSettings.shoePenetration));
        break;
      case "continue-current-session":
        dispatch(setNumDecks(resolvedDraftSettings.numDecks));
        dispatch(setSoft17(resolvedDraftSettings.soft17));
        dispatch(setReshuffle(resolvedDraftSettings.reshuffle));
        dispatch(setAllowSurrender(resolvedDraftSettings.allowSurrender));
        dispatch(setAllowLateSurrender(resolvedDraftSettings.allowLateSurrender));
        dispatch(setAllowDoubleSplit(resolvedDraftSettings.allowDoubleSplit));
        dispatch(setAllowResplitAces(resolvedDraftSettings.allowResplitAces));
        dispatch(setAllowInsurance(resolvedDraftSettings.allowInsurance));
        dispatch(setBjPayout(resolvedDraftSettings.bjPayout));
        dispatch(setShoePenetration(resolvedDraftSettings.shoePenetration));
        break;
      default:
        break;
    }

    setDraftSettings(null);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem key={"numDecks"}>
              <div className="space-y-2 -mt-2">
                <Label htmlFor="numDecks">Number of decks</Label>
                <ToggleGroup
                  id="numDecks"
                  type="single"
                  value={String(resolvedDraftSettings.numDecks)}
                  onValueChange={(value) => {
                    if (!value) return;
                    updateDraftSetting("numDecks", Number(value));
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

                <RadioGroup
                  value={resolvedDraftSettings.soft17}
                  onValueChange={(value) => updateDraftSetting("soft17", value)}
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

                <Label htmlFor="shuffle-type">Reshuffle type</Label>
                <RadioGroup
                  value={resolvedDraftSettings.reshuffle}
                  onValueChange={(value) =>
                    updateDraftSetting("reshuffle", value)
                  }
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

                <Label htmlFor="surrender">Surrender</Label>
                <div id="surrender" className="flex items-center space-x-2">
                  <Switch
                    id="allow-surrender"
                    checked={resolvedDraftSettings.allowSurrender}
                    onCheckedChange={(checked) =>
                      updateDraftSetting("allowSurrender", checked)
                    }
                  />
                  <Label htmlFor="allow-surrender">Allow surrender</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-late-surrenderr"
                    checked={resolvedDraftSettings.allowLateSurrender}
                    onCheckedChange={(checked) =>
                      updateDraftSetting("allowLateSurrender", checked)
                    }
                  />
                  <Label htmlFor="allow-late-surrender">
                    Allow late surrender
                  </Label>
                </div>
                <Separator />

                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="double-split"
                    checked={resolvedDraftSettings.allowDoubleSplit}
                    onCheckedChange={(checked) =>
                      updateDraftSetting("allowDoubleSplit", checked)
                    }
                  />
                  <Label htmlFor="double-split">Allow double after split</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="resplit-aces"
                    checked={resolvedDraftSettings.allowResplitAces}
                    onCheckedChange={(checked) =>
                      updateDraftSetting("allowResplitAces", checked)
                    }
                  />
                  <Label htmlFor="resplit-aces">Allow resplitting aces</Label>
                </div>
                <Separator />

                <div className="flex items-center space-x-2">
                  <Switch
                    id="offer-insurance"
                    checked={resolvedDraftSettings.allowInsurance}
                    onCheckedChange={(checked) =>
                      updateDraftSetting("allowInsurance", checked)
                    }
                  />
                  <Label htmlFor="offer-insurance">Offer insurance</Label>
                </div>
                <Separator />

                <Label htmlFor="bjpayout">Blackjack payout</Label>
                <RadioGroup
                  id="bjpayout"
                  value={resolvedDraftSettings.bjPayout}
                  onValueChange={(value) =>
                    updateDraftSetting("bjPayout", value)
                  }
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

                <Label htmlFor="shoe-penetration">Shoe penetration</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="shoe-penetration"
                    type="number"
                    className="w-12 text-center font-medium
                    [appearance:textfield] 
                    [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                    value={Math.round(resolvedDraftSettings.shoePenetration * 100)}
                    onChange={(e) => {
                      const nextValue = Number(e.target.value) / 100;
                      if (Number.isNaN(nextValue)) return;
                      updateDraftSetting("shoePenetration", nextValue);
                    }}
                  />
                  <span className="font-medium">%</span>
                </div>

                <Separator />
                <div className="pt-1">
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!hasPendingChanges}
                    onClick={() => setIsConfirmationOpen(true)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDraftSettings(null);
          }

          if (open || hasPendingChanges) {
            setIsConfirmationOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Game Settings?</DialogTitle>
            <DialogDescription className="leading-6">
              These changes affect gameplay and strategy. Your results may not
              be comparable before and after this change.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              onClick={() => applyPendingGameSettingChange("start-new-session")}
            >
              Start New Session
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                applyPendingGameSettingChange("continue-current-session")
              }
            >
              Continue Current Session
            </Button>
          </DialogFooter>

          <p className="text-xs text-muted-foreground">
            You can change this behavior later in settings.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameSettings;
